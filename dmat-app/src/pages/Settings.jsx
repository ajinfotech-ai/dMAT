import { useState } from 'react';
import { useApp } from '../App.jsx';

export default function Settings() {
  const { db, questionBank, refresh } = useApp();

  const profile = db.getUserProfile();
  const [name, setName] = useState(profile.name || 'Candidate');
  const [targetScore, setTargetScore] = useState(profile.targetScore || 80);
  const [targetDate, setTargetDate] = useState(profile.targetDate || '');
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal || 20);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    db.saveUserProfile({
      ...profile,
      name,
      targetScore: parseInt(targetScore, 10),
      targetDate,
      dailyGoal: parseInt(dailyGoal, 10)
    });
    setSavedSuccess(true);
    refresh();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFullReset = () => {
    db.resetAllData();
    questionBank.initialize(true);
    setShowResetModal(false);
    refresh();
    window.location.reload();
  };

  const handleExportBackup = () => {
    const fullState = {
      profile: db.getUserProfile(),
      attempts: db.getExamAttempts(),
      mistakes: db.getMistakes(),
      bookmarks: db.getBookmarks(),
      topicProgress: db.getAllTopicProgress(),
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dmat_user_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="settings-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
          Application Settings & Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Personalize your target score, exam timeline, preparation preferences, and local data persistence.
        </p>
      </header>

      {/* Profile Form */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Candidate Profile & Goals
        </h2>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Candidate Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Target dMAT Accuracy Score (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={targetScore}
                onChange={e => setTargetScore(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Daily Task Target (Tasks/Day)
              </label>
              <input
                type="number"
                min="5"
                max="200"
                value={dailyGoal}
                onChange={e => setDailyGoal(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Official Exam Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 'var(--space-3)' }}>
            {savedSuccess && (
              <span style={{ color: 'var(--green-400)', fontSize: '0.9rem', fontWeight: 600 }}>
                ✓ Profile preferences saved!
              </span>
            )}
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* Backup & Data Management */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Data Backup & Storage
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
          All exam progress, mistakes, and bookmarks are preserved offline in your browser's persistent LocalStorage.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExportBackup}>
            📥 Export Study History JSON
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="card" style={{ padding: 'var(--space-6)', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.03)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--red-400)', marginBottom: 'var(--space-2)' }}>
          ⚠️ Danger Zone
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
          Resetting will permanently erase all exam history, mistakes logs, bookmarks, and topic mastery records.
        </p>

        <button className="btn btn-primary" onClick={() => setShowResetModal(true)} style={{ background: 'var(--red-600)' }}>
          Reset All Preparation Data
        </button>
      </section>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg-overlay)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card animate-scale-in" style={{ maxWidth: 450, width: '100%', padding: 'var(--space-6)', border: '1px solid var(--red-600)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--red-400)', marginBottom: 'var(--space-3)' }}>
              Confirm Complete Data Reset
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-5)' }}>
              Are you sure you want to reset all preparation data? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setShowResetModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleFullReset} style={{ background: 'var(--red-600)' }}>
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
