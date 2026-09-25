// dMAT Syllabus Structure - Extracted from Official PDF
// 260902_dMAT_General-Academic-Module_Preparatoy-Materials_EN.pdf

export const SYLLABUS = {
  exam: {
    name: 'dMAT – Digital Master Test',
    fullName: 'dMAT General Academic Module',
    totalDurationMinutes: 180,
    breakDurationMinutes: 30,
    description: 'Standardized aptitude test for admission of international applicants to Master\'s degree programmes in Germany.',
    rules: [
      'No note-taking throughout the exam',
      'No calculators allowed',
      'If you do not know an answer, please guess which answer might be correct',
      'Digital examination format',
      'Standardized and centrally evaluated'
    ]
  },

  modules: [
    {
      id: 'core-module',
      name: 'Core Module',
      description: 'Tests general cognitive and analytical skills. The Core Module is identical for all test-takers and consists of three subtests that measure general cognitive abilities relevant to a master\'s degree programme in Germany.',
      order: 1,
      subtests: [
        {
          id: 'figure-sequences',
          name: 'Figure Sequences',
          taskCount: 20,
          timeMinutes: 25,
          description: 'In this task type, you will see a series of pictures (matrices). The figures in the matrices can change their position, colour, and/or orientation from one matrix to the next according to specific rules. Identify the logical pattern in the sequence and determine the next two matrices.',
          instructions: [
            'You will see a series of matrices with figures',
            'Figures can change position, colour, and/or orientation according to rules',
            'Identify the logical pattern and determine the next two matrices',
            'Be as quick and accurate as possible',
            'If you do not know an answer, guess which answer might be correct',
            'You are not allowed to take notes'
          ],
          rules: [
            'Figures can change their colour',
            'Figures can rotate around their own axis',
            'Figures can move in the matrix — vertical, horizontal, and diagonal movements are allowed',
            'Figures cannot change from one diagonal movement to another type of movement',
            'Figures can change their movement, colour or orientation by x + 1 (accelerating pattern)',
            'Figures cannot disappear or overlap',
            'Figures cannot leave the matrix — if they come up against an outer boundary, they can EITHER bounce off OR move along the outer boundary'
          ],
          topics: [
            {
              id: 'fs-position-tracking',
              name: 'Position Tracking',
              description: 'Tracking figure positions across matrices — vertical, horizontal, diagonal movement patterns'
            },
            {
              id: 'fs-color-changes',
              name: 'Colour Changes',
              description: 'Identifying colour transformation patterns — alternating, cycling, or conditional colour changes'
            },
            {
              id: 'fs-rotation',
              name: 'Rotation Patterns',
              description: 'Detecting rotation rules — 90°, 180°, 270° rotations, clockwise or counter-clockwise'
            },
            {
              id: 'fs-boundary-behavior',
              name: 'Boundary Behaviour',
              description: 'Understanding bounce-off and wrap-around behaviour at matrix edges'
            },
            {
              id: 'fs-acceleration',
              name: 'Accelerating Patterns (x+1)',
              description: 'Recognising patterns where movement, rotation or colour change accelerates by x+1 each step'
            },
            {
              id: 'fs-combined-rules',
              name: 'Combined Rules',
              description: 'Working with multiple simultaneous transformation rules applied to multiple figures'
            }
          ]
        },
        {
          id: 'mathematical-equations',
          name: 'Mathematical Equations',
          taskCount: 20,
          timeMinutes: 25,
          description: 'In this task type, you are supposed to solve systems of equations in such a way that all requirements are met. Find the numbers that the letters represent so that all the equations are correct. Each letter can be an integer between 1 and 20.',
          instructions: [
            'Solve systems of equations so that all requirements are met',
            'One system always consists of several single equations',
            'Find the numbers that the letters represent so that all equations are correct',
            'There is always only one solution for each letter',
            'Each letter can be an integer between 1 and 20',
            'Be as quick and accurate as possible',
            'You are not allowed to take notes'
          ],
          rules: [
            'Each letter represents a unique integer between 1 and 20',
            'All equations must be satisfied simultaneously',
            'There is exactly one solution',
            'Operations include addition, subtraction, multiplication, and division'
          ],
          topics: [
            {
              id: 'me-two-variables',
              name: 'Two-Variable Systems',
              description: 'Systems with two unknowns (A, B) — direct substitution'
            },
            {
              id: 'me-three-variables',
              name: 'Three-Variable Systems',
              description: 'Systems with three unknowns (A, B, C) — multi-step substitution'
            },
            {
              id: 'me-four-variables',
              name: 'Four-Variable Systems',
              description: 'Systems with four unknowns (A, B, C, D) — complex substitution chains'
            },
            {
              id: 'me-mental-arithmetic',
              name: 'Mental Arithmetic Speed',
              description: 'Quick mental computation with multiplication, division, addition, subtraction'
            }
          ]
        },
        {
          id: 'latin-squares',
          name: 'Latin Squares',
          taskCount: 20,
          timeMinutes: 25,
          description: 'In this task type, you will see a 5×5 grid. Some fields contain letters. Each letter can only appear once in each row and each column. Determine which letter belongs in the box marked with a question mark.',
          instructions: [
            'You will see a 5×5 grid (5 rows and 5 columns)',
            'Some fields contain letters',
            'Each letter can only appear once in each row and each column',
            'Only the letters shown as response options can appear in the grid',
            'Determine which letter belongs in the box marked with a question mark',
            'Sometimes you need to fill in other fields mentally before finding the answer',
            'Be as quick and accurate as possible',
            'You are not allowed to take notes'
          ],
          rules: [
            'Each letter appears exactly once per row',
            'Each letter appears exactly once per column',
            'Only letters from the given set (typically A-E) can appear',
            'May require multi-step deduction to reach the answer'
          ],
          topics: [
            {
              id: 'ls-direct-elimination',
              name: 'Direct Elimination',
              description: 'Finding the answer by direct row/column elimination — only one letter missing'
            },
            {
              id: 'ls-multi-step',
              name: 'Multi-Step Deduction',
              description: 'Requiring multiple intermediate cells to be deduced before reaching the answer'
            },
            {
              id: 'ls-constraint-propagation',
              name: 'Constraint Propagation',
              description: 'Using cross-row and cross-column constraints to narrow possibilities'
            }
          ]
        }
      ]
    },
    {
      id: 'subject-module',
      name: 'Subject Module – General Academic Module',
      description: 'Tests the ability to apply cognitive and analytical skills to academic problem solving. Tasks are knowledge-based, consisting of typical subject-related problems with single-choice questions. Requires transfer and application skills rather than memorised factual knowledge.',
      order: 2,
      timeMinutes: 90,
      questionCount: '20-25',
      answerOptions: 4,
      format: 'Single-choice with text/table/figure/formula inputs',
      topics: [
        {
          id: 'vector-calculations',
          name: 'Vector Calculations',
          description: 'Working with vectors in two- and three-dimensional spaces, including operations like scalar products, vector products, triple products, and magnitude calculations.',
          subtopics: [
            {
              id: 'vc-vector-basics',
              name: 'Vector Basics',
              description: 'Components, representation in 2D and 3D coordinate systems'
            },
            {
              id: 'vc-addition-subtraction',
              name: 'Vector Addition & Subtraction',
              description: 'Component-wise addition and subtraction of vectors'
            },
            {
              id: 'vc-scalar-multiplication',
              name: 'Scalar Multiplication',
              description: 'Multiplying vectors by scalars — effect on length and direction'
            },
            {
              id: 'vc-magnitude',
              name: 'Vector Magnitude',
              description: 'Calculating vector length using the Pythagorean theorem'
            },
            {
              id: 'vc-scalar-product',
              name: 'Scalar Product (Dot Product)',
              description: 'Computing a⃗·b⃗ = axbx + ayby + azbz and its relation to the angle between vectors'
            },
            {
              id: 'vc-vector-product',
              name: 'Vector Product (Cross Product)',
              description: 'Computing a⃗ × b⃗ and understanding the resulting perpendicular vector'
            },
            {
              id: 'vc-triple-product',
              name: 'Triple Product',
              description: 'Computing [a⃗ b⃗ c⃗] = a⃗·(b⃗ × c⃗) and its geometric interpretation as volume'
            },
            {
              id: 'vc-angle-between-vectors',
              name: 'Angle Between Vectors',
              description: 'Using the scalar product to determine the angle φ = arccos(a⃗·b⃗ / |a⃗||b⃗|)'
            },
            {
              id: 'vc-parallelogram-area',
              name: 'Parallelogram Area',
              description: 'Using the cross product magnitude to compute the area of a parallelogram'
            },
            {
              id: 'vc-coplanarity',
              name: 'Coplanarity',
              description: 'Understanding when the triple product equals zero — vectors lie in one plane'
            }
          ]
        },
        {
          id: 'hydrostatics',
          name: 'Hydrostatics',
          description: 'Understanding pressure in incompressible fluids, buoyancy, and related applications.',
          subtopics: [
            {
              id: 'hs-pressure-depth',
              name: 'Pressure at Depth',
              description: 'p(h) = ρ·g·h + p₀ — pressure increases linearly with depth'
            },
            {
              id: 'hs-atmospheric-pressure',
              name: 'Atmospheric Pressure',
              description: 'Normal atmospheric pressure ≈ 1 bar (102,325 hPa) at sea level'
            },
            {
              id: 'hs-water-pressure',
              name: 'Water Pressure Estimation',
              description: 'Water pressure increases by ~1 bar every 10 m depth'
            },
            {
              id: 'hs-buoyancy',
              name: 'Buoyancy (Archimedes\' Principle)',
              description: 'Buoyant force equals weight of displaced fluid — FB = FG for floating/swimming bodies'
            },
            {
              id: 'hs-swimming-floating',
              name: 'Swimming vs Floating',
              description: 'Partially submerged (swimming) vs fully submerged (floating) equilibrium'
            },
            {
              id: 'hs-gas-compression',
              name: 'Gas Compression in Fluids',
              description: 'Behaviour of trapped air under water pressure — Cartesian diver principle'
            },
            {
              id: 'hs-pumps',
              name: 'Suction Pumps',
              description: 'Vacuum-based water lifting — maximum suction height limited by atmospheric pressure (~10 m)'
            },
            {
              id: 'hs-ship-stability',
              name: 'Ship Stability',
              description: 'Centre of gravity, centre of buoyancy, tilting moments, and hull cross-section effects'
            }
          ]
        },
        {
          id: 'optimal-order-quantity',
          name: 'Optimal Order Quantity',
          description: 'Inventory management using the Economic Order Quantity (EOQ) model.',
          subtopics: [
            {
              id: 'eoq-model-assumptions',
              name: 'Model Assumptions',
              description: 'Constant demand, no quantity discounts, no capital/storage limits'
            },
            {
              id: 'eoq-cost-components',
              name: 'Cost Components',
              description: 'Holding costs vs fixed ordering costs — their relationship to order quantity'
            },
            {
              id: 'eoq-formula',
              name: 'EOQ Formula',
              description: 'Q* = √(2DS/H) — calculating optimal order quantity'
            },
            {
              id: 'eoq-average-inventory',
              name: 'Average Inventory',
              description: 'Average inventory level = Q/2 between orders'
            },
            {
              id: 'eoq-sensitivity',
              name: 'Sensitivity Analysis',
              description: 'How changes in D, S, or H affect Q* — proportional relationships'
            },
            {
              id: 'eoq-cost-curves',
              name: 'Cost Curves',
              description: 'Interpreting graphs of total costs, ordering costs, and holding costs vs order quantity'
            }
          ]
        },
        {
          id: 'research-strategies',
          name: 'Research Strategies in Social Sciences',
          description: 'Understanding qualitative and quantitative research methodologies in social sciences.',
          subtopics: [
            {
              id: 'rs-quant-vs-qual',
              name: 'Quantitative vs Qualitative Research',
              description: 'Theory testing (deductive) vs theory generating (inductive) strategies'
            },
            {
              id: 'rs-causal-relationships',
              name: 'Causal Relationships vs Mechanisms',
              description: 'Identifying whether factors relate to outcomes vs understanding how outcomes arise'
            },
            {
              id: 'rs-research-phases',
              name: 'Research Phases',
              description: 'Problem identification → research design → data collection & analysis → processing'
            },
            {
              id: 'rs-linear-vs-circular',
              name: 'Linear vs Circular Process',
              description: 'Quantitative (linear/fixed) vs qualitative (circular/flexible) research procedures'
            },
            {
              id: 'rs-hypothesis-testing',
              name: 'Hypothesis Testing',
              description: 'Role of hypotheses in deductive research — pre-defined, not retrospectively adapted'
            },
            {
              id: 'rs-mixed-methods',
              name: 'Mixed Methods',
              description: 'Combining quantitative and qualitative approaches in a single study'
            }
          ]
        }
      ]
    }
  ]
};

// Helper to get all submodule/topic IDs for flat access
export function getAllTopicIds() {
  const ids = [];
  SYLLABUS.modules.forEach(mod => {
    if (mod.subtests) {
      mod.subtests.forEach(st => {
        ids.push(st.id);
        if (st.topics) st.topics.forEach(t => ids.push(t.id));
      });
    }
    if (mod.topics) {
      mod.topics.forEach(t => {
        ids.push(t.id);
        if (t.subtopics) t.subtopics.forEach(st => ids.push(st.id));
      });
    }
  });
  return ids;
}

export function getModuleById(id) {
  return SYLLABUS.modules.find(m => m.id === id);
}

export function getSubtestById(id) {
  const core = SYLLABUS.modules.find(m => m.id === 'core-module');
  return core?.subtests?.find(s => s.id === id);
}

export function getSubjectTopicById(id) {
  const subject = SYLLABUS.modules.find(m => m.id === 'subject-module');
  return subject?.topics?.find(t => t.id === id);
}
