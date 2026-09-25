// Subject Module Question Generators
// Based on dMAT General Academic Module
// Covers: Vector Calculations, Hydrostatics, Optimal Order Quantity, Research Strategies

import { generateId, shuffleArray } from './utils.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========== VECTOR CALCULATIONS ==========

function genVectorAddSubtract(difficulty) {
  const dim = difficulty === 'easy' ? 2 : 3;
  const a = Array.from({ length: dim }, () => randInt(-5, 8));
  const b = Array.from({ length: dim }, () => randInt(-5, 8));
  const c = dim === 3 ? Array.from({ length: dim }, () => randInt(-4, 6)) : null;

  let result, operation, questionText;

  if (c && difficulty !== 'easy') {
    result = a.map((v, i) => v + b[i] - c[i]);
    operation = 'a⃗ + b⃗ − c⃗';
    questionText = `Given the vectors a⃗ = (${a.join(', ')}), b⃗ = (${b.join(', ')}), and c⃗ = (${c.join(', ')}), compute s⃗ = ${operation}.`;
  } else {
    result = a.map((v, i) => v + b[i]);
    operation = 'a⃗ + b⃗';
    questionText = `Given the vectors a⃗ = (${a.join(', ')}) and b⃗ = (${b.join(', ')}), compute s⃗ = ${operation}.`;
  }

  const correctStr = `(${result.join(', ')})`;

  // Generate plausible wrong answers
  const wrongs = [];
  while (wrongs.length < 3) {
    const wrong = result.map((v, i) => {
      const offset = randInt(1, 3) * (Math.random() > 0.5 ? 1 : -1);
      return Math.random() > 0.6 ? v + offset : v;
    });
    const wrongStr = `(${wrong.join(', ')})`;
    if (wrongStr !== correctStr && !wrongs.includes(wrongStr)) {
      wrongs.push(wrongStr);
    }
  }

  const options = shuffleArray([correctStr, ...wrongs]);
  const correctIndex = options.indexOf(correctStr);

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-addition-subtraction',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: difficulty === 'easy' ? 30 : 60,
    question: questionText,
    options,
    correctAnswer: correctIndex,
    explanation: `Vectors are added/subtracted component by component:\n${operation} = (${result.join(', ')})`,
    solutionSteps: [
      `${operation} means adding/subtracting corresponding components.`,
      ...result.map((v, i) => `Component ${i + 1}: ${a[i]}${b[i] >= 0 ? ' + ' : ' − '}${Math.abs(b[i])}${c ? (c[i] >= 0 ? ' − ' : ' + ') + Math.abs(c[i]) : ''} = ${v}`),
      `Result: s⃗ = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['vector arithmetic', 'component-wise operations'],
    commonTrap: 'Watch the signs carefully, especially when subtracting vectors with negative components.',
    tags: ['vectors', 'addition', 'subtraction']
  };
}

function genScalarProduct(difficulty) {
  const a = Array.from({ length: 3 }, () => randInt(1, 6));
  const b = Array.from({ length: 3 }, () => randInt(1, 6));
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);

  const options = shuffleArray([
    `${dot}`,
    `${dot + randInt(1, 5)}`,
    `${dot - randInt(1, 5)}`,
    `${a.reduce((s, v, i) => s + v * v, 0)}`
  ].filter((v, i, arr) => arr.indexOf(v) === i));

  while (options.length < 4) options.push(`${dot + options.length * 3}`);

  const correctIndex = options.indexOf(`${dot}`);

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-scalar-product',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 45,
    question: `Calculate the scalar product (dot product) of a⃗ = (${a.join(', ')}) and b⃗ = (${b.join(', ')}).`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `The scalar product a⃗·b⃗ = ${a.map((v, i) => `${v}×${b[i]}`).join(' + ')} = ${dot}`,
    solutionSteps: [
      `a⃗·b⃗ = a_x·b_x + a_y·b_y + a_z·b_z`,
      `= ${a.map((v, i) => `${v} × ${b[i]}`).join(' + ')}`,
      `= ${a.map((v, i) => v * b[i]).join(' + ')}`,
      `= ${dot}`
    ],
    useKatex: true,
    skillsTested: ['scalar product', 'arithmetic'],
    commonTrap: 'Do not confuse the scalar product with the cross product — the scalar product yields a number, not a vector.',
    tags: ['vectors', 'dot-product', 'scalar-product']
  };
}

function genCrossProduct(difficulty) {
  const a = Array.from({ length: 3 }, () => randInt(1, 6));
  const b = Array.from({ length: 3 }, () => randInt(1, 6));

  const cross = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];

  const correctStr = `(${cross.join(', ')})`;
  const wrongs = [
    `(${cross[0] + 1}, ${cross[1]}, ${cross[2]})`,
    `(${a[0] * b[0]}, ${a[1] * b[1]}, ${a[2] * b[2]})`,
    `(${cross[0]}, ${-cross[1]}, ${cross[2] + 2})`
  ].filter(w => w !== correctStr);

  const options = shuffleArray([correctStr, ...wrongs.slice(0, 3)]);
  while (options.length < 4) options.push(`(${randInt(-10, 10)}, ${randInt(-10, 10)}, ${randInt(-10, 10)})`);

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-vector-product',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 60,
    question: `Calculate the vector product (cross product) a⃗ × b⃗ for a⃗ = (${a.join(', ')}) and b⃗ = (${b.join(', ')}).`,
    options,
    correctAnswer: options.indexOf(correctStr),
    explanation: `a⃗ × b⃗ = (a_y·b_z − a_z·b_y, a_z·b_x − a_x·b_z, a_x·b_y − a_y·b_x)\n= (${a[1]}·${b[2]} − ${a[2]}·${b[1]}, ${a[2]}·${b[0]} − ${a[0]}·${b[2]}, ${a[0]}·${b[1]} − ${a[1]}·${b[0]})\n= ${correctStr}`,
    solutionSteps: [
      `Using the cross product formula:`,
      `x-component: ${a[1]}×${b[2]} − ${a[2]}×${b[1]} = ${a[1] * b[2]} − ${a[2] * b[1]} = ${cross[0]}`,
      `y-component: ${a[2]}×${b[0]} − ${a[0]}×${b[2]} = ${a[2] * b[0]} − ${a[0] * b[2]} = ${cross[1]}`,
      `z-component: ${a[0]}×${b[1]} − ${a[1]}×${b[0]} = ${a[0] * b[1]} − ${a[1] * b[0]} = ${cross[2]}`,
      `Result: a⃗ × b⃗ = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['cross product', 'vector arithmetic'],
    commonTrap: 'The order of components matters! Remember: x = ay·bz − az·by (NOT ax·bx).',
    tags: ['vectors', 'cross-product']
  };
}

function genVectorMagnitude(difficulty) {
  const dim = difficulty === 'easy' ? 2 : 3;
  const v = Array.from({ length: dim }, () => randInt(1, 6));
  const magSquared = v.reduce((s, c) => s + c * c, 0);
  const mag = Math.sqrt(magSquared);

  const isInteger = Number.isInteger(mag);
  const correctStr = isInteger ? `${mag}` : `√${magSquared}`;

  const wrongs = [
    `${magSquared}`,
    `√${magSquared + randInt(1, 5)}`,
    `${v.reduce((s, c) => s + Math.abs(c), 0)}`
  ].filter(w => w !== correctStr);

  const options = shuffleArray([correctStr, ...wrongs.slice(0, 3)]);
  while (options.length < 4) options.push(`√${magSquared + options.length * 2}`);

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-magnitude',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 40,
    question: `What is the magnitude (length) of vector v⃗ = (${v.join(', ')})?`,
    options,
    correctAnswer: options.indexOf(correctStr),
    explanation: `|v⃗| = √(${v.map(c => `${c}²`).join(' + ')}) = √(${v.map(c => c * c).join(' + ')}) = √${magSquared}${isInteger ? ` = ${mag}` : ''}`,
    solutionSteps: [
      `|v⃗| = √(${v.map(c => `${c}²`).join(' + ')})`,
      `= √(${v.map(c => c * c).join(' + ')})`,
      `= √${magSquared}${isInteger ? ` = ${mag}` : ``}`
    ],
    useKatex: true,
    skillsTested: ['vector magnitude', 'Pythagorean theorem'],
    commonTrap: 'Remember to square each component before summing, and take the square root of the sum.',
    tags: ['vectors', 'magnitude', 'length']
  };
}

function genTripleProduct(difficulty) {
  const a = Array.from({ length: 3 }, () => randInt(1, 4));
  const b = Array.from({ length: 3 }, () => randInt(1, 4));
  const c = Array.from({ length: 3 }, () => randInt(1, 4));

  // b × c
  const bxc = [
    b[1] * c[2] - b[2] * c[1],
    b[2] * c[0] - b[0] * c[2],
    b[0] * c[1] - b[1] * c[0]
  ];

  // a · (b × c)
  const triple = a[0] * bxc[0] + a[1] * bxc[1] + a[2] * bxc[2];

  const wrongs = [
    `${triple + randInt(1, 10)}`,
    `${triple - randInt(1, 10)}`,
    `${Math.abs(triple) + randInt(1, 5)}`
  ].filter(w => w !== `${triple}`);

  const options = shuffleArray([`${triple}`, ...wrongs.slice(0, 3)]);

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-triple-product',
    difficulty: difficulty === 'easy' ? 'medium' : difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 90,
    question: `Calculate the triple product [a⃗ b⃗ c⃗] = a⃗ · (b⃗ × c⃗) for:\na⃗ = (${a.join(', ')}), b⃗ = (${b.join(', ')}), c⃗ = (${c.join(', ')})`,
    options,
    correctAnswer: options.indexOf(`${triple}`),
    explanation: `First compute b⃗ × c⃗ = (${bxc.join(', ')}), then a⃗ · (b⃗ × c⃗) = ${a.map((v, i) => `${v}×${bxc[i]}`).join(' + ')} = ${triple}`,
    solutionSteps: [
      `Step 1: Compute b⃗ × c⃗:`,
      `= (${b[1]}×${c[2]} − ${b[2]}×${c[1]}, ${b[2]}×${c[0]} − ${b[0]}×${c[2]}, ${b[0]}×${c[1]} − ${b[1]}×${c[0]})`,
      `= (${bxc.join(', ')})`,
      `Step 2: Compute a⃗ · (b⃗ × c⃗):`,
      `= ${a.map((v, i) => `${v} × (${bxc[i]})`).join(' + ')}`,
      `= ${triple}`
    ],
    useKatex: true,
    skillsTested: ['triple product', 'cross product', 'dot product'],
    commonTrap: 'The triple product is a scalar (number), not a vector. First compute the cross product, then the dot product.',
    tags: ['vectors', 'triple-product', 'volume']
  };
}

function genScalarMultiplication(difficulty) {
  const scalar = randInt(-3, 5);
  const absScalar = Math.abs(scalar);
  const direction = scalar > 0 ? 'same' : 'reversed';
  const lengthEffect = absScalar > 1 ? `multiplied by ${absScalar}` : absScalar === 1 ? 'unchanged' : `multiplied by ${absScalar}`;

  const correctStr = `The length is multiplied by ${absScalar}. The direction is ${scalar < 0 ? 'reversed' : 'unchanged'}.`;
  const wrong1 = `The length is divided by ${absScalar}. The direction is ${scalar < 0 ? 'unchanged' : 'reversed'}.`;
  const wrong2 = `The length is multiplied by ${absScalar}. The direction is ${scalar < 0 ? 'unchanged' : 'reversed'}.`;
  const wrong3 = `The length is unchanged. The direction is ${scalar < 0 ? 'reversed' : 'unchanged'}.`;

  const options = shuffleArray([correctStr, wrong1, wrong2, wrong3]);

  return {
    id: generateId('vc'),
    module: 'Subject Module',
    submodule: 'Vector Calculations',
    topic: 'vc-scalar-multiplication',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 30,
    question: `What happens when a vector is multiplied by the scalar "${scalar}"?`,
    options,
    correctAnswer: options.indexOf(correctStr),
    explanation: `Multiplying by ${scalar}: the absolute value |${scalar}| = ${absScalar} determines the length factor. ${scalar < 0 ? 'The negative sign reverses the direction.' : 'A positive scalar preserves the direction.'}`,
    solutionSteps: [
      `The scalar is ${scalar}.`,
      `|${scalar}| = ${absScalar}, so the length is multiplied by ${absScalar}.`,
      scalar < 0 ? 'The negative sign reverses the direction.' : 'The positive sign preserves the direction.'
    ],
    skillsTested: ['scalar multiplication', 'direction and magnitude'],
    commonTrap: 'The sign affects direction (negative reverses it), while the absolute value affects length.',
    tags: ['vectors', 'scalar-multiplication']
  };
}

// ========== HYDROSTATICS ==========

function genPressureAtDepth(difficulty) {
  const depths = difficulty === 'easy' ? [10, 20, 50, 100] : [100, 250, 500, 1000, 5000, 10000];
  const depth = depths[randInt(0, depths.length - 1)];
  const pressure = depth / 10; // bars (1 bar per 10m)

  const addAtmospheric = difficulty !== 'easy' && Math.random() > 0.5;
  const totalPressure = addAtmospheric ? pressure + 1 : pressure;

  const questionText = addAtmospheric
    ? `What is the approximate total pressure (including atmospheric pressure) at a depth of ${depth.toLocaleString()} m below sea level?`
    : `What is the approximate water pressure at a depth of ${depth.toLocaleString()} m below sea level?`;

  const correctStr = `${totalPressure} bar`;
  const wrongs = [
    `${totalPressure * 10} bar`,
    `${totalPressure / 10} bar`,
    `${Math.max(1, totalPressure - randInt(1, Math.max(1, Math.floor(totalPressure / 2))))} bar`
  ].filter(w => w !== correctStr);

  const options = shuffleArray([correctStr, ...wrongs.slice(0, 3)]);

  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-pressure-depth',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 30,
    question: questionText,
    options,
    correctAnswer: options.indexOf(correctStr),
    explanation: `Water pressure increases by approximately 1 bar for every 10 m of depth. At ${depth} m: ${depth}/10 = ${pressure} bar of water pressure.${addAtmospheric ? ` Adding ~1 bar atmospheric pressure: ${totalPressure} bar total.` : ''}`,
    solutionSteps: [
      `Using the approximation: water pressure ≈ 1 bar per 10 m depth`,
      `At ${depth} m: ${depth} ÷ 10 = ${pressure} bar`,
      addAtmospheric ? `Adding atmospheric pressure (~1 bar): ${pressure} + 1 = ${totalPressure} bar` : `Water pressure = ${pressure} bar`
    ],
    useKatex: true,
    skillsTested: ['pressure calculation', 'unit conversion'],
    commonTrap: 'Don\'t forget to add atmospheric pressure (~1 bar) when asked for total pressure.',
    tags: ['hydrostatics', 'pressure', 'depth']
  };
}

function genBuoyancy(difficulty) {
  const volume = randInt(1, 5);
  const density = 1000; // water
  const mass = volume * density;

  const questionText = `A body with a volume of ${volume} m³ floats fully submerged in water (density = 1000 kg/m³). What is the mass of the body?`;
  const correctStr = `${mass.toLocaleString()} kg`;
  const wrongs = [
    `${Math.round(mass * 0.5).toLocaleString()} kg`,
    `${Math.round(mass * 1.5).toLocaleString()} kg`,
    `${Math.round(mass * 2.5).toLocaleString()} kg`
  ];

  const options = shuffleArray([correctStr, ...wrongs]);

  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-buoyancy',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 40,
    question: questionText,
    options,
    correctAnswer: options.indexOf(correctStr),
    explanation: `A floating body displaces a mass of water equal to its own mass. Volume × density = ${volume} × ${density} = ${mass} kg.`,
    solutionSteps: [
      `For a floating body: mass of body = mass of displaced water`,
      `Mass = Volume × Density`,
      `= ${volume} m³ × ${density} kg/m³`,
      `= ${mass} kg`
    ],
    useKatex: true,
    skillsTested: ['buoyancy', 'Archimedes\' principle'],
    commonTrap: 'Remember: for a floating body, the displaced water mass equals the body mass.',
    tags: ['hydrostatics', 'buoyancy', 'archimedes']
  };
}

function genPumpQuestion(difficulty) {
  const correctStr = 'Approximately 10 m';
  const options = shuffleArray([
    correctStr,
    'Approximately 20 m',
    'Approximately 5 m',
    'There is no theoretical limit'
  ]);
  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-pumps',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 60,
    question: `A suction pump creates a vacuum to lift water. Under ideal conditions (ignoring friction and boiling), what is the maximum height a suction pump can lift water above the water surface?`,
    options,
    correctAnswer: options.indexOf(correctStr),
    explanation: `Atmospheric pressure (≈1 bar ≈ 101,325 Pa) can support a water column of about 10 m. Beyond that height, a perfect vacuum cannot lift the water further.`,
    solutionSteps: [
      'A suction pump works by creating a pressure difference using atmospheric pressure.',
      'Maximum pressure difference = atmospheric pressure ≈ 101,325 Pa',
      'Height = P / (ρ·g) = 101,325 / (1000 × 9.81) ≈ 10.3 m',
      'Therefore, the maximum suction height is approximately 10 m.'
    ],
    useKatex: true,
    skillsTested: ['atmospheric pressure', 'suction principle'],
    commonTrap: 'The pump does not "pull" the water — atmospheric pressure pushes it up. This limits the height to ~10 m.',
    tags: ['hydrostatics', 'pumps', 'atmospheric-pressure']
  };
}

// ========== OPTIMAL ORDER QUANTITY ==========

function genEOQCalculation(difficulty) {
  const D = [500, 800, 1000, 1200, 1500, 1800, 2000, 2400, 3000, 3600][randInt(0, 9)];
  const S = [20, 25, 30, 40, 50, 60, 80, 100][randInt(0, 7)];
  const H = [1, 2, 3, 4, 5, 8, 10][randInt(0, 6)];

  const Qstar = Math.sqrt(2 * D * S / H);
  const QstarRounded = Math.round(Qstar);

  const correctStr = `${QstarRounded} units`;
  const wrongs = [
    `${Math.round(Qstar * 1.5)} units`,
    `${Math.round(Qstar * 0.5)} units`,
    `${Math.round(Qstar * 2)} units`
  ].filter(w => w !== correctStr);

  const options = shuffleArray([correctStr, ...wrongs.slice(0, 3)]);

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'eoq-formula',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 60,
    question: `A retailer requires ${D.toLocaleString()} units annually. Fixed ordering cost per order is €${S}. Annual holding cost per unit is €${H}. Using the EOQ formula Q* = √(2DS/H), what is the optimal order quantity?`,
    options,
    correctAnswer: options.indexOf(correctStr),
    explanation: `Q* = √(2 × ${D} × ${S} / ${H}) = √(${2 * D * S / H}) = ${QstarRounded}`,
    solutionSteps: [
      `Q* = √(2DS/H)`,
      `= √(2 × ${D} × ${S} / ${H})`,
      `= √(${2 * D * S} / ${H})`,
      `= √(${2 * D * S / H})`,
      `≈ ${QstarRounded} units`
    ],
    useKatex: true,
    skillsTested: ['EOQ formula', 'arithmetic', 'square roots'],
    commonTrap: 'Remember the formula structure: demand and ordering cost are in the numerator, holding cost is in the denominator.',
    tags: ['eoq', 'inventory', 'formula']
  };
}

function genEOQSensitivity(difficulty) {
  const scenarios = [
    {
      change: 'ordering cost S is doubled',
      question: 'If the ordering cost per order S is doubled and all other values remain the same, how does Q* change?',
      correct: 'It increases by a factor of √2 (approximately 1.41).',
      wrongs: ['It doubles.', 'It halves.', 'It quadruples.'],
      explanation: 'Since Q* = √(2DS/H), doubling S gives Q_new = √(2D·2S/H) = √2 · Q*. The factor is √2 ≈ 1.41.'
    },
    {
      change: 'annual demand D is halved',
      question: 'If annual demand D is halved, how does the optimal order quantity change?',
      correct: 'It decreases by a factor of √2 (approximately 0.71 of the original).',
      wrongs: ['It halves.', 'It doubles.', 'It remains unchanged.'],
      explanation: 'Q* = √(2DS/H). Halving D: Q_new = √(2·(D/2)·S/H) = Q*/√2 ≈ 0.71·Q*.'
    },
    {
      change: 'holding cost H is quadrupled',
      question: 'If the holding cost per unit H is quadrupled, how does Q* change?',
      correct: 'It halves.',
      wrongs: ['It is divided by 4.', 'It increases by a factor of 2.', 'It remains unchanged.'],
      explanation: 'Q* = √(2DS/H). Quadrupling H: Q_new = √(2DS/(4H)) = Q*/2. It halves.'
    }
  ];

  const scenario = scenarios[randInt(0, scenarios.length - 1)];
  const options = shuffleArray([scenario.correct, ...scenario.wrongs]);

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'eoq-sensitivity',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 60,
    question: scenario.question,
    options,
    correctAnswer: options.indexOf(scenario.correct),
    explanation: scenario.explanation,
    solutionSteps: [scenario.explanation],
    useKatex: true,
    skillsTested: ['sensitivity analysis', 'proportional reasoning'],
    commonTrap: 'Because of the square root, changes to parameters affect Q* by the square root of the factor, not the factor itself.',
    tags: ['eoq', 'sensitivity']
  };
}

function genEOQConceptual(difficulty) {
  const questions = [
    {
      question: 'Which statement correctly describes a central assumption of the optimal order quantity model?',
      correct: 'Demand can be reliably forecast and remains stable over the year.',
      wrongs: [
        'Demand fluctuates, so safety stocks are particularly important.',
        'Quantity discounts are taken into account because larger orders may be cheaper.',
        'The model minimises the total delivery time rather than costs.'
      ],
      explanation: 'The EOQ model assumes constant, known demand over time. This is explicitly stated in the model assumptions.',
      topic: 'eoq-model-assumptions'
    },
    {
      question: 'Why does the EOQ model use Q/2 when calculating holding costs?',
      correct: 'Because Q/2 is the average inventory level between two orders.',
      wrongs: [
        'Because Q/2 is the maximum inventory level after an order.',
        'Because only half of the products incur holding costs.',
        'Because Q/2 indicates how often orders are placed per year.'
      ],
      explanation: 'Between orders, inventory starts at Q and decreases linearly to 0. The average is Q/2.',
      topic: 'eoq-average-inventory'
    }
  ];

  const q = questions[randInt(0, questions.length - 1)];
  const options = shuffleArray([q.correct, ...q.wrongs]);

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: q.topic,
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 45,
    question: q.question,
    options,
    correctAnswer: options.indexOf(q.correct),
    explanation: q.explanation,
    solutionSteps: [q.explanation],
    skillsTested: ['conceptual understanding', 'model assumptions'],
    commonTrap: 'Read each option carefully — some are plausible-sounding but contradict the model\'s assumptions.',
    tags: ['eoq', 'conceptual']
  };
}

// ========== RESEARCH STRATEGIES ==========

function genResearchStrategyQuestion(difficulty) {
  const questions = [
    {
      question: 'How can the following sentence be correctly finished? The deductive research strategy…',
      correct: '…examines the relation between factors and effects.',
      wrongs: [
        '…requires a certain, fixed sample size, independent of research design.',
        '…focuses on the identification of causal mechanisms.',
        '…shows how and why certain conditions influence causes and effects in single cases.'
      ],
      explanation: 'The deductive (quantitative) strategy aims to identify causal relationships — whether certain factors are related to certain outcomes.',
      topic: 'rs-causal-relationships'
    },
    {
      question: 'Which of the following statements applies to the inductive research strategy?',
      correct: 'It is crucial to examine in which way certain factors have certain consequences.',
      wrongs: [
        'It is crucial to make statistically proven statements about how well research results scale.',
        'It is only possible to consider a single case.',
        'Proof about the spread of functioning mechanisms is provided.'
      ],
      explanation: 'The inductive (qualitative) strategy focuses on causal mechanisms — how and why factors lead to consequences.',
      topic: 'rs-causal-relationships'
    },
    {
      question: 'Which of the following statements about conducting research projects is true?',
      correct: 'In a qualitative research project, the research question can be reformulated during the process.',
      wrongs: [
        'In a quantitative research project, the sample can be modified in any way after the first data analyses.',
        'In a qualitative research project, changes to the research design do not need to be recorded.',
        'In a quantitative research project, the order of the four phases is not important.'
      ],
      explanation: 'Qualitative research can include circular elements, allowing the research question to be refined during the process, as long as changes are documented.',
      topic: 'rs-linear-vs-circular'
    },
    {
      question: 'A student wants to test a well-known theory using statistical methods on a large sample. Which research strategy has the student chosen?',
      correct: 'A deductive approach.',
      wrongs: [
        'An inductive approach.',
        'A mixed-methods approach.',
        'A qualitative case-study approach.'
      ],
      explanation: 'Starting from an existing theory and testing it with statistical methods on a large sample corresponds to the deductive (quantitative, theory-testing) research strategy.',
      topic: 'rs-hypothesis-testing'
    },
    {
      question: 'In a quantitative study, the researcher changes the hypothesis after analyzing the data to match the results. Is this consistent with the ideal-typical quantitative process?',
      correct: 'No — this most clearly contradicts the ideal-typical quantitative process, which requires hypotheses to be defined before data analysis.',
      wrongs: [
        'Yes — adjusting hypotheses is a normal and expected part of quantitative research.',
        'It depends on whether the change was documented.',
        'It is acceptable if the sample size is large enough.'
      ],
      explanation: 'In a quantitative research project, hypotheses should be defined before data analysis. Changing them retrospectively to fit results contradicts the ideal-typical process.',
      topic: 'rs-hypothesis-testing'
    },
    {
      question: 'A doctoral student wants to pursue why people use a library (qualitative) and what they borrow (quantitative). Which data collection approach is suitable?',
      correct: 'An analysis of borrowing records (quantitative) combined with semi-structured interviews (qualitative).',
      wrongs: [
        'A group discussion with 3 people and an interview with the library director.',
        'A count of all books borrowed without considering titles and an interview with a publisher.',
        'A count of people entering the library and an evaluation of population statistics.'
      ],
      explanation: 'Borrowing records provide quantitative data about what is borrowed. Semi-structured interviews provide qualitative insights into why people use the library.',
      topic: 'rs-mixed-methods'
    }
  ];

  const q = questions[randInt(0, questions.length - 1)];
  const options = shuffleArray([q.correct, ...q.wrongs]);

  return {
    id: generateId('rs'),
    module: 'Subject Module',
    submodule: 'Research Strategies in Social Sciences',
    topic: q.topic,
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 60,
    question: q.question,
    options,
    correctAnswer: options.indexOf(q.correct),
    explanation: q.explanation,
    solutionSteps: [q.explanation],
    skillsTested: ['research methodology', 'critical thinking'],
    commonTrap: 'Pay attention to the distinction between identifying relationships (quantitative/deductive) and understanding mechanisms (qualitative/inductive).',
    tags: ['research-strategies', 'social-sciences', 'methodology']
  };
}

// ========== MASTER GENERATOR ==========

import { generateVectorQuestion, generateVectorBank } from './vectorCalculations.js';
import { generateHydrostaticsQuestion, generateHydrostaticsBank } from './hydrostatics.js';
import { generateEOQQuestion, generateEOQBank } from './optimalOrderQuantity.js';
import { generateResearchStrategyQuestion, generateResearchStrategyBank } from './researchStrategies.js';

export {
  generateVectorQuestion,
  generateVectorBank,
  generateHydrostaticsQuestion,
  generateHydrostaticsBank,
  generateEOQQuestion,
  generateEOQBank,
  generateResearchStrategyQuestion,
  generateResearchStrategyBank
};

export function generateSubjectQuestion(topicId, difficulty = 'medium') {
  switch (topicId) {
    case 'vector-calculations':
    case 'Vector Calculations':
      return generateVectorQuestion(difficulty);
    case 'hydrostatics':
    case 'Hydrostatics':
      return generateHydrostaticsQuestion(difficulty);
    case 'optimal-order-quantity':
    case 'Optimal Order Quantity':
      return generateEOQQuestion(difficulty);
    case 'research-strategies':
    case 'Research Strategies in Social Sciences':
      return generateResearchStrategyQuestion(difficulty);
    default:
      return generateVectorQuestion(difficulty);
  }
}

export function generateSubjectQuestionBank(topicId, count = 75) {
  switch (topicId) {
    case 'vector-calculations':
    case 'Vector Calculations':
      return generateVectorBank(count);
    case 'hydrostatics':
    case 'Hydrostatics':
      return generateHydrostaticsBank(count);
    case 'optimal-order-quantity':
    case 'Optimal Order Quantity':
      return generateEOQBank(count);
    case 'research-strategies':
    case 'Research Strategies in Social Sciences':
      return generateResearchStrategyBank(count);
    default:
      return generateVectorBank(count);
  }
}
