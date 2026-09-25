import { useState } from 'react';
import { useApp } from '../App.jsx';
import { validateQuestion } from '../generators/utils.js';

export default function Admin() {
  const { questionBank, db, refresh } = useApp();

  const [generatingSubmodule, setGeneratingSubmodule] = useState('');
  const [generateCount, setGenerateCount] = useState(10);
  const [validationReport, setValidationReport] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const submodules = [
    'Figure Sequences',
    'Mathematical Equations',
    'Latin Squares',
    'Vector Calculations',
    'Hydrostatics',
    'Optimal Order Quantity',
    'Research Strategies in Social Sciences'
  ];

  const coverage = questionBank.getCoverageReport();
  const allQuestions = questionBank.getAllQuestions();

  const handleBulkGenerate = (submodule) => {
    setStatusMessage(`Generating ${generateCount} questions for ${submodule}…`);
    setTimeout(() => {
      const generated = questionBank.generateFresh(submodule, 'medium', generateCount);
      setStatusMessage(`Successfully generated ${generated.length} validated questions for ${submodule}!`);
      refresh();
      setTimeout(() => setStatusMessage(''), 4000);
    }, 100);
  };

  const handleGenerateAll = () => {
    setStatusMessage('Generating 10 questions for all 7 submodules (70 total)…');
    setTimeout(() => {
      let total = 0;
      for (const sm of submodules) {
        const gen = questionBank.generateFresh(sm, 'medium', 10);
        total += gen.length;
      }
      setStatusMessage(`Batch generation complete: added ${total} new validated questions!`);
      refresh();
      setTimeout(() => setStatusMessage(''), 4000);
    }, 200);
  };

  const handleRunValidation = () => {
    setStatusMessage('Running comprehensive 12-point validation check across question repository…');
    setTimeout(() => {
      let validCount = 0;
      let issues = [];

      allQuestions.forEach((q, idx) => {
        const res = validateQuestion(q);
        if (res.valid) {
          validCount++;
        } else {
          issues.push({ id: q.id, submodule: q.submodule, errors: res.errors });
        }
      });

      setValidationReport({
        totalChecked: allQuestions.length,
        validCount,
        invalidCount: issues.length,
        issues
      });
      setStatusMessage(`Validation complete: ${validCount} / ${allQuestions.length} passed.`);
      setTimeout(() => setStatusMessage(''), 4000);
    }, 100);
  };

  const handleReSeed = () => {
    setStatusMessage('Re-seeding initial dMAT Question Bank…');
    setTimeout(() => {
      questionBank.initialize(true);
      refresh();
      setStatusMessage('Question bank successfully re-seeded with fresh baseline questions!');
      setTimeout(() => setStatusMessage(''), 4000);
    }, 100);
  };

  return (
    <div className="admin-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 1100, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
          System Administration & Content Diagnostics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Procedural generator controls, repository integrity auditing, and question bank seed management.
        </p>
      </header>

      {statusMessage && (
        <div className="card" style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--blue-500)', color: 'var(--blue-400)', fontWeight: 600, fontSize: '0.9rem' }}>
          ℹ️ {statusMessage}
        </div>
      )}

      {/* Repository Coverage Grid */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Question Bank Coverage Matrix
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Current inventory: <strong>{allQuestions.length}</strong> active questions (Target: 100 per submodule)
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleRunValidation}>
              🔍 Audit Repository Integrity
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleGenerateAll}>
              ⚡ Bulk Generate All (+70)
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Submodule</th>
                <th>Count</th>
                <th>Target</th>
                <th>Coverage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map(c => (
                <tr key={c.submodule}>
                  <td>
                    <strong>{c.submodule}</strong>
                  </td>
                  <td>{c.count}</td>
                  <td>100</td>
                  <td style={{ minWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1, height: 6 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(100, c.coveragePercent)}%`,
                            background: c.coveragePercent >= 100 ? 'var(--green-500)' : 'var(--blue-500)'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{c.coveragePercent}%</span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleBulkGenerate(c.submodule)}
                      style={{ fontSize: '0.75rem', color: 'var(--blue-400)' }}
                    >
                      +10 Fresh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Validation Audit Results */}
      {validationReport && (
        <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)', border: `1px solid ${validationReport.invalidCount === 0 ? 'var(--green-500)' : 'var(--amber-500)'}` }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{validationReport.invalidCount === 0 ? '✅' : '⚠️'}</span>
            Repository Validation Audit
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            Audited <strong>{validationReport.totalChecked}</strong> questions: <strong>{validationReport.validCount}</strong> passed all 12 validation rules, <strong>{validationReport.invalidCount}</strong> issues detected.
          </p>
          {validationReport.issues.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, fontSize: '0.8rem' }}>
              {validationReport.issues.map((iss, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <code>{iss.id}</code> ({iss.submodule}): {iss.errors.join(', ')}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Seed Controls */}
      <section className="card" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          Repository Re-seeding & Rebuild
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
          Re-generates fresh baseline questions across all 7 submodules using the mathematical, logical, and visual SVG generator engines.
        </p>
        <button className="btn btn-secondary" onClick={handleReSeed}>
          🔄 Re-seed Master Question Bank
        </button>
      </section>
    </div>
  );
}
