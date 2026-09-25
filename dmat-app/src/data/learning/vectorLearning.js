// Vector Calculations In-Depth Learning Content
// Covers all 10 official dMAT Vector subtopics with theory, formulas, exam tricks, and 3 difficulty-graded examples.

export const VECTOR_SUBTOPICS = {
  'vc-vector-basics': {
    id: 'vc-vector-basics',
    title: 'Vector Basics & Coordinate Systems',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `A vector represents a quantity possessing both magnitude and direction. In dMAT, vectors are represented in 2D and 3D Euclidean spaces as column vectors or tuples: \\vec{a} = (a_x, a_y, a_z)^T. Unlike pure geometric rays, position vectors are anchored to the coordinate origin (0, 0, 0). Understanding the coordinate axes and standard basis vectors \\vec{i}, \\vec{j}, \\vec{k} is essential for all operations.`,
    principles: [
      'Components: Each element represents displacement along the corresponding axis.',
      'Dimension: 2D vectors have 2 components (x, y); 3D vectors have 3 (x, y, z).',
      'Zero Vector: \\vec{0} = (0, 0, 0) has magnitude 0 and undefined direction.',
      'Equality: \\vec{a} = \\vec{b} \\iff a_x = b_x \\land a_y = b_y \\land a_z = b_z.'
    ],
    formulas: [
      '\\vec{v} = v_x\\hat{i} + v_y\\hat{j} + v_z\\hat{k} = \\begin{pmatrix} v_x \\\\ v_y \\\\ v_z \\end{pmatrix}'
    ],
    examTricks: [
      {
        title: 'Component Inspection Trick',
        description: 'Always check if any component is zero. A zero component drastically simplifies dot products, cross products, and magnitudes.',
        ruleOfThumb: 'Vectors with zero components save 70% calculation time.'
      }
    ],
    commonTraps: [
      {
        trap: 'Confusing vector components with points',
        whyItHappens: 'Both are written as (x, y, z).',
        howToAvoid: 'A point is a fixed location; a vector represents direction and magnitude.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Component Identification',
        problem: 'Given the vector \\vec{a} = 3\\hat{i} - 4\\hat{k}, what is its y-component a_y?',
        options: ['0', '-4', '3', '1'],
        correctIndex: 0,
        explanation: 'The standard basis representation is \\vec{a} = a_x\\hat{i} + a_y\\hat{j} + a_z\\hat{k}. Since the \\hat{j} term is absent, a_y = 0.',
        steps: [
          'Step 1: Check coefficients: \\hat{i} = 3, \\hat{j} = absent, \\hat{k} = -4.',
          'Step 2: Absent unit vector means component is 0.',
          'Step 3: a_y = 0.'
        ],
        examTrick: 'Missing unit vector always implies 0 component.'
      },
      {
        difficulty: 'Medium',
        title: 'Vector Between Two Points',
        problem: 'Find the vector \\vec{AB} pointing from point A(2, -1, 3) to point B(5, 3, -1).',
        options: ['(3, 4, -4)', '(7, 2, 2)', '(-3, -4, 4)', '(3, 2, -4)'],
        correctIndex: 0,
        explanation: '\\vec{AB} = B - A = (5 - 2, 3 - (-1), -1 - 3) = (3, 4, -4).',
        steps: [
          'Step 1: Formula \\vec{AB} = B - A.',
          'Step 2: x = 5 - 2 = 3.',
          'Step 3: y = 3 - (-1) = 4.',
          'Step 4: z = -1 - 3 = -4.',
          'Step 5: Result is (3, 4, -4).'
        ],
        examTrick: 'Always subtract Destination minus Origin: B - A.'
      },
      {
        difficulty: 'Hard',
        title: 'Vector Linear Dependence Condition',
        problem: 'For what value of k are the vectors \\vec{u} = (2, -4, 6) and \\vec{v} = (-3, 6, k) parallel?',
        options: ['-9', '9', '-6', '6'],
        correctIndex: 0,
        explanation: 'Vectors are parallel if \\vec{v} = c\\vec{u}. Looking at x-components: -3 = c(2) → c = -1.5. Checking y: 6 = -1.5(-4) = 6 (consistent). Therefore k = c(6) = -1.5(6) = -9.',
        steps: [
          'Step 1: Find scalar ratio: c = -3 / 2 = -1.5.',
          'Step 2: Verify y-component: -4 × (-1.5) = 6.',
          'Step 3: Calculate k: 6 × (-1.5) = -9.'
        ],
        examTrick: 'Ratio of components must be equal: -3/2 = 6/-4 = k/6 → k = -9.'
      }
    ]
  },

  'vc-addition-subtraction': {
    id: 'vc-addition-subtraction',
    title: 'Vector Addition & Subtraction',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `Vector addition and subtraction are performed component-wise: (a_x ± b_x, a_y ± b_y, a_z ± b_z). Geometrically, vector addition corresponds to placing vectors head-to-tail, with the resultant vector pointing from the tail of the first to the head of the second. Vector subtraction \\vec{a} - \\vec{b} is equivalent to adding the negative vector: \\vec{a} + (-\\vec{b}).`,
    principles: [
      'Component-wise Operation: Work along x, y, and z independently.',
      'Commutativity: \\vec{a} + \\vec{b} = \\vec{b} + \\vec{a}.',
      'Non-commutative Subtraction: \\vec{a} - \\vec{b} = -(\\vec{b} - \\vec{a}).',
      'Triangle Inequality: |\\vec{a} + \\vec{b}| \\leq |\\vec{a}| + |\\vec{b}|.'
    ],
    formulas: [
      '\\vec{a} \\pm \\vec{b} = \\begin{pmatrix} a_x \\pm b_x \\\\ a_y \\pm b_y \\\\ a_z \\pm b_z \\end{pmatrix}'
    ],
    examTricks: [
      {
        title: 'Single-Component Elimination',
        description: 'Calculate ONLY the x-component first. If the 4 answer options have distinct x-components, you can choose the correct option in 3 seconds without calculating y and z.',
        ruleOfThumb: 'Scan options first to see which component differentiates them.'
      }
    ],
    commonTraps: [
      {
        trap: 'Double negative errors in subtraction',
        whyItHappens: 'Computing a_y - b_y when b_y is negative: 3 - (-2) mistaken as 1.',
        howToAvoid: 'Remember that minus a negative is ALWAYS a positive: 3 - (-2) = 5.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Direct 2D Addition',
        problem: 'Compute \\vec{u} + \\vec{v} where \\vec{u} = (3, -2) and \\vec{v} = (5, 7).',
        options: ['(8, 5)', '(8, -9)', '(2, 5)', '(-2, 9)'],
        correctIndex: 0,
        explanation: 'Add components: x = 3 + 5 = 8; y = -2 + 7 = 5. Result: (8, 5).',
        steps: [
          'Step 1: x = 3 + 5 = 8.',
          'Step 2: y = -2 + 7 = 5.',
          'Step 3: Combine: (8, 5).'
        ],
        examTrick: 'x is 8. Only one option has x = 8 and y = 5.'
      },
      {
        difficulty: 'Medium',
        title: '3D Subtraction with Negative Signs',
        problem: 'Given \\vec{a} = (4, -3, 2) and \\vec{b} = (-2, 5, -1), compute \\vec{a} - \\vec{b}.',
        options: ['(6, -8, 3)', '(2, 2, 1)', '(6, 2, 3)', '(2, -8, 1)'],
        correctIndex: 0,
        explanation: 'x = 4 - (-2) = 6; y = -3 - 5 = -8; z = 2 - (-1) = 3. Result: (6, -8, 3).',
        steps: [
          'Step 1: x = 4 - (-2) = 6.',
          'Step 2: y = -3 - 5 = -8.',
          'Step 3: z = 2 - (-1) = 3.'
        ],
        examTrick: 'Watch double negatives: 4 - (-2) = 6, and 2 - (-1) = 3.'
      },
      {
        difficulty: 'Hard',
        title: 'Three-Vector Resultant with Linear Combination',
        problem: 'Given \\vec{u} = (1, 2, 0), \\vec{v} = (-2, 1, 3), \\vec{w} = (3, -1, 2), find \\vec{u} - 2\\vec{v} + \\vec{w}.',
        options: ['(8, -1, -4)', '(6, 1, -4)', '(8, 1, 4)', '(4, -1, -4)'],
        correctIndex: 0,
        explanation: 'x = 1 - 2(-2) + 3 = 1 + 4 + 3 = 8. y = 2 - 2(1) + (-1) = 2 - 2 - 1 = -1. z = 0 - 2(3) + 2 = -6 + 2 = -4. Result: (8, -1, -4).',
        steps: [
          'Step 1: x = 1 + 4 + 3 = 8. (Eliminates Option B and D).',
          'Step 2: y = 2 - 2 - 1 = -1.',
          'Step 3: z = -6 + 2 = -4.',
          'Step 4: Result: (8, -1, -4).'
        ],
        examTrick: 'Compute x = 8 first. Only options A and C remain. Then y = -1 confirms Option A.'
      }
    ]
  },

  'vc-scalar-multiplication': {
    id: 'vc-scalar-multiplication',
    title: 'Scalar Multiplication',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `Multiplying a vector by a scalar c multiplies each component by c: c\\vec{a} = (c a_x, c a_y, c a_z).
• If c > 1: Vector stretches in the same direction.
• If 0 < c < 1: Vector shrinks in the same direction.
• If c < 0: Vector reverses direction by 180° and scales by |c|.`,
    principles: [
      'Distributive Property: c(\\vec{a} + \\vec{b}) = c\\vec{a} + c\\vec{b}.',
      'Magnitude Scaling: |c\\vec{a}| = |c| \\cdot |\\vec{a}|.',
      'Sign Inversion: Negative scalar reverses the arrow direction.'
    ],
    formulas: [
      'c\\vec{a} = \\begin{pmatrix} c a_x \\\\ c a_y \\\\ c a_z \\end{pmatrix}, \\quad |c\\vec{a}| = |c| |\\vec{a}|'
    ],
    examTricks: [
      {
        title: 'Negative Scalar Sign Flip',
        description: 'When multiplying by a negative scalar, ALL components must change signs. If an option retains the original sign on any component, cross it off immediately.',
        ruleOfThumb: 'Negative scalar flips all component signs.'
      }
    ],
    commonTraps: [
      {
        trap: 'Multiplying only the first component',
        whyItHappens: 'Rushing through mental math and writing (c a_x, a_y, a_z).',
        howToAvoid: 'Scalar multiplication distributes to EVERY component.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Basic Scaling',
        problem: 'Multiply \\vec{v} = (3, -4, 2) by scalar c = -2.',
        options: ['(-6, 8, -4)', '(6, -8, 4)', '(-6, -8, -4)', '(1, -2, 0)'],
        correctIndex: 0,
        explanation: 'Multiply each component by -2: 3(-2) = -6; -4(-2) = 8; 2(-2) = -4. Result: (-6, 8, -4).',
        steps: [
          'Step 1: x = 3 × (-2) = -6.',
          'Step 2: y = -4 × (-2) = 8.',
          'Step 3: z = 2 × (-2) = -4.'
        ],
        examTrick: 'Sign flip: (+, -, +) becomes (-, +, -).'
      },
      {
        difficulty: 'Medium',
        title: 'Magnitude After Scaling',
        problem: 'If |\\vec{u}| = 5, what is the magnitude of the vector -3\\vec{u}?',
        options: ['15', '-15', '5', '8'],
        correctIndex: 0,
        explanation: 'Magnitude is strictly non-negative: |-3\\vec{u}| = |-3| × |\\vec{u}| = 3 × 5 = 15.',
        steps: [
          'Step 1: Formula: |c\\vec{u}| = |c| × |\\vec{u}|.',
          'Step 2: Take absolute value of scalar: |-3| = 3.',
          'Step 3: 3 × 5 = 15.'
        ],
        examTrick: 'Magnitudes are NEVER negative! Instantly discard -15.'
      },
      {
        difficulty: 'Hard',
        title: 'Unit Vector Construction',
        problem: 'Find the unit vector \\hat{u} in the direction of \\vec{u} = (0, -3, 4).',
        options: ['(0, -3/5, 4/5)', '(0, -3, 4)', '(0, -1, 1)', '(0, 3/5, -4/5)'],
        correctIndex: 0,
        explanation: 'Magnitude |\\vec{u}| = √(0² + (-3)² + 4²) = √(9 + 16) = √25 = 5. Divide by 5: \\hat{u} = (0/5, -3/5, 4/5) = (0, -3/5, 4/5).',
        steps: [
          'Step 1: Recognize 3-4-5 Pythagorean triple → magnitude = 5.',
          'Step 2: Divide each component by 5.',
          'Step 3: Result is (0, -3/5, 4/5).'
        ],
        examTrick: '3-4-5 triangle means magnitude is 5. Divide components by 5.'
      }
    ]
  },

  'vc-magnitude': {
    id: 'vc-magnitude',
    title: 'Vector Magnitude & Euclidean Norm',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `The magnitude (or length / Euclidean norm) of a vector is calculated via the 3D Pythagorean theorem:
|\\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}
In dMAT, calculations are crafted to yield clean square roots (often using Pythagorean triples like 3-4-5, 5-12-13, 1-2-2 (length 3), and 2-3-6 (length 7)).`,
    principles: [
      'Non-Negativity: |\\vec{a}| \\geq 0 for all vectors; |\\vec{a}| = 0 \\iff \\vec{a} = \\vec{0}.',
      'Squared Coordinates: Negative components become positive when squared.',
      'Pythagorean Triples in 3D: (1, 2, 2) → length 3; (2, 3, 6) → length 7; (1, 4, 8) → length 9.'
    ],
    formulas: [
      '|\\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}'
    ],
    examTricks: [
      {
        title: 'The 3D Pythagorean Triples Shortcut',
        description: `Memorize these 3D integer triples to solve magnitude questions in 1 second without squaring:
• 1² + 2² + 2² = 1 + 4 + 4 = 9 → Length = 3
• 2² + 3² + 6² = 4 + 9 + 36 = 49 → Length = 7
• 1² + 4² + 8² = 1 + 16 + 64 = 81 → Length = 9`,
        ruleOfThumb: 'Recognizing (2, 3, 6) gives magnitude 7 instantly.'
      }
    ],
    commonTraps: [
      {
        trap: 'Forgetting to take the square root',
        whyItHappens: 'Calculating a_x² + a_y² + a_z² = 25 and picking 25 instead of 5.',
        howToAvoid: 'Magnitude is length, always take √ of the sum of squares.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Basic 2D Magnitude',
        problem: 'Calculate the magnitude of \\vec{v} = (6, -8).',
        options: ['10', '14', '48', '√28'],
        correctIndex: 0,
        explanation: '|\\vec{v}| = √(6² + (-8)²) = √(36 + 64) = √100 = 10. (Scaled 3-4-5 triple: 2 × 5 = 10).',
        steps: [
          'Step 1: Square components: 6² = 36, (-8)² = 64.',
          'Step 2: Sum = 36 + 64 = 100.',
          'Step 3: Square root = √100 = 10.'
        ],
        examTrick: '(6, 8) is 2 × (3, 4) → length is 2 × 5 = 10.'
      },
      {
        difficulty: 'Medium',
        title: '3D Magnitude with Pythagorean Triple',
        problem: 'Find the length of vector \\vec{u} = (-2, 3, -6).',
        options: ['7', '11', '49', '√41'],
        correctIndex: 0,
        explanation: '|\\vec{u}| = √((-2)² + 3² + (-6)²) = √(4 + 9 + 36) = √49 = 7.',
        steps: [
          'Step 1: Ignore minus signs (squared values are positive).',
          'Step 2: 4 + 9 + 36 = 49.',
          'Step 3: √49 = 7.'
        ],
        examTrick: 'Classic 3D triple: 2, 3, 6 → magnitude 7.'
      },
      {
        difficulty: 'Hard',
        title: 'Parameter Finding for Desired Norm',
        problem: 'The vector \\vec{w} = (1, k, 2) has magnitude 3. What are the possible values of k?',
        options: ['k = ±2', 'k = ±4', 'k = 0', 'k = ±1'],
        correctIndex: 0,
        explanation: '|\\vec{w}|² = 1² + k² + 2² = 3² → 1 + k² + 4 = 9 → k² + 5 = 9 → k² = 4 → k = ±2.',
        steps: [
          'Step 1: Square both sides: 1 + k² + 4 = 9.',
          'Step 2: k² = 9 - 5 = 4.',
          'Step 3: k = ±2.'
        ],
        examTrick: 'Check 3D triple (1, 2, 2) has length 3! Therefore k = ±2.'
      }
    ]
  },

  'vc-scalar-product': {
    id: 'vc-scalar-product',
    title: 'Scalar Product (Dot Product)',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `The scalar product (dot product) of two vectors yields a real number (scalar), NOT a vector:
\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z
The fundamental geometric property tested in dMAT is orthogonality:
\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0 (for non-zero vectors).`,
    principles: [
      'Result is a Scalar: Never a vector.',
      'Orthogonality Test: \\vec{a} \\cdot \\vec{b} = 0 \\iff vectors are perpendicular (90°).',
      'Sign Interpretation: > 0 means acute angle (< 90°); < 0 means obtuse angle (> 90°).',
      'Self Dot Product: \\vec{a} \\cdot \\vec{a} = |\\vec{a}|^2.'
    ],
    formulas: [
      '\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z = |\\vec{a}||\\vec{b}|\\cos(\\varphi)'
    ],
    examTricks: [
      {
        title: 'The Perpendicular Parameter Hack',
        description: 'When asked "For what value of k are vectors perpendicular?", set dot product to 0: a_x b_x + a_y b_y + a_z b_z = 0. This gives a simple 1-step linear equation for k.',
        ruleOfThumb: 'Perpendicular means Dot Product = 0.'
      }
    ],
    commonTraps: [
      {
        trap: 'Producing a vector instead of a number',
        whyItHappens: 'Writing (a_x b_x, a_y b_y, a_z b_z).',
        howToAvoid: 'You must ADD the products together to get a single number.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Direct Dot Product Computation',
        problem: 'Compute \\vec{u} \\cdot \\vec{v} where \\vec{u} = (2, -3, 4) and \\vec{v} = (5, 2, -1).',
        options: ['0', '10', '24', '-4'],
        correctIndex: 0,
        explanation: '\\vec{u} \\cdot \\vec{v} = (2)(5) + (-3)(2) + (4)(-1) = 10 - 6 - 4 = 0. The vectors are orthogonal!',
        steps: [
          'Step 1: 2 × 5 = 10.',
          'Step 2: -3 × 2 = -6.',
          'Step 3: 4 × (-1) = -4.',
          'Step 4: Sum = 10 - 6 - 4 = 0.'
        ],
        examTrick: '10 - 6 - 4 = 0. Solved in 5 seconds.'
      },
      {
        difficulty: 'Medium',
        title: 'Orthogonality Parameter',
        problem: 'For what value of k is \\vec{a} = (3, k, -2) perpendicular to \\vec{b} = (4, 2, 5)?',
        options: ['-1', '1', '2', '-2'],
        correctIndex: 0,
        explanation: 'Set \\vec{a} \\cdot \\vec{b} = 0: (3)(4) + (k)(2) + (-2)(5) = 0 → 12 + 2k - 10 = 0 → 2k + 2 = 0 → 2k = -2 → k = -1.',
        steps: [
          'Step 1: Dot product = 12 + 2k - 10.',
          'Step 2: 2k + 2 = 0.',
          'Step 3: 2k = -2 → k = -1.'
        ],
        examTrick: '12 - 10 = 2. 2 + 2k = 0 → k = -1.'
      },
      {
        difficulty: 'Hard',
        title: 'Angle Classification via Dot Product Sign',
        problem: 'Without calculating the exact angle, determine if the angle between \\vec{u} = (-3, 2, 5) and \\vec{v} = (4, 1, 1) is acute, right, or obtuse.',
        options: ['Obtuse (angle > 90°)', 'Acute (angle < 90°)', 'Right (angle = 90°)', 'Cannot be determined'],
        correctIndex: 0,
        explanation: 'Calculate \\vec{u} \\cdot \\vec{v} = (-3)(4) + (2)(1) + (5)(1) = -12 + 2 + 5 = -5. Because the dot product is negative (-5 < 0) and magnitudes are positive, cos(φ) < 0, which means φ is an obtuse angle (> 90°).',
        steps: [
          'Step 1: Dot product = -12 + 2 + 5 = -5.',
          'Step 2: Dot product < 0 → cos φ < 0.',
          'Step 3: cos φ < 0 in [0, π] implies φ > 90° (Obtuse).'
        ],
        examTrick: 'Negative dot product immediately means obtuse angle.'
      }
    ]
  },

  'vc-vector-product': {
    id: 'vc-vector-product',
    title: 'Vector Product (Cross Product)',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `The vector product (cross product) \\vec{a} \\times \\vec{b} produces a VECTOR that is perpendicular to BOTH \\vec{a} and \\vec{b}. Its direction follows the Right-Hand Rule, and its magnitude equals the area of the parallelogram spanned by the two vectors:
|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin(\\varphi)
Crucial rule: Cross product is anti-commutative: \\vec{b} \\times \\vec{a} = -(\\vec{a} \\times \\vec{b}).`,
    principles: [
      'Result is a Vector: Unlike dot product, output is in \\mathbb{R}^3.',
      'Mutual Perpendicularity: (\\vec{a} \\times \\vec{b}) \\cdot \\vec{a} = 0 and (\\vec{a} \\times \\vec{b}) \\cdot \\vec{b} = 0.',
      'Anti-commutativity: \\vec{a} \\times \\vec{b} = -(\\vec{b} \\times \\vec{a}).',
      'Parallel Vectors: \\vec{a} \\times \\vec{b} = \\vec{0} \\iff \\vec{a} \\parallel \\vec{b}.'
    ],
    formulas: [
      '\\vec{a} \\times \\vec{b} = \\begin{pmatrix} a_y b_z - a_z b_y \\\\ a_z b_x - a_x b_z \\\\ a_x b_y - a_y b_x \\end{pmatrix}'
    ],
    examTricks: [
      {
        title: 'The Dot-Check Verification Shortcut',
        description: 'Once you calculate a cross product result vector \\vec{c}, take a 2-second dot product \\vec{c} \\cdot \\vec{a}. If it does not equal 0, your cross product is wrong! This catches sign errors instantly.',
        ruleOfThumb: 'Dot product of your answer with vector a MUST be 0.'
      },
      {
        title: 'Basis Vector Wheel',
        description: 'i → j → k → i: i × j = k, j × k = i, k × i = j. Going backwards gives negative: j × i = -k.',
        ruleOfThumb: 'Clockwise cycle = positive basis cross product.'
      }
    ],
    commonTraps: [
      {
        trap: 'Sign error in the middle (y) component',
        whyItHappens: 'Forgetting that the y-component formula is a_z b_x - a_x b_z (or -(a_x b_z - a_z b_x)).',
        howToAvoid: 'Use the cyclic pattern: y·z - z·y, then z·x - x·z, then x·y - y·x.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Standard Basis Cross Product',
        problem: 'Compute \\hat{i} \\times \\hat{j}.',
        options: ['\\hat{k}', '-\\hat{k}', '0', '1'],
        correctIndex: 0,
        explanation: 'By the right-hand rule and definition of Cartesian basis vectors, \\hat{i} \\times \\hat{j} = \\hat{k}.',
        steps: [
          'Step 1: Recall cyclic order: i → j → k.',
          'Step 2: i cross j yields positive k.'
        ],
        examTrick: 'i × j = k; order is alphabetical.'
      },
      {
        difficulty: 'Medium',
        title: '3D Cross Product Calculation',
        problem: 'Compute \\vec{a} \\times \\vec{b} where \\vec{a} = (1, 2, 3) and \\vec{b} = (4, 5, 6).',
        options: ['(-3, 6, -3)', '(3, -6, 3)', '(-3, -6, -3)', '(0, 0, 0)'],
        correctIndex: 0,
        explanation: 'x = (2)(6) - (3)(5) = 12 - 15 = -3. y = (3)(4) - (1)(6) = 12 - 6 = 6. z = (1)(5) - (2)(4) = 5 - 8 = -3. Result: (-3, 6, -3).',
        steps: [
          'Step 1: x = 2(6) - 3(5) = 12 - 15 = -3.',
          'Step 2: y = 3(4) - 1(6) = 12 - 6 = 6.',
          'Step 3: z = 1(5) - 2(4) = 5 - 8 = -3.',
          'Step 4: Check orthogonality: (-3)(1) + (6)(2) + (-3)(3) = -3 + 12 - 9 = 0! Verified.'
        ],
        examTrick: 'Compute x = -3 first to eliminate Option B and D.'
      },
      {
        difficulty: 'Hard',
        title: 'Normal Vector to a Plane',
        problem: 'Find a normal vector perpendicular to the plane containing vectors \\vec{u} = (2, 0, 1) and \\vec{v} = (0, 3, 2).',
        options: ['(-3, -4, 6)', '(3, -4, -6)', '(-3, 4, 6)', '(6, 4, 3)'],
        correctIndex: 0,
        explanation: 'The normal vector is \\vec{n} = \\vec{u} \\times \\vec{v}. x = (0)(2) - (1)(3) = -3. y = (1)(0) - (2)(2) = -4. z = (2)(3) - (0)(0) = 6. Result: (-3, -4, 6). Check: (-3)(2) + (-4)(0) + (6)(1) = -6 + 6 = 0.',
        steps: [
          'Step 1: x = 0 - 3 = -3.',
          'Step 2: y = 0 - 4 = -4.',
          'Step 3: z = 6 - 0 = 6.',
          'Step 4: Normal vector = (-3, -4, 6).'
        ],
        examTrick: 'Check dot product with (2, 0, 1): -3(2) + 0 + 6(1) = 0. Instant verification!'
      }
    ]
  },

  'vc-triple-product': {
    id: 'vc-triple-product',
    title: 'Scalar Triple Product & Parallelepiped Volume',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `The scalar triple product of three vectors is defined as:
[\\vec{a} \\; \\vec{b} \\; \\vec{c}] = \\vec{a} \\cdot (\\vec{b} \\times \\vec{c})
Geometrically, its absolute value equals the volume of the parallelepiped spanned by the three vectors:
V = |\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})|
The volume of a tetrahedron spanned by the same three vectors is \\frac{1}{6} V.`,
    principles: [
      'Result is a Scalar: Output is a real number, not a vector.',
      'Cyclic Invariance: \\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\vec{b} \\cdot (\\vec{c} \\times \\vec{a}) = \\vec{c} \\cdot (\\vec{a} \\times \\vec{b}).',
      'Volume is Absolute Value: Volume cannot be negative; take |\\dots|.',
      'Tetrahedron Volume: V_{\\text{tet}} = \\frac{1}{6} V_{\\text{para}}.'
    ],
    formulas: [
      'V_{\\text{para}} = |\\det(\\vec{a}, \\vec{b}, \\vec{c})| = |\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})|',
      'V_{\\text{tetrahedron}} = \\frac{1}{6} |\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})|'
    ],
    examTricks: [
      {
        title: 'Determinant Expansion via Simplest Row',
        description: 'Expand the 3×3 matrix along the row or column containing the most zeros. If vector a has two zeros like (0, 0, 4), the volume is simply 4 × (2D cross product of b and c)!',
        ruleOfThumb: 'Always expand along the vector with the most zeros.'
      }
    ],
    commonTraps: [
      {
        trap: 'Reporting negative volume',
        whyItHappens: 'Determinant comes out as -24, picking -24 instead of +24.',
        howToAvoid: 'Geometric volume is ALWAYS positive: | -24 | = 24.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Parallelepiped on Coordinate Axes',
        problem: 'Find the volume of the parallelepiped spanned by \\vec{a} = (3, 0, 0), \\vec{b} = (0, 4, 0), and \\vec{c} = (0, 0, 5).',
        options: ['60', '12', '20', '30'],
        correctIndex: 0,
        explanation: 'Because vectors lie along the orthogonal axes, the parallelepiped is a rectangular box: V = 3 × 4 × 5 = 60.',
        steps: [
          'Step 1: V = |det| of diagonal matrix.',
          'Step 2: 3 × 4 × 5 = 60.'
        ],
        examTrick: 'Diagonal vectors simply multiply: 3 × 4 × 5 = 60.'
      },
      {
        difficulty: 'Medium',
        title: '3D Parallelepiped Volume',
        problem: 'Calculate the volume spanned by \\vec{a} = (1, 0, 0), \\vec{b} = (1, 2, 0), and \\vec{c} = (0, 1, 3).',
        options: ['6', '3', '2', '12'],
        correctIndex: 0,
        explanation: 'Compute \\vec{b} \\times \\vec{c}: (2·3 - 0·1, 0·0 - 1·3, 1·1 - 2·0) = (6, -3, 1). Now dot with \\vec{a} = (1, 0, 0): (1)(6) + (0)(-3) + (0)(1) = 6. Volume = |6| = 6.',
        steps: [
          'Step 1: Since \\vec{a} = (1, 0, 0), the dot product is simply the x-component of \\vec{b} \\times \\vec{c}.',
          'Step 2: x-component = b_y c_z - b_z c_y = (2)(3) - (0)(1) = 6.',
          'Step 3: V = 6.'
        ],
        examTrick: 'With \\vec{a} = (1,0,0), Volume is purely b_y c_z - b_z c_y = 6.'
      },
      {
        difficulty: 'Hard',
        title: 'Tetrahedron Volume from Vectors',
        problem: 'Calculate the volume of the tetrahedron spanned by \\vec{u} = (2, 0, 0), \\vec{v} = (0, 3, 0), and \\vec{w} = (0, 0, 4).',
        options: ['4', '24', '12', '8'],
        correctIndex: 0,
        explanation: 'Parallelepiped volume V_para = 2 × 3 × 4 = 24. A tetrahedron has volume \\frac{1}{6} V_para: V_tet = 24 / 6 = 4.',
        steps: [
          'Step 1: Compute box volume: 2 × 3 × 4 = 24.',
          'Step 2: Apply tetrahedron factor 1/6: 24 / 6 = 4.'
        ],
        examTrick: 'Tetrahedron is always 1/6 of box volume: 24 ÷ 6 = 4.'
      }
    ]
  },

  'vc-angle-between-vectors': {
    id: 'vc-angle-between-vectors',
    title: 'Angle Between Vectors',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `The angle \\varphi between two vectors in \\mathbb{R}^2 or \\mathbb{R}^3 is determined using the geometric formula for the dot product:
\\cos(\\varphi) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}, \\quad 0 \\leq \\varphi \\leq 180^\\circ
In dMAT, angles are standard special angles: 0° (\\cos=1), 45° (\\cos=\\frac{\\sqrt{2}}{2}), 60° (\\cos=\\frac{1}{2}), 90° (\\cos=0), 120° (\\cos=-\\frac{1}{2}), 180° (\\cos=-1).`,
    principles: [
      'Domain: The angle between vectors is strictly between 0° and 180°.',
      'Sign Rule: cos φ > 0 → acute; cos φ = 0 → 90°; cos φ < 0 → obtuse.',
      'Collinear Vectors: Same direction → 0°; opposite direction → 180°.'
    ],
    formulas: [
      '\\cos(\\varphi) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}'
    ],
    examTricks: [
      {
        title: 'The Half-Value Shortcut',
        description: 'If you calculate \\cos(\\varphi) = 0.5 (or 1/2), the angle is immediately 60°. If \\cos(\\varphi) = -0.5, the angle is 180° - 60° = 120°.',
        ruleOfThumb: 'cos = 1/2 → 60°; cos = -1/2 → 120°; cos = 0 → 90°.'
      }
    ],
    commonTraps: [
      {
        trap: 'Confusing 60° and 30°',
        whyItHappens: 'Mixing up cos(60°) = 1/2 with sin(60°) = √3/2.',
        howToAvoid: 'Cosine starts at 1 for 0° and decreases: cos(60°) = 0.5.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Perpendicular Angle',
        problem: 'Given \\vec{u} = (3, 0) and \\vec{v} = (0, 4), what is the angle between them?',
        options: ['90°', '0°', '45°', '180°'],
        correctIndex: 0,
        explanation: '\\vec{u} lies on the positive x-axis and \\vec{v} lies on the positive y-axis. The angle between the coordinate axes is 90° (\\vec{u} \\cdot \\vec{v} = 0).',
        steps: [
          'Step 1: Check dot product: 3(0) + 0(4) = 0.',
          'Step 2: Dot product = 0 implies 90°.'
        ],
        examTrick: 'Dot product is 0 → angle is 90°.'
      },
      {
        difficulty: 'Medium',
        title: 'Standard 60° Angle Calculation',
        problem: 'Find the angle between \\vec{a} = (1, 0) and \\vec{b} = (1, √3).',
        options: ['60°', '30°', '45°', '90°'],
        correctIndex: 0,
        explanation: '\\vec{a} \\cdot \\vec{b} = (1)(1) + (0)(√3) = 1. Magnitudes: |\\vec{a}| = 1; |\\vec{b}| = √(1² + (√3)²) = √(1 + 3) = √4 = 2. Then cos(φ) = 1 / (1 × 2) = 1/2. Therefore φ = 60°.',
        steps: [
          'Step 1: Dot product = 1.',
          'Step 2: Magnitudes = 1 and 2.',
          'Step 3: cos φ = 1/2 → φ = 60°.'
        ],
        examTrick: 'cos φ = 1/2 → 60°.'
      },
      {
        difficulty: 'Hard',
        title: 'Obtuse Angle in 3D Space',
        problem: 'Find the angle between \\vec{u} = (1, 1, 0) and \\vec{v} = (-1, 0, 1).',
        options: ['120°', '60°', '90°', '135°'],
        correctIndex: 0,
        explanation: 'Dot product: \\vec{u} \\cdot \\vec{v} = (1)(-1) + (1)(0) + (0)(1) = -1. Magnitudes: |\\vec{u}| = √(1+1) = √2; |\\vec{v}| = √(1+1) = √2. Product of magnitudes = √2 × √2 = 2. Then cos(φ) = -1 / 2 = -0.5. Therefore φ = 180° - 60° = 120°.',
        steps: [
          'Step 1: Dot product = -1.',
          'Step 2: Magnitudes = √2 and √2 → product = 2.',
          'Step 3: cos φ = -1/2.',
          'Step 4: φ = 120°.'
        ],
        examTrick: 'cos φ = -1/2 → 120°.'
      }
    ]
  },

  'vc-parallelogram-area': {
    id: 'vc-parallelogram-area',
    title: 'Parallelogram & Triangle Area via Cross Product',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `The magnitude of the vector cross product equals the area of the parallelogram spanned by \\vec{a} and \\vec{b}:
\\text{Area}_{\\text{parallelogram}} = |\\vec{a} \\times \\vec{b}|
Because a triangle is exactly half of a parallelogram, the area of the triangle spanned by \\vec{a} and \\vec{b} is:
\\text{Area}_{\\text{triangle}} = \\frac{1}{2} |\\vec{a} \\times \\vec{b}|`,
    principles: [
      'Parallelogram Area: Direct magnitude of cross product |\\vec{a} \\times \\vec{b}|.',
      'Triangle Area: Exactly half: \\frac{1}{2}|\\vec{a} \\times \\vec{b}|.',
      '2D Determinant Trick: For 2D vectors, Area = |a_x b_y - a_y b_x|.'
    ],
    formulas: [
      'A_{\\text{para}} = |\\vec{a} \\times \\vec{b}|',
      'A_{\\text{tri}} = \\frac{1}{2}|\\vec{a} \\times \\vec{b}|'
    ],
    examTricks: [
      {
        title: 'The 2D Shoelace Shortcut',
        description: 'For 2D vectors (a_x, a_y) and (b_x, b_y), the parallelogram area is simply the 2×2 determinant: |a_x b_y - a_y b_x|. No 3D cross product needed!',
        ruleOfThumb: 'In 2D: Area = |a_x b_y - a_y b_x|.'
      }
    ],
    commonTraps: [
      {
        trap: 'Forgetting the 1/2 factor for triangles',
        whyItHappens: 'The problem asks for triangle area, but the candidate calculates parallelogram area.',
        howToAvoid: 'Always check if the prompt asks for "parallelogram" or "triangle".'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: '2D Parallelogram Area',
        problem: 'Find the area of the parallelogram spanned by \\vec{a} = (4, 0) and \\vec{b} = (1, 3).',
        options: ['12', '7', '6', '14'],
        correctIndex: 0,
        explanation: 'Area = |a_x b_y - a_y b_x| = |(4)(3) - (0)(1)| = |12 - 0| = 12.',
        steps: [
          'Step 1: Compute 2×2 determinant: 4 × 3 - 0 × 1 = 12.',
          'Step 2: Area = 12.'
        ],
        examTrick: '4 × 3 = 12.'
      },
      {
        difficulty: 'Medium',
        title: 'Triangle Area in 3D',
        problem: 'Find the area of the triangle spanned by \\vec{u} = (2, 0, 0) and \\vec{v} = (0, 3, 0).',
        options: ['3', '6', '1.5', '5'],
        correctIndex: 0,
        explanation: 'Parallelogram area = |\\vec{u} \\times \\vec{v}| = |(0, 0, 6)| = 6. Triangle area = 6 / 2 = 3.',
        steps: [
          'Step 1: Parallelogram area = base × height = 2 × 3 = 6.',
          'Step 2: Triangle area = 1/2 × 6 = 3.'
        ],
        examTrick: 'Triangle is half: (2 × 3) / 2 = 3.'
      },
      {
        difficulty: 'Hard',
        title: 'Arbitrary 3D Parallelogram Area',
        problem: 'Find the area of the parallelogram spanned by \\vec{a} = (1, 2, 0) and \\vec{b} = (0, 2, 1).',
        options: ['3', '√9 = 3', '√5', '6'],
        correctIndex: 0,
        explanation: '\\vec{a} \\times \\vec{b} = (2·1 - 0·2, 0·0 - 1·1, 1·2 - 2·0) = (2, -1, 2). Magnitude = √(2² + (-1)² + 2²) = √(4 + 1 + 4) = √9 = 3.',
        steps: [
          'Step 1: Compute cross product: (2, -1, 2).',
          'Step 2: Compute magnitude: √(4 + 1 + 4) = √9 = 3.'
        ],
        examTrick: 'Classic 3D triple (2, 1, 2) has magnitude 3.'
      }
    ]
  },

  'vc-coplanarity': {
    id: 'vc-coplanarity',
    title: 'Coplanarity & Linear Dependence',
    submodule: 'Vector Calculations',
    module: 'Subject Module',
    overview: `Three vectors in \\mathbb{R}^3 are said to be COPLANAR if they lie entirely within the same flat plane. Geometrically, this means the parallelepiped they form has zero height, and therefore ZERO VOLUME.
Mathematically:
\\vec{a}, \\vec{b}, \\vec{c} \\text{ are coplanar} \\iff \\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = 0 \\iff \\det(\\vec{a}, \\vec{b}, \\vec{c}) = 0`,
    principles: [
      'Zero Volume Criterion: Triple product = 0 \\iff vectors are coplanar.',
      'Linear Dependence: One vector can be written as a linear combination of the other two: \\vec{c} = \\alpha\\vec{a} + \\beta\\vec{b}.',
      'Two Vectors are ALWAYS Coplanar: Any two non-collinear vectors define a single plane.'
    ],
    formulas: [
      '\\vec{a}, \\vec{b}, \\vec{c} \\text{ coplanar} \\iff \\det\\begin{pmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{pmatrix} = 0'
    ],
    examTricks: [
      {
        title: 'The Linear Combination Inspection',
        description: 'Before calculating a 3×3 determinant, check if Vector 3 is simply Vector 1 + Vector 2! If \\vec{w} = \\vec{u} + \\vec{v}, they are automatically coplanar (determinant = 0) with zero calculation.',
        ruleOfThumb: 'If vector C = vector A + vector B, triple product is instantly 0.'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming orthogonal vectors are coplanar',
        whyItHappens: 'Three mutually orthogonal vectors form a 3D basis (like x, y, z) and are NEVER coplanar.',
        howToAvoid: 'Mutually orthogonal non-zero vectors span maximum volume, det ≠ 0.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Coplanarity by Linear Combination',
        problem: 'Given \\vec{a} = (1, 2, 3), \\vec{b} = (4, 1, 0), and \\vec{c} = (5, 3, 3), are these three vectors coplanar?',
        options: ['Yes, because \\vec{c} = \\vec{a} + \\vec{b}', 'No, because none are zero', 'No, because their dot product is not zero', 'Yes, because they are orthogonal'],
        correctIndex: 0,
        explanation: 'Notice that \\vec{a} + \\vec{b} = (1+4, 2+1, 3+0) = (5, 3, 3) = \\vec{c}. Since \\vec{c} is a direct linear combination of \\vec{a} and \\vec{b}, the three vectors lie in the same plane (coplanar).',
        steps: [
          'Step 1: Check component sums: 1+4=5, 2+1=3, 3+0=3.',
          'Step 2: \\vec{c} = \\vec{a} + \\vec{b}.',
          'Step 3: Linearly dependent vectors are coplanar.'
        ],
        examTrick: 'Inspect: \\vec{a} + \\vec{b} = \\vec{c} → instant Yes.'
      },
      {
        difficulty: 'Medium',
        title: 'Coplanarity Parameter Value',
        problem: 'For what value of k are \\vec{u} = (1, 0, 2), \\vec{v} = (0, 1, 3), and \\vec{w} = (2, 1, k) coplanar?',
        options: ['7', '5', '4', '8'],
        correctIndex: 0,
        explanation: 'For \\vec{w} to be a linear combination \\vec{w} = 2\\vec{u} + 1\\vec{v}: x = 2(1)+0 = 2; y = 2(0)+1 = 1. Then z must be 2(2) + 1(3) = 4 + 3 = 7. Therefore k = 7.',
        steps: [
          'Step 1: Need \\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}.',
          'Step 2: x-component: 2 = \\alpha(1) → \\alpha = 2.',
          'Step 3: y-component: 1 = \\beta(1) → \\beta = 1.',
          'Step 4: z-component: k = 2(2) + 1(3) = 4 + 3 = 7.'
        ],
        examTrick: '\\alpha = 2, \\beta = 1. k = 2(2) + 1(3) = 7.'
      },
      {
        difficulty: 'Hard',
        title: 'Determinant Test for Coplanarity',
        problem: 'Which of the following sets of vectors is coplanar?',
        options: [
          '(1, 1, 1), (2, 2, 2), (3, 4, 5)',
          '(1, 0, 0), (0, 1, 0), (0, 0, 1)',
          '(2, 0, 0), (0, 3, 0), (0, 0, 4)',
          '(1, 2, 3), (0, 1, 2), (1, 0, 0)'
        ],
        correctIndex: 0,
        explanation: 'In Option A, the second vector (2, 2, 2) is a direct scalar multiple of the first (1, 1, 1) (factor 2). Since two of the vectors are collinear, the set of three vectors is automatically coplanar (determinant = 0).',
        steps: [
          'Step 1: Notice (2, 2, 2) = 2 × (1, 1, 1).',
          'Step 2: Any set containing parallel vectors is coplanar.',
          'Step 3: Option A is coplanar without calculation.'
        ],
        examTrick: 'Proportional vectors in a set guarantee determinant = 0.'
      }
    ]
  }
};
