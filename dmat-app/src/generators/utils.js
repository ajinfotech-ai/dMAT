// Utility functions for question generation

export function generateId(prefix = 'q') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function seededRandom(seed) {
  let s = Math.abs(seed) || 1;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function seededRandInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Question fingerprint for duplicate detection
export function questionFingerprint(question) {
  let extraEntropy = '';
  if (question.gridData) {
    extraEntropy = JSON.stringify(question.gridData);
  } else if (question.sequenceSVGs) {
    extraEntropy = question.sequenceSVGs.join('');
  } else if (question.equations) {
    extraEntropy = question.equations.join(';');
  }

  const text = question.question || question.questionText || '';
  const normalized = text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[0-9]+/g, 'N')
    .trim();

  // Full hash for each option so that visual SVGs or distinct text are properly preserved
  const optionsNorm = (question.options || [])
    .map(o => {
      const str = typeof o === 'string' ? o : JSON.stringify(o);
      return hashString(str.trim());
    })
    .sort()
    .join('|');

  const extraHash = extraEntropy ? hashString(extraEntropy) : '';
  return hashString(`${question.submodule}:${normalized}:${optionsNorm}:${extraHash}`);
}

// Simple string hash
export function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit int
  }
  return Math.abs(hash).toString(36);
}

// Check if two questions are near-duplicates
export function isNearDuplicate(q1, q2) {
  if (q1.submodule !== q2.submodule) return false;
  if (q1.id === q2.id) return true;

  const fp1 = questionFingerprint(q1);
  const fp2 = questionFingerprint(q2);
  if (fp1 === fp2) return true;

  // Visual or grid-based questions are distinguished by their visual data, not prompt text
  if (q1.gridData || q1.sequenceSVGs || q1.questionType === 'visual_choice') {
    return false;
  }

  // Check template similarity for pure text questions
  const norm1 = (q1.question || q1.questionText || '').toLowerCase().replace(/[0-9]+/g, 'N');
  const norm2 = (q2.question || q2.questionText || '').toLowerCase().replace(/[0-9]+/g, 'N');
  if (norm1 && norm1 === norm2) {
    // If the answer options are also identical, they are near duplicates
    const opt1 = (q1.options || []).join('|');
    const opt2 = (q2.options || []).join('|');
    if (opt1 === opt2) return true;
  }

  return false;
}

// Validate question integrity
export function validateQuestion(question) {
  const errors = [];
  const text = question.question || question.questionText || '';

  if (!question.id) errors.push('Missing question ID');
  if (!text || text.trim().length < 5) errors.push('Question text too short or missing');
  if (!question.options || question.options.length < 2) errors.push('Insufficient answer options');
  if (question.correctAnswer === undefined || question.correctAnswer === null) errors.push('No correct answer specified');
  if (question.correctAnswer < 0 || question.correctAnswer >= (question.options || []).length) errors.push('Correct answer index out of range');
  if (!question.explanation) errors.push('Missing explanation');
  if (!question.difficulty) errors.push('Missing difficulty level');
  if (!['easy', 'medium', 'hard', 'challenge'].includes(question.difficulty)) errors.push('Invalid difficulty level');
  if (!question.module) errors.push('Missing module');
  if (!question.submodule) errors.push('Missing submodule');

  // Check for duplicate options
  const uniqueOpts = new Set(question.options);
  if (uniqueOpts.size !== question.options?.length) errors.push('Duplicate answer options detected');

  return {
    valid: errors.length === 0,
    errors
  };
}

// Difficulty scoring model
export function assessDifficulty(factors) {
  // factors: { reasoningSteps, informationDensity, abstractionLevel, distractorComplexity, timePressSensitivity }
  const weights = {
    reasoningSteps: 0.3,
    informationDensity: 0.2,
    abstractionLevel: 0.25,
    distractorComplexity: 0.15,
    timePressSensitivity: 0.1
  };

  let score = 0;
  for (const [factor, weight] of Object.entries(weights)) {
    score += (factors[factor] || 0) * weight;
  }

  if (score < 0.25) return 'easy';
  if (score < 0.5) return 'medium';
  if (score < 0.75) return 'hard';
  return 'challenge';
}

// Color palette for visual questions
export const COLORS = {
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  pink: '#ec4899',
  black: '#1e293b',
  white: '#ffffff',
  grey: '#94a3b8'
};

export const COLOR_NAMES = Object.keys(COLORS);

// Shape definitions for SVG rendering
export const SHAPES = {
  circle: (x, y, size, color) =>
    `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="${color}" />`,
  square: (x, y, size, color) =>
    `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="${color}" />`,
  triangle: (x, y, size, color) => {
    const h = size * 0.866;
    return `<polygon points="${x},${y - h / 2} ${x - size / 2},${y + h / 2} ${x + size / 2},${y + h / 2}" fill="${color}" />`;
  },
  diamond: (x, y, size, color) =>
    `<polygon points="${x},${y - size / 2} ${x + size / 2},${y} ${x},${y + size / 2} ${x - size / 2},${y}" fill="${color}" />`,
  star: (x, y, size, color) => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 72 - 90) * Math.PI / 180;
      const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
      points.push(`${x + size / 2 * Math.cos(outerAngle)},${y + size / 2 * Math.sin(outerAngle)}`);
      points.push(`${x + size / 4 * Math.cos(innerAngle)},${y + size / 4 * Math.sin(innerAngle)}`);
    }
    return `<polygon points="${points.join(' ')}" fill="${color}" />`;
  },
  cross: (x, y, size, color) => {
    const w = size / 3;
    return `<path d="M${x - w / 2},${y - size / 2} h${w} v${(size - w) / 2} h${(size - w) / 2} v${w} h-${(size - w) / 2} v${(size - w) / 2} h-${w} v-${(size - w) / 2} h-${(size - w) / 2} v-${w} h${(size - w) / 2}z" fill="${color}" />`;
  }
};

export const SHAPE_NAMES = Object.keys(SHAPES);

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeVerbose(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}
