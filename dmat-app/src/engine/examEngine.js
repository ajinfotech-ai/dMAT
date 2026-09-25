// Exam Engine
// Handles exam creation, timing, submission, scoring, and analytics
// Supports both Practice Exam and Exam Simulation modes

import questionBank from '../data/questionBank.js';
import db from '../data/database.js';
import { shuffleArray, generateId } from '../generators/utils.js';

export const EXAM_MODES = {
  PRACTICE: 'practice',
  SIMULATION: 'simulation'
};

export const PRACTICE_MODES = {
  UNTIMED: 'untimed',
  TIMED: 'timed',
  SPEED: 'speed',
  WEAK_AREA: 'weak_area',
  RANDOM: 'random',
  ADAPTIVE: 'adaptive',
  REVIEW: 'review'
};

// Official dMAT timing from PDF
export const OFFICIAL_TIMING = {
  coreModule: {
    'Figure Sequences': { tasks: 20, timeMinutes: 25 },
    'Mathematical Equations': { tasks: 20, timeMinutes: 25 },
    'Latin Squares': { tasks: 20, timeMinutes: 25 }
  },
  subjectModule: {
    totalTimeMinutes: 90,
    questionCount: { min: 20, max: 25 }
  },
  breakMinutes: 30,
  totalExamMinutes: 180
};

class ExamEngine {
  constructor() {
    this.currentExam = null;
  }

  // Create a practice exam
  createPracticeExam({
    modules = [],        // ['Core Module', 'Subject Module']
    submodules = [],     // specific submodules
    difficulty = 'mixed',
    questionCount = 20,
    mode = PRACTICE_MODES.TIMED,
    timeMinutes = null
  } = {}) {
    questionBank.initialize();

    // Select questions
    let questions = [];

    if (submodules.length > 0) {
      for (const sm of submodules) {
        const smQuestions = questionBank.query({
          submodule: sm,
          difficulty,
          maxCount: Math.ceil(questionCount / submodules.length),
          shuffle: true
        });
        questions.push(...smQuestions);
      }
    } else if (modules.length > 0) {
      for (const mod of modules) {
        const modQuestions = questionBank.query({
          module: mod,
          difficulty,
          maxCount: Math.ceil(questionCount / modules.length),
          shuffle: true
        });
        questions.push(...modQuestions);
      }
    } else {
      questions = questionBank.query({
        difficulty,
        maxCount: questionCount,
        shuffle: true
      });
    }

    // For adaptive mode, prioritize weak areas
    if (mode === PRACTICE_MODES.ADAPTIVE || mode === PRACTICE_MODES.WEAK_AREA) {
      questions = this._adaptiveSelect(questions, questionCount);
    }

    // For review mode, get from review queue
    if (mode === PRACTICE_MODES.REVIEW) {
      const reviewQueue = db.getReviewQueue();
      const reviewQuestionIds = reviewQueue.map(r => r.questionId);
      questions = reviewQuestionIds
        .map(id => questionBank.getQuestion(id))
        .filter(q => q !== null)
        .slice(0, questionCount);
    }

    // Ensure we have enough questions
    if (questions.length < questionCount) {
      // Generate fresh questions
      const submodulesToFill = submodules.length > 0 ? submodules : ['Mathematical Equations', 'Latin Squares', 'Vector Calculations'];
      for (const sm of submodulesToFill) {
        if (questions.length >= questionCount) break;
        const fresh = questionBank.generateFresh(sm, difficulty === 'mixed' ? 'medium' : difficulty, questionCount - questions.length);
        questions.push(...fresh);
      }
    }

    questions = questions.slice(0, questionCount);

    // Shuffle questions and options
    questions = shuffleArray(questions);
    questions = questions.map(q => ({
      ...q,
      options: q.questionType === 'visual_choice' ? q.options : q.options // Don't shuffle visual options since SVGs are mapped
    }));

    // Calculate time
    let totalTimeSeconds = null;
    if (mode !== PRACTICE_MODES.UNTIMED) {
      if (timeMinutes) {
        totalTimeSeconds = timeMinutes * 60;
      } else if (mode === PRACTICE_MODES.SPEED) {
        totalTimeSeconds = questions.length * 30; // 30s per question
      } else {
        // Estimate based on question difficulty
        totalTimeSeconds = questions.reduce((sum, q) => sum + (q.estimatedTimeSeconds || 60), 0);
      }
    }

    const exam = {
      id: generateId('practice'),
      type: EXAM_MODES.PRACTICE,
      mode,
      questions,
      totalQuestions: questions.length,
      totalTimeSeconds,
      currentIndex: 0,
      answers: {},
      markedForReview: new Set(),
      startedAt: null,
      completedAt: null,
      timeRemaining: totalTimeSeconds,
      status: 'created',
      settings: {
        showFeedback: mode !== PRACTICE_MODES.SPEED,
        showExplanation: true,
        showTimer: mode !== PRACTICE_MODES.UNTIMED,
        allowPause: mode !== PRACTICE_MODES.SPEED,
        showDifficulty: true
      }
    };

    this.currentExam = exam;
    return exam;
  }

  // Create a full exam simulation
  createExamSimulation() {
    questionBank.initialize();

    const questions = [];

    // Core Module: 3 subtests × 20 questions each
    const coreSubtests = ['Figure Sequences', 'Mathematical Equations', 'Latin Squares'];

    for (const subtest of coreSubtests) {
      const subtestQuestions = questionBank.query({
        submodule: subtest,
        difficulty: 'mixed',
        maxCount: 20,
        shuffle: true
      });

      // Fill if needed
      if (subtestQuestions.length < 20) {
        const fresh = questionBank.generateFresh(subtest, 'medium', 20 - subtestQuestions.length);
        subtestQuestions.push(...fresh);
      }

      questions.push(...subtestQuestions.slice(0, 20));
    }

    // Subject Module: 22 questions
    const subjectTopics = ['Vector Calculations', 'Hydrostatics', 'Optimal Order Quantity', 'Research Strategies in Social Sciences'];
    const perTopic = Math.ceil(22 / subjectTopics.length);

    for (const topic of subjectTopics) {
      const topicQuestions = questionBank.query({
        submodule: topic,
        difficulty: 'mixed',
        maxCount: perTopic,
        shuffle: true
      });

      if (topicQuestions.length < perTopic) {
        const fresh = questionBank.generateFresh(topic, 'medium', perTopic - topicQuestions.length);
        topicQuestions.push(...fresh);
      }

      questions.push(...topicQuestions.slice(0, perTopic));
    }

    // Build exam sections
    const sections = [
      {
        name: 'Core Module – Figure Sequences',
        startIndex: 0,
        endIndex: 19,
        timeMinutes: 25,
        timeSeconds: 25 * 60
      },
      {
        name: 'Core Module – Mathematical Equations',
        startIndex: 20,
        endIndex: 39,
        timeMinutes: 25,
        timeSeconds: 25 * 60
      },
      {
        name: 'Core Module – Latin Squares',
        startIndex: 40,
        endIndex: 59,
        timeMinutes: 25,
        timeSeconds: 25 * 60
      },
      {
        name: 'Subject Module – General Academic Module',
        startIndex: 60,
        endIndex: Math.min(questions.length - 1, 81),
        timeMinutes: 90,
        timeSeconds: 90 * 60
      }
    ];

    const exam = {
      id: generateId('sim'),
      type: EXAM_MODES.SIMULATION,
      mode: 'simulation',
      questions,
      sections,
      currentSection: 0,
      totalQuestions: questions.length,
      totalTimeSeconds: OFFICIAL_TIMING.totalExamMinutes * 60,
      currentIndex: 0,
      answers: {},
      markedForReview: new Set(),
      startedAt: null,
      completedAt: null,
      sectionTimeRemaining: sections[0].timeSeconds,
      status: 'created',
      settings: {
        showFeedback: false,
        showExplanation: false,
        showTimer: true,
        allowPause: false,
        showDifficulty: false,
        fullscreen: true,
        noNotes: true
      }
    };

    this.currentExam = exam;
    return exam;
  }

  _adaptiveSelect(availableQuestions, targetCount) {
    const weakAreas = db.getWeakAreas();
    const mistakes = db.getUnmasteredMistakes();
    const recentAttempts = db.getQuestionAttempts().slice(-50);
    const recentIds = new Set(recentAttempts.map(a => a.questionId));

    // Score each question for adaptive priority
    const scored = availableQuestions.map(q => {
      let priority = 0;

      // Boost weak area questions
      const isWeak = weakAreas.some(w => w.topicId === q.topic || w.topicId === q.submodule);
      if (isWeak) priority += 30;

      // Boost mistake-related questions
      const isMistake = mistakes.some(m => m.questionId === q.id);
      if (isMistake) priority += 20;

      // Penalize recently seen questions
      if (recentIds.has(q.id)) priority -= 40;

      // Slight random factor
      priority += Math.random() * 10;

      return { question: q, priority };
    });

    scored.sort((a, b) => b.priority - a.priority);
    return scored.slice(0, targetCount).map(s => s.question);
  }

  // Start the exam
  startExam(examId) {
    if (!this.currentExam || this.currentExam.id !== examId) return null;
    this.currentExam.startedAt = new Date().toISOString();
    this.currentExam.status = 'in-progress';
    this._autosave();
    return this.currentExam;
  }

  // Record an answer
  recordAnswer(questionIndex, selectedAnswer) {
    if (!this.currentExam) return;

    const question = this.currentExam.questions[questionIndex];
    if (!question) return;

    this.currentExam.answers[questionIndex] = {
      questionId: question.id,
      selectedAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
      answeredAt: new Date().toISOString(),
      timeSpent: 0 // Will be calculated on frontend
    };

    this._autosave();
    return this.currentExam.answers[questionIndex];
  }

  // Update time spent on a question
  updateTimeSpent(questionIndex, timeSeconds) {
    if (!this.currentExam?.answers[questionIndex]) return;
    this.currentExam.answers[questionIndex].timeSpent = timeSeconds;
  }

  // Mark question for review
  toggleMarkForReview(questionIndex) {
    if (!this.currentExam) return;
    if (this.currentExam.markedForReview.has(questionIndex)) {
      this.currentExam.markedForReview.delete(questionIndex);
    } else {
      this.currentExam.markedForReview.add(questionIndex);
    }
    this._autosave();
  }

  // Navigate
  navigateToQuestion(index) {
    if (!this.currentExam) return;
    if (index >= 0 && index < this.currentExam.totalQuestions) {
      this.currentExam.currentIndex = index;
    }
  }

  // Submit exam
  submitExam() {
    if (!this.currentExam) return null;

    this.currentExam.completedAt = new Date().toISOString();
    this.currentExam.status = 'completed';

    const results = this.calculateResults();

    // Record question attempts in database
    Object.entries(this.currentExam.answers).forEach(([idx, answer]) => {
      const question = this.currentExam.questions[parseInt(idx)];
      if (question) {
        db.addQuestionAttempt({
          questionId: question.id,
          topicId: question.topic,
          submoduleId: question.submodule,
          difficulty: question.difficulty,
          isCorrect: answer.isCorrect,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          timeSeconds: answer.timeSpent || 0,
          examId: this.currentExam.id,
          examType: this.currentExam.type
        });
      }
    });

    // Save exam attempt
    db.saveExamAttempt({
      id: this.currentExam.id,
      type: this.currentExam.type,
      mode: this.currentExam.mode,
      results,
      startedAt: this.currentExam.startedAt,
      totalQuestions: this.currentExam.totalQuestions,
      answeredCount: Object.keys(this.currentExam.answers).length,
      questions: this.currentExam.questions,
      answers: this.currentExam.answers
    });

    // Clear autosave
    db.clearExamProgress(this.currentExam.id);

    return results;
  }

  // Calculate detailed results
  calculateResults() {
    if (!this.currentExam) return null;

    const exam = this.currentExam;
    const answers = exam.answers;
    const questions = exam.questions;

    const totalAnswered = Object.keys(answers).length;
    const totalCorrect = Object.values(answers).filter(a => a.isCorrect).length;
    const totalTime = Object.values(answers).reduce((sum, a) => sum + (a.timeSpent || 0), 0);

    // Overall stats
    const overall = {
      totalQuestions: exam.totalQuestions,
      questionsAnswered: totalAnswered,
      questionsUnanswered: exam.totalQuestions - totalAnswered,
      questionsCorrect: totalCorrect,
      accuracy: totalAnswered > 0 ? (totalCorrect / totalAnswered * 100).toFixed(1) : 0,
      totalTimeSeconds: totalTime,
      averageTimePerQuestion: totalAnswered > 0 ? (totalTime / totalAnswered).toFixed(1) : 0
    };

    // Breakdown by module
    const moduleBreakdown = {};
    const submoduleBreakdown = {};
    const difficultyBreakdown = { easy: { total: 0, correct: 0 }, medium: { total: 0, correct: 0 }, hard: { total: 0, correct: 0 }, challenge: { total: 0, correct: 0 } };

    questions.forEach((q, idx) => {
      const answer = answers[idx];
      const mod = q.module || 'Unknown';
      const sm = q.submodule || 'Unknown';
      const diff = q.difficulty || 'medium';

      if (!moduleBreakdown[mod]) moduleBreakdown[mod] = { total: 0, answered: 0, correct: 0, totalTime: 0 };
      if (!submoduleBreakdown[sm]) submoduleBreakdown[sm] = { total: 0, answered: 0, correct: 0, totalTime: 0, module: mod };

      moduleBreakdown[mod].total++;
      submoduleBreakdown[sm].total++;

      if (answer) {
        moduleBreakdown[mod].answered++;
        submoduleBreakdown[sm].answered++;
        moduleBreakdown[mod].totalTime += answer.timeSpent || 0;
        submoduleBreakdown[sm].totalTime += answer.timeSpent || 0;

        if (answer.isCorrect) {
          moduleBreakdown[mod].correct++;
          submoduleBreakdown[sm].correct++;
        }

        difficultyBreakdown[diff].total++;
        if (answer.isCorrect) difficultyBreakdown[diff].correct++;
      }
    });

    // Calculate accuracies
    Object.values(moduleBreakdown).forEach(m => {
      m.accuracy = m.answered > 0 ? (m.correct / m.answered * 100).toFixed(1) : 0;
      m.avgTime = m.answered > 0 ? (m.totalTime / m.answered).toFixed(1) : 0;
    });
    Object.values(submoduleBreakdown).forEach(s => {
      s.accuracy = s.answered > 0 ? (s.correct / s.answered * 100).toFixed(1) : 0;
      s.avgTime = s.answered > 0 ? (s.totalTime / s.answered).toFixed(1) : 0;
    });

    // Time analysis
    const questionTimes = Object.entries(answers).map(([idx, a]) => ({
      index: parseInt(idx),
      submodule: questions[parseInt(idx)]?.submodule,
      timeSpent: a.timeSpent || 0,
      isCorrect: a.isCorrect
    }));
    questionTimes.sort((a, b) => b.timeSpent - a.timeSpent);

    const slowestQuestions = questionTimes.slice(0, 5);
    const fastestQuestions = questionTimes.filter(q => q.timeSpent > 0).sort((a, b) => a.timeSpent - b.timeSpent).slice(0, 5);

    // Generate recommendations
    const recommendations = this._generateRecommendations(submoduleBreakdown, difficultyBreakdown, questionTimes);

    return {
      overall,
      moduleBreakdown,
      submoduleBreakdown,
      difficultyBreakdown,
      timeAnalysis: {
        slowestQuestions,
        fastestQuestions
      },
      recommendations,
      examId: exam.id,
      examType: exam.type
    };
  }

  _generateRecommendations(submoduleBreakdown, difficultyBreakdown, questionTimes) {
    const recommendations = [];

    // Find weakest submodules
    const weakSubmodules = Object.entries(submoduleBreakdown)
      .filter(([_, s]) => s.answered >= 2 && parseFloat(s.accuracy) < 60)
      .sort((a, b) => parseFloat(a[1].accuracy) - parseFloat(b[1].accuracy));

    weakSubmodules.forEach(([name, stats]) => {
      recommendations.push({
        type: 'weak-area',
        submodule: name,
        message: `Your accuracy in ${name} is ${stats.accuracy}%. Focus on reviewing concepts and practising more questions in this area.`,
        action: `Practice ${name}`,
        priority: 'high'
      });
    });

    // Find slow areas
    const slowSubmodules = Object.entries(submoduleBreakdown)
      .filter(([_, s]) => s.answered >= 2 && parseFloat(s.avgTime) > 90)
      .sort((a, b) => parseFloat(b[1].avgTime) - parseFloat(a[1].avgTime));

    slowSubmodules.forEach(([name, stats]) => {
      recommendations.push({
        type: 'slow-area',
        submodule: name,
        message: `Your average response time in ${name} is ${stats.avgTime}s. Consider timed practice to improve speed.`,
        action: `Speed Practice: ${name}`,
        priority: 'medium'
      });
    });

    // Difficulty recommendations
    Object.entries(difficultyBreakdown).forEach(([diff, stats]) => {
      if (stats.total >= 3) {
        const accuracy = stats.total > 0 ? (stats.correct / stats.total * 100).toFixed(0) : 0;
        if (parseFloat(accuracy) < 50) {
          recommendations.push({
            type: 'difficulty',
            message: `Your accuracy on ${diff} questions is only ${accuracy}%. ${diff === 'easy' ? 'Review fundamental concepts.' : `Consider practising more ${diff} questions.`}`,
            priority: diff === 'easy' ? 'high' : 'medium'
          });
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'general',
        message: 'Good performance! Continue practising to maintain and improve your skills.',
        priority: 'low'
      });
    }

    return recommendations;
  }

  // Autosave
  _autosave() {
    if (!this.currentExam) return;
    const saveData = {
      ...this.currentExam,
      markedForReview: Array.from(this.currentExam.markedForReview)
    };
    db.saveExamProgress(this.currentExam.id, saveData);
  }

  // Resume from autosave
  resumeExam(examId) {
    const saved = db.getExamProgress(examId);
    if (saved) {
      saved.markedForReview = new Set(saved.markedForReview || []);
      this.currentExam = saved;
      return saved;
    }
    return null;
  }

  // Get current exam
  getCurrentExam() {
    return this.currentExam;
  }

  // Clear current exam
  clearCurrentExam() {
    this.currentExam = null;
  }
}

const examEngine = new ExamEngine();
export default examEngine;
