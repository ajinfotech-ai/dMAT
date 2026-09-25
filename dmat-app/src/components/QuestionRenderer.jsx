import { useState, useCallback, useEffect, Fragment } from 'react';
import { useAI } from '../context/AIContext.jsx';

// Universal question renderer - handles all question types
export default function QuestionRenderer({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showFeedback,
  showExplanation,
  disabled,
  onBookmark,
  isBookmarked,
  onMarkReview,
  isMarkedReview,
  timeSpent
}) {
  const ai = useAI();

  useEffect(() => {
    if (ai?.setActiveQuestion && question) {
      ai.setActiveQuestion(question);
    }
  }, [question, ai]);

  if (!question) return null;

  const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === question.correctAnswer;
  const feedbackVisible = showFeedback && isAnswered;

  return (
    <div className="question-container">
      {/* Question Header */}
      <div className="question-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="question-number">Question {questionIndex + 1} of {totalQuestions}</span>
          <span className={`badge badge-${question.difficulty}`}>{question.difficulty}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onBookmark && (
            <button className={`btn btn-ghost btn-sm`} onClick={() => onBookmark(question.id)}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
              style={{ color: isBookmarked ? 'var(--amber-400)' : 'var(--text-tertiary)' }}>
              {isBookmarked ? '★' : '☆'}
            </button>
          )}
          {onMarkReview && (
            <button className={`btn btn-ghost btn-sm`} onClick={() => onMarkReview(questionIndex)}
              style={{ color: isMarkedReview ? 'var(--amber-400)' : 'var(--text-tertiary)' }}>
              {isMarkedReview ? '🚩' : '⚑'} {isMarkedReview ? 'Flagged' : 'Flag'}
            </button>
          )}
        </div>
      </div>

      {/* Question Content */}
      {question.questionType === 'visual_choice' ? (
        <VisualQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          feedbackVisible={feedbackVisible}
          disabled={disabled || feedbackVisible}
        />
      ) : question.gridData ? (
        <LatinSquareQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          feedbackVisible={feedbackVisible}
          disabled={disabled || feedbackVisible}
        />
      ) : question.equations ? (
        <EquationQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          feedbackVisible={feedbackVisible}
          disabled={disabled || feedbackVisible}
        />
      ) : (
        <TextQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          feedbackVisible={feedbackVisible}
          disabled={disabled || feedbackVisible}
        />
      )}

      {/* Explanation Panel */}
      {feedbackVisible && showExplanation && (
        <div className={`explanation-panel ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className={`explanation-title ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </div>
          {!isCorrect && (
            <div style={{ marginBottom: 12, fontSize: '0.875rem' }}>
              <strong>Correct answer:</strong>{' '}
              {question.questionType === 'visual_choice' ? (
                <span>Option {question.correctAnswer + 1}</span>
              ) : (
                <span>{question.options[question.correctAnswer]}</span>
              )}
            </div>
          )}
          <div className="explanation-text">{question.explanation}</div>
          {question.solutionSteps && question.solutionSteps.length > 0 && (
            <ul className="solution-steps">
              {question.solutionSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          )}
          {question.commonTrap && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--warning-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--warning)' }}>
              ⚠️ <strong>Common trap:</strong> {question.commonTrap}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Standard text-based question
function TextQuestion({ question, selectedAnswer, onAnswer, feedbackVisible, disabled }) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <>
      <div className="question-text">{question.question || question.questionText}</div>
      <div className="options-list">
        {question.options.map((option, i) => {
          let className = 'option-item';
          if (selectedAnswer === i) className += ' selected';
          if (feedbackVisible && i === question.correctAnswer) className += ' correct';
          if (feedbackVisible && selectedAnswer === i && i !== question.correctAnswer) className += ' incorrect';
          if (disabled) className += ' disabled';

          return (
            <div key={i} className={className} onClick={() => !disabled && onAnswer(i)} tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' && !disabled) onAnswer(i); }}>
              <span className="option-letter">{letters[i]}</span>
              <span className="option-text">{option}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Equation-based question
function EquationQuestion({ question, selectedAnswer, onAnswer, feedbackVisible, disabled }) {
  const letters = ['A', 'B', 'C', 'D'];
  const text = question.question || question.questionText || '';

  return (
    <>
      <div className="question-text">
        {text.split('\n').map((line, i) => {
          // If the line looks like an equation, style it differently
          if (line.match(/[=×÷+−]/)) {
            return <span key={i} className="equation-block">{line}</span>;
          }
          return <span key={i}>{line}{'\n'}</span>;
        })}
      </div>
      <div className="options-list">
        {question.options.map((option, i) => {
          let className = 'option-item';
          if (selectedAnswer === i) className += ' selected';
          if (feedbackVisible && i === question.correctAnswer) className += ' correct';
          if (feedbackVisible && selectedAnswer === i && i !== question.correctAnswer) className += ' incorrect';
          if (disabled) className += ' disabled';

          return (
            <div key={i} className={className} onClick={() => !disabled && onAnswer(i)} tabIndex={0}>
              <span className="option-letter">{letters[i]}</span>
              <span className="option-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{option}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Latin Square visual question
function LatinSquareQuestion({ question, selectedAnswer, onAnswer, feedbackVisible, disabled }) {
  const { grid, targetRow, targetCol } = question.gridData;
  const greekCols = ['α', 'β', 'γ', 'δ', 'ε'];
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <>
      <div className="question-text">{question.question || question.questionText}</div>

      {/* Grid with dMAT Official Greek Column Headers & Row Numbers */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
        <div className="latin-grid-table">
          {/* Top-left empty header cell */}
          <div className="latin-header-cell"></div>
          {/* Greek column headers: α, β, γ, δ, ε */}
          {greekCols.map((col, c) => (
            <div key={`col-${c}`} className="latin-header-cell">{col}</div>
          ))}

          {/* Grid rows with row index 1-5 */}
          {grid.map((row, r) => (
            <Fragment key={`row-${r}`}>
              <div className="latin-header-cell">{r + 1}</div>
              {row.map((cell, c) => {
                const isTarget = r === targetRow && c === targetCol;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`latin-cell ${isTarget ? 'target' : ''} ${!cell && !isTarget ? 'empty' : ''}`}
                  >
                    {isTarget ? '?' : cell || ''}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="options-list">
        {question.options.map((option, i) => {
          let className = 'option-item';
          if (selectedAnswer === i) className += ' selected';
          if (feedbackVisible && i === question.correctAnswer) className += ' correct';
          if (feedbackVisible && selectedAnswer === i && i !== question.correctAnswer) className += ' incorrect';
          if (disabled) className += ' disabled';

          return (
            <div key={i} className={className} onClick={() => !disabled && onAnswer(i)} tabIndex={0}>
              <span className="option-letter">{letters[i]}</span>
              <span className="option-text" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{option}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Visual/SVG question (Figure Sequences)
function VisualQuestion({ question, selectedAnswer, onAnswer, feedbackVisible, disabled }) {
  const optionsToRender = question.optionSVGs || question.options || [];

  return (
    <>
      <div className="question-text" style={{ textAlign: 'center' }}>
        {question.question || question.questionText || 'Identify the logical pattern in the sequence of matrices and determine the next matrix.'}
      </div>

      {/* Sequence Display */}
      {question.sequenceSVGs && (
        <div className="sequence-display">
          {question.sequenceSVGs.map((svg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="sequence-matrix" dangerouslySetInnerHTML={{ __html: svg }} />
              {i < question.sequenceSVGs.length - 1 && <span className="sequence-arrow">→</span>}
            </div>
          ))}
          <span className="sequence-arrow">→</span>
          <div className="sequence-question-mark">?</div>
        </div>
      )}

      {/* Option Grid */}
      <div className="visual-options-grid">
        {optionsToRender.map((svg, i) => {
          let className = 'visual-option';
          if (selectedAnswer === i) className += ' selected';
          if (feedbackVisible && i === question.correctAnswer) className += ' correct';
          if (feedbackVisible && selectedAnswer === i && i !== question.correctAnswer) className += ' incorrect';

          return (
            <div key={i} className={className} onClick={() => !disabled && onAnswer(i)} tabIndex={0}>
              <span className="visual-option-label">Option {i + 1}</span>
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
          );
        })}
      </div>
    </>
  );
}
