// Hydrostatics In-Depth Learning Content
// Covers all 8 official dMAT Hydrostatics subtopics with theory, formulas, exam tricks, and 3 difficulty-graded examples.

export const HYDROSTATICS_SUBTOPICS = {
  'hs-pressure-depth': {
    id: 'hs-pressure-depth',
    title: 'Hydrostatic Pressure at Depth',
    submodule: 'Hydrostatics',
    module: 'Subject Module',
    overview: `Hydrostatic pressure is the pressure exerted by an incompressible fluid at rest under gravity. The pressure depends solely on fluid density (\\rho), gravitational acceleration (g), and vertical depth (h):
p(h) = \\rho \\cdot g \\cdot h
Crucial dMAT Principle: Container shape, total fluid volume, and surface area DO NOT affect pressure at depth. Only the vertical depth matters (Hydrostatic Paradox).`,
    principles: [
      'Linear Depth Scaling: Double the depth → double the hydrostatic gauge pressure.',
      'Container Shape Independence: A narrow test tube and a vast lake have the identical pressure at 5 m depth.',
      'Density Proportionality: Denser fluids exert proportionally greater pressure at the same depth.'
    ],
    formulas: [
      'p_{\\text{hydro}} = \\rho \\cdot g \\cdot h',
      '\\text{For water: } \\rho = 1000 \\text{ kg/m}^3, \\; g \\approx 10 \\text{ m/s}^2 \\implies p(h) = 10000 \\cdot h \\text{ Pa} = 0.1 \\cdot h \\text{ bar}'
    ],
    examTricks: [
      {
        title: 'The 0.1 bar per Meter Shortcut',
        description: 'For fresh water with g = 10 m/s², hydrostatic pressure increases by exactly 0.1 bar for every 1 meter of depth (1 bar per 10 meters). At 25 m, pressure = 2.5 bar.',
        ruleOfThumb: 'Depth in meters ÷ 10 = hydrostatic pressure in bar.'
      },
      {
        title: 'Shape Irrelevance Rule',
        description: 'If a question shows three containers (conical, cylindrical, stepped) filled to the same height h, pressure at the bottom is EQUAL in all three.',
        ruleOfThumb: 'Same fluid + same depth = identical bottom pressure.'
      }
    ],
    commonTraps: [
      {
        trap: 'Confusing pressure with total force',
        whyItHappens: 'Pressure is force per area (p = F/A). Force at bottom is p × Area.',
        howToAvoid: 'Pressure is independent of area; total force depends on bottom area.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Water Pressure at 30 Meters',
        problem: 'What is the hydrostatic gauge pressure at a depth of 30 m in fresh water (\\rho = 1000 kg/m³, g = 10 m/s²)?',
        options: ['3 bar (300,000 Pa)', '30 bar', '0.3 bar', '4 bar'],
        correctIndex: 0,
        explanation: 'p = \\rho g h = 1000 × 10 × 30 = 300,000 Pa. Since 1 bar = 100,000 Pa, 300,000 Pa = 3 bar.',
        steps: [
          'Step 1: Formula p = \\rho g h.',
          'Step 2: 1000 × 10 × 30 = 300,000 Pa.',
          'Step 3: Convert Pa to bar: 300,000 / 100,000 = 3 bar.'
        ],
        examTrick: '30 meters ÷ 10 = 3 bar.'
      },
      {
        difficulty: 'Medium',
        title: 'Hydrostatic Paradox Across Shapes',
        problem: 'Three vessels A (narrow beaker), B (wide basin), and C (flared vase) all have the same base area of 0.02 m² and are filled with water to a height of 2 m. Which vessel has the greatest pressure at its base?',
        options: [
          'All three vessels experience the same base pressure',
          'Vessel B (widest fluid volume)',
          'Vessel C (slanted walls)',
          'Vessel A (narrowest column)'
        ],
        correctIndex: 0,
        explanation: 'By Stevin’s law (hydrostatic paradox), hydrostatic pressure depends ONLY on depth and fluid density: p = \\rho g h. Because all three vessels have the same fluid and same depth (2 m), the pressure at the base is identical in all three vessels (0.2 bar).',
        steps: [
          'Step 1: Check variables in p = \\rho g h.',
          'Step 2: \\rho is identical (water).',
          'Step 3: h is identical (2 m).',
          'Step 4: Pressure is strictly equal.'
        ],
        examTrick: 'Container geometry has zero effect on bottom hydrostatic pressure.'
      },
      {
        difficulty: 'Hard',
        title: 'Two-Layer Fluid Hydrostatic Pressure',
        problem: 'A tank contains a 4 m layer of oil (\\rho = 800 kg/m³) floating on top of a 3 m layer of water (\\rho = 1000 kg/m³). With g = 10 m/s², what is the total hydrostatic pressure at the tank bottom?',
        options: ['62,000 Pa (0.62 bar)', '70,000 Pa (0.70 bar)', '56,000 Pa (0.56 bar)', '162,000 Pa (1.62 bar)'],
        correctIndex: 0,
        explanation: 'p_bottom = p_oil + p_water = (\\rho_oil · g · h_oil) + (\\rho_water · g · h_water) = (800 × 10 × 4) + (1000 × 10 × 3) = 32,000 Pa + 30,000 Pa = 62,000 Pa (0.62 bar).',
        steps: [
          'Step 1: Oil layer pressure = 800 × 10 × 4 = 32,000 Pa.',
          'Step 2: Water layer pressure = 1000 × 10 × 3 = 30,000 Pa.',
          'Step 3: Total pressure = 32,000 + 30,000 = 62,000 Pa.'
        ],
        examTrick: 'Calculate layer pressures separately and sum them: 32 kPa + 30 kPa = 62 kPa.'
      }
    ]
  },

  'hs-atmospheric-pressure': {
    id: 'hs-atmospheric-pressure',
    title: 'Atmospheric Pressure & Absolute vs Gauge Pressure',
    submodule: 'Hydrostatics',
    module: 'Subject Module',
    overview: `Absolute pressure is the total pressure relative to a perfect vacuum:
p_{\\text{abs}} = p_{\\text{atm}} + p_{\\text{gauge}}
At sea level, standard atmospheric pressure is approximately:
p_0 = 1 \\text{ bar} = 100,000 \\text{ Pa} = 1000 \\text{ hPa}
Most pressure gauges (tire gauges, diving gauges) measure GAUGE pressure (excess pressure over atmospheric). When a question asks for "total pressure" or "absolute pressure", you MUST add atmospheric pressure (1 bar).`,
    principles: [
      'Standard Sea Level Atmosphere: p_0 \\approx 1.013 \\text{ bar} \\approx 1 \\text{ bar} (10^5 \\text{ Pa}).',
      'Absolute Pressure: p_{abs} = p_{atm} + \\rho g h.',
      'Gauge Pressure: p_{gauge} = \\rho g h (ignores atmosphere).'
    ],
    formulas: [
      'p_{\\text{abs}} = p_0 + \\rho \\cdot g \\cdot h'
    ],
    examTricks: [
      {
        title: 'The +1 Bar Absolute Pressure Rule',
        description: 'Whenever you see the word "TOTAL" or "ABSOLUTE" pressure for an underwater object, calculate gauge pressure (depth/10) and then ADD 1 BAR.',
        ruleOfThumb: 'Absolute pressure at depth h = (h / 10) + 1 bar.'
      }
    ],
    commonTraps: [
      {
        trap: 'Selecting gauge pressure when absolute pressure is asked',
        whyItHappens: 'Calculating 20 m = 2 bar and picking 2 bar instead of 2 + 1 = 3 bar.',
        howToAvoid: 'Highlight "absolute" vs "gauge" in the question stem.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Absolute Pressure at 20 Meters',
        problem: 'A scuba diver dives to a depth of 20 m in a lake. Assuming atmospheric pressure is 1 bar, what is the absolute pressure experienced by the diver?',
        options: ['3 bar', '2 bar', '1 bar', '4 bar'],
        correctIndex: 0,
        explanation: 'Water gauge pressure at 20 m = 20 / 10 = 2 bar. Absolute pressure = p_atm + p_water = 1 bar + 2 bar = 3 bar.',
        steps: [
          'Step 1: Gauge pressure = 20 m / 10 = 2 bar.',
          'Step 2: Add atmospheric pressure: 2 + 1 = 3 bar.'
        ],
        examTrick: '20 m water = 2 bar. Add 1 bar surface = 3 bar absolute.'
      },
      {
        difficulty: 'Medium',
        title: 'Gauge vs Absolute Differentiation',
        problem: 'A submarine pressure gauge reads 4.5 bar gauge pressure. What absolute pressure is acting on the hull?',
        options: ['5.5 bar', '4.5 bar', '3.5 bar', '9.0 bar'],
        correctIndex: 0,
        explanation: 'p_abs = p_gauge + p_atm = 4.5 bar + 1.0 bar = 5.5 bar.',
        steps: [
          'Step 1: Formula: p_abs = p_gauge + p_atm.',
          'Step 2: 4.5 + 1.0 = 5.5 bar.'
        ],
        examTrick: 'Absolute = Gauge + 1 bar.'
      },
      {
        difficulty: 'Hard',
        title: 'Net Force on Submarine Window',
        problem: 'A circular submarine hatch with area 0.2 m² is at a depth of 50 m. The cabin interior is pressurized to 1.0 bar. What is the net inward force on the hatch?',
        options: ['100,000 N (100 kN)', '120,000 N', '50,000 N', '20,000 N'],
        correctIndex: 0,
        explanation: 'Outside absolute pressure: 1 bar (atm) + 5 bar (50 m water) = 6 bar. Inside pressure: 1 bar. Net differential pressure \\Delta p = 6 - 1 = 5 bar = 500,000 Pa (which equals the hydrostatic gauge pressure!). Net force F = \\Delta p · A = 500,000 Pa × 0.2 m² = 100,000 N = 100 kN.',
        steps: [
          'Step 1: Differential pressure = outside - inside = 6 bar - 1 bar = 5 bar.',
          'Step 2: Convert to Pa: 5 × 100,000 = 500,000 Pa.',
          'Step 3: Force = 500,000 × 0.2 = 100,000 N = 100 kN.'
        ],
        examTrick: 'Interior 1 bar cancels atmospheric 1 bar. Net pressure is purely the 50 m water pressure (5 bar).'
      }
    ]
  },

  'hs-water-pressure': {
    id: 'hs-water-pressure',
    title: 'Water Pressure Estimation Rules of Thumb',
    submodule: 'Hydrostatics',
    module: 'Subject Module',
    overview: `Under dMAT examination conditions (no calculators permitted), quick mental estimations of water pressure are essential.
• 10 meters of water column (mWC) \\approx 1 bar = 100 kPa
• 1 meter of water column \\approx 0.1 bar = 10 kPa
• 1 cm of water column \\approx 100 Pa = 1 hPa
• Seawater (\\rho \\approx 1025 kg/m³) exerts slightly higher pressure (~2.5% more), but for dMAT estimation, 1 bar per 10 m is standard.`,
    principles: [
      '10 m Rule: Each 10 m depth adds 1 bar.',
      'Linear Depth Interpolation: 5 m = 0.5 bar, 15 m = 1.5 bar, 25 m = 2.5 bar, 100 m = 10 bar.',
      'Pascal\'s Principle: In a connected fluid system, applied pressure transmits undiminished to all portions.'
    ],
    formulas: [
      '\\Delta p \\approx \\frac{h}{10} \\text{ bar}'
    ],
    examTricks: [
      {
        title: 'The 10m Mental Scale',
        description: `Convert depths instantly without using \\rho × g × h:
• 10 m = 1 bar
• 20 m = 2 bar
• 35 m = 3.5 bar
• 70 m = 7 bar`,
        ruleOfThumb: 'Divide depth by 10 to get pressure in bar.'
      }
    ],
    commonTraps: [
      {
        trap: 'Using 100 m instead of 10 m for 1 bar',
        whyItHappens: 'Metric prefix confusion.',
        howToAvoid: '10 m of water = 1 atmospheric bar.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Instant Depth Estimation',
        problem: 'A pressure gauge on an underwater pipe reads 2.5 bar hydrostatic pressure. What is the approximate depth of the pipe?',
        options: ['25 m', '2.5 m', '250 m', '50 m'],
        correctIndex: 0,
        explanation: 'At 1 bar per 10 m, 2.5 bar corresponds to 2.5 × 10 m = 25 m.',
        steps: [
          'Step 1: Depth = pressure in bar × 10.',
          'Step 2: 2.5 × 10 = 25 m.'
        ],
        examTrick: 'Multiply bar by 10 to get meters depth.'
      },
      {
        difficulty: 'Medium',
        title: 'Pascal Hydraulic Jack Force Multiplier',
        problem: 'A hydraulic jack has a small piston of area A₁ = 10 cm² and a large piston of area A₂ = 200 cm². A force of 50 N is applied to the small piston. What weight can the large piston support?',
        options: ['1,000 N', '500 N', '2,000 N', '200 N'],
        correctIndex: 0,
        explanation: 'By Pascal\'s principle, pressure is equal: p = F₁ / A₁ = F₂ / A₂ → F₂ = F₁ × (A₂ / A₁) = 50 N × (200 / 10) = 50 × 20 = 1,000 N.',
        steps: [
          'Step 1: Calculate area ratio: A₂ / A₁ = 200 / 10 = 20.',
          'Step 2: Force multiplier is 20.',
          'Step 3: F₂ = 50 × 20 = 1,000 N.'
        ],
        examTrick: 'Area ratio = 20. Output force = 50 × 20 = 1,000 N.'
      },
      {
        difficulty: 'Hard',
        title: 'U-Tube Manometer with Two Liquids',
        problem: 'A U-tube contains mercury (\\rho_m = 13,600 kg/m³) in equilibrium. In one arm, a 27.2 cm column of water (\\rho_w = 1,000 kg/m³) is added. What is the height difference \\Delta h of the mercury surfaces?',
        options: ['2.0 cm', '2.72 cm', '1.36 cm', '0.5 cm'],
        correctIndex: 0,
        explanation: 'Hydrostatic balance at interface: \\rho_w · g · h_w = \\rho_m · g · \\Delta h → \\Delta h = h_w × (\\rho_w / \\rho_m) = 27.2 cm × (1,000 / 13,600) = 27.2 / 13.6 = 2.0 cm.',
        steps: [
          'Step 1: Set pressures equal: \\rho_w h_w = \\rho_m \\Delta h.',
          'Step 2: Ratio of densities = 1,000 / 13,600 = 1 / 13.6.',
          'Step 3: \\Delta h = 27.2 / 13.6 = 2.0 cm.'
        ],
        examTrick: '27.2 ÷ 13.6 = 2.0 exactly!'
      }
    ]
  },

  'hs-buoyancy': {
    id: 'hs-buoyancy',
    title: 'Buoyancy (Archimedes\' Principle)',
    submodule: 'Hydrostatics',
    module: 'Subject Module',
    overview: `Archimedes\' Principle: Any body completely or partially submerged in a fluid experiences an upward buoyant force equal to the weight of the fluid displaced by the body:
F_B = \\rho_{\\text{fluid}} \\cdot V_{\\text{disp}} \\cdot g
Apparent Weight of a Submerged Object:
When submerged, an object feels lighter:
W_{\\text{app}} = W - F_B = (\\rho_{\\text{body}} - \\rho_{\\text{fluid}}) \\cdot V \\cdot g`,
    principles: [
      'Displaced Volume: For a fully submerged object, V_disp = V_body.',
      'Fluid Density Determines Upward Force: Upward force depends on FLUID density, not the body’s material.',
      'Apparent Weight Loss: Apparent mass loss in water equals the mass of displaced water.'
    ],
    formulas: [
      'F_B = \\rho_{\\text{fluid}} \\cdot V_{\\text{submerged}} \\cdot g',
      'W_{\\text{app}} = m \\cdot g - F_B'
    ],
    examTricks: [
      {
        title: 'The 1 Liter = 1 kg = 10 N Rule',
        description: `In water, every 1 liter (0.001 m³) of displaced volume generates:
• 1 kg of displaced water
• Exactly 10 N of buoyant force (using g = 10 m/s²).`,
        ruleOfThumb: 'Volume in liters × 10 = buoyant force in Newtons.'
      }
    ],
    commonTraps: [
      {
        trap: 'Using the object\'s density in the buoyancy formula',
        whyItHappens: 'Calculating F_B = \\rho_body × V × g.',
        howToAvoid: 'F_B is exerted by the FLUID, so always use \\rho_fluid!'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Buoyancy on a 5 Liter Block',
        problem: 'A solid metal block with volume 5 liters is completely submerged in water (\\rho = 1000 kg/m³, g = 10 m/s²). What is the buoyant force acting on it?',
        options: ['50 N', '5 N', '500 N', '0.5 N'],
        correctIndex: 0,
        explanation: '5 liters = 0.005 m³. Mass of displaced water = 0.005 × 1000 = 5 kg. Buoyant force F_B = m_disp × g = 5 kg × 10 m/s² = 50 N.',
        steps: [
          'Step 1: 5 L = 5 kg of water.',
          'Step 2: F_B = 5 kg × 10 m/s² = 50 N.'
        ],
        examTrick: '5 liters × 10 N/L = 50 N.'
      },
      {
        difficulty: 'Medium',
        title: 'Apparent Weight of Submerged Stone',
        problem: 'A stone has a mass of 12 kg and volume of 4 liters. When weighed submerged in water, what will the scale read?',
        options: ['8 kg (80 N)', '12 kg (120 N)', '4 kg (40 N)', '16 kg (160 N)'],
        correctIndex: 0,
        explanation: 'The stone displaces 4 liters of water, which has a mass of 4 kg. The buoyant force reduces the scale reading by 4 kg: Apparent mass = 12 kg - 4 kg = 8 kg (Apparent weight = 80 N).',
        steps: [
          'Step 1: Mass of displaced water = 4 L × 1 kg/L = 4 kg.',
          'Step 2: Apparent mass = True mass - Displaced mass = 12 kg - 4 kg = 8 kg.',
          'Step 3: Weight = 8 kg × 10 m/s² = 80 N.'
        ],
        examTrick: '12 kg - 4 kg = 8 kg.'
      },
      {
        difficulty: 'Hard',
        title: 'Density Calculation from Buoyant Weight Loss',
        problem: 'An unknown mineral weighs 50 N in air and 30 N when fully submerged in water. What is the density of the mineral?',
        options: ['2,500 kg/m³', '1,667 kg/m³', '2,000 kg/m³', '3,000 kg/m³'],
        correctIndex: 0,
        explanation: 'Weight loss = F_B = 50 N - 30 N = 20 N. Displaced water weight is 20 N (mass = 2 kg, volume = 2 liters = 0.002 m³). The mineral has mass m = 50 N / 10 = 5 kg and volume V = 0.002 m³. Density \\rho = m / V = 5 kg / 0.002 m³ = 2,500 kg/m³.',
        steps: [
          'Step 1: F_B = 50 - 30 = 20 N.',
          'Step 2: Ratio of densities = W_air / F_B = 50 / 20 = 2.5.',
          'Step 3: Density = 2.5 × \\rho_water = 2.5 × 1,000 = 2,500 kg/m³.'
        ],
        examTrick: 'Density = (Weight in air / Weight loss) × \\rho_water = (50 / 20) × 1000 = 2500 kg/m³.'
      }
    ]
  },

  'hs-swimming-floating': {
    id: 'hs-swimming-floating',
    title: 'Floating, Sinking & Suspended Equilibrium',
    submodule: 'Hydrostatics',
    module: 'Subject Module',
    overview: `When an object is placed in a fluid, three equilibrium states exist:
1. Floating (Swimming): \\rho_{\\text{body}} < \\rho_{\\text{fluid}}. The object floats partially submerged. In equilibrium:
F_B = F_G \\implies \\frac{V_{\\text{submerged}}}{V_{\\text{total}}} = \\frac{\\rho_{\\text{body}}}{\\rho_{\\text{fluid}}}
2. Suspended (Neutral Buoyancy): \\rho_{\\text{body}} = \\rho_{\\text{fluid}}. The object stays at any depth without sinking or rising.
3. Sinking: \\rho_{\\text{body}} > \\rho_{\\text{fluid}}. F_B < F_G, so the object accelerates to the bottom.`,
    principles: [
      'Submerged Fraction: Equals the ratio of body density to fluid density: V_sub / V_total = \\rho_body / \\rho_fluid.',
      'Iceberg Principle: Ice (\\rho = 900 kg/m³) in water (1000 kg/m³) is 90% submerged, with 10% above water.',
      'Equilibrium: For any floating body, the mass of displaced water EXACTLY equals the total mass of the body.'
    ],
    formulas: [
      '\\frac{V_{\\text{sub}}}{V} = \\frac{\\rho_{\\text{body}}}{\\rho_{\\text{fluid}}}'
    ],
    examTricks: [
      {
        title: 'The Submerged Fraction Shortcut',
        description: `To find the percentage submerged, simply take the ratio \\rho_body / \\rho_fluid × 100%.
• Wood (600 kg/m³) in water (1000 kg/m³) → 60% submerged.
• Oil (800 kg/m³) → 80% submerged.`,
        ruleOfThumb: 'Submerged percentage = (\\rho_body / \\rho_fluid) × 100%.'
      }
    ],
    commonTraps: [
      {
        trap: 'Confusing submerged fraction with exposed fraction',
        whyItHappens: 'Calculating 90% submerged and picking 90% when asked for the portion ABOVE water.',
        howToAvoid: 'Above water = 100% - Submerged %.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Submerged Percentage of Wood Block',
        problem: 'A wooden cube of density 700 kg/m³ floats in fresh water (1000 kg/m³). What percentage of the cube is submerged beneath the water surface?',
        options: ['70%', '30%', '80%', '50%'],
        correctIndex: 0,
        explanation: 'Submerged fraction = \\rho_wood / \\rho_water = 700 / 1000 = 0.70 = 70%. (30% remains above water).',
        steps: [
          'Step 1: Ratio = 700 / 1000 = 0.70.',
          'Step 2: Submerged % = 70%.'
        ],
        examTrick: '700 ÷ 1000 = 70%.'
      },
      {
        difficulty: 'Medium',
        title: 'Ice Melting in Water Paradox',
        problem: 'An ice cube floats in a glass filled to the brim with water. When the ice cube completely melts, what happens to the water level?',
        options: [
          'The water level remains exactly the same (does not overflow)',
          'The glass overflows',
          'The water level drops significantly',
          'Depends on the shape of the glass'
        ],
        correctIndex: 0,
        explanation: 'A floating ice cube displaces a mass of water equal to its own mass. When it melts, the melted ice turns into liquid water with that EXACT same mass and volume as the displaced water. Thus, it fills the exact submerged cavity, leaving the water level unchanged.',
        steps: [
          'Step 1: Floating body displaces water mass = ice mass: m_disp = m_ice.',
          'Step 2: When melted: V_melted = m_ice / \\rho_water = m_disp / \\rho_water = V_disp.',
          'Step 3: Melted volume equals displaced volume. Water level remains constant.'
        ],
        examTrick: 'Classic dMAT physics rule: Melting pure ice in pure water never changes the water level.'
      },
      {
        difficulty: 'Hard',
        title: 'Floating in Saltwater vs Freshwater',
        problem: 'A cargo ship floats in freshwater (\\rho = 1000 kg/m³). When it enters the ocean with saltwater (\\rho = 1030 kg/m³), what happens to the ship?',
        options: [
          'The ship rises slightly (submerged volume decreases)',
          'The ship sinks deeper (submerged volume increases)',
          'The ship stays at the exact same waterline',
          'The ship\'s buoyant force increases'
        ],
        correctIndex: 0,
        explanation: 'In both waters, the ship floats, so F_B = F_G (buoyant force equals ship weight, which is constant). F_B = \\rho_fluid · V_sub · g. In denser saltwater (\\rho increases), the submerged volume V_sub must DECREASE to maintain the same buoyant force. Therefore, the ship rises slightly in the water.',
        steps: [
          'Step 1: Buoyant force equals gravity in both cases: F_B = constant.',
          'Step 2: F_B = \\rho × V_sub × g.',
          'Step 3: Denser fluid (higher \\rho) requires smaller V_sub.',
          'Step 4: Smaller submerged volume means the ship rises.'
        ],
        examTrick: 'Denser fluid = floats higher (rises).'
      }
    ]
  },

  'hs-gas-compression': {
    id: 'hs-gas-compression',
    title: 'Gas Compression in Fluids (Cartesian Diver Principle)',
    submodule: 'Hydrostatics',
    module: 'Subject Module',
    overview: `Unlike liquids, gases are highly compressible. According to Boyle\'s Law (at constant temperature):
p_1 \\cdot V_1 = p_2 \\cdot V_2 = \\text{const}
As depth increases, hydrostatic pressure increases, compressing any trapped gas pocket. As the gas compresses:
• Its volume decreases: V(h) = \\frac{p_0}{p_0 + \\rho g h} V_0
• The displaced volume decreases
• The buoyant force decreases!
This is the operational principle of the Cartesian Diver: squeezing the bottle increases pressure, compresses the diver\'s air bubble, reduces buoyancy below gravity, and the diver sinks.`,
    principles: [
      'Boyle\'s Law: Pressure × Volume = Constant (p · V = const).',
      'Depth Halving Rule: At 10 m depth (p_abs = 2 bar), an air bubble\'s volume is halved (V = V_0 / 2).',
      'Unstable Buoyancy Feedback: As a diving body sinks, water pressure increases → air compresses → buoyancy drops → body sinks even faster!'
    ],
    formulas: [
      'V(h) = V_0 \\cdot \\frac{p_0}{p_0 + \\rho g h}',
      'F_B(h) = \\rho_{\\text{fluid}} \\cdot V(h) \\cdot g'
    ],
    examTricks: [
      {
        title: 'The 10m Bubble Halving Rule',
        description: 'Surface (1 bar) → 10 m (2 bar, volume = 1/2) → 20 m (3 bar, volume = 1/3) → 30 m (4 bar, volume = 1/4).',
        ruleOfThumb: 'At depth h, air volume = 1 / (1 + h/10) of original volume.'
      }
    ],
    commonTraps: [
      {
        trap: 'Using gauge pressure instead of absolute pressure in Boyle\'s Law',
        whyItHappens: 'Dividing by gauge pressure (e.g. 10 m = 1 bar) and thinking volume is unchanged.',
        howToAvoid: 'Boyle\'s law ALWAYS requires absolute pressure (add 1 bar atmospheric!).'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Air Bubble at 10 Meters',
        problem: 'An air bubble with volume 10 cm³ at the surface (1 bar) is pulled down to a depth of 10 m (2 bar absolute). Assuming constant temperature, what is its volume at 10 m?',
        options: ['5 cm³', '10 cm³', '2.5 cm³', '1 cm³'],
        correctIndex: 0,
        explanation: 'p₁V₁ = p₂V₂ → 1 bar × 10 cm³ = 2 bar × V₂ → V₂ = 10 / 2 = 5 cm³.',
        steps: [
          'Step 1: Surface pressure = 1 bar. Depth 10 m pressure = 2 bar.',
          'Step 2: Pressure doubles → volume halves.',
          'Step 3: 10 cm³ / 2 = 5 cm³.'
        ],
        examTrick: 'Pressure doubles from 1 to 2 bar → volume drops by half to 5 cm³.'
      },
      {
        difficulty: 'Medium',
        title: 'Cartesian Diver Sinking Trigger',
        problem: 'Why does squeezing a flexible sealed bottle containing a Cartesian diver cause the diver to sink?',
        options: [
          'The pressure compresses the diver\'s air bubble, decreasing buoyancy',
          'The squeeze pushes more water into the bottle from outside',
          'The density of the water increases significantly',
          'The diver\'s mass increases'
        ],
        correctIndex: 0,
        explanation: 'By Pascal’s principle, squeezing the bottle increases pressure everywhere in the fluid. The increased pressure compresses the trapped air bubble inside the diver. With smaller bubble volume, displaced water volume decreases, buoyant force drops below gravity, and the diver sinks.',
        steps: [
          'Step 1: Squeeze increases fluid pressure.',
          'Step 2: Trapped air bubble compresses (Boyle\'s Law).',
          'Step 3: Smaller volume = less water displaced = lower F_B.',
          'Step 4: F_B < F_G → sinks.'
        ],
        examTrick: 'Air bubble compresses → less buoyancy → sinks.'
      },
      {
        difficulty: 'Hard',
        title: 'Air Bubble Expansion from 30 Meters Depth',
        problem: 'A diver releases a 20 mL bubble at depth 30 m (4 bar abs). What will be its volume right before reaching the surface (1 bar abs)?',
        options: ['80 mL', '60 mL', '40 mL', '100 mL'],
        correctIndex: 0,
        explanation: 'At 30 m: p₁ = 1 + 3 = 4 bar. At surface: p₂ = 1 bar. By Boyle\'s law: V₂ = V₁ × (p₁ / p₂) = 20 mL × (4 / 1) = 80 mL.',
        steps: [
          'Step 1: Initial absolute pressure at 30 m = 4 bar.',
          'Step 2: Final pressure at surface = 1 bar.',
          'Step 3: Pressure decreases by factor of 4 → volume increases by factor of 4.',
          'Step 4: 20 mL × 4 = 80 mL.'
        ],
        examTrick: 'Pressure ratio 4:1 means volume expands 4x: 20 × 4 = 80 mL.'
      }
    ]
  },

  'hs-pumps': {
    id: 'hs-pumps',
    title: 'Suction Pumps & The Torricelli Atmospheric Limit',
    submodule: 'Hydrostatics',
    module: 'Subject Module',
    overview: `A suction pump functions by creating a partial vacuum above a column of liquid. It does NOT "pull" the water up; rather, atmospheric pressure on the open water surface outside PUSHES the water up the pipe.
Because atmospheric pressure is finite (p_0 \\approx 10^5 \\text{ Pa}), there is a strict theoretical maximum height to which any suction pump can lift water:
h_{\\text{max}} = \\frac{p_0}{\\rho \\cdot g} = \\frac{100,000}{1000 \\cdot 9.81} \\approx 10.33 \\text{ m}
No suction pump in the world, no matter how powerful or perfectly engineered, can lift water higher than ~10 meters! To lift water higher, a submersible push pump (pressure pump placed at the bottom) must be used.`,
    principles: [
      'Atmospheric Pushing Mechanism: Water is pushed upward by atmospheric pressure on the free surface.',
      'Torricelli Limit for Water: h_max = 10.33 m (practically ~7–8 m due to vapor pressure and friction).',
      'Mercury Barometer: Mercury (\\rho = 13,600 kg/m³) has h_max = 760 mm Hg = 0.76 m.',
      'Overcoming the Limit: Pumps must be placed AT THE BOTTOM to push water up under positive pressure.'
    ],
    formulas: [
      'h_{\\text{max}} = \\frac{p_{\\text{atm}}}{\\rho \\cdot g}'
    ],
    examTricks: [
      {
        title: 'The 10-Meter Suction Limit Rule',
        description: 'Any dMAT question proposing a suction pump at the surface to lift water from a 15 m or 20 m well is impossible! The answer is ALWAYS limited by ~10 m.',
        ruleOfThumb: 'Maximum suction lift for water is ~10 m. Beyond 10 m requires a submersible pump.'
      }
    ],
    commonTraps: [
      {
        trap: 'Believing a stronger motor can lift water higher by suction',
        whyItHappens: 'Assuming engine power creates stronger suction.',
        howToAvoid: 'A perfect motor creates a 100% vacuum (0 Pa). Beyond 0 Pa, you cannot create negative pressure.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Theoretical Maximum Suction Height',
        problem: 'Under normal atmospheric pressure of 100,000 Pa, what is the maximum theoretical height a surface suction pump can lift water (\\rho = 1000 kg/m³, g = 10 m/s²)?',
        options: ['10 m', '20 m', '100 m', 'Unlimited with a strong motor'],
        correctIndex: 0,
        explanation: 'h_max = p_atm / (\\rho g) = 100,000 / (1000 × 10) = 10 m. Even a perfect vacuum cannot exceed this height.',
        steps: [
          'Step 1: Formula h_max = p_atm / (\\rho g).',
          'Step 2: 100,000 / (1,000 × 10) = 10 m.'
        ],
        examTrick: '100,000 ÷ 10,000 = 10 m.'
      },
      {
        difficulty: 'Medium',
        title: 'Torricelli Barometer with Alcohol',
        problem: 'Atmospheric pressure is 100,000 Pa. If a Torricelli barometer uses ethyl alcohol (\\rho = 800 kg/m³) instead of mercury, what will be the height of the alcohol column (g = 10 m/s²)?',
        options: ['12.5 m', '10.0 m', '8.0 m', '0.76 m'],
        correctIndex: 0,
        explanation: 'h = p_atm / (\\rho g) = 100,000 / (800 × 10) = 100,000 / 8,000 = 12.5 m.',
        steps: [
          'Step 1: h = 100,000 / (800 × 10).',
          'Step 2: 100,000 / 8,000 = 100 / 8 = 12.5 m.'
        ],
        examTrick: '100 ÷ 8 = 12.5 m. Alcohol is less dense than water, so its column is higher.'
      },
      {
        difficulty: 'Hard',
        title: 'High Altitude Well Problem',
        problem: 'On a high mountain where atmospheric pressure drops to 70 kPa (0.7 bar), what is the maximum height water can be lifted by a surface suction pump (g = 10 m/s²)?',
        options: ['7.0 m', '10.0 m', '14.3 m', '3.0 m'],
        correctIndex: 0,
        explanation: 'h = p_atm / (\\rho g) = 70,000 Pa / (1000 × 10) = 70,000 / 10,000 = 7.0 m. At lower atmospheric pressure, suction lift decreases proportionally.',
        steps: [
          'Step 1: p_atm = 70,000 Pa.',
          'Step 2: h = 70,000 / (1,000 × 10) = 7.0 m.'
        ],
        examTrick: '70 kPa ÷ 10 kPa/m = 7.0 m.'
      }
    ]
  },

  'hs-ship-stability': {
    id: 'hs-ship-stability',
    title: 'Ship Stability, Center of Buoyancy & Metacenter',
    submodule: 'Hydrostatics',
    module: 'Subject Module',
    overview: `Floating body stability depends on the interplay between two forces and their points of action:
1. Center of Gravity (G): Point where total body weight F_G acts downward. Fixed unless cargo shifts.
2. Center of Buoyancy (B): Centroid of the SUBMERGED volume, where upward buoyant force F_B acts. Shifts as the ship heels (tilts).
Metacenter (M):
The intersection point of the vertical line through the new tilted Center of Buoyancy (B') with the original centerline of the ship.
• Stable Equilibrium: M is ABOVE G (Positive Metacentric Height GM > 0). The couple creates a RIGHTING MOMENT restoring upright posture.
• Unstable Equilibrium: M is BELOW G (GM < 0). Tilting causes an overturning moment that capsizes the ship.`,
    principles: [
      'Metacentric Height: GM = KM - KG.',
      'Stability Criterion: Stable \\iff M is ABOVE G (GM > 0).',
      'Wide Hull Effect: A wider beam (hull width) shifts the center of buoyancy B rapidly outward when heeled, moving M higher and increasing stability.',
      'High Center of Gravity Danger: Stacking heavy cargo high raises G, which can place G above M and cause capsizing.'
    ],
    formulas: [
      '\\text{Righting Moment } M_R = F_G \\cdot \\overline{GM} \\cdot \\sin(\\theta)'
    ],
    examTricks: [
      {
        title: 'M Above G = Safe',
        description: 'Remember the acronym: MAG (Metacenter Above Gravity = Stable). If G is above M, the ship flips.',
        ruleOfThumb: 'M above G = Righting moment (stable). G above M = Capsizes (unstable).'
      },
      {
        title: 'Hull Width vs Height',
        description: 'Wide and low = extremely stable. Narrow and tall = easily capsizes.',
        ruleOfThumb: 'Widening the beam increases stability exponentially.'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming B must be above G for stability',
        whyItHappens: 'Thinking buoyant force must be higher than center of mass.',
        howToAvoid: 'For surface ships, B is almost always BELOW G! Stability is guaranteed because M is above G.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Stability Condition',
        problem: 'A cargo vessel is tilted by a wave. For the ship to automatically right itself and return to upright equilibrium, where must the metacenter (M) be located?',
        options: [
          'Above the center of gravity (G)',
          'Below the center of gravity (G)',
          'At the center of buoyancy (B)',
          'At the keel of the ship'
        ],
        correctIndex: 0,
        explanation: 'When M is above G, the vertical buoyant force and the downward gravitational force create a positive restoring (righting) torque that rights the ship.',
        steps: [
          'Step 1: Check restoring torque condition.',
          'Step 2: Restoring torque requires M to be above G (GM > 0).'
        ],
        examTrick: 'M must be ABOVE G for stability.'
      },
      {
        difficulty: 'Medium',
        title: 'Cargo Loading Effect on Stability',
        problem: 'A container ship is loaded with heavy containers on its top deck rather than in the lower hold. How does this affect ship stability?',
        options: [
          'It raises the center of gravity G, reducing the metacentric height GM and decreasing stability',
          'It lowers the center of gravity G, increasing stability',
          'It moves the metacenter M higher, increasing stability',
          'It has no effect on stability because total ship weight is unchanged'
        ],
        correctIndex: 0,
        explanation: 'Placing heavy cargo high on the deck shifts the total center of gravity G upward. This reduces the distance GM between G and M. If G rises above M, the ship becomes unstable and capsizes.',
        steps: [
          'Step 1: High cargo raises G.',
          'Step 2: Distance GM = M - G shrinks.',
          'Step 3: Smaller GM means smaller righting torque and reduced stability.'
        ],
        examTrick: 'High cargo = G moves UP = stability decreases.'
      },
      {
        difficulty: 'Hard',
        title: 'Hull Geometry Comparison',
        problem: 'Ship A and Ship B have identical displacement and center of gravity G. Ship A has a wide rectangular barge hull, while Ship B has a narrow deep hull. When tilted by 5°, which ship generates a larger righting moment?',
        options: [
          'Ship A (wide hull shifts center of buoyancy further outward)',
          'Ship B (deep hull has more mass under water)',
          'Both generate identical righting moments',
          'Cannot be determined without knowing ship length'
        ],
        correctIndex: 0,
        explanation: 'When a wide hull tilts, a large triangular volume of water is immersed on the heeled side and emerged on the high side. This shifts the center of buoyancy B significantly further horizontally, producing a higher metacenter M and a much larger righting moment.',
        steps: [
          'Step 1: Wide hull has larger transverse moment of inertia (I \\propto B^3).',
          'Step 2: Metacentric radius BM = I / V is much larger for wide hull.',
          'Step 3: Higher M produces larger righting arm and moment.'
        ],
        examTrick: 'Wider beam = larger horizontal shift of B = larger righting moment.'
      }
    ]
  }
};
