import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { SYLLABUS, getSubtestById, getSubjectTopicById } from '../data/syllabus.js';
import { LEARNING_CONTENT } from '../data/learningContent.js';
import { getSubtopicLearningContent } from '../data/learning/index.js';

export default function LearningModule() {
  const { moduleId, topicId } = useParams();
  const { db } = useApp();
  const navigate = useNavigate();

  // Determine what we're viewing
  const subtest = getSubtestById(moduleId);
  const subjectTopic = getSubjectTopicById(moduleId);
  const item = subtest || subjectTopic;

  // If topicId is provided, render the in-depth Subtopic Learning Guide
  if (item && topicId) {
    return (
      <SubtopicLearningView
        moduleId={moduleId}
        topicId={topicId}
        parentItem={item}
        isCore={!!subtest}
        navigate={navigate}
        db={db}
      />
    );
  }

  // Handle top-level or invalid modules
  if (!item) {
    if (moduleId === 'core-module' || moduleId === 'subject-module') {
      return (
        <>
          <header className="main-header">
            <h1>{moduleId === 'core-module' ? 'Core Module' : 'Subject Module'}</h1>
            <button className="btn btn-ghost" onClick={() => navigate('/learning')}>← Back to Learning</button>
          </header>
          <div className="main-content">
            <ModuleOverview moduleId={moduleId} navigate={navigate} />
          </div>
        </>
      );
    }
    return (
      <>
        <header className="main-header">
          <h1>Topic Not Found</h1>
        </header>
        <div className="main-content">
          <div className="empty-state">
            <h3>Topic not found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/learning')}>Back to Learning</button>
          </div>
        </div>
      </>
    );
  }

  // Otherwise, render the Module Overview with subtopic cards that navigate to subtopics
  return (
    <ModuleMainView
      moduleId={moduleId}
      item={item}
      isCore={!!subtest}
      navigate={navigate}
      db={db}
    />
  );
}

// ==========================================
// SUBTOPIC IN-DEPTH LEARNING VIEW
// ==========================================
function SubtopicLearningView({ moduleId, topicId, parentItem, isCore, navigate, db }) {
  const [selectedExampleDiff, setSelectedExampleDiff] = useState('easy');

  const subtopicData = getSubtopicLearningContent(moduleId, topicId);
  const siblingTopics = parentItem.topics || parentItem.subtopics || [];
  const currentIndex = siblingTopics.findIndex(t => t.id === topicId);
  const nextTopic = currentIndex >= 0 && currentIndex < siblingTopics.length - 1 ? siblingTopics[currentIndex + 1] : null;
  const prevTopic = currentIndex > 0 ? siblingTopics[currentIndex - 1] : null;

  if (!subtopicData) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <h3>Subtopic content unavailable</h3>
          <button className="btn btn-primary" onClick={() => navigate(`/learning/${moduleId}`)}>
            Back to {parentItem.name}
          </button>
        </div>
      </div>
    );
  }

  // Select active example
  const activeExample = subtopicData.examples.find(
    e => e.difficulty.toLowerCase() === selectedExampleDiff.toLowerCase()
  ) || subtopicData.examples[0];

  return (
    <>
      <header className="main-header">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb-nav">
            <span className="breadcrumb-link" onClick={() => navigate('/learning')}>Learning</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-link" onClick={() => navigate(`/learning/${moduleId}`)}>{parentItem.name}</span>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{subtopicData.title}</span>
          </div>
          <h1 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{isCore ? '🧩' : '📐'}</span>
            <span>{subtopicData.title}</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/learning/${moduleId}`)}>
            ← Subtopics
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/practice?submodule=${encodeURIComponent(parentItem.name)}&topic=${topicId}`)}
          >
            Practice This Topic →
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Sibling Subtopics Quick Switcher */}
        <div className="subtopic-switcher-bar">
          {siblingTopics.map(st => (
            <button
              key={st.id}
              className={`subtopic-pill ${st.id === topicId ? 'active' : ''}`}
              onClick={() => navigate(`/learning/${moduleId}/${st.id}`)}
            >
              {st.name}
            </button>
          ))}
        </div>

        {/* SECTION 1: Conceptual Overview & Key Principles */}
        <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              📖 <span>Concept Overview & Mechanics</span>
            </h2>
            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--blue-400)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              {subtopicData.submodule}
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 'var(--space-4)', whiteSpace: 'pre-wrap' }}>
            {subtopicData.overview}
          </p>

          {/* Governing Principles */}
          {subtopicData.principles && subtopicData.principles.length > 0 && (
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)', marginTop: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                Core Principles to Remember
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {subtopicData.principles.map((pr, i) => (
                  <li key={i}>{pr}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Formulas if present */}
          {subtopicData.formulas && subtopicData.formulas.length > 0 && (
            <div style={{ marginTop: 'var(--space-5)' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                Governing Mathematical Formulas
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {subtopicData.formulas.map((form, i) => (
                  <div key={i} className="formula-card">
                    {form}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: High-Yield Exam Tricks & Shortcuts */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚡ <span>dMAT Exam Tricks & Time-Saving Shortcuts</span>
          </h2>
          {subtopicData.examTricks && subtopicData.examTricks.map((trick, i) => (
            <div key={i} className="trick-card">
              <div className="trick-header">
                <span>⚡</span>
                <span>{trick.title}</span>
              </div>
              <div className="trick-body">
                {trick.description}
              </div>
              {trick.ruleOfThumb && (
                <div className="rule-of-thumb-badge">
                  <span>💡 Rule of Thumb:</span>
                  <span>{trick.ruleOfThumb}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SECTION 3: Common Exam Traps */}
        {subtopicData.commonTraps && subtopicData.commonTraps.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ <span>Common Traps to Avoid</span>
            </h2>
            {subtopicData.commonTraps.map((trap, i) => (
              <div key={i} className="trap-card">
                <div className="trap-header">
                  <span>⚠️</span>
                  <span>Trap: {trap.trap}</span>
                </div>
                <div className="trap-body">
                  <div style={{ marginBottom: 6 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Why candidates get this wrong:</strong> {trap.whyItHappens}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--green-400)' }}>How to avoid it:</strong> {trap.howToAvoid}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 4: Worked Examples Across Difficulty Levels */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              📝 <span>Worked Examples by Difficulty Level</span>
            </h2>
          </div>

          {/* Difficulty Selector Tabs */}
          <div className="example-diff-tabs">
            {['easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                className={`example-tab-btn ${diff} ${selectedExampleDiff === diff ? 'active' : ''}`}
                onClick={() => setSelectedExampleDiff(diff)}
              >
                <span>{diff === 'easy' ? '🟢 Easy' : diff === 'medium' ? '🟡 Medium' : '🔴 Hard'}</span>
                <span>Example</span>
              </button>
            ))}
          </div>

          {/* Active Example Card */}
          {activeExample && (
            <div className="example-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeExample.title}
                </h3>
                <span className={`badge badge-${activeExample.difficulty.toLowerCase()}`}>
                  {activeExample.difficulty}
                </span>
              </div>

              {/* Problem Statement */}
              <div className="example-problem-box">
                {activeExample.problem}
              </div>

              {/* Options */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                  Answer Options
                </div>
                <div className="example-options-grid">
                  {activeExample.options.map((opt, idx) => {
                    const isCorrect = idx === activeExample.correctIndex;
                    const letter = ['A', 'B', 'C', 'D'][idx] || String.fromCharCode(65 + idx);
                    return (
                      <div key={idx} className={`example-option-row ${isCorrect ? 'correct-option' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 700, color: isCorrect ? 'var(--green-400)' : 'var(--text-tertiary)' }}>
                            {letter}.
                          </span>
                          <span style={{ color: isCorrect ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {opt}
                          </span>
                        </div>
                        {isCorrect && (
                          <span className="badge badge-correct" style={{ fontSize: '0.75rem' }}>
                            ✓ Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Solution Path */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                  Step-by-Step Solution Path
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 'var(--space-3)' }}>
                  {activeExample.explanation}
                </p>
                {activeExample.steps && (
                  <div className="example-step-list">
                    {activeExample.steps.map((st, i) => (
                      <div key={i} className="example-step-item">
                        {st}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Speed Trick Callout */}
              {activeExample.examTrick && (
                <div className="example-shortcut-box">
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <div>
                    <strong>Exam Speed Trick:</strong> {activeExample.examTrick}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION: Next topic or practice */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-5) 0', borderTop: '1px solid var(--border-secondary)', flexWrap: 'wrap', gap: 12 }}>
          <div>
            {prevTopic ? (
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/learning/${moduleId}/${prevTopic.id}`)}
              >
                ← Previous: {prevTopic.name}
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/learning/${moduleId}`)}
              >
                ← Back to {parentItem.name}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {nextTopic && (
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/learning/${moduleId}/${nextTopic.id}`)}
              >
                Next: {nextTopic.name} →
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/practice?submodule=${encodeURIComponent(parentItem.name)}&topic=${topicId}`)}
            >
              Practice {subtopicData.title} (5 Qs) →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// SUBMODULE OVERVIEW VIEW
// ==========================================
function ModuleMainView({ moduleId, item, isCore, navigate, db }) {
  const [activeTab, setActiveTab] = useState('overview');

  const content = LEARNING_CONTENT[moduleId] || {};
  const progress = db.getTopicProgress(moduleId);
  const accuracy = progress.questionsAttempted > 0 ? (progress.questionsCorrect / progress.questionsAttempted * 100).toFixed(0) : 0;
  const topicsList = isCore ? item.topics : item.subtopics;

  const tabs = ['overview', 'subtopics', 'concepts', 'strategy'];

  return (
    <>
      <header className="main-header">
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isCore ? 'Core Module' : 'Subject Module'} →
          </div>
          <h1 style={{ fontSize: '1.25rem' }}>{item.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/learning')}>← Back to Modules</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/practice?submodule=${encodeURIComponent(item.name)}`)}
          >
            Practice Exam →
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="card">
            <div className="card-title">Questions Attempted</div>
            <div className="card-value">{progress.questionsAttempted}</div>
          </div>
          <div className="card">
            <div className="card-title">Accuracy</div>
            <div className="card-value" style={{ color: accuracy >= 70 ? 'var(--green-400)' : accuracy >= 50 ? 'var(--amber-400)' : accuracy > 0 ? 'var(--red-400)' : 'var(--text-secondary)' }}>
              {accuracy}%
            </div>
          </div>
          <div className="card">
            <div className="card-title">Mastery Level</div>
            <div className={`mastery-badge mastery-${progress.masteryLevel}`} style={{ marginTop: 8 }}>
              {progress.masteryLevel.replace('-', ' ')}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Curriculum Scope</div>
            <div className="card-value" style={{ fontSize: '1.4rem' }}>{topicsList?.length || 0} Subtopics</div>
            <div className="card-label">With worked examples & tricks</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs">
          {tabs.map(tab => (
            <div
              key={tab}
              className={`tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'subtopics' ? '📚 Subtopics & Lessons' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Overview</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {item.description}
              </p>
            </div>

            {isCore && item.instructions && (
              <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Official dMAT Instructions</h3>
                <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                  {item.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}

            {isCore && item.rules && (
              <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Official Examination Rules</h3>
                <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                  {item.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Link to Subtopics */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Subtopics in this Module</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('subtopics')}>
                  View All Subtopics →
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
                {topicsList?.map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => navigate(`/learning/${moduleId}/${topic.id}`)}
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--blue-500)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-secondary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                      {topic.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>
                      {topic.description?.slice(0, 90)}…
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--blue-400)', fontWeight: 600 }}>
                      Study Topic & Examples →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBTOPICS & LESSONS (CLICKING NAVIGATES TO IN-DEPTH GUIDE!) */}
        {activeTab === 'subtopics' && (
          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Select any subtopic below to explore in-depth conceptual explanations, governing formulas, high-yield exam tricks, and difficulty-graded worked examples (Easy, Medium, Hard).
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {topicsList?.map((topic, idx) => {
                const tp = db.getTopicProgress(topic.id);
                return (
                  <div
                    key={topic.id}
                    className="card"
                    style={{
                      padding: 'var(--space-5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid var(--border-secondary)'
                    }}
                    onClick={() => navigate(`/learning/${moduleId}/${topic.id}`)}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--blue-500)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-secondary)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(59, 130, 246, 0.12)',
                          color: 'var(--blue-400)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1rem',
                          flexShrink: 0
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                          {topic.name}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, maxWidth: 650 }}>
                          {topic.description}
                        </p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--green-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            ✓ 3 Worked Examples (Easy, Med, Hard)
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--blue-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            ⚡ Exam Speed Tricks
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/learning/${moduleId}/${topic.id}`);
                        }}
                      >
                        Study Lesson →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CONCEPTS & FORMULAS */}
        {activeTab === 'concepts' && (
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Master Concepts</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {content.concepts || item.description}
              </div>
            </div>
            {content.formulas && (
              <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Summary Formula Sheet</h3>
                <div style={{ color: 'var(--blue-300)', fontSize: '0.95rem', fontFamily: 'var(--font-mono)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>
                  {content.formulas}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STRATEGY & TRAPS */}
        {activeTab === 'strategy' && (
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Overall Solving Strategy</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {content.strategy || 'Systematically analyze given constraints and prune impossible choices.'}
              </div>
            </div>
            <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>General Traps</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {content.traps || 'Watch for boundary reflections, double negatives, and unit conversions.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ModuleOverview({ moduleId, navigate }) {
  const module = SYLLABUS.modules.find(m => m.id === moduleId);
  if (!module) return null;

  const items = module.subtests || module.topics || [];

  return (
    <div>
      <div className="learning-hero">
        <h2>{module.name}</h2>
        <p>{module.description}</p>
      </div>
      <div className="module-cards">
        {items.map(item => (
          <div key={item.id} className="module-card" onClick={() => navigate(`/learning/${item.id}`)}>
            <h3>{item.name}</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {item.description?.slice(0, 100)}…
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
