import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { SYLLABUS } from '../data/syllabus.js';

export default function Learning() {
  const { db } = useApp();
  const navigate = useNavigate();
  const progress = db.getProgress();

  const coreModule = SYLLABUS.modules[0];
  const subjectModule = SYLLABUS.modules[1];

  function getMasteryLevel(id) {
    const p = progress[id];
    if (!p || p.questionsAttempted === 0) return 'not-started';
    return p.masteryLevel || 'learning';
  }

  function getMasteryLabel(level) {
    const labels = { 'not-started': 'Not Started', 'learning': 'Learning', 'practicing': 'Practicing', 'improving': 'Improving', 'mastered': 'Mastered' };
    return labels[level] || 'Not Started';
  }

  function getAccuracy(id) {
    const p = progress[id];
    if (!p || p.questionsAttempted === 0) return null;
    return Math.round(p.questionsCorrect / p.questionsAttempted * 100);
  }

  return (
    <>
      <header className="main-header">
        <h1>Learning</h1>
      </header>
      <div className="main-content">
        <div className="learning-hero">
          <h2>dMAT Preparation</h2>
          <p>
            Study the complete dMAT syllabus module-by-module. The dMAT consists of a Core Module
            testing cognitive and analytical skills, and a Subject Module testing application of
            those skills to academic problem solving.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btn btn-primary" onClick={() => navigate('/practice')}>
              Start Practice →
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/simulation')}>
              Full Exam Simulation
            </button>
          </div>
        </div>

        {/* Core Module */}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Core Module
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-4)', maxWidth: 700 }}>
          {coreModule.description}
        </p>

        <div className="module-cards" style={{ marginBottom: 'var(--space-8)' }}>
          {coreModule.subtests.map(subtest => {
            const mastery = getMasteryLevel(subtest.id);
            const accuracy = getAccuracy(subtest.id);
            return (
              <div
                key={subtest.id}
                className="module-card"
                onClick={() => navigate(`/learning/${subtest.id}`)}
              >
                <div className="module-card-header">
                  <div className="module-card-icon core">🧩</div>
                  <span className={`mastery-badge mastery-${mastery}`}>
                    {getMasteryLabel(mastery)}
                  </span>
                </div>
                <h3>{subtest.name}</h3>
                <p>{subtest.description.slice(0, 120)}…</p>
                <div className="module-card-footer">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {subtest.taskCount} tasks · {subtest.timeMinutes} min
                  </div>
                  {accuracy !== null && (
                    <span className={`badge ${accuracy >= 70 ? 'badge-correct' : accuracy >= 50 ? 'badge-medium' : 'badge-incorrect'}`}>
                      {accuracy}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subject Module */}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Subject Module — General Academic Module
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-4)', maxWidth: 700 }}>
          {subjectModule.description}
        </p>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
          ⏱ {subjectModule.timeMinutes} minutes · {subjectModule.questionCount} single-choice questions · {subjectModule.answerOptions} answer options each
        </div>

        <div className="module-cards">
          {subjectModule.topics.map(topic => {
            const mastery = getMasteryLevel(topic.id);
            const accuracy = getAccuracy(topic.id);
            return (
              <div
                key={topic.id}
                className="module-card"
                onClick={() => navigate(`/learning/${topic.id}`)}
              >
                <div className="module-card-header">
                  <div className="module-card-icon subject">📐</div>
                  <span className={`mastery-badge mastery-${mastery}`}>
                    {getMasteryLabel(mastery)}
                  </span>
                </div>
                <h3>{topic.name}</h3>
                <p>{topic.description.slice(0, 120)}…</p>
                <div className="module-card-footer">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {topic.subtopics?.length || 0} subtopics
                  </div>
                  {accuracy !== null && (
                    <span className={`badge ${accuracy >= 70 ? 'badge-correct' : accuracy >= 50 ? 'badge-medium' : 'badge-incorrect'}`}>
                      {accuracy}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
