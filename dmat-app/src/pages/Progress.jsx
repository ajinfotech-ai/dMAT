import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { SYLLABUS } from '../data/syllabus.js';
import { formatTime, formatTimeVerbose } from '../generators/utils.js';
import examEngine, { PRACTICE_MODES } from '../engine/examEngine.js';

export default function Progress() {
  const { db, refresh } = useApp();
  const navigate = useNavigate();

  const stats = db.getOverallStats();
  const weakAreas = db.getWeakAreas();
  const strongAreas = db.getStrongAreas();
  const attempts = db.getExamAttempts();
  const allTopicProgress = db.getAllTopicProgress();

  const submodules = [
    { id: 'figure-sequences', name: 'Figure Sequences', module: 'Core Module' },
    { id: 'mathematical-equations', name: 'Mathematical Equations', module: 'Core Module' },
    { id: 'latin-squares', name: 'Latin Squares', module: 'Core Module' },
    { id: 'vector-calculations', name: 'Vector Calculations', module: 'Subject Module' },
    { id: 'hydrostatics', name: 'Hydrostatics', module: 'Subject Module' },
    { id: 'optimal-order-quantity', name: 'Optimal Order Quantity', module: 'Subject Module' },
    { id: 'research-strategies', name: 'Research Strategies in Social Sciences', module: 'Subject Module' },
  ];

  // Helper for quick practice from progress
  const startTopicPractice = (submoduleName) => {
    const exam = examEngine.createPracticeExam({
      submodules: [submoduleName],
      difficulty: 'mixed',
      questionCount: 15,
      mode: PRACTICE_MODES.TIMED
    });
    examEngine.startExam(exam.id);
    refresh();
    navigate(`/exam-session/${exam.id}`);
  };

  return (
    <div className="progress-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 1100, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
          Preparation Analytics & Mastery
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Comprehensive diagnostic breakdown of your readiness, accuracy trends, and mastery across the dMAT curriculum.
        </p>
      </header>

      {/* Top High-Level Stats */}
      <section className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-400)' }}>
            {stats.readinessScore || 0}%
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            dMAT Readiness Score
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green-400)' }}>
            {stats.overallAccuracy || 0}%
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Overall Accuracy
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats.totalQuestionsAttempted || 0}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Questions Solved
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple-400)' }}>
            {stats.examsCompleted || 0}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Exams Completed
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--amber-400)' }}>
            {formatTimeVerbose(stats.totalStudyTimeSeconds || 0)}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Total Study Time
          </div>
        </div>
      </section>

      {/* Submodule Mastery Matrix */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Curriculum Mastery Matrix (7 Submodules)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {submodules.map(sm => {
            const p = allTopicProgress[sm.name] || allTopicProgress[sm.id] || {
              accuracy: 0,
              questionsAttempted: 0,
              questionsCorrect: 0,
              masteryLevel: 'not-started'
            };

            const accuracy = parseFloat(p.accuracy || 0);

            return (
              <div
                key={sm.id}
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: 'var(--space-4) var(--space-5)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16
                }}
              >
                <div style={{ flex: '1 1 250px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{sm.name}</span>
                    <span className={`mastery-badge mastery-${p.masteryLevel || 'not-started'}`}>
                      {p.masteryLevel ? p.masteryLevel.replace('-', ' ') : 'not started'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {sm.module} • {p.questionsAttempted || 0} tasks attempted ({p.questionsCorrect || 0} correct)
                  </div>
                </div>

                <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <div
                        className={`progress-fill ${p.masteryLevel || 'default'}`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', width: 45, textAlign: 'right', color: accuracy >= 70 ? 'var(--green-400)' : accuracy >= 50 ? 'var(--blue-400)' : 'var(--text-secondary)' }}>
                    {accuracy}%
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => startTopicPractice(sm.name)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    Practice ➔
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two-Column: Strengths & Weaknesses */}
      <section className="two-col" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Weak Areas */}
        <div className="card" style={{ padding: 'var(--space-5)', borderLeft: '4px solid var(--amber-500)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎯</span> Attention Required (Weak Areas)
          </h3>
          {weakAreas.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              No critical weak areas detected! Keep solving a variety of tasks to maintain consistency.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {weakAreas.map(w => (
                <div key={w.topicId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 6 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{w.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--amber-400)' }}>{w.accuracy}% accuracy ({w.attempts} attempts)</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => startTopicPractice(w.name)}
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    Drill
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strong Areas */}
        <div className="card" style={{ padding: 'var(--space-5)', borderLeft: '4px solid var(--green-500)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🏆</span> Mastered Strengths
          </h3>
          {strongAreas.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Complete more questions across all modules to build strong areas.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {strongAreas.map(s => (
                <div key={s.topicId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 6 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--green-400)' }}>{s.accuracy}% accuracy ({s.attempts} attempts)</div>
                  </div>
                  <span className="badge badge-correct">Mastered</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Exam Attempts History */}
      <section className="card" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Historical Exam Sessions ({attempts.length})
        </h2>

        {attempts.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No exams completed yet. Take a Practice Exam or Exam Simulation to begin building your performance history!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Tasks</th>
                  <th>Answered</th>
                  <th>Accuracy</th>
                  <th>Time</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice().reverse().map(att => {
                  const ov = att.results?.overall || {};
                  return (
                    <tr key={att.id}>
                      <td>
                        <span className={`badge ${att.type === 'simulation' ? 'badge-info' : 'badge-medium'}`}>
                          {att.type}
                        </span>
                      </td>
                      <td>{new Date(att.startedAt).toLocaleDateString()}</td>
                      <td>{att.totalQuestions}</td>
                      <td>{att.answeredCount}</td>
                      <td>
                        <strong style={{ color: parseFloat(ov.accuracy || 0) >= 70 ? 'var(--green-400)' : 'var(--amber-400)' }}>
                          {ov.accuracy || 0}%
                        </strong>
                      </td>
                      <td>{formatTime(ov.totalTimeSeconds || 0)}</td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/results/${att.id}`)}
                          style={{ color: 'var(--blue-400)', fontSize: '0.8rem' }}
                        >
                          Results ➔
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
