import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import examEngine, { PRACTICE_MODES } from '../engine/examEngine.js';

export default function QuestionBankPage() {
  const { questionBank, db, refresh } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmodule, setSelectedSubmodule] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const submodules = [
    'Figure Sequences',
    'Mathematical Equations',
    'Latin Squares',
    'Vector Calculations',
    'Hydrostatics',
    'Optimal Order Quantity',
    'Research Strategies in Social Sciences'
  ];

  // Get all questions
  const allQuestions = questionBank.getAllQuestions();
  const coverage = questionBank.getCoverageReport();

  // Filtered list
  const filtered = useMemo(() => {
    return allQuestions.filter(q => {
      if (selectedSubmodule !== 'all' && q.submodule !== selectedSubmodule) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'all') {
        if (selectedType === 'visual' && q.questionType !== 'visual_choice') return false;
        if (selectedType === 'latin' && !q.gridData) return false;
        if (selectedType === 'equation' && !q.equations) return false;
        if (selectedType === 'text' && (q.questionType === 'visual_choice' || q.gridData || q.equations)) return false;
      }
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const textMatch = q.questionText && q.questionText.toLowerCase().includes(query);
        const subMatch = q.submodule && q.submodule.toLowerCase().includes(query);
        const topicMatch = q.topic && q.topic.toLowerCase().includes(query);
        const explMatch = q.explanation && q.explanation.toLowerCase().includes(query);
        if (!textMatch && !subMatch && !topicMatch && !explMatch) return false;
      }
      return true;
    });
  }, [allQuestions, selectedSubmodule, selectedDifficulty, selectedType, searchTerm]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pagedQuestions = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Generate batch
  const handleGenerateBatch = (targetSubmodule) => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const sm = targetSubmodule || (selectedSubmodule !== 'all' ? selectedSubmodule : 'Figure Sequences');
        questionBank.generateFresh(sm, 'medium', 10);
        refresh();
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  // Practice filtered questions
  const handlePracticeFiltered = () => {
    if (filtered.length === 0) return;
    const exam = examEngine.createPracticeExam({
      submodules: selectedSubmodule !== 'all' ? [selectedSubmodule] : submodules,
      difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : 'mixed',
      questionCount: Math.min(20, filtered.length),
      mode: PRACTICE_MODES.TIMED
    });
    examEngine.startExam(exam.id);
    refresh();
    navigate(`/exam-session/${exam.id}`);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(questionBank.exportJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dmat_question_bank_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="question-bank-page animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: 1100, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            Master Question Bank
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Browse, inspect, and practice from {allQuestions.length} procedurally validated dMAT questions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportJSON}
            title="Export repository as JSON"
          >
            📥 Export JSON
          </button>
          <button
            className="btn btn-secondary btn-sm"
            disabled={isGenerating}
            onClick={() => handleGenerateBatch(selectedSubmodule !== 'all' ? selectedSubmodule : null)}
          >
            {isGenerating ? 'Generating…' : '⚡ Generate +10 Questions'}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handlePracticeFiltered}
            disabled={filtered.length === 0}
          >
            Practice Filtered ({Math.min(20, filtered.length)}) ➔
          </button>
        </div>
      </header>

      {/* Coverage Overview Stats */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4) var(--space-5)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 12 }}>
          Question Bank Distribution Across 7 Submodules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          {coverage.map(c => (
            <div
              key={c.submodule}
              onClick={() => { setSelectedSubmodule(c.submodule); setPage(1); }}
              style={{
                background: selectedSubmodule === c.submodule ? 'var(--navy-700)' : 'var(--bg-tertiary)',
                border: `1px solid ${selectedSubmodule === c.submodule ? 'var(--blue-500)' : 'var(--border-secondary)'}`,
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.submodule}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.count}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{c.coveragePercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4) var(--space-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {/* Search */}
          <div style={{ gridColumn: 'span 2' }}>
            <input
              type="text"
              placeholder="🔍 Search questions, equations, terms, explanations..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              style={{ width: '100%' }}
            />
          </div>

          {/* Submodule filter */}
          <div>
            <select
              value={selectedSubmodule}
              onChange={e => { setSelectedSubmodule(e.target.value); setPage(1); }}
              style={{ width: '100%' }}
            >
              <option value="all">All Submodules</option>
              {submodules.map(sm => (
                <option key={sm} value={sm}>{sm}</option>
              ))}
            </select>
          </div>

          {/* Difficulty filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={e => { setSelectedDifficulty(e.target.value); setPage(1); }}
              style={{ width: '100%' }}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="challenge">Challenge</option>
            </select>
          </div>

          {/* Question Type */}
          <div>
            <select
              value={selectedType}
              onChange={e => { setSelectedType(e.target.value); setPage(1); }}
              style={{ width: '100%' }}
            >
              <option value="all">All Task Types</option>
              <option value="visual">Figure Sequences (Visual SVG)</option>
              <option value="equation">Math Equations</option>
              <option value="latin">Latin Square Grids</option>
              <option value="text">Subject Multiple Choice</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>
            Showing <strong>{filtered.length}</strong> matching questions (Page {page} of {totalPages})
          </span>
          {(searchTerm || selectedSubmodule !== 'all' || selectedDifficulty !== 'all' || selectedType !== 'all') && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedSubmodule('all');
                setSelectedDifficulty('all');
                setSelectedType('all');
                setPage(1);
              }}
              style={{ fontSize: '0.75rem', color: 'var(--blue-400)' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Questions List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {pagedQuestions.map((q, idx) => {
          const isExpanded = expandedId === q.id;
          const isBookmarked = db.isBookmarked(q.id);

          return (
            <div
              key={q.id}
              className="card"
              style={{
                padding: 'var(--space-4) var(--space-5)',
                border: `1px solid ${isExpanded ? 'var(--blue-500)' : 'var(--border-secondary)'}`,
                transition: 'all 0.15s ease'
              }}
            >
              {/* Question Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                    #{(page - 1) * PAGE_SIZE + idx + 1}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{q.submodule}</span>
                  <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                  {q.questionType === 'visual_choice' && (
                    <span className="badge badge-info">Visual SVG</span>
                  )}
                  {q.gridData && (
                    <span className="badge badge-info">5×5 Latin</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (isBookmarked) db.removeBookmark(q.id);
                      else db.addBookmark(q.id, q.submodule);
                      refresh();
                    }}
                    style={{ color: isBookmarked ? 'var(--amber-400)' : 'var(--text-tertiary)', fontSize: '1rem' }}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                  >
                    {isBookmarked ? '★' : '☆'}
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {isExpanded ? 'Hide Details ▲' : 'Inspect & Answer ▼'}
                  </button>
                </div>
              </div>

              {/* Short Preview if Collapsed */}
              {!isExpanded && (
                <div style={{ marginTop: 8, fontSize: '0.875rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {q.question || q.questionText || (q.gridData ? 'Latin Square: Determine target cell (?) value' : 'Visual sequence rule deduction')}
                </div>
              )}

              {/* Full Question Renderer if Expanded */}
              {isExpanded && (
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-secondary)' }}>
                  <QuestionRenderer
                    question={q}
                    questionIndex={(page - 1) * PAGE_SIZE + idx}
                    totalQuestions={filtered.length}
                    selectedAnswer={q.correctAnswer} // Show correct answer directly in browser preview
                    showFeedback={true}
                    showExplanation={true}
                    disabled={true}
                    onBookmark={(id) => {
                      if (db.isBookmarked(id)) db.removeBookmark(id);
                      else db.addBookmark(id, q.submodule);
                      refresh();
                    }}
                    isBookmarked={isBookmarked}
                  />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            ← Previous
          </button>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0 8px' }}>
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-secondary btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
