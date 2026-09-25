import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { SYLLABUS } from '../data/syllabus.js';
import examEngine, { PRACTICE_MODES } from '../engine/examEngine.js';

export default function PracticeExam() {
  const { db, refresh } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode and settings
  const [selectedMode, setSelectedMode] = useState(PRACTICE_MODES.TIMED);
  const [selectedDifficulty, setSelectedDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(20);
  const [showImmediateFeedback, setShowImmediateFeedback] = useState(true);

  // Selected submodules (default: all, or query param)
  const allSubmodules = useMemo(() => [
    'Figure Sequences',
    'Mathematical Equations',
    'Latin Squares',
    'Vector Calculations',
    'Hydrostatics',
    'Optimal Order Quantity',
    'Research Strategies in Social Sciences'
  ], []);

  const requestedSubmodule = searchParams.get('submodule');
  const [selectedSubmodules, setSelectedSubmodules] = useState(() => {
    if (requestedSubmodule && allSubmodules.includes(requestedSubmodule)) {
      return [requestedSubmodule];
    }
    return allSubmodules;
  });

  const stats = db.getOverallStats();
  const weakAreas = db.getWeakAreas();
  const reviewQueue = db.getReviewQueue();

  const toggleSubmodule = (sm) => {
    setSelectedSubmodules(prev => {
      if (prev.includes(sm)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(item => item !== sm);
      } else {
        return [...prev, sm];
      }
    });
  };

  const selectAll = () => setSelectedSubmodules(allSubmodules);
  const selectCoreOnly = () => setSelectedSubmodules(['Figure Sequences', 'Mathematical Equations', 'Latin Squares']);
  const selectSubjectOnly = () => setSelectedSubmodules([
    'Vector Calculations',
    'Hydrostatics',
    'Optimal Order Quantity',
    'Research Strategies in Social Sciences'
  ]);

  const handleStartExam = (customConfig = null) => {
    const config = customConfig || {
      submodules: selectedSubmodules,
      difficulty: selectedDifficulty,
      questionCount: parseInt(questionCount, 10),
      mode: selectedMode,
      settings: {
        showFeedback: showImmediateFeedback,
        showExplanation: true
      }
    };

    const exam = examEngine.createPracticeExam(config);
    if (exam) {
      if (customConfig?.settings?.showFeedback !== undefined) {
        exam.settings.showFeedback = customConfig.settings.showFeedback;
      } else {
        exam.settings.showFeedback = showImmediateFeedback;
      }
      examEngine.startExam(exam.id);
      refresh();
      navigate(`/exam-session/${exam.id}`);
    }
  };

  // Quick Preset Launches
  const handleQuickStart = (type) => {
    if (type === 'quick-mix') {
      handleStartExam({
        submodules: allSubmodules,
        difficulty: 'mixed',
        questionCount: 10,
        mode: PRACTICE_MODES.TIMED,
        settings: { showFeedback: true }
      });
    } else if (type === 'core-sprint') {
      handleStartExam({
        submodules: ['Figure Sequences', 'Mathematical Equations', 'Latin Squares'],
        difficulty: 'mixed',
        questionCount: 15,
        mode: PRACTICE_MODES.TIMED,
        settings: { showFeedback: true }
      });
    } else if (type === 'subject-focus') {
      handleStartExam({
        submodules: ['Vector Calculations', 'Hydrostatics', 'Optimal Order Quantity', 'Research Strategies in Social Sciences'],
        difficulty: 'mixed',
        questionCount: 16,
        mode: PRACTICE_MODES.TIMED,
        settings: { showFeedback: true }
      });
    } else if (type === 'weak-area') {
      handleStartExam({
        submodules: weakAreas.length > 0 ? weakAreas.map(w => w.name) : allSubmodules,
        difficulty: 'mixed',
        questionCount: 15,
        mode: PRACTICE_MODES.WEAK_AREA,
        settings: { showFeedback: true }
      });
    } else if (type === 'speed-drill') {
      handleStartExam({
        submodules: allSubmodules,
        difficulty: 'medium',
        questionCount: 20,
        mode: PRACTICE_MODES.SPEED,
        settings: { showFeedback: false }
      });
    } else if (type === 'mistakes-review') {
      handleStartExam({
        submodules: allSubmodules,
        difficulty: 'mixed',
        questionCount: Math.min(20, Math.max(5, reviewQueue.length)),
        mode: PRACTICE_MODES.REVIEW,
        settings: { showFeedback: true }
      });
    }
  };

  const modeDescriptions = {
    [PRACTICE_MODES.TIMED]: 'Standard test timer based on official per-question allocation.',
    [PRACTICE_MODES.UNTIMED]: 'No time pressure. Ideal for thorough concept learning and deep deduction.',
    [PRACTICE_MODES.SPEED]: '30 seconds per question high-intensity drill to build quick pattern recognition.',
    [PRACTICE_MODES.WEAK_AREA]: 'Prioritizes questions from topics where your historical accuracy is lowest.',
    [PRACTICE_MODES.ADAPTIVE]: 'Dynamic question selection balancing your current mastery and learning curve.',
    [PRACTICE_MODES.REVIEW]: 'Targeted practice from your spaced-repetition mistake notebook.'
  };

  return (
    <div className="practice-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 1100, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
          Practice Exam Laboratory
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Configure custom targeted practice sessions with real-time feedback, detailed step-by-step solutions, and flexible pacing.
        </p>
      </header>

      {/* Quick Launch Cards */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚡ <span>Quick Launch Presets</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-secondary)' }}
            onClick={() => handleQuickStart('quick-mix')}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue-500)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-secondary)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '1.4rem' }}>🎲</span>
              <span className="badge badge-medium">10 Questions</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>Quick 10-Question Mix</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              A balanced blend across all 7 dMAT submodules for a rapid 10-minute checkup.
            </p>
          </div>

          <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-secondary)' }}
            onClick={() => handleQuickStart('core-sprint')}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue-500)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-secondary)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '1.4rem' }}>🧩</span>
              <span className="badge badge-info">15 Questions</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>Core Module Sprint</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Figure Sequences, Mathematical Equations, and Latin Squares exclusively.
            </p>
          </div>

          <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-secondary)' }}
            onClick={() => handleQuickStart('subject-focus')}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue-500)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-secondary)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '1.4rem' }}>🔬</span>
              <span className="badge badge-info">16 Questions</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>Subject Module Focus</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Vectors, Hydrostatics, Optimal Order Quantity & Social Research methodology.
            </p>
          </div>

          {weakAreas.length > 0 && (
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.05)' }}
              onClick={() => handleQuickStart('weak-area')}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--amber-500)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '1.4rem' }}>🎯</span>
                <span className="badge badge-hard">Targeted</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>Weak Area Booster</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Concentrated practice on your {weakAreas.length} lowest-accuracy submodules.
              </p>
            </div>
          )}

          {reviewQueue.length > 0 && (
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' }}
              onClick={() => handleQuickStart('mistakes-review')}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red-500)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '1.4rem' }}>🔄</span>
                <span className="badge badge-challenge">{reviewQueue.length} Due</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>Mistakes Spaced Review</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Re-test missed questions scheduled for review to lock in mastery.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Practice Configurator */}
      <section className="card" style={{ padding: 'var(--space-6)', border: '1px solid var(--border-secondary)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 10 }}>
          🛠️ <span>Custom Practice Setup</span>
        </h2>

        {/* Practice Mode Selector */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
            1. Select Practice Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
            {[
              { id: PRACTICE_MODES.TIMED, label: 'Timed Practice', icon: '⏱️' },
              { id: PRACTICE_MODES.UNTIMED, label: 'Untimed Study', icon: '📖' },
              { id: PRACTICE_MODES.SPEED, label: 'Speed Drill', icon: '⚡' },
              { id: PRACTICE_MODES.WEAK_AREA, label: 'Weak Areas', icon: '🎯' },
              { id: PRACTICE_MODES.ADAPTIVE, label: 'Adaptive', icon: '🧠' }
            ].map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  background: selectedMode === m.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-tertiary)',
                  border: `2px solid ${selectedMode === m.id ? 'var(--blue-500)' : 'transparent'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.label}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--blue-400)' }}>
            ℹ️ {modeDescriptions[selectedMode]}
          </p>
        </div>

        {/* Submodules Selection */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              2. Select Topics ({selectedSubmodules.length} of {allSubmodules.length})
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={selectAll} style={{ fontSize: '0.75rem' }}>All</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={selectCoreOnly} style={{ fontSize: '0.75rem' }}>Core Only</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={selectSubjectOnly} style={{ fontSize: '0.75rem' }}>Subject Only</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {allSubmodules.map(sm => {
              const isSelected = selectedSubmodules.includes(sm);
              const isCore = ['Figure Sequences', 'Mathematical Equations', 'Latin Squares'].includes(sm);
              return (
                <div
                  key={sm}
                  onClick={() => toggleSubmodule(sm)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--navy-700)' : 'var(--bg-tertiary)',
                    border: `1px solid ${isSelected ? 'var(--blue-500)' : 'var(--border-secondary)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{sm}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, background: isCore ? 'rgba(59, 130, 246, 0.2)' : 'rgba(168, 85, 247, 0.2)', color: isCore ? 'var(--blue-400)' : 'var(--purple-400)' }}>
                    {isCore ? 'Core' : 'Subject'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty & Count */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
              3. Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-3)' }}
            >
              <option value="mixed">Mixed (Standard dMAT distribution)</option>
              <option value="easy">Easy (Foundations)</option>
              <option value="medium">Medium (Representative dMAT level)</option>
              <option value="hard">Hard (Advanced deduction)</option>
              <option value="challenge">Challenge (Highest difficulty)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
              4. Number of Questions
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[5, 10, 15, 20, 30].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`btn ${questionCount === cnt ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ flex: 1 }}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
              5. Feedback Timing
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setShowImmediateFeedback(true)}
                className={`btn ${showImmediateFeedback ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                Instant Feedback
              </button>
              <button
                type="button"
                onClick={() => setShowImmediateFeedback(false)}
                className={`btn ${!showImmediateFeedback ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                At End Only
              </button>
            </div>
          </div>
        </div>

        {/* Start Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-secondary)' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => handleStartExam()}
            style={{ minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <span>Start Practice Exam</span>
            <span>➔</span>
          </button>
        </div>
      </section>
    </div>
  );
}
