import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import examEngine, { PRACTICE_MODES } from '../engine/examEngine.js';

export default function Mistakes() {
  const { db, questionBank, refresh } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('unmastered'); // 'unmastered', 'all', 'due'
  const [selectedSubmodule, setSelectedSubmodule] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const mistakes = db.getMistakes();
  const reviewQueue = db.getReviewQueue();
  const dueQuestionIds = new Set(reviewQueue.map(r => r.questionId));

  const submodules = [
    'Figure Sequences',
    'Mathematical Equations',
    'Latin Squares',
    'Vector Calculations',
    'Hydrostatics',
    'Optimal Order Quantity',
    'Research Strategies in Social Sciences'
  ];

  // Filtered mistakes
  const filtered = useMemo(() => {
    return mistakes.filter(m => {
      if (activeTab === 'unmastered' && m.mastered) return false;
      if (activeTab === 'due' && !dueQuestionIds.has(m.questionId)) return false;
      if (selectedSubmodule !== 'all' && m.submoduleId !== selectedSubmodule) return false;
      return true;
    });
  }, [mistakes, activeTab, selectedSubmodule, dueQuestionIds]);

  // Launch Practice Mistakes Drill
  const handlePracticeMistakes = () => {
    if (filtered.length === 0) return;
    const exam = examEngine.createPracticeExam({
      questionCount: Math.min(20, filtered.length),
      mode: PRACTICE_MODES.REVIEW
    });
    examEngine.startExam(exam.id);
    refresh();
    navigate(`/exam-session/${exam.id}`);
  };

  const toggleMastery = (questionId, currentMastered) => {
    if (currentMastered) {
      // Unmark mastery
      db.unmarkMistakeMastered(questionId);
    } else {
      // Mark as mastered
      db.markMistakeMastered(questionId);
    }
    refresh();
  };

  return (
    <div className="mistakes-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 1050, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            Mistakes Notebook & Spaced Repetition
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Systematic error log tracking every missed question to ensure errors are transformed into permanent mastery.
          </p>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={handlePracticeMistakes}
            disabled={filtered.length === 0}
            style={{ fontWeight: 600 }}
          >
            Practice Mistakes Drill ({filtered.length}) ➔
          </button>
        </div>
      </header>

      {/* Tabs & Filters */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4) var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`btn ${activeTab === 'unmastered' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('unmastered')}
            >
              Unmastered ({mistakes.filter(m => !m.mastered).length})
            </button>
            <button
              className={`btn ${activeTab === 'due' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('due')}
            >
              Due for Review ({reviewQueue.length})
            </button>
            <button
              className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('all')}
            >
              All Mistakes ({mistakes.length})
            </button>
          </div>

          {/* Submodule filter */}
          <div>
            <select
              value={selectedSubmodule}
              onChange={e => setSelectedSubmodule(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="all">All Submodules</option>
              {submodules.map(sm => (
                <option key={sm} value={sm}>{sm}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎉</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>
            {activeTab === 'unmastered' ? 'No Unmastered Mistakes!' : 'No Mistakes in this View'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 450, margin: '0 auto 20px' }}>
            {activeTab === 'unmastered'
              ? 'Excellent work! Either you haven’t made mistakes or all recorded errors have been resolved.'
              : 'Complete more exams to record and analyze error patterns.'}
          </p>
          <button className="btn btn-secondary" onClick={() => navigate('/practice')}>
            Start a Practice Exam
          </button>
        </div>
      )}

      {/* Mistakes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filtered.map((m, idx) => {
          const q = questionBank.getQuestion(m.questionId);
          const isExpanded = expandedId === m.questionId;
          const isDue = dueQuestionIds.has(m.questionId);

          return (
            <div
              key={m.questionId || idx}
              className="card"
              style={{
                padding: 'var(--space-4) var(--space-5)',
                border: `1px solid ${m.mastered ? 'var(--border-secondary)' : isDue ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-primary)'}`,
                background: m.mastered ? 'rgba(34, 197, 94, 0.03)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.1rem' }}>
                    {m.mastered ? '✅' : '❌'}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {m.submoduleId || q?.submodule || 'Question'}
                      </span>
                      {q?.difficulty && <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>}
                      {isDue && <span className="badge badge-challenge">Review Due</span>}
                      {m.mastered && <span className="badge badge-correct">Mastered</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      Failed {m.attemptCount || 1} time(s) • Last missed {new Date(m.lastFailedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className={`btn ${m.mastered ? 'btn-ghost' : 'btn-secondary'} btn-sm`}
                    onClick={() => toggleMastery(m.questionId, m.mastered)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {m.mastered ? 'Mark Unmastered' : '✓ Mark Mastered'}
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setExpandedId(isExpanded ? null : m.questionId)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {isExpanded ? 'Hide ▲' : 'Inspect Task ▼'}
                  </button>
                </div>
              </div>

              {/* Collapsed short hint */}
              {!isExpanded && q && (
                <div style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {q.questionText || (q.gridData ? 'Latin Square: Fill missing target cell' : 'Figure sequence pattern')}
                </div>
              )}

              {/* Expanded Question Card */}
              {isExpanded && q && (
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-secondary)' }}>
                  <QuestionRenderer
                    question={q}
                    questionIndex={idx}
                    totalQuestions={filtered.length}
                    selectedAnswer={q.correctAnswer}
                    showFeedback={true}
                    showExplanation={true}
                    disabled={true}
                    onBookmark={(id) => {
                      if (db.isBookmarked(id)) db.removeBookmark(id);
                      else db.addBookmark(id, q.submodule);
                      refresh();
                    }}
                    isBookmarked={db.isBookmarked(q.id)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
