import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import examEngine, { EXAM_MODES } from '../engine/examEngine.js';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import { formatTime } from '../generators/utils.js';

export default function ExamSession() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { db, refresh } = useApp();

  const [exam, setExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showBreakScreen, setShowBreakScreen] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(30 * 60);
  const [bookmarkedMap, setBookmarkedMap] = useState({});
  const [questionTimeMap, setQuestionTimeMap] = useState({});

  const timerRef = useRef(null);
  const questionStartTimeRef = useRef(Date.now());

  // Load exam on mount
  useEffect(() => {
    let current = examEngine.getCurrentExam();
    if (!current || current.id !== examId) {
      current = examEngine.resumeExam(examId);
    }

    if (!current) {
      // Check database if it was already submitted
      const attempts = db.getExamAttempts();
      const found = attempts.find(a => a.id === examId);
      if (found) {
        navigate(`/results/${examId}`);
        return;
      }
      navigate('/practice');
      return;
    }

    setExam({ ...current });
    setCurrentIndex(current.currentIndex || 0);

    // Initial time remaining
    if (current.type === EXAM_MODES.SIMULATION) {
      const section = current.sections[current.currentSection || 0];
      setTimeRemaining(current.sectionTimeRemaining !== undefined ? current.sectionTimeRemaining : section.timeSeconds);
    } else {
      setTimeRemaining(current.timeRemaining);
    }

    // Populate bookmarks
    const bmMap = {};
    current.questions.forEach(q => {
      bmMap[q.id] = db.isBookmarked(q.id);
    });
    setBookmarkedMap(bmMap);
  }, [examId, db, navigate]);

  // Record time spent on previous question whenever index changes
  const saveCurrentQuestionTime = useCallback(() => {
    const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    if (elapsed > 0 && exam) {
      setQuestionTimeMap(prev => {
        const updated = (prev[currentIndex] || 0) + elapsed;
        examEngine.updateTimeSpent(currentIndex, updated);
        return { ...prev, [currentIndex]: updated };
      });
    }
    questionStartTimeRef.current = Date.now();
  }, [currentIndex, exam]);

  // Main countdown timer
  useEffect(() => {
    if (!exam || isPaused || showBreakScreen || timeRemaining === null) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          // Time expired!
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [exam, isPaused, showBreakScreen, timeRemaining]);

  // Break countdown timer
  useEffect(() => {
    if (!showBreakScreen) return;

    const breakTimer = setInterval(() => {
      setBreakTimeRemaining(prev => {
        if (prev <= 1) {
          endBreak();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breakTimer);
  }, [showBreakScreen]);

  // Handle time expiration
  const handleTimeExpire = () => {
    saveCurrentQuestionTime();

    if (exam?.type === EXAM_MODES.SIMULATION) {
      // Advance to next section or break or finish
      const nextSectionIdx = (exam.currentSection || 0) + 1;
      if (nextSectionIdx === 3) {
        // Break between Core and Subject Module
        setShowBreakScreen(true);
        setBreakTimeRemaining(30 * 60);
      } else if (nextSectionIdx < exam.sections.length) {
        advanceToSection(nextSectionIdx);
      } else {
        // Final submit
        handleSubmitExam();
      }
    } else {
      // In practice mode, submit on time up
      handleSubmitExam();
    }
  };

  const advanceToSection = (sectionIndex) => {
    const nextSec = exam.sections[sectionIndex];
    exam.currentSection = sectionIndex;
    setCurrentIndex(nextSec.startIndex);
    setTimeRemaining(nextSec.timeSeconds);
    exam.sectionTimeRemaining = nextSec.timeSeconds;
    setExam({ ...exam });
  };

  const endBreak = () => {
    setShowBreakScreen(false);
    advanceToSection(3); // Subject module
  };

  // Answer handler
  const handleAnswer = (selectedOptionIndex) => {
    saveCurrentQuestionTime();
    examEngine.recordAnswer(currentIndex, selectedOptionIndex);
    setExam({ ...examEngine.getCurrentExam() });
    refresh();
  };

  // Bookmark handler
  const handleToggleBookmark = (questionId) => {
    const isBm = bookmarkedMap[questionId];
    if (isBm) {
      db.removeBookmark(questionId);
      setBookmarkedMap(prev => ({ ...prev, [questionId]: false }));
    } else {
      const q = exam.questions[currentIndex];
      db.addBookmark(questionId, q.submodule || q.topic);
      setBookmarkedMap(prev => ({ ...prev, [questionId]: true }));
    }
    refresh();
  };

  // Flag / mark review
  const handleToggleMarkReview = (index) => {
    examEngine.toggleMarkForReview(index);
    setExam({ ...examEngine.getCurrentExam() });
  };

  // Navigation
  const goToQuestion = (index) => {
    if (index === currentIndex) return;
    if (index < 0 || index >= exam.questions.length) return;

    // In simulation mode, verify question is in current section
    if (exam.type === EXAM_MODES.SIMULATION) {
      const currentSec = exam.sections[exam.currentSection || 0];
      if (index < currentSec.startIndex || index > currentSec.endIndex) {
        return; // Locked out of other sections
      }
    }

    saveCurrentQuestionTime();
    examEngine.navigateToQuestion(index);
    setCurrentIndex(index);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Submit exam
  const handleSubmitExam = () => {
    saveCurrentQuestionTime();
    setShowSubmitModal(false);
    const results = examEngine.submitExam();
    refresh();
    navigate(`/results/${exam.id}`);
  };

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading exam session…</p>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentIndex];
  const currentAnswer = exam.answers?.[currentIndex]?.selectedAnswer;
  const isMarked = exam.markedForReview ? exam.markedForReview.has(currentIndex) : false;

  // Compute question boundaries for Question Map
  let visibleStartIndex = 0;
  let visibleEndIndex = exam.questions.length - 1;
  let currentSectionInfo = null;

  if (exam.type === EXAM_MODES.SIMULATION) {
    currentSectionInfo = exam.sections[exam.currentSection || 0];
    visibleStartIndex = currentSectionInfo.startIndex;
    visibleEndIndex = currentSectionInfo.endIndex;
  }

  // Count answered in active section
  let answeredCount = 0;
  for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
    if (exam.answers?.[i] !== undefined) answeredCount++;
  }
  const totalInSection = visibleEndIndex - visibleStartIndex + 1;

  // Break screen overlay
  if (showBreakScreen) {
    return (
      <div className="exam-fullscreen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
        <div className="card" style={{ maxWidth: 600, width: '100%', textAlign: 'center', padding: 'var(--space-8)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>☕</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            Official 30-Minute Rest Break
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
            You have completed all 3 subtests of the Core Module (Figure Sequences, Mathematical Equations, and Latin Squares).
            Take this time to relax and hydrate before the 90-minute Subject Module.
          </p>

          <div style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--green-400)', marginBottom: 'var(--space-6)' }}>
            {formatTime(breakTimeRemaining)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button className="btn btn-primary btn-lg" onClick={endBreak}>
              Skip Break & Begin Subject Module ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-fullscreen animate-fade-in">
      {/* Top Bar */}
      <header className="exam-topbar">
        <div className="exam-topbar-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="sidebar-logo" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>dM</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {exam.type === EXAM_MODES.SIMULATION ? 'dMAT Official Simulation' : 'dMAT Practice Exam'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {currentSectionInfo ? currentSectionInfo.name : currentQuestion?.submodule || 'Practice'}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Timer & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {timeRemaining !== null && (
            <div
              className={`question-timer ${timeRemaining < 300 ? 'danger' : timeRemaining < 600 ? 'warning' : ''}`}
              title="Time Remaining"
            >
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}

          {exam.settings.allowPause && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsPaused(!isPaused)}
              style={{ fontSize: '0.8rem' }}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          )}

          <button
            className="btn btn-ghost btn-sm"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            style={{ fontSize: '0.8rem' }}
          >
            ⛶
          </button>
        </div>

        {/* Right: End/Submit Action */}
        <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowSubmitModal(true)}
            style={{ fontWeight: 600, background: 'var(--blue-600)' }}
          >
            Finish Exam ➔
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="exam-body">
        {isPaused ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: '2.5rem' }}>⏸️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Practice Session Paused</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Take your time. Click Resume when you are ready to continue.</p>
            <button className="btn btn-primary btn-lg" onClick={() => setIsPaused(false)}>
              Resume Practice
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: 950, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Question Map Mini-Navigator */}
            <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>
                  Section Progress: <strong>{answeredCount} / {totalInSection}</strong> answered
                </span>
                <span style={{ display: 'flex', gap: 12 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--navy-600)', border: '1px solid var(--border-primary)' }}></span> Answered
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--amber-500)' }}></span> Flagged
                  </span>
                </span>
              </div>

              <div className="question-map" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(32px, 1fr))` }}>
                {exam.questions.slice(visibleStartIndex, visibleEndIndex + 1).map((q, localIdx) => {
                  const actualIdx = visibleStartIndex + localIdx;
                  const isCurrent = actualIdx === currentIndex;
                  const isAns = exam.answers?.[actualIdx] !== undefined;
                  const isFlg = exam.markedForReview?.has(actualIdx);

                  let cellClass = 'question-map-cell';
                  if (isCurrent) cellClass += ' current';
                  if (isAns) cellClass += ' answered';
                  else cellClass += ' unanswered';
                  if (isFlg) cellClass += ' flagged';

                  return (
                    <button
                      key={actualIdx}
                      className={cellClass}
                      onClick={() => goToQuestion(actualIdx)}
                      title={`Question ${actualIdx + 1}${isFlg ? ' (Flagged)' : ''}${isAns ? ' (Answered)' : ''}`}
                    >
                      {actualIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Renderer */}
            <div className="card" style={{ padding: 'var(--space-6)', minHeight: 480, background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <QuestionRenderer
                question={currentQuestion}
                questionIndex={currentIndex}
                totalQuestions={exam.questions.length}
                selectedAnswer={currentAnswer}
                onAnswer={handleAnswer}
                showFeedback={exam.settings.showFeedback}
                showExplanation={exam.settings.showExplanation}
                disabled={false}
                onBookmark={handleToggleBookmark}
                isBookmarked={bookmarkedMap[currentQuestion?.id] || false}
                onMarkReview={handleToggleMarkReview}
                isMarkedReview={isMarked}
                timeSpent={questionTimeMap[currentIndex] || 0}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Bar Navigation */}
      <footer className="exam-bottombar">
        <div>
          <button
            className="btn btn-secondary"
            disabled={currentIndex <= visibleStartIndex}
            onClick={() => goToQuestion(currentIndex - 1)}
          >
            ← Previous
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn btn-ghost"
            onClick={() => handleToggleMarkReview(currentIndex)}
            style={{ color: isMarked ? 'var(--amber-400)' : 'var(--text-secondary)' }}
          >
            {isMarked ? '🚩 Flagged for Review' : '⚑ Mark for Review'}
          </button>
        </div>

        <div>
          {currentIndex < visibleEndIndex ? (
            <button
              className="btn btn-primary"
              onClick={() => goToQuestion(currentIndex + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                if (exam.type === EXAM_MODES.SIMULATION && (exam.currentSection || 0) < exam.sections.length - 1) {
                  // Next section
                  handleTimeExpire();
                } else {
                  setShowSubmitModal(true);
                }
              }}
              style={{ background: 'var(--green-600)' }}
            >
              {exam.type === EXAM_MODES.SIMULATION && (exam.currentSection || 0) < exam.sections.length - 1
                ? 'Proceed to Next Section →'
                : 'Submit Exam ➔'}
            </button>
          )}
        </div>
      </footer>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg-overlay)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card animate-scale-in" style={{ maxWidth: 500, width: '100%', padding: 'var(--space-6)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              Ready to submit your exam?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-5)' }}>
              Please review your completion status before finalizing your submission.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 'var(--space-6)', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--blue-400)' }}>
                  {Object.keys(exam.answers || {}).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Answered</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-400)' }}>
                  {exam.questions.length - Object.keys(exam.answers || {}).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Unanswered</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-400)' }}>
                  {exam.markedForReview ? exam.markedForReview.size : 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Flagged</div>
              </div>
            </div>

            {exam.questions.length - Object.keys(exam.answers || {}).length > 0 && (
              <div style={{ padding: 12, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--amber-400)', marginBottom: 'var(--space-5)' }}>
                ⚠️ <strong>Remember:</strong> dMAT has NO negative marking. It is strongly recommended to guess all unanswered tasks!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>
                Return to Exam
              </button>
              <button className="btn btn-primary" onClick={handleSubmitExam} style={{ background: 'var(--green-600)' }}>
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
