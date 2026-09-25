import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import examEngine, { PRACTICE_MODES } from '../engine/examEngine.js';

export default function Bookmarks() {
  const { db, questionBank, refresh } = useApp();
  const navigate = useNavigate();

  const [selectedSubmodule, setSelectedSubmodule] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const bookmarks = db.getBookmarks();

  const submodules = [
    'Figure Sequences',
    'Mathematical Equations',
    'Latin Squares',
    'Vector Calculations',
    'Hydrostatics',
    'Optimal Order Quantity',
    'Research Strategies in Social Sciences'
  ];

  const filtered = useMemo(() => {
    return bookmarks.filter(b => {
      const q = questionBank.getQuestion(b.questionId);
      if (selectedSubmodule !== 'all' && q?.submodule !== selectedSubmodule) return false;
      return true;
    });
  }, [bookmarks, selectedSubmodule, questionBank]);

  const handlePracticeBookmarks = () => {
    if (filtered.length === 0) return;
    const questions = filtered
      .map(b => questionBank.getQuestion(b.questionId))
      .filter(q => q !== null);

    if (questions.length === 0) return;

    const exam = examEngine.createPracticeExam({
      questionCount: questions.length,
      mode: PRACTICE_MODES.TIMED
    });
    // Override exam questions with bookmarked questions
    exam.questions = questions;
    exam.totalQuestions = questions.length;
    examEngine.startExam(exam.id);
    refresh();
    navigate(`/exam-session/${exam.id}`);
  };

  const removeBookmark = (questionId) => {
    db.removeBookmark(questionId);
    refresh();
  };

  return (
    <div className="bookmarks-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 1050, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            Saved Bookmarks
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            High-yield and challenging problems you flagged for repeated revision.
          </p>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={handlePracticeBookmarks}
            disabled={filtered.length === 0}
            style={{ fontWeight: 600 }}
          >
            Practice Bookmarks ({filtered.length}) ➔
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4) var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Total Bookmarked: <strong>{bookmarks.length}</strong> tasks
          </span>

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
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔖</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>
            No Bookmarks Saved Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 450, margin: '0 auto 20px' }}>
            Click the star (★) icon during practice exams, learning modules, or question bank browsing to save tasks here.
          </p>
          <button className="btn btn-secondary" onClick={() => navigate('/questions')}>
            Browse Question Bank
          </button>
        </div>
      )}

      {/* Bookmarks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filtered.map((b, idx) => {
          const q = questionBank.getQuestion(b.questionId);
          if (!q) return null;

          const isExpanded = expandedId === b.questionId;

          return (
            <div
              key={b.questionId}
              className="card"
              style={{
                padding: 'var(--space-4) var(--space-5)',
                border: `1px solid ${isExpanded ? 'var(--blue-500)' : 'var(--border-secondary)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--amber-400)', fontSize: '1.2rem' }}>★</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{q.submodule}</span>
                      <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      Saved on {new Date(b.addedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeBookmark(b.questionId)}
                    style={{ fontSize: '0.75rem', color: 'var(--red-400)' }}
                  >
                    Remove
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setExpandedId(isExpanded ? null : b.questionId)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {isExpanded ? 'Hide ▲' : 'View Question ▼'}
                  </button>
                </div>
              </div>

              {/* Short Preview */}
              {!isExpanded && (
                <div style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {q.questionText || (q.gridData ? 'Latin Square: Fill missing target cell' : 'Figure sequence pattern')}
                </div>
              )}

              {/* Expanded Card */}
              {isExpanded && (
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-secondary)' }}>
                  <QuestionRenderer
                    question={q}
                    questionIndex={idx}
                    totalQuestions={filtered.length}
                    selectedAnswer={q.correctAnswer}
                    showFeedback={true}
                    showExplanation={true}
                    disabled={true}
                    onBookmark={() => removeBookmark(b.questionId)}
                    isBookmarked={true}
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
