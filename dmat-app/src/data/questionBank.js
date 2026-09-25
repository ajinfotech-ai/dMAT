// Master Question Bank
// Manages the complete question inventory for the dMAT preparation platform
// Combines all generators, handles caching, validation, and duplicate detection

import { generateMathEquationQuestion, generateMathEquationBank } from '../generators/mathEquations.js';
import { generateLatinSquareQuestion, generateLatinSquareBank } from '../generators/latinSquares.js';
import { generateFigureSequenceQuestion, generateFigureSequenceBank } from '../generators/figureSequences.js';
import { generateSubjectQuestion, generateSubjectQuestionBank } from '../generators/subjectModule.js';
import { validateQuestion, questionFingerprint, isNearDuplicate, shuffleArray } from '../generators/utils.js';

class QuestionBank {
  constructor() {
    this._questions = new Map();
    this._fingerprints = new Set();
    this._submoduleIndex = {};
    this._difficultyIndex = {};
    this._topicIndex = {};
    this._initialized = false;
  }

  // Initialize the question bank with seed questions
  initialize(force = false) {
    if (this._initialized && !force) return;

    if (force) {
      this._questions.clear();
      this._fingerprints.clear();
      this._submoduleIndex = {};
      this._difficultyIndex = {};
      this._topicIndex = {};
    }

    console.log('[QuestionBank] Generating seed questions...');

    // Core Module (75 each)
    this._generateAndAdd(() => generateFigureSequenceBank(75), 'Figure Sequences');
    this._generateAndAdd(() => generateMathEquationBank(75), 'Mathematical Equations');
    this._generateAndAdd(() => generateLatinSquareBank(75), 'Latin Squares');

    // Subject Module (75 each)
    this._generateAndAdd(() => generateSubjectQuestionBank('vector-calculations', 75), 'Vector Calculations');
    this._generateAndAdd(() => generateSubjectQuestionBank('hydrostatics', 75), 'Hydrostatics');
    this._generateAndAdd(() => generateSubjectQuestionBank('optimal-order-quantity', 75), 'Optimal Order Quantity');
    this._generateAndAdd(() => generateSubjectQuestionBank('research-strategies', 75), 'Research Strategies');

    this._initialized = true;
    console.log(`[QuestionBank] Initialized with ${this._questions.size} questions`);
  }

  _generateAndAdd(generatorFn, label) {
    try {
      const questions = generatorFn();
      let added = 0;
      for (const q of questions) {
        if (this.addQuestion(q)) added++;
      }
      console.log(`[QuestionBank] ${label}: generated ${questions.length}, added ${added}`);
    } catch (e) {
      console.warn(`[QuestionBank] Error generating ${label}:`, e);
    }
  }

  // Add a single question (with validation and dedup)
  addQuestion(question) {
    const validation = validateQuestion(question);
    if (!validation.valid) {
      console.warn(`[QuestionBank] Invalid question rejected:`, validation.errors);
      return false;
    }

    const fp = questionFingerprint(question);
    if (this._fingerprints.has(fp)) {
      return false; // Duplicate
    }

    this._fingerprints.add(fp);
    this._questions.set(question.id, { ...question, _fingerprint: fp, _validated: true, _active: true });

    // Index by submodule
    const sm = question.submodule || 'Unknown';
    if (!this._submoduleIndex[sm]) this._submoduleIndex[sm] = [];
    this._submoduleIndex[sm].push(question.id);

    // Index by difficulty
    const diff = question.difficulty || 'medium';
    if (!this._difficultyIndex[diff]) this._difficultyIndex[diff] = [];
    this._difficultyIndex[diff].push(question.id);

    // Index by topic
    const topic = question.topic || 'general';
    if (!this._topicIndex[topic]) this._topicIndex[topic] = [];
    this._topicIndex[topic].push(question.id);

    return true;
  }

  // Get a question by ID
  getQuestion(id) {
    return this._questions.get(id) || null;
  }

  // Get all questions
  getAllQuestions() {
    return Array.from(this._questions.values()).filter(q => q._active);
  }

  // Get questions by submodule
  getBySubmodule(submodule) {
    const ids = this._submoduleIndex[submodule] || [];
    return ids.map(id => this._questions.get(id)).filter(q => q && q._active);
  }

  // Get questions by difficulty
  getByDifficulty(difficulty) {
    const ids = this._difficultyIndex[difficulty] || [];
    return ids.map(id => this._questions.get(id)).filter(q => q && q._active);
  }

  // Get questions by topic
  getByTopic(topic) {
    const ids = this._topicIndex[topic] || [];
    return ids.map(id => this._questions.get(id)).filter(q => q && q._active);
  }

  // Advanced query
  query({ module, submodule, topic, difficulty, excludeIds = [], maxCount, shuffle = true } = {}) {
    let questions = this.getAllQuestions();

    if (module) questions = questions.filter(q => q.module === module);
    if (submodule) questions = questions.filter(q => q.submodule === submodule);
    if (topic) questions = questions.filter(q => q.topic === topic);
    if (difficulty) {
      if (difficulty === 'mixed') {
        // Keep all
      } else {
        questions = questions.filter(q => q.difficulty === difficulty);
      }
    }
    if (excludeIds.length > 0) {
      const excludeSet = new Set(excludeIds);
      questions = questions.filter(q => !excludeSet.has(q.id));
    }

    if (shuffle) questions = shuffleArray(questions);
    if (maxCount) questions = questions.slice(0, maxCount);

    return questions;
  }

  // Generate fresh questions on demand (for when the bank runs low)
  generateFresh(submodule, difficulty = 'medium', count = 10) {
    const generated = [];

    for (let i = 0; i < count; i++) {
      let q = null;
      try {
        switch (submodule) {
          case 'Figure Sequences':
            q = generateFigureSequenceQuestion(difficulty);
            break;
          case 'Mathematical Equations':
            q = generateMathEquationQuestion(difficulty);
            break;
          case 'Latin Squares':
            q = generateLatinSquareQuestion(difficulty);
            break;
          case 'Vector Calculations':
            q = generateSubjectQuestion('vector-calculations', difficulty);
            break;
          case 'Hydrostatics':
            q = generateSubjectQuestion('hydrostatics', difficulty);
            break;
          case 'Optimal Order Quantity':
            q = generateSubjectQuestion('optimal-order-quantity', difficulty);
            break;
          case 'Research Strategies in Social Sciences':
            q = generateSubjectQuestion('research-strategies', difficulty);
            break;
        }
      } catch (e) {
        console.warn(`[QuestionBank] Error generating fresh question:`, e);
      }

      if (q && this.addQuestion(q)) {
        generated.push(q);
      }
    }

    return generated;
  }

  // Get statistics
  getStats() {
    const stats = {
      total: this._questions.size,
      active: this.getAllQuestions().length,
      bySubmodule: {},
      byDifficulty: {},
      byModule: {}
    };

    this.getAllQuestions().forEach(q => {
      const sm = q.submodule || 'Unknown';
      const diff = q.difficulty || 'unknown';
      const mod = q.module || 'Unknown';

      stats.bySubmodule[sm] = (stats.bySubmodule[sm] || 0) + 1;
      stats.byDifficulty[diff] = (stats.byDifficulty[diff] || 0) + 1;
      stats.byModule[mod] = (stats.byModule[mod] || 0) + 1;
    });

    return stats;
  }

  // Coverage report
  getCoverageReport() {
    const target = 100;
    const submodules = [
      'Figure Sequences',
      'Mathematical Equations',
      'Latin Squares',
      'Vector Calculations',
      'Hydrostatics',
      'Optimal Order Quantity',
      'Research Strategies in Social Sciences'
    ];

    return submodules.map(sm => {
      const count = this.getBySubmodule(sm).length;
      return {
        submodule: sm,
        count,
        target,
        status: count >= target ? 'ready' : count >= target * 0.8 ? 'almost' : 'needs-work',
        needed: Math.max(0, target - count)
      };
    });
  }

  // Deactivate a question
  deactivateQuestion(id) {
    const q = this._questions.get(id);
    if (q) q._active = false;
  }

  // Check duplicates for a new question
  checkDuplicate(question) {
    const fp = questionFingerprint(question);
    if (this._fingerprints.has(fp)) return { isDuplicate: true, type: 'exact' };

    // Check near-duplicates
    const sameSubmodule = this.getBySubmodule(question.submodule);
    for (const existing of sameSubmodule) {
      if (isNearDuplicate(question, existing)) {
        return { isDuplicate: true, type: 'near', existingId: existing.id };
      }
    }

    return { isDuplicate: false };
  }

  // Export all questions as JSON
  exportQuestions() {
    return this.getAllQuestions().map(({ _fingerprint, _validated, _active, ...q }) => q);
  }
}

// Singleton instance
const questionBank = new QuestionBank();
export default questionBank;
