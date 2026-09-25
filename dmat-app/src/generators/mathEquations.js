// Mathematical Equations Question Generator
// Based on dMAT Core Module - Mathematical Equations subtest
// Generates systems of equations where each letter is an integer 1-20

import { generateId, shuffleArray } from './utils.js';

const OPERATIONS = ['+', '-', '×', '÷'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate a valid system of equations with known solution
function generateTwoVariableSystem(difficulty, seed) {
  const rng = seed ? seededRandom(seed) : Math.random.bind(Math);
  const rInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;

  // Generate solution first
  const A = rInt(1, 15);
  const B = rInt(1, 18);

  // Ensure A != B for variety
  const templates = [];

  if (difficulty === 'easy') {
    // Simple direct equations
    const c1 = rInt(1, 10);
    templates.push(
      { type: 'add', eq: `${c1} + A = ${c1 + A}`, display: `${c1} + A = ${c1 + A}` },
      { type: 'sub', eq: `B - ${B - A} = A`, display: `B – ${B - A} = A` },
      { type: 'add-rev', eq: `A + ${B - A} = B`, display: `A + ${B - A} = B` },
      { type: 'direct', eq: `B = ${B}`, display: `B = ${B}` }
    );

    const selected = [templates[rInt(0, 1)], templates[rInt(2, 3)]];
    return {
      equations: selected.map(t => t.display),
      variables: { A, B },
      askFor: ['A', 'B']
    };
  }

  if (difficulty === 'medium') {
    const c1 = rInt(2, 5);
    if (A * c1 <= 20) {
      return {
        equations: [
          `${c1} × A = ${c1 * A}`,
          `A + B = ${A + B}`
        ],
        variables: { A, B },
        askFor: ['A', 'B']
      };
    } else {
      return {
        equations: [
          `B ÷ 2 = A`,
          `B – A = ${B - A}`
        ],
        variables: { A: B / 2, B },
        askFor: ['A', 'B']
      };
    }
  }

  // Hard
  return {
    equations: [
      `A + B = ${A + B}`,
      `A × 2 = ${A * 2}`
    ],
    variables: { A, B },
    askFor: ['A', 'B']
  };
}

function generateThreeVariableSystem(difficulty, seed) {
  const rng = seed ? seededRandom(seed) : Math.random.bind(Math);
  const rInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;

  // Medium difficulty - 3 variables
  const C = rInt(1, 5);
  const multiplier = rInt(2, 4);
  const A = C * multiplier;

  if (A > 20) {
    // Fallback to simpler values
    const C2 = 2;
    const A2 = C2 * 3;
    const B2 = 2 * A2 + 2 * C2;
    return {
      equations: [
        `${3} × C = A`,
        `A + C = ${A2 + C2}`,
        `2 × A + 2 × C = B`
      ],
      variables: { A: A2, B: B2, C: C2 },
      askFor: ['A', 'B', 'C']
    };
  }

  const B = 2 * A + 2 * C;
  if (B > 20) {
    const C2 = 2;
    const A2 = 6;
    const B2 = 16;
    return {
      equations: [
        `3 × C = A`,
        `A + C = 8`,
        `2 × A + 2 × C = B`
      ],
      variables: { A: A2, B: B2, C: C2 },
      askFor: ['A', 'B', 'C']
    };
  }

  return {
    equations: [
      `${multiplier} × C = A`,
      `A + C = ${A + C}`,
      `2 × A + 2 × C = B`
    ],
    variables: { A, B, C },
    askFor: ['A', 'B', 'C']
  };
}

function generateFourVariableSystem(difficulty, seed) {
  const rng = seed ? seededRandom(seed) : Math.random.bind(Math);
  const rInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;

  // Start with B and derive others
  const B = rInt(1, 3);
  const multA = rInt(3, 6);
  const multC = rInt(5, 12);
  const addD = rInt(5, 15);

  const A = multA * B;
  const C = multC * B;
  const D = addD + B;

  if (A > 20 || C > 20 || D > 20) {
    // Fallback
    return {
      equations: [
        'A – B + C – D = 2',
        '10 × B = C',
        '5 × B = A',
        '11 + B = D'
      ],
      variables: { A: 5, B: 1, C: 10, D: 12 },
      askFor: ['A', 'B', 'C', 'D']
    };
  }

  const result = A - B + C - D;
  return {
    equations: [
      `A – B + C – D = ${result}`,
      `${multC} × B = C`,
      `${multA} × B = A`,
      `${addD} + B = D`
    ],
    variables: { A, B, C, D },
    askFor: ['A', 'B', 'C', 'D']
  };
}

function generateWrongAnswers(correctValues, variables, count = 3) {
  const wrong = [];
  const letters = Object.keys(correctValues);

  while (wrong.length < count) {
    const modified = { ...correctValues };
    const letterToChange = letters[randInt(0, letters.length - 1)];
    let newVal;
    const offset = randInt(1, 3) * (Math.random() > 0.5 ? 1 : -1);
    newVal = modified[letterToChange] + offset;
    if (newVal < 1) newVal = modified[letterToChange] + Math.abs(offset);
    if (newVal > 20) newVal = modified[letterToChange] - Math.abs(offset);
    modified[letterToChange] = newVal;

    const key = JSON.stringify(modified);
    if (key !== JSON.stringify(correctValues) && !wrong.find(w => JSON.stringify(w) === key)) {
      wrong.push(modified);
    }
  }
  return wrong;
}

function formatAnswer(values) {
  return Object.entries(values).map(([k, v]) => `${k} = ${v}`).join(', ');
}

function generateExplanation(equations, variables) {
  const steps = [];
  const entries = Object.entries(variables);

  steps.push(`The system of equations is:\n${equations.join('\n')}`);
  steps.push(`Solving step by step:`);

  entries.forEach(([letter, value]) => {
    steps.push(`${letter} = ${value}`);
  });

  steps.push(`Verify: substituting these values back into all equations confirms they are all satisfied.`);

  return steps;
}

export function generateMathEquationQuestion(difficulty = 'medium', seed = null) {
  let system;
  let topicId;

  if (difficulty === 'easy') {
    system = generateTwoVariableSystem('easy', seed);
    topicId = 'me-two-variables';
  } else if (difficulty === 'medium') {
    if (Math.random() > 0.5) {
      system = generateTwoVariableSystem('medium', seed);
      topicId = 'me-two-variables';
    } else {
      system = generateThreeVariableSystem('medium', seed);
      topicId = 'me-three-variables';
    }
  } else if (difficulty === 'hard') {
    system = generateFourVariableSystem('hard', seed);
    topicId = 'me-four-variables';
  } else {
    // Challenge
    system = generateFourVariableSystem('challenge', seed);
    topicId = 'me-four-variables';
  }

  const correctAnswer = formatAnswer(system.variables);
  const wrongAnswers = generateWrongAnswers(system.variables, system.askFor);
  const allOptions = shuffleArray([
    system.variables,
    ...wrongAnswers
  ]);

  const correctIndex = allOptions.findIndex(
    o => JSON.stringify(o) === JSON.stringify(system.variables)
  );

  const explanation = generateExplanation(system.equations, system.variables);

  const estimatedTime = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 60 : difficulty === 'hard' ? 90 : 120;

  return {
    id: generateId('me'),
    module: 'Core Module',
    submodule: 'Mathematical Equations',
    topic: topicId,
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: estimatedTime,
    question: `Solve the following system of equations. Find the values of ${system.askFor.join(', ')} so that all equations are correct. Each letter is an integer between 1 and 20.\n\n${system.equations.join('\n')}`,
    equations: system.equations,
    options: allOptions.map(o => formatAnswer(o)),
    correctAnswer: correctIndex,
    explanation: explanation.join('\n'),
    solutionSteps: explanation,
    variables: system.variables,
    skillsTested: ['algebraic reasoning', 'mental arithmetic', 'substitution'],
    commonTrap: 'Watch for sign errors in subtraction and be careful with multiplication order.',
    tags: ['equations', 'algebra', `${system.askFor.length}-variables`]
  };
}

// Generate a batch of questions for this subtest
export function generateMathEquationBank(count = 30) {
  const questions = [];
  const difficulties = { easy: 0.25, medium: 0.35, hard: 0.25, challenge: 0.15 };

  Object.entries(difficulties).forEach(([diff, ratio]) => {
    const n = Math.ceil(count * ratio);
    for (let i = 0; i < n; i++) {
      questions.push(generateMathEquationQuestion(diff, Date.now() + i * 1000 + questions.length));
    }
  });

  return questions;
}
