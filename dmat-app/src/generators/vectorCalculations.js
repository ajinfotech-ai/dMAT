// Vector Calculations Question Generator for dMAT Subject Module
// Covers: Vector addition/subtraction, scalar multiplication, magnitude,
// unit vectors, dot product, cross product, angles, projections, scalar triple product

import { generateId, shuffleArray, randInt } from './utils.js';

// Safe helper to build 4 unique options
function makeUniqueOptions(correctStr, rawWrongs, fallbackGenerator) {
  const seen = new Set([correctStr]);
  const wrongs = [];
  for (const w of rawWrongs) {
    if (!seen.has(w)) {
      seen.add(w);
      wrongs.push(w);
      if (wrongs.length === 3) break;
    }
  }
  let attempts = 0;
  while (wrongs.length < 3 && attempts < 20) {
    attempts++;
    const fb = fallbackGenerator();
    if (!seen.has(fb)) {
      seen.add(fb);
      wrongs.push(fb);
    }
  }
  const options = shuffleArray([correctStr, ...wrongs]);
  return { options, correctAnswer: options.indexOf(correctStr) };
}

// 1. Vector Addition / Subtraction (2D and 3D)
function genVectorAddSub(difficulty) {
  const is3D = difficulty !== 'easy';
  const dim = is3D ? 3 : 2;
  const isSub = Math.random() > 0.5;

  const a = Array.from({ length: dim }, () => randInt(-6, 8));
  const b = Array.from({ length: dim }, () => randInt(-6, 8));
  const result = a.map((val, i) => isSub ? val - b[i] : val + b[i]);

  const aStr = `(${a.join(', ')})`;
  const bStr = `(${b.join(', ')})`;
  const opSymbol = isSub ? '−' : '+';
  const correctStr = `(${result.join(', ')})`;

  const rawWrongs = [
    `(${result.map((v, i) => isSub ? a[i] + b[i] : a[i] - b[i]).join(', ')})`,
    `(${result.map(v => v + 1).join(', ')})`,
    `(${result.map(v => -v).join(', ')})`,
    `(${result.map((v, i) => i === 0 ? v + 2 : v - 1).join(', ')})`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `(${Array.from({ length: dim }, () => randInt(-10, 15)).join(', ')})`
  );

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-linear-operations',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: is3D ? 45 : 30,
    question: `Given the vectors a⃗ = ${aStr} and b⃗ = ${bStr}, determine the vector c⃗ = a⃗ ${opSymbol} b⃗.`,
    options,
    correctAnswer,
    explanation: `Vector operations are performed component by component:\nc⃗ = ${aStr} ${opSymbol} ${bStr} = (${a.map((v, i) => `${v} ${opSymbol} (${b[i]})`).join(', ')}) = ${correctStr}`,
    solutionSteps: [
      `Compute each coordinate independently:`,
      ...result.map((r, i) => `Coordinate ${i + 1}: ${a[i]} ${opSymbol} (${b[i]}) = ${r}`),
      `Final vector: ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['vector addition', 'vector subtraction', 'component-wise arithmetic'],
    commonTrap: 'Remember to pay close attention to negative signs when subtracting coordinates.',
    tags: ['vectors', 'addition', 'subtraction', difficulty]
  };
}

// 2. Scalar Multiplication & Linear Combinations
function genLinearCombination(difficulty) {
  const is3D = difficulty === 'hard' || difficulty === 'challenge';
  const dim = is3D ? 3 : 2;
  const k1 = randInt(2, 4);
  const k2 = randInt(-3, 3) || 2;

  const a = Array.from({ length: dim }, () => randInt(-4, 5));
  const b = Array.from({ length: dim }, () => randInt(-4, 5));
  const result = a.map((val, i) => k1 * val + k2 * b[i]);

  const aStr = `(${a.join(', ')})`;
  const bStr = `(${b.join(', ')})`;
  const opStr = `${k1}a⃗ ${k2 >= 0 ? '+' : '−'} ${Math.abs(k2)}b⃗`;
  const correctStr = `(${result.join(', ')})`;

  const rawWrongs = [
    `(${result.map((v, i) => k1 * a[i] - k2 * b[i]).join(', ')})`,
    `(${result.map(v => v + k1).join(', ')})`,
    `(${result.map((v, i) => a[i] + b[i]).join(', ')})`,
    `(${result.map(v => 2 * v).join(', ')})`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `(${Array.from({ length: dim }, () => randInt(-20, 20)).join(', ')})`
  );

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-linear-operations',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 50,
    question: `Calculate the linear combination v⃗ = ${opStr} for the vectors a⃗ = ${aStr} and b⃗ = ${bStr}.`,
    options,
    correctAnswer,
    explanation: `Multiply each vector's components by the respective scalar and sum them:\n${k1}·${aStr} ${k2 >= 0 ? '+' : '−'} ${Math.abs(k2)}·${bStr} = ${correctStr}`,
    solutionSteps: [
      `1. Scale a⃗ by ${k1}: (${a.map(v => k1 * v).join(', ')})`,
      `2. Scale b⃗ by ${k2}: (${b.map(v => k2 * v).join(', ')})`,
      `3. Add corresponding components: ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['scalar multiplication', 'linear combinations'],
    commonTrap: 'Distribute the scalar to every single component, not just the first one.',
    tags: ['vectors', 'linear-combination', difficulty]
  };
}

// 3. Magnitude (Euclidean Norm)
function genMagnitude(difficulty) {
  // Nice Pythagorean triples and 3D norms
  const triples2D = [
    { vec: [3, 4], norm: 5 },
    { vec: [-3, 4], norm: 5 },
    { vec: [5, 12], norm: 13 },
    { vec: [6, 8], norm: 10 },
    { vec: [8, 15], norm: 17 },
    { vec: [7, 24], norm: 25 },
    { vec: [-5, -12], norm: 13 }
  ];

  const triples3D = [
    { vec: [1, 2, 2], norm: 3 },
    { vec: [2, 3, 6], norm: 7 },
    { vec: [-2, 3, 6], norm: 7 },
    { vec: [1, 4, 8], norm: 9 },
    { vec: [4, 4, 7], norm: 9 },
    { vec: [2, 6, 9], norm: 11 },
    { vec: [6, 6, 7], norm: 11 },
    { vec: [3, 4, 12], norm: 13 },
    { vec: [2, 10, 11], norm: 15 }
  ];

  const pool = difficulty === 'easy' ? triples2D : triples3D;
  const item = pool[randInt(0, pool.length - 1)];
  const vecStr = `(${item.vec.join(', ')})`;
  const norm = item.norm;
  const correctStr = `${norm}`;

  const rawWrongs = [
    `${norm + 2}`,
    `${norm - 1 > 0 ? norm - 1 : norm + 3}`,
    `${Math.round(norm * 1.5)}`,
    `${item.vec.reduce((sum, v) => sum + Math.abs(v), 0)}` // Manhattan distance trap!
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${norm + randInt(3, 10)}`
  );

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-magnitude',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 40,
    question: `Find the magnitude (Euclidean length) ||v⃗|| of the vector v⃗ = ${vecStr}.`,
    options,
    correctAnswer,
    explanation: `The magnitude is ||v⃗|| = √(${item.vec.map(v => `(${v})²`).join(' + ')}) = √(${item.vec.map(v => v * v).join(' + ')}) = √(${norm * norm}) = ${norm}`,
    solutionSteps: [
      `Formula: ||v⃗|| = √(v₁² + v₂²${item.vec.length === 3 ? ' + v₃²' : ''})`,
      `Square each component: ${item.vec.map(v => `${v}² = ${v * v}`).join(', ')}`,
      `Sum the squares: ${item.vec.map(v => v * v).join(' + ')} = ${norm * norm}`,
      `Take the square root: √(${norm * norm}) = ${norm}`
    ],
    useKatex: true,
    skillsTested: ['vector magnitude', 'Euclidean norm', 'Pythagorean theorem'],
    commonTrap: 'Do not simply sum the absolute values of the components; remember to square first, add, and take the square root.',
    tags: ['vectors', 'magnitude', 'norm', difficulty]
  };
}

// 4. Dot Product (Scalar Product)
function genDotProduct(difficulty) {
  const is3D = difficulty !== 'easy';
  const dim = is3D ? 3 : 2;

  const a = Array.from({ length: dim }, () => randInt(-5, 6));
  const b = Array.from({ length: dim }, () => randInt(-5, 6));
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);

  const aStr = `(${a.join(', ')})`;
  const bStr = `(${b.join(', ')})`;
  const correctStr = `${dot}`;

  const rawWrongs = [
    `${dot + randInt(2, 5)}`,
    `${dot - randInt(2, 5)}`,
    `${-dot}`,
    `${a.reduce((s, v) => s + v, 0) * b.reduce((s, v) => s + v, 0)}`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${dot + randInt(6, 20)}`
  );

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-scalar-product',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 45,
    question: `Calculate the scalar product (dot product) a⃗ · b⃗ for the vectors a⃗ = ${aStr} and b⃗ = ${bStr}.`,
    options,
    correctAnswer,
    explanation: `The scalar product is computed by summing the products of corresponding coordinates:\na⃗ · b⃗ = ${a.map((v, i) => `(${v})·(${b[i]})`).join(' + ')} = ${a.map((v, i) => v * b[i]).join(' + ')} = ${dot}`,
    solutionSteps: [
      `Formula: a⃗ · b⃗ = a₁b₁ + a₂b₂${dim === 3 ? ' + a₃b₃' : ''}`,
      `Multiply coordinates: ${a.map((v, i) => `(${v})·(${b[i]}) = ${v * b[i]}`).join(', ')}`,
      `Sum terms: ${dot}`
    ],
    useKatex: true,
    skillsTested: ['dot product', 'scalar product'],
    commonTrap: 'The dot product produces a scalar number, not a vector.',
    tags: ['vectors', 'dot-product', difficulty]
  };
}

// 5. Orthogonality Condition (Perpendicular Vectors)
function genOrthogonalQuestion(difficulty) {
  // a = (a1, a2, a3), b = (b1, b2, k), find k such that a . b = 0
  const a1 = randInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
  const a2 = randInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
  const a3 = [1, 2, 3, 4][randInt(0, 3)];

  const b1 = randInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
  const b2 = randInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);

  // We want a1*b1 + a2*b2 + a3*k = 0 => k = -(a1*b1 + a2*b2) / a3
  const targetNumerator = -(a1 * b1 + a2 * b2);
  // Ensure integer k:
  const k = Math.round(targetNumerator / a3);
  const fixedA3 = targetNumerator % a3 === 0 ? a3 : 1;
  const actualK = -(a1 * b1 + a2 * b2) / fixedA3;

  const aStr = `(${a1}, ${a2}, ${fixedA3})`;
  const bStr = `(${b1}, ${b2}, k)`;
  const correctStr = `k = ${actualK}`;

  const rawWrongs = [
    `k = ${-actualK}`,
    `k = ${actualK + 2}`,
    `k = ${actualK - 3}`,
    `k = 0`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `k = ${actualK + randInt(4, 15)}`
  );

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-orthogonality',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 55,
    question: `For which value of the parameter k are the vectors a⃗ = ${aStr} and b⃗ = ${bStr} orthogonal (perpendicular)?`,
    options,
    correctAnswer,
    explanation: `Two vectors are orthogonal if and only if their scalar product is zero:\na⃗ · b⃗ = 0\n(${a1})·(${b1}) + (${a2})·(${b2}) + (${fixedA3})·k = 0\n${a1 * b1 + a2 * b2} + ${fixedA3}k = 0  ⇒  k = ${actualK}`,
    solutionSteps: [
      `1. Set the scalar product equal to 0: a⃗ · b⃗ = 0`,
      `2. Expand: (${a1})(${b1}) + (${a2})(${b2}) + (${fixedA3})k = 0`,
      `3. Simplify: ${a1 * b1 + a2 * b2} + ${fixedA3}k = 0`,
      `4. Solve for k: k = ${actualK}`
    ],
    useKatex: true,
    skillsTested: ['orthogonality', 'scalar product', 'solving linear equations'],
    commonTrap: 'Check your signs when isolating k on the other side of the equation.',
    tags: ['vectors', 'orthogonality', difficulty]
  };
}

// 6. Vector Cross Product (3D)
function genCrossProduct(difficulty) {
  const a = Array.from({ length: 3 }, () => randInt(-4, 5));
  const b = Array.from({ length: 3 }, () => randInt(-4, 5));

  const cross = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];

  const aStr = `(${a.join(', ')})`;
  const bStr = `(${b.join(', ')})`;
  const correctStr = `(${cross.join(', ')})`;

  const rawWrongs = [
    `(${cross[0] + 2}, ${cross[1]}, ${cross[2]})`,
    `(${-cross[0]}, ${-cross[1]}, ${-cross[2]})`,
    `(${cross[0]}, ${-cross[1]}, ${cross[2]})`,
    `(${a[0] * b[0]}, ${a[1] * b[1]}, ${a[2] * b[2]})`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `(${randInt(-20, 20)}, ${randInt(-20, 20)}, ${randInt(-20, 20)})`
  );

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-vector-product',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 65,
    question: `Compute the vector product (cross product) a⃗ × b⃗ for a⃗ = ${aStr} and b⃗ = ${bStr}.`,
    options,
    correctAnswer,
    explanation: `The cross product formula in ℝ³ is:\na⃗ × b⃗ = (a_y·b_z − a_z·b_y, a_z·b_x − a_x·b_z, a_x·b_y − a_y·b_x) = ${correctStr}`,
    solutionSteps: [
      `x-component: (${a[1]})·(${b[2]}) − (${a[2]})·(${b[1]}) = ${cross[0]}`,
      `y-component: (${a[2]})·(${b[0]}) − (${a[0]})·(${b[2]}) = ${cross[1]}`,
      `z-component: (${a[0]})·(${b[1]}) − (${a[1]})·(${b[0]}) = ${cross[2]}`,
      `Resulting vector: ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['cross product', 'determinants in ℝ³'],
    commonTrap: 'Watch the sign of the y-component: it is (az·bx − ax·bz), which has the opposite order from standard determinant.',
    tags: ['vectors', 'cross-product', difficulty]
  };
}

// 7. Scalar Triple Product / Volume of Parallelepiped
function genTripleProduct(difficulty) {
  const a = [randInt(1, 3), randInt(0, 3), randInt(0, 2)];
  const b = [randInt(0, 2), randInt(1, 3), randInt(0, 2)];
  const c = [randInt(0, 2), randInt(0, 2), randInt(1, 3)];

  // Cross b x c
  const bc = [
    b[1] * c[2] - b[2] * c[1],
    b[2] * c[0] - b[0] * c[2],
    b[0] * c[1] - b[1] * c[0]
  ];
  // Dot a . (b x c)
  const trip = a[0] * bc[0] + a[1] * bc[1] + a[2] * bc[2];
  const vol = Math.abs(trip);

  const correctStr = `${vol} cubic units`;
  const rawWrongs = [
    `${vol + 3} cubic units`,
    `${vol > 2 ? vol - 2 : vol + 5} cubic units`,
    `${vol * 2} cubic units`,
    `${vol + 7} cubic units`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${vol + randInt(4, 15)} cubic units`
  );

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-triple-product',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 75,
    question: `Calculate the volume of the parallelepiped (spat) spanned by the three vectors a⃗ = (${a.join(', ')}), b⃗ = (${b.join(', ')}), and c⃗ = (${c.join(', ')}).`,
    options,
    correctAnswer,
    explanation: `The volume of the parallelepiped is the absolute value of the scalar triple product: V = |a⃗ · (b⃗ × c⃗)| = ${vol} cubic units.`,
    solutionSteps: [
      `1. Compute cross product b⃗ × c⃗ = (${bc.join(', ')})`,
      `2. Compute scalar product a⃗ · (b⃗ × c⃗) = (${a[0]})(${bc[0]}) + (${a[1]})(${bc[1]}) + (${a[2]})(${bc[2]}) = ${trip}`,
      `3. Volume V = |${trip}| = ${vol}`
    ],
    useKatex: true,
    skillsTested: ['scalar triple product', 'volume calculation', 'spatial geometry'],
    commonTrap: 'Volume must always be positive. Take the absolute value of the triple product determinant.',
    tags: ['vectors', 'triple-product', 'volume', difficulty]
  };
}

// 8. Unit Vector Normalization
function genUnitVector(difficulty) {
  const triples = [
    { vec: [3, 4], norm: 5 },
    { vec: [-6, 8], norm: 10 },
    { vec: [1, 2, 2], norm: 3 },
    { vec: [-2, 3, 6], norm: 7 },
    { vec: [4, 4, 7], norm: 9 }
  ];
  const item = triples[randInt(0, triples.length - 1)];
  const vecStr = `(${item.vec.join(', ')})`;
  const correctStr = `(${item.vec.map(v => `${v}/${item.norm}`).join(', ')})`;

  const rawWrongs = [
    `(${item.vec.map(v => `${v}/${item.norm * item.norm}`).join(', ')})`,
    `(${item.vec.map(v => `${v + 1}/${item.norm}`).join(', ')})`,
    `(${item.vec.map(v => `${-v}/${item.norm}`).join(', ')})`,
    `(${item.vec.map(v => `${v}`).join(', ')})`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `(${item.vec.map(v => `${v}/${item.norm + 2}`).join(', ')})`
  );

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-unit-vector',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 40,
    question: `Find the normalized unit vector u⃗ in the direction of v⃗ = ${vecStr}.`,
    options,
    correctAnswer,
    explanation: `The unit vector is obtained by dividing the vector by its magnitude: u⃗ = v⃗ / ||v⃗||.\nMagnitude ||v⃗|| = √(${item.vec.map(v => `${v}²`).join(' + ')}) = ${item.norm}.\nThus u⃗ = ${correctStr}.`,
    solutionSteps: [
      `1. Compute magnitude ||v⃗|| = ${item.norm}`,
      `2. Divide each coordinate by ${item.norm}: ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['unit vector', 'normalization', 'magnitude'],
    commonTrap: 'Divide by the magnitude ||v⃗||, not the squared magnitude ||v⃗||².',
    tags: ['vectors', 'unit-vector', difficulty]
  };
}

// Master Generator for Vector Calculations
export function generateVectorQuestion(difficulty = 'medium') {
  const easyGenerators = [genVectorAddSub, genMagnitude, genDotProduct, genUnitVector];
  const mediumGenerators = [genVectorAddSub, genLinearCombination, genMagnitude, genDotProduct, genOrthogonalQuestion, genCrossProduct, genUnitVector];
  const hardGenerators = [genLinearCombination, genOrthogonalQuestion, genCrossProduct, genTripleProduct];
  const challengeGenerators = [genOrthogonalQuestion, genCrossProduct, genTripleProduct];

  let pool = mediumGenerators;
  if (difficulty === 'easy') pool = easyGenerators;
  else if (difficulty === 'hard') pool = hardGenerators;
  else if (difficulty === 'challenge') pool = challengeGenerators;

  const fn = pool[randInt(0, pool.length - 1)];
  return fn(difficulty);
}

export function generateVectorBank(count = 75) {
  const bank = [];
  const difficulties = ['easy', 'medium', 'hard', 'challenge'];
  const perDiff = Math.ceil(count / difficulties.length);

  for (const diff of difficulties) {
    for (let i = 0; i < perDiff; i++) {
      try {
        bank.push(generateVectorQuestion(diff));
      } catch (e) {
        console.warn('Error generating vector question:', e);
      }
    }
  }
  return bank.slice(0, count);
}
