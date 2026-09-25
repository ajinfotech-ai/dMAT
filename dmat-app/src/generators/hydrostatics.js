// Hydrostatics Question Generator for dMAT Subject Module
// Covers: Hydrostatic pressure (P = ρgh), absolute vs gauge pressure,
// Pascal's principle (hydraulic systems), Archimedes' principle (buoyancy, floating, apparent weight),
// U-tube manometers, barometers & atmospheric pressure, suction lift limits,
// layered fluid tanks, and hydrostatic force on submerged surfaces

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

// 1. Hydrostatic Pressure at Depth (P = ρ·g·h) with continuous parameters
function genPressureAtDepth(difficulty) {
  const liquids = [
    { name: 'fresh water', density: 1000 },
    { name: 'sea water', density: 1025 },
    { name: 'mineral oil', density: 850 },
    { name: 'ethyl alcohol', density: 790 },
    { name: 'glycerol', density: 1260 },
    { name: 'mercury', density: 13600 },
    { name: 'kerosene', density: 820 },
    { name: 'vegetable oil', density: 920 }
  ];

  const liquid = liquids[randInt(0, liquids.length - 1)];
  const depth = randInt(2, 60); // 2 to 60 meters
  const g = 10; // m/s^2 for mental arithmetic
  const pressurePa = liquid.density * g * depth;
  const pressureKPa = pressurePa / 1000;
  const pressureBar = (pressurePa / 100000).toFixed(2);

  const formatAsBar = difficulty === 'hard' || difficulty === 'challenge';
  const correctStr = formatAsBar ? `${pressureBar} bar` : `${pressureKPa.toLocaleString()} kPa`;

  const rawWrongs = formatAsBar ? [
    `${(parseFloat(pressureBar) * 1.5).toFixed(2)} bar`,
    `${(parseFloat(pressureBar) * 0.5).toFixed(2)} bar`,
    `${(parseFloat(pressureBar) + 1.25).toFixed(2)} bar`,
    `${(parseFloat(pressureBar) * 2).toFixed(2)} bar`
  ] : [
    `${Math.round(pressureKPa * 1.5).toLocaleString()} kPa`,
    `${Math.round(pressureKPa * 0.5).toLocaleString()} kPa`,
    `${(pressureKPa * 2).toLocaleString()} kPa`,
    `${(pressureKPa + 100).toLocaleString()} kPa`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => formatAsBar ? `${(parseFloat(pressureBar) + randInt(3, 15)).toFixed(2)} bar` : `${(pressureKPa + randInt(50, 400)).toLocaleString()} kPa`
  );

  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-hydrostatic-pressure',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 45,
    question: `Calculate the hydrostatic gauge pressure at a depth of ${depth} m in a storage tank filled with ${liquid.name} (density ρ = ${liquid.density} kg/m³). Assume acceleration due to gravity g = 10 m/s².`,
    options,
    correctAnswer,
    explanation: `Hydrostatic pressure is given by P = ρ · g · h.\nP = ${liquid.density} kg/m³ × 10 m/s² × ${depth} m = ${pressurePa.toLocaleString()} Pa = ${correctStr}.`,
    solutionSteps: [
      `Formula: P = ρ · g · h`,
      `Density ρ = ${liquid.density} kg/m³, g = 10 m/s², depth h = ${depth} m`,
      `P = ${liquid.density} × 10 × ${depth} = ${pressurePa.toLocaleString()} Pa`,
      `In requested units: ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['hydrostatic pressure', 'density', 'unit conversion'],
    commonTrap: 'Check unit conversion carefully: 1 bar = 100,000 Pa = 100 kPa.',
    tags: ['hydrostatics', 'pressure', difficulty]
  };
}

// 2. Absolute Pressure vs. Gauge Pressure
function genAbsolutePressure(difficulty) {
  const depth = randInt(4, 55);
  const liquids = [
    { name: 'fresh water', density: 1000 },
    { name: 'sea water', density: 1025 },
    { name: 'oil', density: 850 }
  ];
  const liq = liquids[randInt(0, liquids.length - 1)];
  const g = 10;
  const pAtmBar = 1.0;
  const pGaugeBar = (liq.density * g * depth) / 100000;
  const pAbsBar = (pAtmBar + pGaugeBar).toFixed(2);

  const correctStr = `${pAbsBar} bar`;
  const rawWrongs = [
    `${pGaugeBar.toFixed(2)} bar`, // forgot atmospheric pressure!
    `${(parseFloat(pAbsBar) + 1.0).toFixed(2)} bar`,
    `${(parseFloat(pAbsBar) * 1.5).toFixed(2)} bar`,
    `${(pGaugeBar + 2.0).toFixed(2)} bar`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${(parseFloat(pAbsBar) + randInt(3, 10)).toFixed(2)} bar`
  );

  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-absolute-pressure',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 50,
    question: `A submerged sensor is placed at a depth of ${depth} m in ${liq.name} (ρ = ${liq.density} kg/m³). If standard atmospheric pressure at the free surface is 1.00 bar (100 kPa), what is the total absolute pressure detected by the sensor? (Assume g = 10 m/s²)`,
    options,
    correctAnswer,
    explanation: `Total absolute pressure is the sum of atmospheric pressure and hydrostatic gauge pressure:\nP_abs = P_atm + ρ·g·h = 1.00 bar + (${liq.density} × 10 × ${depth})/100,000 bar = 1.00 bar + ${pGaugeBar.toFixed(2)} bar = ${correctStr}.`,
    solutionSteps: [
      `1. Gauge pressure: P_gauge = ρ · g · h = ${liq.density} × 10 × ${depth} = ${(liq.density * g * depth).toLocaleString()} Pa = ${pGaugeBar.toFixed(2)} bar`,
      `2. Atmospheric surface pressure: P_atm = 1.00 bar`,
      `3. Absolute pressure: P_abs = P_atm + P_gauge = 1.00 + ${pGaugeBar.toFixed(2)} = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['absolute pressure', 'gauge pressure', 'atmospheric pressure'],
    commonTrap: 'Do not forget to add atmospheric pressure (1 bar) at the surface to find absolute pressure.',
    tags: ['hydrostatics', 'absolute-pressure', difficulty]
  };
}

// 3. Pascal's Principle & Hydraulic Systems (F1 / A1 = F2 / A2)
function genHydraulicJack(difficulty) {
  const useDiameters = difficulty === 'hard' || difficulty === 'challenge';

  if (!useDiameters) {
    const areaRatio = randInt(4, 50);
    const forceSmall = randInt(10, 150);
    const forceLarge = forceSmall * areaRatio;

    const askForSmall = Math.random() > 0.5;
    const questionText = askForSmall
      ? `In a hydraulic press, the output piston has an area ${areaRatio} times greater than the input piston (A₂/A₁ = ${areaRatio}). What force F₁ must be applied to the input piston to lift a load of ${forceLarge.toLocaleString()} N on the output piston?`
      : `In a hydraulic system, the cross-sectional area of the slave cylinder is ${areaRatio} times that of the master cylinder (A₂/A₁ = ${areaRatio}). If an input force of ${forceSmall} N is applied to the master cylinder, what output force F₂ is exerted by the slave cylinder?`;

    const correctStr = askForSmall ? `${forceSmall.toLocaleString()} N` : `${forceLarge.toLocaleString()} N`;
    const targetVal = askForSmall ? forceSmall : forceLarge;

    const rawWrongs = [
      `${(targetVal * 2).toLocaleString()} N`,
      `${Math.max(1, Math.round(targetVal / 2)).toLocaleString()} N`,
      `${(targetVal + areaRatio * 10).toLocaleString()} N`,
      `${Math.round(targetVal * 1.5).toLocaleString()} N`
    ];

    const { options, correctAnswer } = makeUniqueOptions(
      correctStr,
      rawWrongs,
      () => `${(targetVal + randInt(50, 500)).toLocaleString()} N`
    );

    return {
      id: generateId('hs'),
      module: 'Subject Module',
      submodule: 'Hydrostatics',
      topic: 'hs-pascals-principle',
      difficulty,
      questionType: 'single_choice',
      sourceType: 'generated',
      estimatedTimeSeconds: 45,
      question: questionText,
      options,
      correctAnswer,
      explanation: `By Pascal's principle, pressure is transmitted uniformly throughout the fluid: P₁ = P₂  ⇒  F₁ / A₁ = F₂ / A₂  ⇒  F₂ = F₁ × (A₂ / A₁).`,
      solutionSteps: [
        `Pascal's Law: F₁ / A₁ = F₂ / A₂`,
        `Area ratio A₂ / A₁ = ${areaRatio}`,
        askForSmall ? `F₁ = F₂ / (A₂/A₁) = ${forceLarge} / ${areaRatio} = ${forceSmall} N` : `F₂ = F₁ × ${areaRatio} = ${forceSmall} × ${areaRatio} = ${forceLarge} N`
      ],
      useKatex: true,
      skillsTested: ['Pascal\'s law', 'hydraulic lift', 'mechanical advantage'],
      commonTrap: 'The larger piston exerts a larger force by the exact factor of the area ratio.',
      tags: ['hydrostatics', 'pascals-law', 'hydraulics', difficulty]
    };
  } else {
    const d1 = randInt(2, 6);
    const ratio = randInt(2, 6);
    const d2 = d1 * ratio;
    const areaFactor = ratio * ratio;
    const forceSmall = randInt(20, 150);
    const forceLarge = forceSmall * areaFactor;

    const correctStr = `${forceLarge.toLocaleString()} N`;
    const rawWrongs = [
      `${(forceSmall * ratio).toLocaleString()} N`, // forgot to square the diameter ratio!
      `${Math.round(forceLarge / 2).toLocaleString()} N`,
      `${(forceLarge * 2).toLocaleString()} N`,
      `${(forceSmall * (ratio + 1)).toLocaleString()} N`
    ];

    const { options, correctAnswer } = makeUniqueOptions(
      correctStr,
      rawWrongs,
      () => `${(forceLarge + randInt(200, 1500)).toLocaleString()} N`
    );

    return {
      id: generateId('hs'),
      module: 'Subject Module',
      submodule: 'Hydrostatics',
      topic: 'hs-pascals-principle',
      difficulty,
      questionType: 'single_choice',
      sourceType: 'generated',
      estimatedTimeSeconds: 60,
      question: `A hydraulic lift has a circular input piston with diameter d₁ = ${d1} cm and a circular output piston with diameter d₂ = ${d2} cm. If an input force of ${forceSmall} N is applied to the small piston, what is the maximum load F₂ that can be lifted?`,
      options,
      correctAnswer,
      explanation: `The area of a circle is proportional to the square of its diameter: A = π(d/2)². Therefore, A₂/A₁ = (d₂/d₁)² = (${d2}/${d1})² = ${ratio}² = ${areaFactor}.\nF₂ = F₁ × ${areaFactor} = ${forceSmall} × ${areaFactor} = ${correctStr}.`,
      solutionSteps: [
        `1. Diameter ratio: d₂ / d₁ = ${d2} / ${d1} = ${ratio}`,
        `2. Area ratio: A₂ / A₁ = (d₂ / d₁)² = ${ratio}² = ${areaFactor}`,
        `3. Output force: F₂ = F₁ × (A₂ / A₁) = ${forceSmall} × ${areaFactor} = ${correctStr}`
      ],
      useKatex: true,
      skillsTested: ['Pascal\'s law', 'circular area scaling', 'mechanical advantage'],
      commonTrap: 'Area scales with the SQUARE of the diameter ratio, not the diameter ratio itself!',
      tags: ['hydrostatics', 'pascals-law', 'diameters', difficulty]
    };
  }
}

// 4. Archimedes' Principle & Buoyancy (Floating vs Submerged)
function genBuoyancyArchimedes(difficulty) {
  const isFloating = difficulty === 'hard' || difficulty === 'challenge';

  if (!isFloating) {
    const vol = parseFloat((randInt(1, 25) * 0.05).toFixed(2)); // 0.05 to 1.25 m^3
    const rhoFluid = [1000, 1025, 800, 1260][randInt(0, 3)];
    const g = 10;
    const buoyantForce = Math.round(rhoFluid * vol * g);

    const correctStr = `${buoyantForce.toLocaleString()} N`;
    const rawWrongs = [
      `${Math.round(buoyantForce * 0.5).toLocaleString()} N`,
      `${Math.round(buoyantForce * 1.5).toLocaleString()} N`,
      `${Math.round(buoyantForce * 2.0).toLocaleString()} N`,
      `${Math.round(vol * rhoFluid).toLocaleString()} N`
    ];

    const { options, correctAnswer } = makeUniqueOptions(
      correctStr,
      rawWrongs,
      () => `${(buoyantForce + randInt(300, 2000)).toLocaleString()} N`
    );

    return {
      id: generateId('hs'),
      module: 'Subject Module',
      submodule: 'Hydrostatics',
      topic: 'hs-buoyancy',
      difficulty,
      questionType: 'single_choice',
      sourceType: 'generated',
      estimatedTimeSeconds: 45,
      question: `A solid metal workpiece with volume V = ${vol} m³ is fully submerged in a tank containing fluid of density ρ = ${rhoFluid} kg/m³. Calculate the buoyant force F_b exerted by the fluid on the workpiece. (Assume g = 10 m/s²)`,
      options,
      correctAnswer,
      explanation: `By Archimedes' principle, buoyant force equals the weight of displaced fluid:\nF_b = ρ_fluid · V_submerged · g = ${rhoFluid} kg/m³ × ${vol} m³ × 10 m/s² = ${correctStr}.`,
      solutionSteps: [
        `Archimedes' formula: F_b = ρ · V · g`,
        `= ${rhoFluid} kg/m³ × ${vol} m³ × 10 m/s²`,
        `= ${buoyantForce.toLocaleString()} N`
      ],
      useKatex: true,
      skillsTested: ['Archimedes principle', 'buoyancy', 'weight of displaced fluid'],
      commonTrap: 'Buoyant force depends on the fluid\'s density and the submerged volume, not the object\'s density.',
      tags: ['hydrostatics', 'buoyancy', 'archimedes', difficulty]
    };
  } else {
    const rhoBody = randInt(200, 950);
    const rhoLiquid = 1000;
    const percent = Math.round((rhoBody / rhoLiquid) * 100);
    const correctStr = `${percent}%`;

    const rawWrongs = [
      `${100 - percent}%`,
      `${Math.min(99, percent + 12)}%`,
      `${Math.max(5, percent - 15)}%`,
      `50%`
    ];

    const { options, correctAnswer } = makeUniqueOptions(
      correctStr,
      rawWrongs,
      () => `${randInt(20, 95)}%`
    );

    return {
      id: generateId('hs'),
      module: 'Subject Module',
      submodule: 'Hydrostatics',
      topic: 'hs-buoyancy',
      difficulty,
      questionType: 'single_choice',
      sourceType: 'generated',
      estimatedTimeSeconds: 50,
      question: `A solid uniform block with density ρ_body = ${rhoBody} kg/m³ floats freely in equilibrium in water (ρ_water = 1000 kg/m³). What percentage of the block's total volume is submerged below the waterline?`,
      options,
      correctAnswer,
      explanation: `For floating equilibrium: Weight = Buoyant force  ⇒  ρ_body · V_total · g = ρ_liquid · V_submerged · g  ⇒  V_submerged / V_total = ρ_body / ρ_liquid = ${rhoBody} / 1000 = ${correctStr}.`,
      solutionSteps: [
        `1. Equilibrium: Weight of block = Buoyant force`,
        `2. ρ_body · V_total = ρ_water · V_submerged`,
        `3. V_submerged / V_total = ${rhoBody} / 1000 = ${percent / 100} = ${correctStr}`
      ],
      useKatex: true,
      skillsTested: ['floating equilibrium', 'Archimedes principle', 'density ratios'],
      commonTrap: 'Check whether the question asks for the percentage submerged (below water) or protruding (above water).',
      tags: ['hydrostatics', 'buoyancy', 'floating', difficulty]
    };
  }
}

// 5. U-Tube Manometer (ρ1 · h1 = ρ2 · h2)
function genUTubeManometer(difficulty) {
  const rho1 = [1000, 1025, 1260][randInt(0, 2)];
  const rho2 = [600, 750, 800, 850, 900][randInt(0, 4)];
  const h1 = randInt(8, 45); // cm
  const h2 = Math.round((rho1 * h1) / rho2);

  const correctStr = `${h2} cm`;
  const rawWrongs = [
    `${h1} cm`,
    `${Math.round(h2 * 1.4)} cm`,
    `${Math.round(h2 * 0.7)} cm`,
    `${Math.round((rho2 * h1) / rho1)} cm`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${h2 + randInt(5, 25)} cm`
  );

  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-manometers',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 55,
    question: `A U-tube open to atmosphere on both ends contains two immiscible liquids in equilibrium: Liquid A (density ρ_A = ${rho1} kg/m³) and Liquid B (density ρ_B = ${rho2} kg/m³). If the column height of Liquid A above the interface is ${h1} cm, what is the balancing height h_B of Liquid B?`,
    options,
    correctAnswer,
    explanation: `Hydrostatic pressures at the horizontal interface level must balance: ρ_A · g · h_A = ρ_B · g · h_B  ⇒  h_B = (ρ_A / ρ_B) · h_A = (${rho1} / ${rho2}) × ${h1} cm ≈ ${correctStr}.`,
    solutionSteps: [
      `1. Pressure equality at interface: ρ_A · g · h_A = ρ_B · g · h_B`,
      `2. Cancel gravity g: ρ_A · h_A = ρ_B · h_B`,
      `3. Solve for h_B: h_B = (${rho1} × ${h1}) / ${rho2} = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['U-tube manometer', 'hydrostatic equilibrium', 'density comparison'],
    commonTrap: 'The less dense fluid will always have a GREATER column height to balance the denser fluid.',
    tags: ['hydrostatics', 'manometer', 'fluids', difficulty]
  };
}

// 6. Layered Fluid Tank Pressure
function genLayeredFluids(difficulty) {
  const hOil = randInt(2, 6);
  const hWater = randInt(2, 8);
  const rhoOil = 800;
  const rhoWater = 1000;
  const g = 10;

  const pOilKPa = (rhoOil * g * hOil) / 1000;
  const pWaterKPa = (rhoWater * g * hWater) / 1000;
  const totalGaugeKPa = pOilKPa + pWaterKPa;

  const correctStr = `${totalGaugeKPa} kPa`;
  const rawWrongs = [
    `${pWaterKPa} kPa`, // forgot oil layer!
    `${Math.round(totalGaugeKPa * 1.5)} kPa`,
    `${totalGaugeKPa + 50} kPa`,
    `${((rhoWater * g * (hOil + hWater)) / 1000)} kPa` // treated entire depth as water
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${totalGaugeKPa + randInt(20, 100)} kPa`
  );

  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-layered-fluids',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 55,
    question: `A cylindrical storage reservoir contains a ${hOil} m deep layer of oil (density ρ = 800 kg/m³) floating on top of a ${hWater} m deep layer of water (density ρ = 1000 kg/m³). What is the total gauge pressure at the bottom of the reservoir? (Take g = 10 m/s²)`,
    options,
    correctAnswer,
    explanation: `Total hydrostatic pressure at the bottom is the sum of the hydrostatic pressures exerted by each individual fluid layer:\nP_bottom = P_oil + P_water = (ρ_oil · g · h_oil) + (ρ_water · g · h_water)\n= (800 × 10 × ${hOil}) + (1000 × 10 × ${hWater}) Pa = ${(pOilKPa * 1000).toLocaleString()} + ${(pWaterKPa * 1000).toLocaleString()} Pa = ${correctStr}.`,
    solutionSteps: [
      `1. Pressure from oil layer: P_oil = 800 × 10 × ${hOil} = ${(pOilKPa * 1000).toLocaleString()} Pa = ${pOilKPa} kPa`,
      `2. Pressure from water layer: P_water = 1000 × 10 × ${hWater} = ${(pWaterKPa * 1000).toLocaleString()} Pa = ${pWaterKPa} kPa`,
      `3. Total bottom pressure: ${pOilKPa} + ${pWaterKPa} = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['layered fluids', 'additive hydrostatic pressure', 'multiple densities'],
    commonTrap: 'The bottom water experiences the weight of both the water above it AND the oil layer on top.',
    tags: ['hydrostatics', 'layered-fluids', difficulty]
  };
}

// 7. Apparent Weight of Submerged Body
function genApparentWeight(difficulty) {
  const massKg = randInt(20, 120);
  const densityBody = [2500, 2700, 3000, 7800, 8900][randInt(0, 4)]; // stone, aluminum, iron, copper
  const g = 10;
  const weightInAir = massKg * g;
  const volumeM3 = massKg / densityBody;
  const rhoWater = 1000;
  const buoyantForce = rhoWater * volumeM3 * g;
  const apparentWeight = Math.round(weightInAir - buoyantForce);

  const correctStr = `${apparentWeight} N`;
  const rawWrongs = [
    `${weightInAir} N`, // forgot buoyant force
    `${Math.round(apparentWeight * 1.3)} N`,
    `${Math.round(apparentWeight * 0.7)} N`,
    `${Math.round(buoyantForce)} N`
  ];

  const { options, correctAnswer } = makeUniqueOptions(
    correctStr,
    rawWrongs,
    () => `${apparentWeight + randInt(50, 250)} N`
  );

  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-apparent-weight',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 60,
    question: `A solid metal casting with mass m = ${massKg} kg and density ρ = ${densityBody} kg/m³ is suspended from a spring scale and completely submerged in water (ρ = 1000 kg/m³). What reading (apparent weight in Newtons) does the scale display? (Assume g = 10 m/s²)`,
    options,
    correctAnswer,
    explanation: `Apparent weight equals real weight in air minus the buoyant force:\nW_app = W_real − F_b = m·g − (ρ_water · V · g) = ${weightInAir} − (1000 × (${massKg} / ${densityBody}) × 10) ≈ ${correctStr}.`,
    solutionSteps: [
      `1. Real weight in air: W = m · g = ${massKg} × 10 = ${weightInAir} N`,
      `2. Volume of object: V = m / ρ = ${massKg} / ${densityBody} = ${volumeM3.toFixed(4)} m³`,
      `3. Buoyant force: F_b = ρ_water · V · g = 1000 × ${volumeM3.toFixed(4)} × 10 ≈ ${Math.round(buoyantForce)} N`,
      `4. Apparent weight: W_app = ${weightInAir} − ${Math.round(buoyantForce)} = ${correctStr}`
    ],
    useKatex: true,
    skillsTested: ['apparent weight', 'buoyancy', 'Archimedes principle', 'density-volume relations'],
    commonTrap: 'An object appears lighter when submerged because the upward buoyant force partially counteracts gravity.',
    tags: ['hydrostatics', 'apparent-weight', 'buoyancy', difficulty]
  };
}

// 8. Barometer & Torricelli Tube
function genBarometerQuestion(difficulty) {
  const items = [
    {
      fluid: 'mercury (density ρ = 13,600 kg/m³)',
      pAtm: 101325,
      h: '745 mm Hg',
      hExact: 760,
      unit: 'mm',
      q: 'At sea level, standard atmospheric pressure is P_atm = 101.3 kPa. In a Torricellian mercury barometer (ρ_Hg = 13,600 kg/m³, g = 9.81 m/s²), what is the height of the mercury column supported by atmospheric pressure?',
      correct: 'Approximately 760 mm',
      wrongs: ['Approximately 1,000 mm', 'Approximately 500 mm', 'Approximately 10,300 mm'],
      expl: 'h = P / (ρ·g) = 101,325 / (13,600 × 9.81) ≈ 0.760 m = 760 mm.'
    },
    {
      fluid: 'water',
      pAtm: 100000,
      h: '10.0 m',
      hExact: 10,
      unit: 'm',
      q: 'If a Torricellian barometer is constructed using water (density ρ = 1000 kg/m³) instead of mercury, approximately how tall must the glass tube be to measure standard atmospheric pressure (1.0 bar, g = 10 m/s²)?',
      correct: 'Approximately 10 metres',
      wrongs: ['Approximately 0.76 metres', 'Approximately 1.0 metre', 'Approximately 100 metres'],
      expl: 'h = P / (ρ·g) = 100,000 / (1000 × 10) = 10 m. Because water is ~13.6 times less dense than mercury, the column must be ~13.6 times taller.'
    }
  ];

  const item = items[randInt(0, items.length - 1)];
  const { options, correctAnswer } = makeUniqueOptions(
    item.correct,
    item.wrongs,
    () => `Approximately ${randInt(15, 50)} metres`
  );

  return {
    id: generateId('hs'),
    module: 'Subject Module',
    submodule: 'Hydrostatics',
    topic: 'hs-barometers',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: 50,
    question: item.q,
    options,
    correctAnswer,
    explanation: item.expl,
    solutionSteps: [item.expl],
    useKatex: true,
    skillsTested: ['Torricelli barometer', 'atmospheric pressure measurement'],
    commonTrap: 'A water barometer requires a tube over 10 metres tall due to water\'s lower density relative to mercury.',
    tags: ['hydrostatics', 'barometer', difficulty]
  };
}

// Master Generator for Hydrostatics
export function generateHydrostaticsQuestion(difficulty = 'medium') {
  const easyGenerators = [genPressureAtDepth, genAbsolutePressure, genHydraulicJack, genBuoyancyArchimedes, genBarometerQuestion];
  const mediumGenerators = [genPressureAtDepth, genAbsolutePressure, genHydraulicJack, genBuoyancyArchimedes, genUTubeManometer, genLayeredFluids, genApparentWeight, genBarometerQuestion];
  const hardGenerators = [genHydraulicJack, genBuoyancyArchimedes, genUTubeManometer, genLayeredFluids, genApparentWeight, genPressureAtDepth];
  const challengeGenerators = [genHydraulicJack, genBuoyancyArchimedes, genUTubeManometer, genLayeredFluids, genApparentWeight];

  let pool = mediumGenerators;
  if (difficulty === 'easy') pool = easyGenerators;
  else if (difficulty === 'hard') pool = hardGenerators;
  else if (difficulty === 'challenge') pool = challengeGenerators;

  const fn = pool[randInt(0, pool.length - 1)];
  return fn(difficulty);
}

export function generateHydrostaticsBank(count = 75) {
  const bank = [];
  const difficulties = ['easy', 'medium', 'hard', 'challenge'];
  const perDiff = Math.ceil(count / difficulties.length);

  for (const diff of difficulties) {
    for (let i = 0; i < perDiff; i++) {
      try {
        bank.push(generateHydrostaticsQuestion(diff));
      } catch (e) {
        console.warn('Error generating hydrostatics question:', e);
      }
    }
  }
  return bank.slice(0, count);
}
