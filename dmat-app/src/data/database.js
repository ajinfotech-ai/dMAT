// Persistence layer using localStorage with JSON serialization
// Handles all data storage for the dMAT preparation platform

const DB_PREFIX = 'dmat_';
const DB_VERSION = 1;

class Database {
  constructor() {
    this._cache = {};
    this._initDefaults();
  }

  _key(name) {
    return `${DB_PREFIX}${name}`;
  }

  _get(name) {
    if (this._cache[name] !== undefined) return this._cache[name];
    try {
      const raw = localStorage.getItem(this._key(name));
      const val = raw ? JSON.parse(raw) : null;
      this._cache[name] = val;
      return val;
    } catch {
      return null;
    }
  }

  _set(name, value) {
    this._cache[name] = value;
    try {
      localStorage.setItem(this._key(name), JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  }

  _initDefaults() {
    if (!this._get('version')) {
      this._set('version', DB_VERSION);
      this._set('user', {
        id: 'user-1',
        name: 'Student',
        createdAt: new Date().toISOString(),
        settings: {
          theme: 'dark',
          showTimer: true,
          showDifficulty: true,
          soundEffects: false,
          fontSize: 'medium',
          reducedMotion: false
        }
      });
      this._set('progress', {});
      this._set('questionAttempts', []);
      this._set('examAttempts', []);
      this._set('bookmarks', []);
      this._set('mistakes', []);
      this._set('studySessions', []);
      this._set('spacedRepetition', {});
      this._set('questionStats', {});
    }
  }

  // User
  getUser() { return this._get('user'); }
  updateUser(updates) {
    const user = this._get('user');
    this._set('user', { ...user, ...updates });
  }
  getSettings() { return this._get('user')?.settings || {}; }
  updateSettings(updates) {
    const user = this._get('user');
    user.settings = { ...user.settings, ...updates };
    this._set('user', user);
  }

  // Progress
  getProgress() { return this._get('progress') || {}; }
  getTopicProgress(topicId) {
    const progress = this._get('progress') || {};
    return progress[topicId] || {
      questionsAttempted: 0,
      questionsCorrect: 0,
      totalTimeSeconds: 0,
      masteryLevel: 'not-started',
      lastAttempt: null,
      difficultyBreakdown: { easy: { attempted: 0, correct: 0 }, medium: { attempted: 0, correct: 0 }, hard: { attempted: 0, correct: 0 }, challenge: { attempted: 0, correct: 0 } }
    };
  }
  updateTopicProgress(topicId, update) {
    const progress = this._get('progress') || {};
    const current = progress[topicId] || {
      questionsAttempted: 0,
      questionsCorrect: 0,
      totalTimeSeconds: 0,
      masteryLevel: 'not-started',
      lastAttempt: null,
      difficultyBreakdown: { easy: { attempted: 0, correct: 0 }, medium: { attempted: 0, correct: 0 }, hard: { attempted: 0, correct: 0 }, challenge: { attempted: 0, correct: 0 } }
    };
    progress[topicId] = { ...current, ...update };

    // Recalculate mastery
    const p = progress[topicId];
    const accuracy = p.questionsAttempted > 0 ? p.questionsCorrect / p.questionsAttempted : 0;
    if (p.questionsAttempted === 0) p.masteryLevel = 'not-started';
    else if (p.questionsAttempted < 5) p.masteryLevel = 'learning';
    else if (accuracy < 0.5) p.masteryLevel = 'practicing';
    else if (accuracy < 0.8) p.masteryLevel = 'improving';
    else p.masteryLevel = 'mastered';

    this._set('progress', progress);
  }

  // Question Attempts
  getQuestionAttempts() { return this._get('questionAttempts') || []; }
  addQuestionAttempt(attempt) {
    const attempts = this._get('questionAttempts') || [];
    attempts.push({
      ...attempt,
      id: `qa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    });
    this._set('questionAttempts', attempts);

    // Update topic progress
    const topicId = attempt.topicId || attempt.submoduleId;
    if (topicId) {
      const p = this.getTopicProgress(topicId);
      const difficulty = attempt.difficulty || 'medium';
      p.questionsAttempted++;
      if (attempt.isCorrect) p.questionsCorrect++;
      p.totalTimeSeconds += attempt.timeSeconds || 0;
      p.lastAttempt = new Date().toISOString();
      if (p.difficultyBreakdown[difficulty]) {
        p.difficultyBreakdown[difficulty].attempted++;
        if (attempt.isCorrect) p.difficultyBreakdown[difficulty].correct++;
      }
      this.updateTopicProgress(topicId, p);
    }

    // Update question stats
    this._updateQuestionStats(attempt.questionId, attempt.isCorrect, attempt.timeSeconds);

    // Add to mistakes if wrong
    if (!attempt.isCorrect) {
      this.addMistake(attempt);
    }

    // Update spaced repetition
    this._updateSpacedRepetition(attempt.questionId, attempt.isCorrect);

    return attempt;
  }

  _updateQuestionStats(questionId, isCorrect, timeSeconds) {
    const stats = this._get('questionStats') || {};
    if (!stats[questionId]) {
      stats[questionId] = { attempts: 0, correct: 0, totalTime: 0, lastAttempt: null };
    }
    stats[questionId].attempts++;
    if (isCorrect) stats[questionId].correct++;
    stats[questionId].totalTime += timeSeconds || 0;
    stats[questionId].lastAttempt = new Date().toISOString();
    this._set('questionStats', stats);
  }

  getQuestionStats(questionId) {
    const stats = this._get('questionStats') || {};
    return stats[questionId] || { attempts: 0, correct: 0, totalTime: 0, lastAttempt: null };
  }

  // Exam Attempts
  getExamAttempts() { return this._get('examAttempts') || []; }
  saveExamAttempt(attempt) {
    const attempts = this._get('examAttempts') || [];
    const examAttempt = {
      ...attempt,
      id: attempt.id || `exam-${Date.now()}`,
      completedAt: new Date().toISOString()
    };
    attempts.push(examAttempt);
    this._set('examAttempts', attempts);
    return examAttempt;
  }
  getExamAttempt(id) {
    return this.getExamAttempts().find(a => a.id === id);
  }

  // Autosave for in-progress exams
  saveExamProgress(examId, progress) {
    this._set(`exam_progress_${examId}`, progress);
  }
  getExamProgress(examId) {
    return this._get(`exam_progress_${examId}`);
  }
  clearExamProgress(examId) {
    localStorage.removeItem(this._key(`exam_progress_${examId}`));
    delete this._cache[`exam_progress_${examId}`];
  }

  // Bookmarks
  getBookmarks() { return this._get('bookmarks') || []; }
  addBookmark(questionId, metadata = {}) {
    const bookmarks = this._get('bookmarks') || [];
    if (!bookmarks.find(b => b.questionId === questionId)) {
      bookmarks.push({
        questionId,
        ...metadata,
        addedAt: new Date().toISOString()
      });
      this._set('bookmarks', bookmarks);
    }
  }
  removeBookmark(questionId) {
    const bookmarks = this._get('bookmarks') || [];
    this._set('bookmarks', bookmarks.filter(b => b.questionId !== questionId));
  }
  isBookmarked(questionId) {
    return (this._get('bookmarks') || []).some(b => b.questionId === questionId);
  }

  // Mistakes
  getMistakes() { return this._get('mistakes') || []; }
  addMistake(attempt) {
    const mistakes = this._get('mistakes') || [];
    const existing = mistakes.find(m => m.questionId === attempt.questionId);
    if (existing) {
      existing.attempts = (existing.attempts || 1) + 1;
      existing.lastAttempt = new Date().toISOString();
      existing.userAnswer = attempt.selectedAnswer;
      existing.timeSeconds = attempt.timeSeconds;
    } else {
      mistakes.push({
        questionId: attempt.questionId,
        userAnswer: attempt.selectedAnswer,
        correctAnswer: attempt.correctAnswer,
        topicId: attempt.topicId,
        submoduleId: attempt.submoduleId,
        difficulty: attempt.difficulty,
        timeSeconds: attempt.timeSeconds,
        attempts: 1,
        mastered: false,
        firstAttempt: new Date().toISOString(),
        lastAttempt: new Date().toISOString()
      });
    }
    this._set('mistakes', mistakes);
  }
  markMistakeMastered(questionId) {
    const mistakes = this._get('mistakes') || [];
    const m = mistakes.find(m => m.questionId === questionId);
    if (m) m.mastered = true;
    this._set('mistakes', mistakes);
  }
  getUnmasteredMistakes() {
    return (this._get('mistakes') || []).filter(m => !m.mastered);
  }

  // Spaced Repetition
  _updateSpacedRepetition(questionId, isCorrect) {
    const sr = this._get('spacedRepetition') || {};
    if (!sr[questionId]) {
      sr[questionId] = {
        correctStreak: 0,
        incorrectStreak: 0,
        confidence: 0,
        firstAttempt: new Date().toISOString(),
        lastAttempt: new Date().toISOString(),
        nextReview: null,
        interval: 1
      };
    }
    const item = sr[questionId];
    item.lastAttempt = new Date().toISOString();

    if (isCorrect) {
      item.correctStreak++;
      item.incorrectStreak = 0;
      item.confidence = Math.min(1, item.confidence + 0.2);
      item.interval = Math.min(30, item.interval * 2);
    } else {
      item.incorrectStreak++;
      item.correctStreak = 0;
      item.confidence = Math.max(0, item.confidence - 0.3);
      item.interval = 1;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + item.interval);
    item.nextReview = nextDate.toISOString();

    this._set('spacedRepetition', sr);
  }

  getReviewQueue() {
    const sr = this._get('spacedRepetition') || {};
    const now = new Date().toISOString();
    return Object.entries(sr)
      .filter(([_, item]) => item.nextReview && item.nextReview <= now && item.confidence < 0.8)
      .map(([questionId, item]) => ({ questionId, ...item }))
      .sort((a, b) => a.confidence - b.confidence);
  }

  getSpacedRepetitionData(questionId) {
    const sr = this._get('spacedRepetition') || {};
    return sr[questionId] || null;
  }

  // Study Sessions
  startStudySession(moduleId, submoduleId) {
    const session = {
      id: `session-${Date.now()}`,
      moduleId,
      submoduleId,
      startedAt: new Date().toISOString(),
      endedAt: null,
      questionsAttempted: 0,
      questionsCorrect: 0,
      duration: 0
    };
    const sessions = this._get('studySessions') || [];
    sessions.push(session);
    this._set('studySessions', sessions);
    return session;
  }
  endStudySession(sessionId, stats) {
    const sessions = this._get('studySessions') || [];
    const s = sessions.find(s => s.id === sessionId);
    if (s) {
      s.endedAt = new Date().toISOString();
      Object.assign(s, stats);
    }
    this._set('studySessions', sessions);
  }
  getStudySessions() { return this._get('studySessions') || []; }
  getRecentSessions(count = 10) {
    return this.getStudySessions().slice(-count).reverse();
  }

  // Analytics
  getOverallStats() {
    const attempts = this.getQuestionAttempts();
    const total = attempts.length;
    const correct = attempts.filter(a => a.isCorrect).length;
    const totalTime = attempts.reduce((s, a) => s + (a.timeSeconds || 0), 0);

    return {
      questionsAttempted: total,
      questionsCorrect: correct,
      accuracy: total > 0 ? (correct / total * 100).toFixed(1) : 0,
      averageTimeSeconds: total > 0 ? (totalTime / total).toFixed(1) : 0,
      totalStudyTimeMinutes: (totalTime / 60).toFixed(0),
      totalExams: this.getExamAttempts().length,
      totalBookmarks: this.getBookmarks().length,
      totalMistakes: this.getMistakes().length,
      unmasteredMistakes: this.getUnmasteredMistakes().length,
      reviewQueueSize: this.getReviewQueue().length
    };
  }

  getWeakAreas() {
    const progress = this.getProgress();
    return Object.entries(progress)
      .filter(([_, p]) => {
        const accuracy = p.questionsAttempted > 0 ? p.questionsCorrect / p.questionsAttempted : 1;
        return p.questionsAttempted >= 3 && accuracy < 0.6;
      })
      .sort((a, b) => {
        const accA = a[1].questionsCorrect / a[1].questionsAttempted;
        const accB = b[1].questionsCorrect / b[1].questionsAttempted;
        return accA - accB;
      })
      .map(([id, p]) => ({
        topicId: id,
        accuracy: (p.questionsCorrect / p.questionsAttempted * 100).toFixed(1),
        questionsAttempted: p.questionsAttempted,
        avgTime: p.questionsAttempted > 0 ? (p.totalTimeSeconds / p.questionsAttempted).toFixed(0) : 0,
        masteryLevel: p.masteryLevel
      }));
  }

  getStrongestAreas() {
    const progress = this.getProgress();
    return Object.entries(progress)
      .filter(([_, p]) => p.questionsAttempted >= 5)
      .sort((a, b) => {
        const accA = a[1].questionsCorrect / a[1].questionsAttempted;
        const accB = b[1].questionsCorrect / b[1].questionsAttempted;
        return accB - accA;
      })
      .slice(0, 5)
      .map(([id, p]) => ({
        topicId: id,
        accuracy: (p.questionsCorrect / p.questionsAttempted * 100).toFixed(1),
        questionsAttempted: p.questionsAttempted,
        masteryLevel: p.masteryLevel
      }));
  }

  getStrongAreas() {
    return this.getStrongestAreas();
  }

  getAllTopicProgress() {
    return this.getProgress();
  }

  getActiveExam() {
    const attempts = this.getExamAttempts();
    return attempts.find(a => a.status === 'in-progress') || null;
  }

  // Recommendation Engine
  getRecommendation() {
    const weakAreas = this.getWeakAreas();
    const mistakes = this.getUnmasteredMistakes();
    const reviewQueue = this.getReviewQueue();

    if (reviewQueue.length > 0) {
      return {
        type: 'review',
        message: `You have ${reviewQueue.length} question(s) due for review today.`,
        action: 'Start Review',
        priority: 'high'
      };
    }

    if (weakAreas.length > 0) {
      const weakest = weakAreas[0];
      return {
        type: 'weak-area',
        topicId: weakest.topicId,
        message: `Focus on improving your weakest area (${weakest.accuracy}% accuracy).`,
        action: 'Practice Weak Area',
        priority: 'high'
      };
    }

    if (mistakes.length > 0) {
      return {
        type: 'mistakes',
        message: `You have ${mistakes.length} unmastered mistake(s) to review.`,
        action: 'Review Mistakes',
        priority: 'medium'
      };
    }

    return {
      type: 'continue',
      message: 'Continue learning — explore new topics or take a practice exam.',
      action: 'Continue Learning',
      priority: 'low'
    };
  }

  // Reset
  resetAllData() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(DB_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    this._cache = {};
    this._initDefaults();
  }
}

const db = new Database();
export default db;
