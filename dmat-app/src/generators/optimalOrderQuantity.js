// Optimal Order Quantity (EOQ / Andler Formula) Question Generator for dMAT Subject Module
// Covers: Classic EOQ formula, Total Inventory Cost, Order Frequency (N = D/Q),
// Order Cycle Time, Average Inventory, Cost Equality at EOQ, Holding Cost rate (H = i*C),
// Sensitivity Analysis, Quantity Discount Decisions, and Reorder Point (ROP)

import { generateId, shuffleArray, randInt } from './utils.js';

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
  while (wrongs.length < 3 && attempts < 30) {
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

// Helper to generate clean integer EOQ triples: 2*D*S / H = Q^2
function getCleanEOQTriple() {
  const S = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 100, 120, 150][randInt(0, 15)];
  const H = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15][randInt(0, 9)];
  const mult = randInt(4, 40);
  const targetQ = mult * 25; // 100 to 1000
  const D = Math.max(300, Math.round((targetQ * targetQ * H) / (2 * S)));
  const exactQ = Math.round(Math.sqrt((2 * D * S) / H));
  return { D, S, H, Q: exactQ };
}

// 1. Classic EOQ Calculation (Andler Formula)
function genEOQCalculation(difficulty) {
  const { D, S, H, Q } = getCleanEOQTriple();
  const correctStr = `${Q} units`;

  const rawWrongs = [
    `${Math.round(Q * 1.5)} units`,
    `${Math.max(10, Math.round(Q * 0.5))} units`,
    `${Math.round(Q * 2)} units`,
    `${Math.round(Math.sqrt((D * S) / H))} units` // forgot factor of 2 in numerator!
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${Q + randInt(30, 200)} units`
  );

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-andler-formula',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 50,
    question: `A manufacturing firm has an annual demand of D = ${D.toLocaleString()} units for a key component. The ordering cost is S = €${S} per order, and the annual holding cost is H = €${H} per unit per year. According to the classic Andler / Harris-Wilson formula, what is the optimal order quantity (EOQ)?`,
    options,
    correctAnswer,
    explanation: `The Economic Order Quantity is determined by the Andler formula:\nQ* = √( (2 · D · S) / H ) = √( (2 × ${D.toLocaleString()} × ${S}) / ${H} ) = √( ${( (2 * D * S) / H ).toLocaleString()} ) = ${correctStr}.`,
    solutionSteps: [
      `Andler / EOQ Formula: Q* = √( (2 · D · S) / H )`,
      `Numerator: 2 × ${D.toLocaleString()} × ${S} = ${(2 * D * S).toLocaleString()}`,
      `Divide by holding cost: ${(2 * D * S).toLocaleString()} / ${H} = ${Math.round((2 * D * S) / H).toLocaleString()}`,
      `Square root: √(${Math.round((2 * D * S) / H).toLocaleString()}) = ${Q} units`
    ],
    useKatex: true,
    skillsTested: ['EOQ formula', 'inventory management', 'Andler formula'],
    commonTrap: 'Remember the factor of 2 in the numerator: 2·D·S, not D·S.',
    tags: ['eoq', 'optimal-order-quantity', 'andler', difficulty]
  };
}

// 2. Total Annual Inventory Cost at EOQ
function genTotalCostQuestion(difficulty) {
  const { D, S, H, Q } = getCleanEOQTriple();
  const orderingCost = (D / Q) * S;
  const holdingCost = (Q / 2) * H;
  const totalCost = Math.round(orderingCost + holdingCost);

  const correctStr = `€${totalCost.toLocaleString()}`;
  const rawWrongs = [
    `€${Math.round(orderingCost).toLocaleString()}`, // only ordering cost
    `€${Math.round(holdingCost).toLocaleString()}`, // only holding cost
    `€${Math.round(totalCost * 1.5).toLocaleString()}`,
    `€${Math.round(totalCost * 2).toLocaleString()}`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `€${totalCost + randInt(50, 400)}`
  );

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-total-costs',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 55,
    question: `For an item with annual demand D = ${D.toLocaleString()} units, ordering cost S = €${S}, and unit annual holding cost H = €${H}, the optimal order quantity is Q* = ${Q} units. What is the total annual inventory management cost (ordering cost + holding cost) at this optimum?`,
    options,
    correctAnswer,
    explanation: `At the optimal order quantity Q*, annual ordering cost equals annual holding cost:\nAnnual Ordering Cost = (D / Q*) × S = (${D} / ${Q}) × ${S} = €${Math.round(orderingCost)}\nAnnual Holding Cost = (Q* / 2) × H = (${Q} / 2) × ${H} = €${Math.round(holdingCost)}\nTotal Cost = €${Math.round(orderingCost)} + €${Math.round(holdingCost)} = ${correctStr}.`,
    solutionSteps: [
      `1. Annual Ordering Cost = (D / Q) · S = (${D} / ${Q}) × ${S} = €${Math.round(orderingCost)}`,
      `2. Annual Holding Cost = (Q / 2) · H = (${Q} / 2) × ${H} = €${Math.round(holdingCost)}`,
      `3. Total Cost = Ordering + Holding = €${totalCost}`
    ],
    useKatex: true,
    skillsTested: ['total inventory cost', 'ordering cost', 'holding cost'],
    commonTrap: 'At the EOQ, annual ordering cost and annual holding cost are equal.',
    tags: ['eoq', 'total-cost', difficulty]
  };
}

// 3. Number of Orders per Year (Order Frequency)
function genOrderFrequency(difficulty) {
  const { D, S, H, Q } = getCleanEOQTriple();
  const numOrders = parseFloat((D / Q).toFixed(1));
  const correctStr = `${numOrders} orders/year`;

  const rawWrongs = [
    `${parseFloat((Q / D).toFixed(2))} orders/year`, // inverted ratio
    `${parseFloat((numOrders * 2).toFixed(1))} orders/year`,
    `${parseFloat((numOrders / 2).toFixed(1))} orders/year`,
    `${parseFloat((numOrders + 3).toFixed(1))} orders/year`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${numOrders + randInt(4, 15)} orders/year`
  );

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-order-frequency',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 40,
    question: `A retailer has an annual demand of D = ${D.toLocaleString()} units and orders in optimal batches of Q* = ${Q} units. How many orders per year (order frequency N) will the retailer place?`,
    options,
    correctAnswer,
    explanation: `The order frequency is the annual demand divided by the batch size:\nN = D / Q* = ${D.toLocaleString()} / ${Q} = ${correctStr}.`,
    solutionSteps: [
      `Formula: N = D / Q*`,
      `= ${D.toLocaleString()} / ${Q}`,
      `= ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['order frequency', 'batch sizing'],
    commonTrap: 'Do not invert the formula: it is Annual Demand / Order Quantity, not Q / D.',
    tags: ['eoq', 'frequency', difficulty]
  };
}

// 4. Order Cycle Time (Days between orders)
function genOrderCycleTime(difficulty) {
  const { D, S, H, Q } = getCleanEOQTriple();
  const workingDays = 360;
  const cycleDays = Math.round((Q / D) * workingDays);
  const correctStr = `${cycleDays} days`;

  const rawWrongs = [
    `${Math.round(cycleDays * 1.5)} days`,
    `${Math.max(5, Math.round(cycleDays * 0.5))} days`,
    `${Math.round((D / Q) * 10)} days`,
    `${cycleDays + 30} days`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${cycleDays + randInt(15, 60)} days`
  );

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-cycle-time',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 45,
    question: `Assuming 360 business days per operating year, an annual demand of D = ${D.toLocaleString()} units, and an optimal batch size Q* = ${Q} units, what is the optimal cycle time T (time between consecutive orders)?`,
    options,
    correctAnswer,
    explanation: `Cycle time is given by T = (Q* / D) × Operating Days = (${Q} / ${D.toLocaleString()}) × 360 days ≈ ${correctStr}.`,
    solutionSteps: [
      `Formula: T = (Q* / D) × 360 days`,
      `= (${Q} / ${D.toLocaleString()}) × 360`,
      `= ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['order cycle time', 'inventory scheduling'],
    commonTrap: 'Cycle time is (Q / D) × Days, which represents the fraction of the year each batch covers.',
    tags: ['eoq', 'cycle-time', difficulty]
  };
}

// 5. Holding Cost from Interest / Carrying Rate (H = i · C)
function genHoldingCostRate(difficulty) {
  const unitCost = [20, 40, 50, 80, 100, 200][randInt(0, 5)];
  const ratePercent = [10, 15, 20, 25][randInt(0, 3)];
  const H = (unitCost * ratePercent) / 100;
  const D = [1000, 2000, 3600, 4000][randInt(0, 3)];
  const S = [25, 40, 50, 80][randInt(0, 3)];

  const Q = Math.round(Math.sqrt((2 * D * S) / H));
  const correctStr = `${Q} units`;

  const rawWrongs = [
    `${Math.round(Math.sqrt((2 * D * S) / unitCost))} units`, // forgot interest rate!
    `${Math.round(Q * 1.5)} units`,
    `${Math.round(Q * 0.5)} units`,
    `${Math.round(Q * 2)} units`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${Q + randInt(25, 150)} units`
  );

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-carrying-rate',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 55,
    question: `A company purchases an item for C = €${unitCost} per unit. The annual inventory carrying charge is i = ${ratePercent}% of the purchase price. Annual demand is D = ${D.toLocaleString()} units, and fixed ordering cost is S = €${S}. What is the optimal order quantity (EOQ)?`,
    options,
    correctAnswer,
    explanation: `First compute the unit holding cost: H = i · C = ${ratePercent}% of €${unitCost} = €${H} per unit/year.\nThen apply the EOQ formula:\nQ* = √( (2 · D · S) / H ) = √( (2 × ${D.toLocaleString()} × ${S}) / ${H} ) = ${correctStr}.`,
    solutionSteps: [
      `1. Holding cost per unit/year: H = i × C = ${(ratePercent / 100)} × ${unitCost} = €${H}`,
      `2. Andler formula: Q* = √( (2 · D · S) / H )`,
      `3. Q* = √( (2 × ${D.toLocaleString()} × ${S}) / ${H} ) = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['inventory carrying rate', 'percentage holding cost', 'EOQ'],
    commonTrap: 'Convert the carrying rate percentage into holding cost per unit (H = i · C) before using the Andler formula.',
    tags: ['eoq', 'holding-rate', difficulty]
  };
}

// 6. Sensitivity Analysis (Square Root Law)
function genSensitivityQuestion(difficulty) {
  const scenarios = [
    {
      q: 'If the annual demand D for a product quadruples (increases by a factor of 4) while ordering costs and holding costs remain unchanged, how does the optimal order quantity Q* change?',
      correct: 'Q* doubles (increases by a factor of 2).',
      wrongs: ['Q* quadruples (increases by a factor of 4).', 'Q* remains unchanged.', 'Q* increases by a factor of 16.'],
      expl: 'Because EOQ depends on the square root of demand: Q* ∝ √D. If D is multiplied by 4, Q* is multiplied by √4 = 2.'
    },
    {
      q: 'If the annual unit holding cost H quadruples (increases by a factor of 4) while demand and ordering costs remain constant, how does the optimal order quantity Q* change?',
      correct: 'Q* is halved (decreases by 50%).',
      wrongs: ['Q* decreases by 75% (to 1/4 of original).', 'Q* doubles.', 'Q* remains unaffected.'],
      expl: 'Holding cost H is in the denominator under the square root: Q* ∝ 1/√H. If H increases by a factor of 4, Q* is multiplied by 1/√4 = 1/2.'
    },
    {
      q: 'If BOTH the ordering cost S and the unit holding cost H double simultaneously, how does the optimal order quantity Q* respond?',
      correct: 'Q* remains completely unchanged.',
      wrongs: ['Q* doubles.', 'Q* is halved.', 'Q* increases by √2.'],
      expl: 'In the Andler formula, Q* = √(2·D·S / H). The ratio S/H becomes (2S)/(2H) = S/H. The factor of 2 cancels out entirely, leaving Q* unchanged.'
    },
    {
      q: 'At the optimal order quantity Q*, what is the mathematical relationship between the annual ordering cost and the annual inventory holding cost?',
      correct: 'Annual ordering cost is exactly equal to annual holding cost.',
      wrongs: ['Annual holding cost is twice the annual ordering cost.', 'Annual ordering cost is minimized while holding cost is zero.', 'Their sum equals demand D.'],
      expl: 'At the minimum of the total cost curve TC(Q) = (D/Q)S + (Q/2)H, setting the derivative to zero yields (D/Q*)S = (Q*/2)H. The two cost components are identical.'
    }
  ];

  const item = scenarios[randInt(0, scenarios.length - 1)];
  const { options, correctAnswer } = makeUniqueOptions(
    item.correct,
    item.wrongs,
    () => `Q* changes by a factor of ${randInt(3, 8)}.`
  );

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-sensitivity-analysis',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 45,
    question: item.q,
    options,
    correctAnswer,
    explanation: item.expl,
    solutionSteps: [item.expl],
    useKatex: true,
    skillsTested: ['EOQ sensitivity', 'square root law of inventory', 'cost trade-offs'],
    commonTrap: 'Remember the square root! An increase in demand or ordering cost does not translate linearly to Q*.',
    tags: ['eoq', 'sensitivity', difficulty]
  };
}

// 7. Reorder Point (ROP = d · L + SS)
function genReorderPoint(difficulty) {
  const dailyDemand = randInt(10, 50);
  const leadTimeDays = randInt(3, 14);
  const safetyStock = randInt(20, 100);

  const demandDuringLeadTime = dailyDemand * leadTimeDays;
  const rop = demandDuringLeadTime + safetyStock;

  const correctStr = `${rop} units`;
  const rawWrongs = [
    `${demandDuringLeadTime} units`, // forgot safety stock!
    `${Math.round(rop * 1.4)} units`,
    `${Math.max(10, demandDuringLeadTime - safetyStock)} units`,
    `${dailyDemand * 30} units`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${rop + randInt(20, 80)} units`
  );

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-reorder-point',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 40,
    question: `A distribution center experiences an average daily demand of d = ${dailyDemand} units. The replenishment lead time from the supplier is L = ${leadTimeDays} days, and the center maintains a safety stock of SS = ${safetyStock} units. At what inventory level should a reorder be triggered (Reorder Point, ROP)?`,
    options,
    correctAnswer,
    explanation: `The Reorder Point is the expected demand during lead time plus safety stock:\nROP = (d · L) + SS = (${dailyDemand} × ${leadTimeDays}) + ${safetyStock} = ${demandDuringLeadTime} + ${safetyStock} = ${correctStr}.`,
    solutionSteps: [
      `Formula: ROP = (Daily Demand × Lead Time) + Safety Stock`,
      `Demand during lead time = ${dailyDemand} × ${leadTimeDays} = ${demandDuringLeadTime} units`,
      `Add safety stock: ${demandDuringLeadTime} + ${safetyStock} = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['reorder point', 'lead time demand', 'safety stock'],
    commonTrap: 'Always include the buffer safety stock in the reorder point trigger.',
    tags: ['eoq', 'reorder-point', difficulty]
  };
}

// 8. Average Inventory Level (I_avg = Q / 2)
function genAverageInventory(difficulty) {
  const Q = [80, 120, 160, 200, 240, 300, 360, 400, 500, 600, 800, 1000][randInt(0, 11)];
  const avg = Q / 2;
  const correctStr = `${avg} units`;
  const rawWrongs = [
    `${Q} units`,
    `${Math.round(Q / 4)} units`,
    `${Math.round(Q * 1.5)} units`,
    `${avg + 40} units`
  ];
  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${avg + randInt(20, 100)} units`
  );
  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-average-inventory',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 30,
    question: `Under the assumptions of the classic Economic Order Quantity model (constant demand, instantaneous replenishment, and no shortages), if a firm orders in batch sizes of Q = ${Q} units, what is its average inventory level?`,
    options,
    correctAnswer,
    explanation: `In the classic sawtooth inventory model, inventory drops uniformly from Q to 0 between orders. The average inventory level is therefore I_avg = Q / 2 = ${Q} / 2 = ${correctStr}.`,
    solutionSteps: [
      `Sawtooth inventory model formula: Average Inventory = Q / 2`,
      `= ${Q} / 2 = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['average inventory', 'sawtooth model', 'EOQ fundamentals'],
    commonTrap: 'Average cycle stock is Q/2, not Q.',
    tags: ['eoq', 'average-inventory', difficulty]
  };
}

// 9. Cost Penalty of Non-Optimal Order Quantity
function genSuboptimalOrderCost(difficulty) {
  const { D, S, H, Q } = getCleanEOQTriple();
  const actualQ = 2 * Q;
  const actualOrdering = (D / actualQ) * S;
  const actualHolding = (actualQ / 2) * H;
  const actualTotal = Math.round(actualOrdering + actualHolding);

  const correctStr = `€${actualTotal.toLocaleString()}`;
  const rawWrongs = [
    `€${Math.round((D / Q) * S + (Q / 2) * H).toLocaleString()}`,
    `€${Math.round(actualTotal * 1.4).toLocaleString()}`,
    `€${Math.round(actualOrdering).toLocaleString()}`,
    `€${Math.round(actualHolding).toLocaleString()}`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `€${actualTotal + randInt(50, 300)}`
  );

  return {
    id: generateId('eoq'),
    module: 'Subject Module',
    submodule: 'Optimal Order Quantity',
    topic: 'ooq-cost-comparison',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 60,
    question: `A firm has annual demand D = ${D.toLocaleString()} units, ordering cost S = €${S}, and holding cost H = €${H} per unit/year (optimal EOQ Q* = ${Q} units). Due to warehouse space constraints, the firm decides instead to place larger orders of Q = ${actualQ} units. What is the resulting total annual inventory cost?`,
    options,
    correctAnswer,
    explanation: `Total Cost = (D / Q)·S + (Q / 2)·H\n= (${D} / ${actualQ}) × ${S} + (${actualQ} / 2) × ${H}\n= €${Math.round(actualOrdering)} + €${Math.round(actualHolding)} = ${correctStr}.`,
    solutionSteps: [
      `1. Ordering cost = (${D} / ${actualQ}) × ${S} = €${Math.round(actualOrdering)}`,
      `2. Holding cost = (${actualQ} / 2) × ${H} = €${Math.round(actualHolding)}`,
      `3. Total annual cost = €${actualTotal}`
    ],
    useKatex: true,
    skillsTested: ['cost curve analysis', 'non-optimal batch sizing'],
    commonTrap: 'Ordering double the optimal batch size halves ordering cost but doubles holding cost, resulting in a higher total cost.',
    tags: ['eoq', 'suboptimal-cost', difficulty]
  };
}

// Master Generator for Optimal Order Quantity
export function generateEOQQuestion(difficulty = 'medium') {
  const easyGenerators = [genEOQCalculation, genOrderFrequency, genOrderCycleTime, genAverageInventory, genSensitivityQuestion];
  const mediumGenerators = [genEOQCalculation, genTotalCostQuestion, genOrderFrequency, genOrderCycleTime, genHoldingCostRate, genAverageInventory, genSensitivityQuestion, genReorderPoint];
  const hardGenerators = [genTotalCostQuestion, genHoldingCostRate, genSuboptimalOrderCost, genSensitivityQuestion, genEOQCalculation, genReorderPoint];
  const challengeGenerators = [genTotalCostQuestion, genHoldingCostRate, genSuboptimalOrderCost, genSensitivityQuestion];

  let pool = mediumGenerators;
  if (difficulty === 'easy') pool = easyGenerators;
  else if (difficulty === 'hard') pool = hardGenerators;
  else if (difficulty === 'challenge') pool = challengeGenerators;

  const fn = pool[randInt(0, pool.length - 1)];
  return fn(difficulty);
}

export function generateEOQBank(count = 75) {
  const bank = [];
  const difficulties = ['easy', 'medium', 'hard', 'challenge'];
  const perDiff = Math.ceil(count / difficulties.length);

  for (const diff of difficulties) {
    for (let i = 0; i < perDiff; i++) {
      try {
        bank.push(generateEOQQuestion(diff));
      } catch (e) {
        console.warn('Error generating EOQ question:', e);
      }
    }
  }
  return bank.slice(0, count);
}
