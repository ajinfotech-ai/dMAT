import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import db from '../data/database.js';
import examEngine, { EXAM_MODES } from '../engine/examEngine.js';
import { SYLLABUS } from '../data/syllabus.js';

export const AIContext = createContext();

export function useAI() {
  return useContext(AIContext);
}

export function AIProvider({ children }) {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your **dMAT AI Coach** powered by the **Omni Route** gateway. I am aware of your active study topics, questions, and performance diagnostics. Ask me for hints, concept explanations, step-by-step solutions, or targeted practice!',
      timestamp: Date.now()
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [abortController, setAbortController] = useState(null);

  // Check if Exam Simulation is currently active
  // Rule: AI orb/drawer must automatically be disabled during Exam Simulation and re-enabled after
  const isSimulationActive = (() => {
    // Direct check on /simulation setup page
    if (location.pathname === '/simulation') return false; // Allowed to read about rules
    
    // Check if in an active exam session
    if (location.pathname.startsWith('/exam-session/')) {
      const currentExam = examEngine.getCurrentExam();
      if (currentExam && currentExam.type === EXAM_MODES.SIMULATION) {
        return true;
      }
      // Check autosave if exam not in memory
      const examId = location.pathname.replace('/exam-session/', '');
      const saved = db.getExamProgress(examId);
      if (saved && saved.type === EXAM_MODES.SIMULATION) {
        return true;
      }
    }
    return false;
  })();

  // Close drawer immediately if a simulation becomes active
  useEffect(() => {
    if (isSimulationActive && isOpen) {
      setIsOpen(false);
    }
  }, [isSimulationActive, isOpen]);

  // Derive current page context
  const getContextSnapshot = useCallback(() => {
    const stats = db.getOverallStats();
    const weakAreas = db.getWeakAreas();
    const mistakes = db.getUnmasteredMistakes();

    let moduleName = 'General';
    let submoduleName = '';
    let lessonName = '';

    // Inspect route
    if (location.pathname.startsWith('/learning')) {
      moduleName = 'Learning Center';
      const parts = location.pathname.split('/');
      if (parts[2]) {
        if (parts[2] === 'core-module') moduleName = 'Core Module';
        else if (parts[2] === 'subject-module') moduleName = 'Subject Module';
        else submoduleName = parts[2].replace(/-/g, ' ');
      }
      if (parts[3]) {
        submoduleName = parts[3].replace(/-/g, ' ');
      }
    } else if (location.pathname.startsWith('/practice')) {
      moduleName = 'Practice Exam Lab';
    } else if (location.pathname.startsWith('/questions')) {
      moduleName = 'Question Bank';
    } else if (location.pathname.startsWith('/progress')) {
      moduleName = 'Progress & Mastery Matrix';
    } else if (location.pathname.startsWith('/mistakes')) {
      moduleName = 'Mistakes Notebook';
    } else if (location.pathname.startsWith('/bookmarks')) {
      moduleName = 'Saved Bookmarks';
    } else if (location.pathname.startsWith('/results')) {
      moduleName = 'Exam Diagnostic Results';
    }

    // If there is an active question being viewed
    if (activeQuestion) {
      moduleName = activeQuestion.module || moduleName;
      submoduleName = activeQuestion.submodule || submoduleName;
      lessonName = activeQuestion.topic || lessonName;
    }

    return {
      module: moduleName,
      submodule: submoduleName,
      lesson: lessonName,
      currentQuestion: activeQuestion,
      difficulty: activeQuestion?.difficulty || 'medium',
      accuracy: parseFloat(stats.overallAccuracy || 70),
      mistakesCount: mistakes.length,
      weakAreas: weakAreas.slice(0, 3)
    };
  }, [location.pathname, activeQuestion]);

  // Send message to server AI proxy
  const sendMessage = async (userText, overrideContext = null) => {
    if (!userText.trim() || isStreaming) return;

    const userMessage = {
      role: 'user',
      content: userText.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsStreaming(true);
    setStreamText('');

    const context = overrideContext || getContextSnapshot();
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context,
          stream: true
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAccumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed === 'data: [DONE]') {
            break;
          }
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.text) {
                fullAccumulated += data.text;
                setStreamText(fullAccumulated);
              }
            } catch (parseErr) {
              // ignore partial chunk json errors
            }
          }
        }
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: fullAccumulated || 'Done.',
          timestamp: Date.now()
        }
      ]);
      setStreamText('');
    } catch (err) {
      if (err.name === 'AbortError') {
        // Stream aborted by user
        if (streamText) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: streamText + ' [Response stopped]',
              timestamp: Date.now()
            }
          ]);
        }
      } else {
        console.error('[AI Assistant Client] Chat error:', err);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ Could not complete request (${err.message}). The dMAT cognitive engine will re-attempt on your next question.`,
            timestamp: Date.now(),
            isError: true
          }
        ]);
      }
      setStreamText('');
    } finally {
      setIsStreaming(false);
      setAbortController(null);
    }
  };

  const stopGenerating = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation cleared. How can I help you with your dMAT preparation?',
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <AIContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isSimulationActive,
        activeQuestion,
        setActiveQuestion,
        messages,
        sendMessage,
        isStreaming,
        streamText,
        stopGenerating,
        clearChat,
        getContextSnapshot
      }}
    >
      {children}
    </AIContext.Provider>
  );
}
