// Learning content - detailed educational material for each module
// This is platform-created content, not official dMAT material

export const LEARNING_CONTENT = {
  'figure-sequences': {
    concepts: `Figure Sequences is a visual reasoning subtest that measures your ability to identify logical patterns.

You will see a series of 4 matrices (grids). Each matrix contains geometric figures (circles, squares, triangles, diamonds, etc.) placed in specific cells. From one matrix to the next, figures change according to fixed rules.

Your task: Identify the transformation rules and predict what the next matrix looks like.

TRANSFORMATION TYPES:
1. Position changes — figures move within the grid (up, down, left, right, diagonal)
2. Colour changes — figures change colour (cycling or alternating)
3. Rotation — figures rotate around their centre (90°, 180°, 270°)
4. Acceleration (x+1) — the amount of change increases by 1 each step

BOUNDARY RULES:
• Figures cannot leave the matrix
• When hitting a border, they either bounce back or slide along the edge
• Diagonal movement that hits a corner reverses direction

IMPORTANT:
• Multiple figures can appear in the same matrix
• Each figure may follow DIFFERENT rules
• Figures cannot overlap or disappear`,

    formulas: null,

    strategy: `STEP-BY-STEP APPROACH:

1. IDENTIFY all figures in the matrices
   Count how many distinct shapes/colours appear

2. TRACK each figure separately
   Follow one figure across all 4 matrices before moving to the next

3. For each figure, determine:
   a) Is it moving? → Track row and column changes
   b) Is it changing colour? → Note the colour sequence
   c) Is it rotating? → Check orientation changes
   d) Is the change constant or accelerating?

4. CHECK for boundary interactions
   What happens when a figure reaches the edge?

5. PREDICT the next matrix
   Apply all rules simultaneously to all figures

6. MATCH with answer options
   Look for the option that matches your prediction

7. IF STUCK: Use elimination
   Check each option — can you find a rule that contradicts it?`,

    traps: `• Each figure follows its OWN rules — don't assume all figures behave the same
• Watch for the x+1 acceleration pattern: 1 step, then 2, then 3…
• Boundary bouncing can reverse direction
• A figure moving clockwise along borders is different from one moving diagonally
• Colour cycles may have 2, 3, or more colours
• Rotation and colour change can happen simultaneously with movement`,

    timeManagement: `25 minutes for 20 tasks = 75 seconds per task.

• Spend no more than 90 seconds on any single task
• Quick tasks (1 figure, simple movement): aim for 30–45 seconds
• Complex tasks (3–4 figures, multiple rules): up to 90 seconds
• If you can't identify all rules within 60 seconds, make your best guess
• Guess intelligently: eliminate options that clearly violate one rule you DID identify
• No penalty for guessing — never leave a question unanswered`
  },

  'mathematical-equations': {
    concepts: `Mathematical Equations tests your mental arithmetic and algebraic substitution skills.

You are given a system of equations where letters represent unknown integers between 1 and 20.

CHARACTERISTICS:
• 2 to 4 unknown variables (letters)
• Operations: + (addition), − (subtraction), × (multiplication), ÷ (division)
• Each letter has exactly one solution
• All solutions are integers between 1 and 20

SOLVING APPROACH:
The key technique is SUBSTITUTION:
1. Find an equation where you can express one variable in terms of another
2. Substitute that expression into another equation
3. Solve for the remaining variable
4. Back-substitute to find all values

EXAMPLE:
Given: B = 2 × A and B + A = 12
Step 1: Replace B with 2A in the second equation → 2A + A = 12 → 3A = 12
Step 2: A = 4
Step 3: B = 2 × 4 = 8`,

    formulas: `Basic algebra operations:
a + b = c  →  a = c - b  →  b = c - a
a × b = c  →  a = c ÷ b  →  b = c ÷ a
a ÷ b = c  →  a = c × b  →  b = a ÷ c
a - b = c  →  a = c + b  →  b = a - c`,

    strategy: `STEP-BY-STEP:

1. READ all equations first
2. FIND the simplest equation (one variable, or one already solved)
3. SUBSTITUTE known values into other equations
4. REPEAT until all values are found
5. VERIFY: plug all values back into every equation

MENTAL ARITHMETIC TIPS:
• Look for multiplication/division first — they constrain values quickly
• If a × b = c and all are 1–20, the possibilities are very limited
• Division must yield an integer — use this to narrow options
• Keep running totals in your head, don't try to hold all numbers at once`,

    traps: `• Sign errors — double-check subtraction
• Forgetting to verify ALL equations, not just the ones you used
• Making arithmetic errors under time pressure
• Assuming a value and building on it without checking
• Not noticing that a value falls outside 1–20`,

    timeManagement: `25 minutes for 20 systems = 75 seconds per system.

• Simple 2-variable systems: 30–45 seconds
• Medium 3-variable systems: 45–75 seconds
• Complex 4-variable systems: 60–90 seconds
• If stuck after 60 seconds: try systematic substitution of small integers
• Never spend more than 2 minutes on one system — guess and move on`
  },

  'latin-squares': {
    concepts: `Latin Squares tests logical deduction and constraint satisfaction.

A Latin Square is a 5×5 grid filled with 5 letters (A, B, C, D, E) such that:
• Each letter appears exactly ONCE in every ROW
• Each letter appears exactly ONCE in every COLUMN

You see a partially filled grid with one cell marked "?".
Your task: determine which letter goes in the "?" cell.

DIFFICULTY LEVELS:
• Easy: The answer can be found by looking at just the row and column of "?"
• Medium: You need to fill in 1–2 other cells first
• Hard: You need a chain of deductions across multiple rows and columns`,

    formulas: null,

    strategy: `1. Look at the "?" cell's ROW — which letters are already there?
2. Look at the "?" cell's COLUMN — which letters are already there?
3. Combine: which letters are NOT in either the row or column?
4. If only ONE letter remains → that's your answer!
5. If multiple remain → you need more deduction:
   a. Look for other cells in the grid that have only one possibility
   b. Fill those in (mentally)
   c. This may narrow down the "?" cell
6. Work from most-constrained to least-constrained cells`,

    traps: `• Only checking the row but not the column (or vice versa)
• Forgetting a letter that's already present (visual oversight)
• Not realising that intermediate cells need to be filled first
• Confusing rows and columns when scanning
• Rushing and miscounting`,

    timeManagement: `25 minutes for 20 tasks = 75 seconds per task.

• Direct elimination (1 step): 15–30 seconds
• Multi-step deduction (2–3 steps): 30–60 seconds
• Complex chains (4+ steps): 45–90 seconds
• Tip: scan the grid quickly — the most-filled row/column is the best starting point
• Never leave blank — there are only 5 options, so guessing gives 20% chance`
  },

  'vector-calculations': {
    concepts: `Vector Calculations tests your ability to work with mathematical vectors.

FUNDAMENTALS:
• A vector has components: a⃗ = (ax, ay) in 2D or a⃗ = (ax, ay, az) in 3D
• Vectors define direction and magnitude (length)

OPERATIONS:
1. Addition: a⃗ + b⃗ = (ax+bx, ay+by, az+bz) — component-wise
2. Subtraction: a⃗ − b⃗ = (ax−bx, ay−by, az−bz)
3. Scalar multiplication: k·a⃗ = (k·ax, k·ay, k·az)
   • |k| > 1 → lengthens; 0 < |k| < 1 → shortens; k < 0 → reverses direction
4. Magnitude: |a⃗| = √(ax² + ay² + az²)
5. Scalar product: a⃗·b⃗ = axbx + ayby + azbz = |a⃗||b⃗|cos(φ)
   • Result is a NUMBER (scalar)
6. Cross product: a⃗ × b⃗ = (aybz−azby, azbx−axbz, axby−aybx)
   • Result is a VECTOR perpendicular to both
   • |a⃗ × b⃗| = area of the parallelogram
7. Triple product: [a⃗ b⃗ c⃗] = a⃗·(b⃗ × c⃗)
   • Result is a SCALAR equal to the volume of the parallelepiped
   • If = 0, the vectors are coplanar`,

    formulas: `Vector magnitude:
  |a⃗| = √(ax² + ay² + az²)

Scalar (dot) product:
  a⃗·b⃗ = ax·bx + ay·by + az·bz
  a⃗·b⃗ = |a⃗|·|b⃗|·cos(φ)

Angle between vectors:
  φ = arccos( a⃗·b⃗ / (|a⃗|·|b⃗|) )

Cross product:
  a⃗ × b⃗ = ( ay·bz − az·by,
              az·bx − ax·bz,
              ax·by − ay·bx )
  |a⃗ × b⃗| = |a⃗|·|b⃗|·sin(φ)  (0 ≤ φ ≤ π)

Triple product:
  [a⃗ b⃗ c⃗] = a⃗ · (b⃗ × c⃗)`,

    strategy: `1. Read the question carefully — which operation is needed?
2. Identify the vectors and their components
3. Apply the correct formula step by step
4. For the cross product, use the pattern:
   x-component: "y times z minus z times y"
   y-component: "z times x minus x times z"
   z-component: "x times y minus y times x"
5. Double-check arithmetic for each component
6. Check the result type: scalar product → number, cross product → vector
7. For angle questions: first compute dot product, then magnitudes, then use arccos`,

    traps: `• Scalar product gives a SCALAR, cross product gives a VECTOR — don't confuse them
• Cross product component order: the "cyclic" pattern is crucial
• Negative scalar reverses direction — |−2| = 2 changes the magnitude
• Triple product = 0 means coplanar, not "zero vectors"
• For 2D cross products, set z = 0 and only the z-component remains
• Parallelogram area = |cross product|, not cross product squared`
  },

  'hydrostatics': {
    concepts: `Hydrostatics covers the physics of fluids at rest.

FUNDAMENTAL PRINCIPLE:
In an incompressible fluid, pressure increases linearly with depth.

THE PRESSURE FORMULA:
  p(h) = ρ·g·h + p₀

Where:
  ρ = density of the fluid (water ≈ 1000 kg/m³)
  g = gravitational acceleration (≈ 9.81 m/s² ≈ 10 m/s²)
  h = depth below surface
  p₀ = pressure at the surface (atmospheric ≈ 1 bar ≈ 101,325 Pa)

QUICK ESTIMATION:
  Water pressure increases by ≈ 1 bar every 10 metres of depth.

BUOYANCY (ARCHIMEDES' PRINCIPLE):
  A body in fluid experiences an upward buoyant force equal to the weight of displaced fluid.
  For a floating/swimming body: F_buoyancy = F_gravity
  → Mass of displaced fluid = mass of the body

PASCAL'S PRINCIPLE:
  Pressure applied to an enclosed fluid is transmitted equally in all directions.

GAS COMPRESSION:
  Trapped air in a sealed space underwater gets compressed proportionally to pressure.
  At 10 m depth, pressure doubles → air volume halves (Boyle's Law approximation).`,

    formulas: `Pressure at depth:
  p(h) = ρ·g·h + p₀

Quick water pressure:
  ≈ 1 bar per 10 m depth

Buoyancy equilibrium:
  F_G = F_B
  m_body · g = ρ_fluid · V_displaced · g
  → m_body = ρ_fluid · V_displaced

Atmospheric pressure:
  ≈ 1 bar ≈ 101,325 Pa ≈ 1013.25 hPa

Maximum suction height:
  h_max = p_atm / (ρ·g) ≈ 10 m`
  },

  'optimal-order-quantity': {
    concepts: `The Optimal Order Quantity (EOQ — Economic Order Quantity) model minimises total inventory costs.

THE MODEL:
A business needs to order products regularly. Two costs compete:
1. ORDERING COSTS — fixed cost per order (e.g., administrative, shipping setup)
   More orders → higher ordering costs
2. HOLDING COSTS — cost per unit per year stored (e.g., warehouse rent, capital tied up)
   Larger orders → higher holding costs

The EOQ formula finds the sweet spot that minimises total costs.

THE FORMULA:
  Q* = √(2·D·S / H)

Where:
  Q* = optimal order quantity
  D = annual demand (units/year)
  S = fixed ordering cost per order (€)
  H = holding cost per unit per year (€)

KEY RELATIONSHIPS:
  • If D increases → Q* increases (more demand → order more per batch)
  • If S increases → Q* increases (expensive orders → order fewer times)
  • If H increases → Q* decreases (expensive storage → keep less stock)
  • Due to √: doubling any parameter changes Q* by √2, not 2

AVERAGE INVENTORY:
  Between orders, inventory goes from Q down to 0 (constant demand).
  Average inventory = Q/2`,

    formulas: `EOQ Formula:
  Q* = √(2·D·S / H)

Total Annual Cost:
  TC = (D/Q)·S + (Q/2)·H
       ordering    holding

Number of orders per year:
  N = D / Q*

Average inventory:
  I_avg = Q* / 2

Sensitivity (parameter doubled):
  S×2 → Q* × √2
  D×2 → Q* × √2
  H×2 → Q* / √2`
  },

  'research-strategies': {
    concepts: `Research Strategies covers qualitative and quantitative approaches in social sciences.

TWO STRATEGIES:
1. QUANTITATIVE (Deductive / Theory-Testing)
   • Tests existing theories
   • Identifies CAUSAL RELATIONSHIPS (does X relate to Y?)
   • Large, representative samples
   • Standardised data collection
   • Statistical analysis
   • Linear research process (fixed phases)
   • Hypotheses must be defined BEFORE data analysis

2. QUALITATIVE (Inductive / Theory-Generating)
   • Builds new theories
   • Identifies CAUSAL MECHANISMS (HOW does X lead to Y?)
   • Small number of cases (even single-case studies)
   • In-depth, flexible data collection
   • Interpretive analysis
   • Circular research process (phases can overlap/repeat)
   • Research question can be refined during the process

RESEARCH PHASES:
1. Problem identification → research question
2. Research design (methods, sample, instruments)
3. Data collection and analysis
4. Processing and publication

IMPORTANT DISTINCTIONS:
• Causal RELATIONSHIP: "Does education affect income?" (quantitative)
• Causal MECHANISM: "How does education lead to higher income?" (qualitative)
• Quantitative: modifications must be documented, may limit results
• Qualitative: modifications are acceptable if documented`
  }
};
