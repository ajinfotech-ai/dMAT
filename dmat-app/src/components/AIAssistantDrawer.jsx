import { useState, useEffect, useRef } from 'react';
import { useAI } from '../context/AIContext.jsx';

export default function AIAssistantDrawer() {
  const {
    isOpen,
    setIsOpen,
    isSimulationActive,
    messages,
    sendMessage,
    isStreaming,
    streamText,
    stopGenerating,
    clearChat,
    getContextSnapshot
  } = useAI();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const context = getContextSnapshot();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamText, isOpen]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Disabled in Exam Simulation
  if (isSimulationActive || !isOpen) {
    return null;
  }

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  const handleQuickAction = (actionPrompt) => {
    if (isStreaming) return;
    sendMessage(actionPrompt);
  };

  // Format message text with markdown-like highlights
  const renderMessageContent = (content) => {
    if (!content) return null;

    // Split paragraphs
    const paragraphs = content.split('\n\n');

    return (
      <div className="ai-message-content">
        {paragraphs.map((p, pIdx) => {
          const lines = p.split('\n');
          return (
            <div key={pIdx} style={{ marginBottom: pIdx < paragraphs.length - 1 ? 10 : 0 }}>
              {lines.map((line, lIdx) => {
                // Bullet points
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                const isNumber = /^\d+\.\s/.test(line.trim());

                // Basic bold processing (**text**)
                const parts = line.split(/(\*\*.*?\*\*)/g);

                return (
                  <div
                    key={lIdx}
                    style={{
                      paddingLeft: isBullet || isNumber ? 12 : 0,
                      marginBottom: 4,
                      lineHeight: 1.55,
                      fontSize: '0.875rem'
                    }}
                  >
                    {parts.map((part, partIdx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong key={partIdx} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return <span key={partIdx}>{part}</span>;
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop Blur Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 14, 39, 0.4)',
          backdropFilter: 'blur(3px)',
          zIndex: 998,
          animation: 'ai-fade-in 0.2s ease'
        }}
      />

      {/* Slide-out Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '450px',
          maxWidth: '100vw',
          background: 'var(--navy-900)',
          borderLeft: '1px solid var(--border-primary)',
          boxShadow: '-8px 0 28px rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'ai-slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <header
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--border-secondary)',
            background: 'var(--navy-950)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #60a5fa 0%, #3b82f6 50%, #1e1b4b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                }}
              >
                ✦
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>dMAT AI Coach</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: 'var(--green-400)',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    ⚡ OmniRoute Connected
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  Model: auto/chat • Context-Aware Cognitive Scaffolding
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={clearChat}
                title="Clear conversation"
                style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}
              >
                🗑️
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setIsOpen(false)}
                title="Close AI Assistant"
                style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Active Context Chip */}
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--navy-800)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--border-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--blue-400)' }}>📍</span>
              <strong style={{ color: 'var(--text-primary)' }}>{context.submodule || context.module}</strong>
              {context.currentQuestion && (
                <span>• Task [{context.difficulty}]</span>
              )}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--green-400)', flexShrink: 0 }}>
              {context.accuracy}% Acc
            </span>
          </div>
        </header>

        {/* Quick Action Prompt Chips */}
        <div
          style={{
            padding: '8px var(--space-4)',
            background: 'var(--navy-900)',
            borderBottom: '1px solid var(--border-secondary)',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickAction('Give me a progressive hint for this question without spoiling the answer.')}
            disabled={isStreaming}
            style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 14 }}
          >
            💡 Give Hint
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickAction('Explain the fundamental concept and rules behind this topic.')}
            disabled={isStreaming}
            style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 14 }}
          >
            📖 Explain Concept
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickAction('Provide the full step-by-step solution and mathematical deduction.')}
            disabled={isStreaming}
            style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 14 }}
          >
            🔍 Full Solution
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickAction('Generate a targeted practice problem for this topic.')}
            disabled={isStreaming}
            style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 14 }}
          >
            🎯 Practice Similar
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickAction('Analyze my performance data and tell me my weak areas and study advice.')}
            disabled={isStreaming}
            style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 14 }}
          >
            📊 My Weak Areas
          </button>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)'
          }}
        >
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-tertiary)',
                    marginBottom: 3,
                    padding: '0 4px'
                  }}
                >
                  {isUser ? 'You' : 'dMAT AI Coach'}
                </div>

                <div
                  style={{
                    maxWidth: '88%',
                    padding: '10px 14px',
                    borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: isUser ? 'var(--blue-600)' : 'var(--bg-tertiary)',
                    color: isUser ? 'white' : 'var(--text-secondary)',
                    border: isUser ? 'none' : msg.isError ? '1px solid var(--red-500)' : '1px solid var(--border-secondary)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            );
          })}

          {/* Active Streaming Response Bubble */}
          {isStreaming && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '100%' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--blue-400)', marginBottom: 3, padding: '0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>✦ Thinking & streaming via OmniRoute…</span>
              </div>
              <div
                style={{
                  maxWidth: '88%',
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 2px',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--blue-500)',
                  boxShadow: '0 0 12px rgba(59, 130, 246, 0.2)'
                }}
              >
                {renderMessageContent(streamText)}
                <span style={{ display: 'inline-block', width: 6, height: 14, background: 'var(--blue-400)', marginLeft: 3, animation: 'ai-blink 0.8s infinite' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <footer
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--border-secondary)',
            background: 'var(--navy-950)'
          }}
        >
          {isStreaming && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={stopGenerating}
                style={{ fontSize: '0.75rem', padding: '3px 10px', color: 'var(--red-400)' }}
              >
                ⏹ Stop Generating
              </button>
            </div>
          )}

          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything about this task or dMAT concepts…"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isStreaming}
              style={{
                flex: 1,
                background: 'var(--navy-800)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '10px 14px',
                fontSize: '0.875rem'
              }}
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!input.trim() || isStreaming}
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ➔
            </button>
          </form>
        </footer>
      </aside>
    </>
  );
}
