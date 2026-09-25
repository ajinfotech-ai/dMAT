import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import examEngine, { OFFICIAL_TIMING } from '../engine/examEngine.js';
import { formatTimeVerbose } from '../generators/utils.js';

export default function ExamSimulation() {
  const { db, refresh } = useApp();
  const navigate = useNavigate();

  // Check if there's an active simulation in autosave
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Load past simulation attempts
  const allAttempts = db.getExamAttempts();
  const simulationAttempts = allAttempts.filter(a => a.type === 'simulation');

  useEffect(() => {
    // Check local progress for in-progress simulation
    const active = db.getActiveExam();
    if (active && active.type === 'simulation' && active.status === 'in-progress') {
      setActiveSimulation(active);
    }
  }, [db]);

  const handleStartSimulation = () => {
    const exam = examEngine.createExamSimulation();
    examEngine.startExam(exam.id);
    refresh();
    navigate(`/exam-session/${exam.id}`);
  };

  const handleResumeSimulation = () => {
    if (activeSimulation) {
      examEngine.resumeExam(activeSimulation.id);
      refresh();
      navigate(`/exam-session/${activeSimulation.id}`);
    }
  };

  return (
    <div className="simulation-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 1000, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--blue-400)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 12 }}>
          <span>🏛️</span>
          <span>Official dMAT Test Simulation</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
          Official dMAT Exam Simulation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          Experience the exact conditions, timing, structure, and question distribution of the official
          General Academic Module entrance test under timed test-center conditions.
        </p>
      </header>

      {/* Resume Banner if Active */}
      {activeSimulation && (
        <div className="card" style={{ marginBottom: 'var(--space-6)', border: '1px solid var(--amber-500)', background: 'rgba(245, 158, 11, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5)' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--amber-400)', marginBottom: 4 }}>
              ⚠️ Unfinished Exam Session Detected
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              You have an in-progress exam simulation from {new Date(activeSimulation.startedAt).toLocaleString()}.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn btn-primary"
              onClick={handleResumeSimulation}
              style={{ background: 'var(--amber-500)', color: 'black', fontWeight: 700 }}
            >
              Resume Simulation ➔
            </button>
          </div>
        </div>
      )}

      {/* Official Exam Architecture Grid */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Official Examination Structure & Timetable
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          {/* Section 1 */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--blue-500)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-400)', textTransform: 'uppercase' }}>Section 1</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '6px 0' }}>Figure Sequences</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>📝 <strong>20 Tasks</strong></span>
              <span>⏱️ <strong>25 Minutes</strong></span>
              <span>💡 Visual pattern matrices</span>
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--blue-500)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-400)', textTransform: 'uppercase' }}>Section 2</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '6px 0' }}>Mathematical Equations</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>📝 <strong>20 Tasks</strong></span>
              <span>⏱️ <strong>25 Minutes</strong></span>
              <span>💡 Systems of equations (1–20)</span>
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--blue-500)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-400)', textTransform: 'uppercase' }}>Section 3</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '6px 0' }}>Latin Squares</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>📝 <strong>20 Tasks</strong></span>
              <span>⏱️ <strong>25 Minutes</strong></span>
              <span>💡 5×5 sudoku-style grids</span>
            </div>
          </div>

          {/* Break */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--green-500)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-400)', textTransform: 'uppercase' }}>Intermission</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '6px 0' }}>Official Rest Break</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>☕ <strong>30 Minutes</strong></span>
              <span>💡 Rest & mental reset</span>
              <span>⚠️ Can be skipped if desired</span>
            </div>
          </div>

          {/* Section 4 */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--purple-500)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple-400)', textTransform: 'uppercase' }}>Section 4</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '6px 0' }}>Subject Module</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>📝 <strong>22 Tasks</strong> (4 domains)</span>
              <span>⏱️ <strong>90 Minutes</strong></span>
              <span>💡 Vectors, Hydro, EOQ, Research</span>
            </div>
          </div>
        </div>

        {/* Official Rules & Instructions */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📋</span> Official dMAT Rules & Guidance
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: 'var(--blue-400)' }}>•</span>
              <span><strong>No Negative Marking:</strong> Wrong answers do not incur penalties. Guessing is explicitly encouraged—never leave any task unanswered.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: 'var(--blue-400)' }}>•</span>
              <span><strong>No Calculators:</strong> Electronic calculation devices are strictly prohibited during the real exam. Perform all arithmetic mentally.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: 'var(--blue-400)' }}>•</span>
              <span><strong>Section Time Boundaries:</strong> Each section is strictly timed. Unused time in one section does NOT carry over to subsequent sections.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: 'var(--blue-400)' }}>•</span>
              <span><strong>No Going Back:</strong> Once a section ends, questions in previous sections are locked and cannot be edited.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: 'var(--blue-400)' }}>•</span>
              <span><strong>Single Best Answer:</strong> Every question has exactly one correct answer out of the provided choices.</span>
            </li>
          </ul>
        </div>

        {/* Readiness Checklist */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
          <input
            type="checkbox"
            id="agreeRules"
            checked={agreedToRules}
            onChange={e => setAgreedToRules(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="agreeRules" style={{ fontSize: '0.875rem', cursor: 'pointer', userSelect: 'none' }}>
            I understand the official dMAT rules: 3 hours + 30m break, no calculator, strict section timing, and non-reversible sections.
          </label>
        </div>

        {/* Start Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            className="btn btn-primary btn-lg"
            disabled={!agreedToRules}
            onClick={handleStartSimulation}
            style={{ minWidth: 260, fontWeight: 700 }}
          >
            Begin Official Simulation ➔
          </button>
        </div>
      </section>

      {/* Past Simulation History */}
      {simulationAttempts.length > 0 && (
        <section className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Past Simulation Attempts ({simulationAttempts.length})
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Questions</th>
                  <th>Answered</th>
                  <th>Accuracy</th>
                  <th>Total Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {simulationAttempts.map(attempt => {
                  const res = attempt.results || {};
                  const overall = res.overall || {};
                  return (
                    <tr key={attempt.id}>
                      <td>{new Date(attempt.startedAt).toLocaleDateString()}</td>
                      <td>{attempt.totalQuestions}</td>
                      <td>{attempt.answeredCount}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: (parseFloat(overall.accuracy) >= 70) ? 'var(--green-400)' : (parseFloat(overall.accuracy) >= 50) ? 'var(--blue-400)' : 'var(--amber-400)' }}>
                          {overall.accuracy || 0}%
                        </span>
                      </td>
                      <td>
                        <strong>{overall.questionsCorrect || 0} / {overall.totalQuestions || attempt.totalQuestions}</strong>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/results/${attempt.id}`)}
                          style={{ color: 'var(--blue-400)' }}
                        >
                          View Report ➔
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
