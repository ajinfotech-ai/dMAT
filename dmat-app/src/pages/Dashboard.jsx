import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { SYLLABUS } from '../data/syllabus.js';
import { formatTime, formatTimeVerbose } from '../generators/utils.js';

export default function Dashboard() {
  const { db, questionBank, refreshKey } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats({
      overall: db.getOverallStats(),
      weakAreas: db.getWeakAreas(),
      strongAreas: db.getStrongestAreas(),
      recommendation: db.getRecommendation(),
      recentSessions: db.getRecentSessions(5),
      reviewQueue: db.getReviewQueue(),
      qbStats: questionBank.getStats()
    });
  }, [refreshKey]);

  if (!stats) return <div className="main-content"><div className="loading-spinner"></div></div>;

  const { overall, weakAreas, strongAreas, recommendation, recentSessions, reviewQueue, qbStats } = stats;

  // Calculate module progress
  const progress = db.getProgress();
  const coreSubtests = SYLLABUS.modules[0].subtests;
  const subjectTopics = SYLLABUS.modules[1].topics;

  function getModuleProgress(items, key = 'id') {
    let totalAttempted = 0, totalCorrect = 0;
    items.forEach(item => {
      const p = progress[item[key]] || {};
      totalAttempted += p.questionsAttempted || 0;
      totalCorrect += p.questionsCorrect || 0;
    });
    return {
      attempted: totalAttempted,
      accuracy: totalAttempted > 0 ? (totalCorrect / totalAttempted * 100).toFixed(0) : 0
    };
  }

  const coreProgress = getModuleProgress(coreSubtests);
  const subjectProgress = getModuleProgress(subjectTopics);

  const topicNameMap = {};
  coreSubtests.forEach(s => { topicNameMap[s.id] = s.name; });
  subjectTopics.forEach(t => { topicNameMap[t.id] = t.name; });

  return (
    <>
      <header className="main-header">
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => navigate('/practice')}>
            ✏️ Quick Practice
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/simulation')}>
            🎯 Exam Simulation
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Recommendation Banner */}
        {recommendation && (
          <div className="card" style={{
            marginBottom: 'var(--space-5)',
            background: recommendation.priority === 'high'
              ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.08))'
              : 'var(--bg-card)',
            borderColor: recommendation.priority === 'high' ? 'var(--blue-600)' : undefined
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Recommended Next Step
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {recommendation.message}
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => {
                if (recommendation.type === 'review') navigate('/mistakes');
                else if (recommendation.type === 'weak-area') navigate('/practice');
                else if (recommendation.type === 'mistakes') navigate('/mistakes');
                else navigate('/learning');
              }}>
                {recommendation.action} →
              </button>
            </div>
          </div>
        )}

        {/* Main Stats */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="card">
            <div className="card-title">Questions Attempted</div>
            <div className="card-value">{overall.questionsAttempted}</div>
            <div className="card-label">{overall.questionsCorrect} correct</div>
          </div>
          <div className="card">
            <div className="card-title">Accuracy</div>
            <div className="card-value" style={{ color: parseFloat(overall.accuracy) >= 70 ? 'var(--green-400)' : parseFloat(overall.accuracy) >= 50 ? 'var(--amber-400)' : 'var(--red-400)' }}>
              {overall.accuracy}%
            </div>
            <div className="card-label">{overall.questionsCorrect} / {overall.questionsAttempted}</div>
          </div>
          <div className="card">
            <div className="card-title">Avg Response Time</div>
            <div className="card-value">{overall.averageTimeSeconds}s</div>
            <div className="card-label">per question</div>
          </div>
          <div className="card">
            <div className="card-title">Study Time</div>
            <div className="card-value">{overall.totalStudyTimeMinutes}m</div>
            <div className="card-label">total practice</div>
          </div>
          <div className="card">
            <div className="card-title">Exams Taken</div>
            <div className="card-value">{overall.totalExams}</div>
            <div className="card-label">{overall.totalBookmarks} bookmarks</div>
          </div>
          <div className="card">
            <div className="card-title">Review Queue</div>
            <div className="card-value" style={{ color: reviewQueue.length > 0 ? 'var(--amber-400)' : 'var(--green-400)' }}>
              {reviewQueue.length}
            </div>
            <div className="card-label">questions due today</div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="two-col" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="card" onClick={() => navigate('/learning/core-module')} style={{ cursor: 'pointer' }}>
            <div className="card-header">
              <div className="card-title">Core Module</div>
              <span className="badge badge-info">{coreProgress.accuracy}% accuracy</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
              Figure Sequences · Mathematical Equations · Latin Squares
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill default"
                style={{ width: `${Math.min(100, coreProgress.attempted / 3)}%` }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6 }}>
              {coreProgress.attempted} questions attempted across 3 subtests
            </div>
          </div>

          <div className="card" onClick={() => navigate('/learning/subject-module')} style={{ cursor: 'pointer' }}>
            <div className="card-header">
              <div className="card-title">Subject Module</div>
              <span className="badge badge-info">{subjectProgress.accuracy}% accuracy</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
              Vector Calculations · Hydrostatics · EOQ · Research Strategies
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill default"
                style={{ width: `${Math.min(100, subjectProgress.attempted / 4)}%` }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6 }}>
              {subjectProgress.attempted} questions attempted across 4 topics
            </div>
          </div>
        </div>

        {/* Weak + Strong Areas */}
        <div className="two-col" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">⚠️ Weakest Areas</div>
            </div>
            {weakAreas.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', padding: '12px 0' }}>
                No weak areas detected yet. Keep practising!
              </div>
            ) : (
              <div className="topic-list" style={{ gap: 6 }}>
                {weakAreas.slice(0, 5).map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-secondary)' }}>
                    <span style={{ fontSize: '0.85rem' }}>{topicNameMap[w.topicId] || w.topicId}</span>
                    <span className="badge badge-incorrect">{w.accuracy}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">💪 Strongest Areas</div>
            </div>
            {strongAreas.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', padding: '12px 0' }}>
                Complete more questions to see your strengths.
              </div>
            ) : (
              <div className="topic-list" style={{ gap: 6 }}>
                {strongAreas.slice(0, 5).map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-secondary)' }}>
                    <span style={{ fontSize: '0.85rem' }}>{topicNameMap[s.topicId] || s.topicId}</span>
                    <span className="badge badge-correct">{s.accuracy}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Question Bank Overview */}
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="card-header">
            <div className="card-title">Question Bank</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin')}>View Details →</button>
          </div>
          <div className="stats-grid">
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{qbStats.total}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total Questions</div>
            </div>
            {Object.entries(qbStats.byDifficulty).map(([diff, count]) => (
              <div key={diff}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{count}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{diff}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
          </div>
          {recentSessions.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
              <div className="empty-state-icon">📝</div>
              <h3>No activity yet</h3>
              <p>Start your first practice session to see your activity here.</p>
            </div>
          ) : (
            <div>
              {recentSessions.map((session, i) => (
                <div key={session.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-secondary)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{session.submoduleId || session.moduleId || 'Practice Session'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {new Date(session.startedAt).toLocaleDateString()} · {session.questionsAttempted} questions
                    </div>
                  </div>
                  <span className={`badge ${session.questionsAttempted > 0 && session.questionsCorrect / session.questionsAttempted >= 0.7 ? 'badge-correct' : 'badge-medium'}`}>
                    {session.questionsAttempted > 0 ? Math.round(session.questionsCorrect / session.questionsAttempted * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
