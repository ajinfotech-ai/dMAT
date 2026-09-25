import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../App.jsx';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import { formatTime, formatTimeVerbose } from '../generators/utils.js';

export default function ExamResults() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { db, refresh } = useApp();

  const [activeFilter, setActiveFilter] = useState('all'); // all, incorrect, correct, unanswered
  const [submoduleFilter, setSubmoduleFilter] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const attempt = db.getExamAttempt(examId);

  if (!attempt) {
    return (
      <div className="card" style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Exam Results Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Could not find an exam session with ID: <code>{examId}</code>.
        </p>
        <Link to="/practice" className="btn btn-primary">Go to Practice Exams</Link>
      </div>
    );
  }

  const results = attempt.results || {};
  const overall = results.overall || {};
  const accuracyNum = parseFloat(overall.accuracy || 0);
  const questions = attempt.questions || [];
  const answers = attempt.answers || {};

  // Score tier
  let tier = { label: 'Needs Practice', color: 'var(--red-400)', badge: 'badge-challenge', desc: 'Focus on core principles and timed drill practice.' };
  if (accuracyNum >= 85) {
    tier = { label: 'Exceptional (Top Percentile)', color: 'var(--green-400)', badge: 'badge-correct', desc: 'Outstanding performance matching top university entrance cutoffs!' };
  } else if (accuracyNum >= 70) {
    tier = { label: 'Competitive (Strong Foundation)', color: 'var(--blue-400)', badge: 'badge-medium', desc: 'Solid conceptual understanding; refine time management and edge cases.' };
  } else if (accuracyNum >= 50) {
    tier = { label: 'Satisfactory (Progressing)', color: 'var(--amber-400)', badge: 'badge-hard', desc: 'Good baseline; dedicate study to identified weak submodules.' };
  }

  // Toggle expand/collapse for question review
  const toggleExpand = (idx) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const expandAll = () => {
    const all = {};
    questions.forEach((_, i) => { all[i] = true; });
    setExpandedQuestions(all);
  };

  const collapseAll = () => setExpandedQuestions({});

  // Filter questions
  const filteredQuestions = questions.map((q, idx) => ({ q, idx, answer: answers[idx] })).filter(({ q, idx, answer }) => {
    // Status filter
    if (activeFilter === 'correct' && (!answer || !answer.isCorrect)) return false;
    if (activeFilter === 'incorrect' && (!answer || answer.isCorrect)) return false;
    if (activeFilter === 'unanswered' && answer !== undefined) return false;

    // Submodule filter
    if (submoduleFilter !== 'all' && q.submodule !== submoduleFilter) return false;

    return true;
  });

  return (
    <div className="results-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 1050, margin: '0 auto' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/practice')} style={{ color: 'var(--text-secondary)' }}>
          ← Back to Practice
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
          Session ID: {attempt.id} • Completed {new Date(attempt.completedAt || Date.now()).toLocaleString()}
        </span>
      </div>

      {/* Hero Score Card */}
      <section className="results-hero">
        <span className={`badge ${tier.badge}`} style={{ fontSize: '0.85rem', padding: '4px 14px', marginBottom: 12 }}>
          {tier.label}
        </span>
        <div className="results-score">
          {accuracyNum}%
        </div>
        <p className="results-subtitle" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {overall.questionsCorrect || 0} of {overall.totalQuestions || attempt.totalQuestions} Questions Correct
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 600, margin: '8px auto 0' }}>
          {tier.desc}
        </p>
      </section>

      {/* Metrics Grid */}
      <section className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--green-400)' }}>
            {overall.questionsCorrect || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Correct Answers
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--red-400)' }}>
            {(overall.questionsAnswered || 0) - (overall.questionsCorrect || 0)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Incorrect Answers
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--amber-400)' }}>
            {overall.questionsUnanswered || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Unanswered Tasks
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--blue-400)' }}>
            {formatTime(overall.totalTimeSeconds || 0)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Total Time Spent
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple-400)' }}>
            {overall.averageTimePerQuestion || 0}s
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Avg Time / Question
          </div>
        </div>
      </section>

      {/* Module & Submodule Breakdown */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Performance by Submodule
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {results.submoduleBreakdown && Object.entries(results.submoduleBreakdown).map(([smName, smData]) => {
            const smAccuracy = smData.total > 0 ? Math.round((smData.correct / smData.total) * 100) : 0;
            return (
              <div key={smName} style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{smName}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>({smData.module})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {smData.correct} / {smData.total} correct
                    </span>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: smAccuracy >= 75 ? 'var(--green-400)' : smAccuracy >= 50 ? 'var(--blue-400)' : 'var(--amber-400)'
                    }}>
                      {smAccuracy}%
                    </span>
                  </div>
                </div>

                <div className="progress-bar" style={{ height: 6 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${smAccuracy}%`,
                      background: smAccuracy >= 75 ? 'var(--green-500)' : smAccuracy >= 50 ? 'var(--blue-500)' : 'var(--amber-500)'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Strategic Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)', borderLeft: '4px solid var(--blue-500)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💡</span> Recommended Next Steps
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {results.recommendations.map((rec, i) => (
              <li key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--blue-400)' }}>•</span>
                <span>{typeof rec === 'string' ? rec : rec.message}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Action Buttons */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-8)' }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/practice')}
          style={{ flex: '1 1 200px' }}
        >
          Take Another Practice Exam ➔
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/mistakes')}
          style={{ flex: '1 1 200px' }}
        >
          Review Mistakes Notebook 🔍
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/learning')}
          style={{ flex: '1 1 200px' }}
        >
          Study Module Concepts 📚
        </button>
      </section>

      {/* Comprehensive Question Review */}
      {questions.length > 0 && (
        <section className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-5)' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Question-by-Question Review
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Showing {filteredQuestions.length} of {questions.length} questions
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={expandAll} style={{ fontSize: '0.75rem' }}>Expand All</button>
              <button className="btn btn-ghost btn-sm" onClick={collapseAll} style={{ fontSize: '0.75rem' }}>Collapse All</button>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-secondary)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'incorrect', label: `❌ Incorrect (${(overall.questionsAnswered || 0) - (overall.questionsCorrect || 0)})` },
                { id: 'correct', label: `✅ Correct (${overall.questionsCorrect || 0})` },
                { id: 'unanswered', label: `⚠️ Unanswered (${overall.questionsUnanswered || 0})` }
              ].map(f => (
                <button
                  key={f.id}
                  className={`btn ${activeFilter === f.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setActiveFilter(f.id)}
                  style={{ fontSize: '0.8rem' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {filteredQuestions.map(({ q, idx, answer }) => {
              const isAnswered = answer !== undefined;
              const isCorrect = isAnswered && answer.isCorrect;
              const isExpanded = expandedQuestions[idx] ?? true; // Default expanded for easy reading

              return (
                <div
                  key={idx}
                  style={{
                    border: `1px solid ${!isAnswered ? 'var(--border-secondary)' : isCorrect ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  {/* Collapsible Question Summary Header */}
                  <div
                    onClick={() => toggleExpand(idx)}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      background: isCorrect ? 'rgba(34, 197, 94, 0.05)' : isAnswered ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid var(--border-secondary)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: !isAnswered ? 'var(--bg-card)' : isCorrect ? 'var(--green-600)' : 'var(--red-600)',
                        color: 'white'
                      }}>
                        {!isAnswered ? '—' : isCorrect ? '✓' : '✗'}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        Task {idx + 1}: {q.submodule}
                      </span>
                      <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {answer?.timeSpent ? <span>⏱️ {answer.timeSpent}s</span> : null}
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded Full Question Renderer */}
                  {isExpanded && (
                    <div style={{ padding: 'var(--space-5)' }}>
                      <QuestionRenderer
                        question={q}
                        questionIndex={idx}
                        totalQuestions={questions.length}
                        selectedAnswer={answer?.selectedAnswer}
                        showFeedback={true}
                        showExplanation={true}
                        disabled={true}
                        onBookmark={(id) => {
                          if (db.isBookmarked(id)) db.removeBookmark(id);
                          else db.addBookmark(id, q.submodule);
                          refresh();
                        }}
                        isBookmarked={db.isBookmarked(q.id)}
                        timeSpent={answer?.timeSpent || 0}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
