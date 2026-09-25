// Optimal Order Quantity (EOQ) In-Depth Learning Content
// Covers all 6 official dMAT EOQ subtopics with theory, formulas, exam tricks, and 3 difficulty-graded examples.

export const BUSINESS_SUBTOPICS = {
  'eoq-model-assumptions': {
    id: 'eoq-model-assumptions',
    title: 'EOQ Model Assumptions & Boundary Conditions',
    submodule: 'Optimal Order Quantity',
    module: 'Subject Module',
    overview: `The classical Economic Order Quantity (EOQ) model, also known in German academic literature as the "Andler-Formel" (Harris-Wilson EOQ formula), finds the lot size that minimizes total annual inventory costs.
The model is built on strict simplifying assumptions:
1. Deterministic, constant demand rate (D) throughout the year.
2. Constant lead time (L = 0 or known constant) with instantaneous batch replenishment.
3. No stockouts allowed (infinite stockout cost penalty).
4. Fixed ordering cost (S) per order, completely independent of order quantity Q.
5. Linear unit holding cost (H) per item per year, independent of batch size.
6. Zero quantity discounts (constant purchase price P).
7. Unlimited warehouse storage and capital availability.`,
    principles: [
      'Constant Demand: Demand occurs continuously at an unvarying rate.',
      'Instant Replenishment: All Q units arrive simultaneously into stock (vertical spike in sawtooth chart).',
      'No Stockouts: Inventory never drops below 0.',
      'Cost Trade-Off: Balances batch ordering costs vs storage holding costs.'
    ],
    formulas: [
      '\\text{Sawtooth profile: Peak} = Q, \\; \\text{Minimum} = 0, \\; \\text{Average} = \\frac{Q}{2}'
    ],
    examTricks: [
      {
        title: 'Discount Invalidation Rule',
        description: 'If a dMAT question asks: "Which factor violates standard EOQ assumptions?", look for "volume discount", "bulk tier price", "stochastic demand", or "warehouse capacity limit". Standard EOQ strictly assumes none of these exist.',
        ruleOfThumb: 'Quantity discounts violate basic EOQ.'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming EOQ accounts for perishable shelf-life',
        whyItHappens: 'Real-world intuition thinks goods spoil.',
        howToAvoid: 'Standard EOQ assumes non-perishable goods with unlimited holding time.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Core Assumption Identification',
        problem: 'Which of the following is a fundamental assumption of the classical Economic Order Quantity (EOQ) model?',
        options: [
          'Demand rate is constant and known with certainty throughout the period',
          'Suppliers offer bulk quantity discounts for large lot sizes',
          'Shortages and stockouts are permitted at a fixed penalty cost',
          'Holding cost per unit decreases as inventory levels increase'
        ],
        correctIndex: 0,
        explanation: 'The classic EOQ model strictly assumes constant, deterministic demand. Bulk discounts, planned stockouts, and variable unit holding costs all violate basic EOQ assumptions.',
        steps: [
          'Step 1: Review 7 core assumptions.',
          'Step 2: Constant, known demand is the foundational premise.'
        ],
        examTrick: 'Constant, predictable demand is always the correct assumption.'
      },
      {
        difficulty: 'Medium',
        title: 'Replenishment Mechanism in EOQ',
        problem: 'How does inventory arrive according to the standard EOQ model?',
        options: [
          'The entire order quantity Q arrives instantaneously in a single batch',
          'Goods arrive gradually at a continuous production rate p',
          'Items arrive randomly according to a Poisson distribution',
          'Shipments arrive in staggered weekly intervals over the cycle'
        ],
        correctIndex: 0,
        explanation: 'Standard EOQ assumes instantaneous batch replenishment (lead time is either zero or completely predictable, with the entire batch Q delivered at once, creating a vertical step on the sawtooth graph). Gradual arrival is the Economic Production Quantity (EPQ) model.',
        steps: [
          'Step 1: Note the sawtooth graph vertical rise.',
          'Step 2: Instantaneous receipt of entire batch Q.'
        ],
        examTrick: 'Instant delivery = vertical line on sawtooth chart.'
      },
      {
        difficulty: 'Hard',
        title: 'Assumption Violation Implication',
        problem: 'A company faces seasonal demand where sales peak in Q4 and are low in Q1. If they blindly apply a single annual EOQ lot size throughout the entire year, what will happen in Q1?',
        options: [
          'Inventory will turn over very slowly, resulting in excessive holding costs and overstocking',
          'Frequent stockouts will occur due to high sales velocity',
          'Ordering costs will exceed holding costs in Q1',
          'The optimal order quantity will automatically adjust to 0'
        ],
        correctIndex: 0,
        explanation: 'In Q1, actual demand is far below the annual average D. Ordering a batch sized for the annual average means stock will sit in the warehouse for months, incurring massive holding costs and tying up working capital.',
        steps: [
          'Step 1: In Q1, real demand D_q1 << D_annual.',
          'Step 2: High order size Q leads to extended cycle time T = Q / D_q1.',
          'Step 3: Slow inventory turnover = excessive holding costs.'
        ],
        examTrick: 'Low demand period + fixed high lot size = overstocking & excessive holding costs.'
      }
    ]
  },

  'eoq-cost-components': {
    id: 'eoq-cost-components',
    title: 'Inventory Cost Components & Trade-Offs',
    submodule: 'Optimal Order Quantity',
    module: 'Subject Module',
    overview: `Total annual inventory cost consists of two opposing cost components:
1. Annual Ordering Costs (Setup Costs):
Cost of placing purchase orders (paperwork, freight, inspection).
C_{\\text{order}} = \\frac{D}{Q} \\cdot S
• As Q increases, number of orders (D/Q) decreases, and ordering costs FALL.
2. Annual Holding Costs (Carrying Costs):
Cost of financing capital, warehouse space, insurance, obsolescence.
C_{\\text{hold}} = \\frac{Q}{2} \\cdot H
• As Q increases, average inventory (Q/2) increases, and holding costs RISE.
The optimal point balances these two opposing forces.`,
    principles: [
      'Orders per Year: N = D / Q.',
      'Average Inventory: \\bar{I} = Q / 2.',
      'Holding Cost Rate: H is often given as a percentage of purchase price P: H = h_r · P.',
      'Cost Trade-Off: Ordering costs \\propto 1/Q; Holding costs \\propto Q.'
    ],
    formulas: [
      'C_{\\text{order}} = \\frac{D}{Q} \\cdot S',
      'C_{\\text{hold}} = \\frac{Q}{2} \\cdot H',
      'C_{\\text{total}} = \\frac{D}{Q} S + \\frac{Q}{2} H'
    ],
    examTricks: [
      {
        title: 'The Equal-Cost Property at Q*',
        description: `At the exact optimal order quantity Q*, annual ordering cost and annual holding cost are EXACTLY EQUAL:
C_order(Q*) = C_hold(Q*)!
Total minimum cost is simply 2 × C_order(Q*).`,
        ruleOfThumb: 'At optimal Q*: Ordering Cost = Holding Cost.'
      }
    ],
    commonTraps: [
      {
        trap: 'Multiplying holding cost H by the entire order quantity Q',
        whyItHappens: 'Writing Q × H instead of (Q/2) × H.',
        howToAvoid: 'The warehouse does not hold Q units on average; it holds Q/2 on average.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Number of Orders Calculation',
        problem: 'Annual demand D = 1,200 units. If the order quantity Q = 300 units, how many orders are placed per year?',
        options: ['4 orders', '3 orders', '6 orders', '12 orders'],
        correctIndex: 0,
        explanation: 'N = D / Q = 1,200 / 300 = 4 orders per year.',
        steps: [
          'Step 1: Formula N = D / Q.',
          'Step 2: 1,200 / 300 = 4.'
        ],
        examTrick: '1200 ÷ 300 = 4 orders.'
      },
      {
        difficulty: 'Medium',
        title: 'Holding Cost Calculation with Interest Rate',
        problem: 'A company orders in batches of Q = 400 units. Unit purchase price P = €50. Annual inventory holding cost rate is 20% (0.20). What is the total annual holding cost?',
        options: ['€2,000', '€4,000', '€1,000', '€5,000'],
        correctIndex: 0,
        explanation: 'Unit holding cost H = 20% × €50 = €10 per unit/year. Average inventory = Q / 2 = 400 / 2 = 200 units. Total annual holding cost = 200 units × €10 = €2,000.',
        steps: [
          'Step 1: H = 0.20 × 50 = €10 / unit / year.',
          'Step 2: Average inventory = 400 / 2 = 200 units.',
          'Step 3: Total holding cost = 200 × €10 = €2,000.'
        ],
        examTrick: '(400 / 2) × (0.20 × 50) = 200 × 10 = €2,000.'
      },
      {
        difficulty: 'Hard',
        title: 'Suboptimal Batch Cost Penalty',
        problem: 'For an item, optimal Q* = 200 units, where annual ordering costs are €1,000 and holding costs are €1,000 (total = €2,000). If the manager orders Q = 400 units instead (doubling order size), what will be the new total cost?',
        options: ['€2,500', '€4,000', '€2,000', '€3,000'],
        correctIndex: 0,
        explanation: 'If Q doubles to 400: Number of orders halves → C_order = €1,000 / 2 = €500. Average inventory doubles → C_hold = €1,000 × 2 = €2,000. New Total Cost = €500 + €2,000 = €2,500.',
        steps: [
          'Step 1: Ordering cost halves: €1,000 ÷ 2 = €500.',
          'Step 2: Holding cost doubles: €1,000 × 2 = €2,000.',
          'Step 3: New total = €500 + €2,000 = €2,500.'
        ],
        examTrick: 'Doubling Q: cost becomes (0.5 + 2)/2 = 1.25 × original = €2,500.'
      }
    ]
  },

  'eoq-formula': {
    id: 'eoq-formula',
    title: 'The Andler EOQ Formula Calculation',
    submodule: 'Optimal Order Quantity',
    module: 'Subject Module',
    overview: `The Economic Order Quantity formula (Andler formula) finds the global minimum of the total cost function:
Q^* = \\sqrt{\\frac{2 \\cdot D \\cdot S}{H}}
Where:
• D = Annual Demand (units/year)
• S = Ordering cost per order (€/order)
• H = Holding cost per unit per year (€/unit/year)
Because this formula involves a square root, dMAT questions are designed with values that produce clean perfect squares (e.g., √40,000 = 200, √10,000 = 100, √2,500 = 50, √90,000 = 300).`,
    principles: [
      'Square Root Law: Q* scales with the square root of demand and ordering cost.',
      'Denominator Effect: Higher holding cost H reduces the optimal lot size Q*.',
      'Derivation: Set derivative \\frac{dC}{dQ} = -\\frac{DS}{Q^2} + \\frac{H}{2} = 0 \\implies Q^2 = \\frac{2DS}{H}.'
    ],
    formulas: [
      'Q^* = \\sqrt{\\frac{2DS}{H}}'
    ],
    examTricks: [
      {
        title: 'The "Factor-Out Zeros" Square Root Trick',
        description: `When computing \\sqrt{\\frac{2 \\times 1000 \\times 20}{1}} = \\sqrt{40,000}:
Count the zeros! 4 zeros inside a square root become 2 zeros outside: \\sqrt{4} = 2, and 4 zeros → 2 zeros = 200! Never do long-form arithmetic.`,
        ruleOfThumb: 'Pair zeros: √40,000 = 200; √90,000 = 300; √1,000,000 = 1,000.'
      }
    ],
    commonTraps: [
      {
        trap: 'Forgetting the factor of 2 in the numerator',
        whyItHappens: 'Calculating √(DS/H) instead of √(2DS/H).',
        howToAvoid: 'The "2" comes from the average inventory Q/2 in the denominator derivative. Always multiply DS by 2!'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Direct EOQ Calculation',
        problem: 'Annual demand D = 1,000 units. Ordering cost S = €20 per order. Holding cost H = €1 per unit/year. What is the optimal order quantity Q*?',
        options: ['200 units', '141 units', '400 units', '100 units'],
        correctIndex: 0,
        explanation: 'Q* = √(2 × 1,000 × 20 / 1) = √(40,000) = 200 units.',
        steps: [
          'Step 1: 2 × D × S = 2 × 1,000 × 20 = 40,000.',
          'Step 2: Divide by H = 1: 40,000 / 1 = 40,000.',
          'Step 3: Square root: √40,000 = 200 units.'
        ],
        examTrick: '√(40,000) = 200.'
      },
      {
        difficulty: 'Medium',
        title: 'EOQ with Percentage Holding Cost',
        problem: 'Annual demand D = 2,400 units. Ordering cost S = €75. Unit price P = €10. Carrying cost rate is 25% per year. What is Q*?',
        options: ['379 units', '380 units', '300 units', '400 units'],
        correctIndex: 0,
        explanation: 'Holding cost H = 25% of €10 = €2.50. 2DS / H = (2 × 2,400 × 75) / 2.50 = 360,000 / 2.50 = 144,000. Q* = √144,000 = √(144 × 1,000) ≈ 379.47 units. (If D = 2,400, S = €75, H = 2.5: 2 × 2,400 = 4,800; 4,800 × 75 = 360,000; 360,000 / 2.5 = 144,000; √144,000 ≈ 379.5 ≈ 380 units).',
        steps: [
          'Step 1: H = 0.25 × 10 = €2.50.',
          'Step 2: 2 × 2,400 × 75 / 2.5 = 144,000.',
          'Step 3: √144,000 ≈ 380 units.'
        ],
        examTrick: '√144 = 12 → √144,000 is slightly below 400 (≈ 380).'
      },
      {
        difficulty: 'Hard',
        title: 'Solving for Unknown Ordering Cost S',
        problem: 'An inventory manager found that the optimal order quantity Q* is 300 units for an annual demand of D = 9,000 units with unit holding cost H = €4. What is the fixed ordering cost S?',
        options: ['€20', '€40', '€10', '€50'],
        correctIndex: 0,
        explanation: 'Q*² = 2DS / H → (300)² = (2 × 9,000 × S) / 4 → 90,000 = (18,000S) / 4 → 90,000 = 4,500S → S = 90,000 / 4,500 = 20.',
        steps: [
          'Step 1: Square Q*: 300² = 90,000.',
          'Step 2: Formula rearranged: S = (Q*² × H) / (2D).',
          'Step 3: S = (90,000 × 4) / (2 × 9,000) = 360,000 / 18,000 = 20.'
        ],
        examTrick: 'Cancel 9,000: (90,000 / 9,000) × (4 / 2) = 10 × 2 = €20.'
      }
    ]
  },

  'eoq-average-inventory': {
    id: 'eoq-average-inventory',
    title: 'Average Inventory, Order Cycle Time & Turnover',
    submodule: 'Optimal Order Quantity',
    module: 'Subject Module',
    overview: `Once the lot size Q is determined, several key operational metrics follow:
1. Average Inventory Level:
Because inventory drops linearly from Q to 0 at a constant rate, the average inventory held in stock is:
\\bar{I} = \\frac{Q}{2}
2. Cycle Time (Time Between Orders):
Fraction of a year between consecutive replenishment orders:
T = \\frac{Q}{D} \\text{ (in years)} = \\frac{Q}{D} \\cdot 360 \\text{ (in working days)}
3. Inventory Turnover Ratio:
Turnover = \\frac{D}{\\bar{I}} = \\frac{D}{Q/2} = 2 \\cdot \\frac{D}{Q}`,
    principles: [
      'Average Inventory is Q/2: Exactly half the order quantity.',
      'Cycle Length: T = 360 · (Q / D) working days.',
      'Reorder Point (ROP): ROP = d · L, where d = daily demand and L = lead time in days.'
    ],
    formulas: [
      '\\bar{I} = \\frac{Q}{2}, \\quad T_{\\text{days}} = \\frac{Q}{D} \\times 360, \\quad \\text{Turnover} = \\frac{2D}{Q}'
    ],
    examTricks: [
      {
        title: 'Working Year 360 vs 365 Days',
        description: 'dMAT questions in German academic business literature routinely use 360 days (or 50 weeks / 250 working days) for clean division. Always look at the options to see if they divide cleanly by 360.',
        ruleOfThumb: 'Use 360 days for daily demand calculations unless specified.'
      }
    ],
    commonTraps: [
      {
        trap: 'Confusing Cycle Time with Lead Time',
        whyItHappens: 'Both are measured in days.',
        howToAvoid: 'Lead time is delivery delay; cycle time is the total duration a batch lasts.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Average Stock Calculation',
        problem: 'A warehouse orders widgets in batches of 500 units. What is the average inventory level in the warehouse?',
        options: ['250 units', '500 units', '125 units', '100 units'],
        correctIndex: 0,
        explanation: 'Average inventory = Q / 2 = 500 / 2 = 250 units.',
        steps: [
          'Step 1: Formula \\bar{I} = Q / 2.',
          'Step 2: 500 / 2 = 250 units.'
        ],
        examTrick: 'Divide batch size by 2: 500 ÷ 2 = 250.'
      },
      {
        difficulty: 'Medium',
        title: 'Order Cycle Time in Days',
        problem: 'Annual demand is D = 3,600 units. A company orders in batches of Q = 300 units. Assuming 360 working days per year, how many days elapse between orders?',
        options: ['30 days', '12 days', '25 days', '36 days'],
        correctIndex: 0,
        explanation: 'Number of orders per year = 3,600 / 300 = 12 orders. Cycle time = 360 days / 12 orders = 30 days per order.',
        steps: [
          'Step 1: Orders per year = 3,600 / 300 = 12.',
          'Step 2: Days between orders = 360 / 12 = 30 days.'
        ],
        examTrick: '360 ÷ 12 = 30 days.'
      },
      {
        difficulty: 'Hard',
        title: 'Reorder Point with Safety Stock',
        problem: 'Daily demand is 20 units/day. Supplier lead time is 5 days. The company maintains a safety stock buffer of 40 units. At what inventory level must the reorder be placed?',
        options: ['140 units', '100 units', '60 units', '80 units'],
        correctIndex: 0,
        explanation: 'Reorder Point (ROP) = (Daily Demand × Lead Time) + Safety Stock = (20 units/day × 5 days) + 40 units = 100 + 40 = 140 units.',
        steps: [
          'Step 1: Lead time demand = 20 × 5 = 100 units.',
          'Step 2: Add safety stock: 100 + 40 = 140 units.'
        ],
        examTrick: '(20 × 5) + 40 = 140 units.'
      }
    ]
  },

  'eoq-sensitivity': {
    id: 'eoq-sensitivity',
    title: 'Sensitivity Analysis & The Square Root Law',
    submodule: 'Optimal Order Quantity',
    module: 'Subject Module',
    overview: `Sensitivity analysis in EOQ examines how changes in parameters (D, S, H) affect the optimal order quantity Q* and total cost:
Because Q^* = \\sqrt{\\frac{2DS}{H}}, any percentage change inside the radical produces a SQUARE ROOT effect on Q*:
• Quadrupling Demand (4× D) → Doubles Q* (\\sqrt{4} = 2).
• Doubling Ordering Cost (2× S) → Increases Q* by \\sqrt{2} \\approx 1.414 (+41.4%).
• Quadrupling Holding Cost (4× H) → Halves Q* (1 / \\sqrt{4} = 1/2).
Furthermore, the total cost curve is remarkably flat around Q*: ordering 20% above or below Q* only increases total costs by ~1.6%!`,
    principles: [
      'Square Root Rule: Doubling a numerator parameter increases Q* by ~41% (√2), NOT 100%.',
      'Cost Insensitivity: Modest estimation errors in D or S cause negligible total cost increases.',
      'Economies of Scale: As demand quadruples, inventory costs only double.'
    ],
    formulas: [
      'Q^*_{\\text{new}} = Q^*_{\\text{old}} \\cdot \\sqrt{\\frac{D_{\\text{new}}}{D_{\\text{old}}}}'
    ],
    examTricks: [
      {
        title: 'The 4x = 2x Rule',
        description: 'Whenever a parameter quadruples (4x), its impact on Q* is 2x. If demand quadruples, Q* doubles. If holding cost quadruples, Q* is cut in half.',
        ruleOfThumb: '4x inside square root = 2x outside.'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming linear proportionality',
        whyItHappens: 'Thinking that doubling demand doubles the optimal order quantity.',
        howToAvoid: 'Remember the square root: doubling demand increases Q* by √2 (≈ 1.41), NOT 2!'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Quadrupled Demand Impact',
        problem: 'If annual demand D quadruples (increases by 400% from D to 4D) while ordering and holding costs remain unchanged, what happens to the optimal order quantity Q*?',
        options: ['Q* doubles (increases by 2x)', 'Q* quadruples (increases by 4x)', 'Q* remains unchanged', 'Q* increases by 16x'],
        correctIndex: 0,
        explanation: 'Q* = √(2(4D)S / H) = √4 × √(2DS / H) = 2 × Q*. The optimal order quantity exactly doubles.',
        steps: [
          'Step 1: Pull factor 4 outside the square root.',
          'Step 2: √4 = 2.',
          'Step 3: Q* doubles.'
        ],
        examTrick: '√4 = 2 → Q* doubles.'
      },
      {
        difficulty: 'Medium',
        title: 'Holding Cost Halving Effect',
        problem: 'Due to improved warehouse efficiency, unit holding cost H is reduced to one-fourth (H / 4). What happens to Q*?',
        options: ['Q* doubles', 'Q* quadruples', 'Q* is halved', 'Q* is quartered'],
        correctIndex: 0,
        explanation: 'H is in the denominator: Q* = √(2DS / (H/4)) = √(4 × 2DS / H) = 2 × √(2DS / H). Q* doubles.',
        steps: [
          'Step 1: Dividing denominator by 4 multiplies numerator by 4.',
          'Step 2: √4 = 2.',
          'Step 3: Q* doubles.'
        ],
        examTrick: 'Quartered denominator = quadrupled fraction = √4 = 2x.'
      },
      {
        difficulty: 'Hard',
        title: 'Simultaneous Parameter Shift',
        problem: 'Demand D increases by a factor of 9, while ordering cost S is reduced to 1/4 of its original value. How does Q* change?',
        options: ['Q* increases by a factor of 1.5 (3/2)', 'Q* increases by 9/4 = 2.25', 'Q* increases by a factor of 3', 'Q* decreases'],
        correctIndex: 0,
        explanation: 'Inside the radical, the product D × S changes by a factor of 9 × (1/4) = 9/4. The change in Q* is √(9/4) = 3/2 = 1.5. Thus Q* increases by 1.5 times (50% increase).',
        steps: [
          'Step 1: Net factor inside radical = 9 × (1/4) = 9/4.',
          'Step 2: Take square root: √(9/4) = 3/2 = 1.5.',
          'Step 3: Q* becomes 1.5 times original.'
        ],
        examTrick: '√(9/4) = 3/2 = 1.5.'
      }
    ]
  },

  'eoq-cost-curves': {
    id: 'eoq-cost-curves',
    title: 'Interpreting Inventory Cost Curves',
    submodule: 'Optimal Order Quantity',
    module: 'Subject Module',
    overview: `Visualizing the inventory cost curves is a core competency in dMAT economics:
1. Annual Ordering Cost Curve: A decreasing hyperbola (y = A / x). As lot size Q → ∞, ordering costs approach 0.
2. Annual Holding Cost Curve: A straight line through the origin (y = B · x) with slope H/2.
3. Total Cost Curve: A convex U-shaped curve:
C_{\\text{total}}(Q) = \\frac{DS}{Q} + \\frac{HQ}{2}
The minimum point on the Total Cost curve occurs PRECISELY at the intersection of the ordering cost curve and the holding cost curve:
C_{\\text{order}}(Q^*) = C_{\\text{hold}}(Q^*)`,
    principles: [
      'Intersection Principle: The minimum total cost is located exactly where the ordering cost curve intersects the holding cost line.',
      'Asymptotes: Total cost approaches ∞ as Q → 0 (infinite ordering costs) and as Q → ∞ (infinite holding costs).',
      'Flat Optimum: The U-shape is relatively flat near Q*, showing robustness against minor demand estimation errors.'
    ],
    formulas: [
      '\\text{At } Q = Q^*: \\quad C_{\\text{order}} = C_{\\text{hold}} = \\sqrt{\\frac{DSH}{2}}',
      'C_{\\text{total, min}} = 2 \\cdot C_{\\text{order}}(Q^*) = \\sqrt{2DSH}'
    ],
    examTricks: [
      {
        title: 'The Intersection Minimum Rule',
        description: 'If a diagram displays cost curves, find the exact point where the downward curve (ordering cost) crosses the straight upward line (holding cost). Drop a vertical line to the x-axis: that is Q*!',
        ruleOfThumb: 'Intersection point = Minimum total cost.'
      }
    ],
    commonTraps: [
      {
        trap: 'Thinking the total cost curve is symmetric',
        whyItHappens: 'It looks like a parabola, but it is skewed (approaches ∞ much faster as Q → 0 than as Q → ∞).',
        howToAvoid: 'Ordering too little is much more expensive than ordering too much.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Cost Curve Identification',
        problem: 'In a standard EOQ cost curve diagram with lot size Q on the x-axis, which curve is represented by a straight line passing through the origin (0,0)?',
        options: ['Annual Holding Cost', 'Annual Ordering Cost', 'Total Inventory Cost', 'Unit Purchase Price'],
        correctIndex: 0,
        explanation: 'Holding cost C_hold = (H/2) · Q is a linear equation with slope H/2 passing through the origin (0,0).',
        steps: [
          'Step 1: Formula C_hold = (H/2) × Q.',
          'Step 2: Linear function of Q passing through origin.'
        ],
        examTrick: 'Straight line through (0,0) is always Holding Cost.'
      },
      {
        difficulty: 'Medium',
        title: 'Cost Equivalence at Optimum',
        problem: 'A company calculates that at its optimal order quantity Q*, annual holding cost is €4,500. What is the annual ordering cost at this same optimal quantity?',
        options: ['€4,500', '€9,000', '€2,250', 'Cannot be determined without knowing S'],
        correctIndex: 0,
        explanation: 'A fundamental mathematical property of the EOQ model is that at the optimal lot size Q*, annual ordering cost and annual holding cost are strictly EQUAL. Thus, ordering cost is also €4,500 (and total cost is €9,000).',
        steps: [
          'Step 1: Recall the intersection principle.',
          'Step 2: At Q*, C_order = C_hold.',
          'Step 3: Therefore C_order = €4,500.'
        ],
        examTrick: 'At Q*, Ordering Cost = Holding Cost = €4,500.'
      },
      {
        difficulty: 'Hard',
        title: 'Minimum Total Cost Closed Formula',
        problem: 'Given D = 5,000, S = €40, H = €4. What is the minimum total annual cost C_total(Q*)?',
        options: ['€4,000', '€2,000', '€8,000', '€5,000'],
        correctIndex: 0,
        explanation: 'Direct formula: C_total,min = √(2DSH) = √(2 × 5,000 × 40 × 4) = √(1,600,000) = €4,000. Alternatively: Q* = √(2 × 5000 × 40 / 4) = √100,000 = 316.2. Holding cost = (316.2/2) × 4 = €2,000. Ordering cost = (5000/316.2) × 40 = €2,000. Total = €2,000 + €2,000 = €4,000.',
        steps: [
          'Step 1: Formula C_min = √(2DSH).',
          'Step 2: 2 × 5,000 × 40 × 4 = 1,600,000.',
          'Step 3: √1,600,000 = €4,000.'
        ],
        examTrick: 'Direct minimum cost formula: √(2 × D × S × H) = √1,600,000 = €4,000.'
      }
    ]
  }
};
