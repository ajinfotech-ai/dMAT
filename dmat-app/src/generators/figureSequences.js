// Figure Sequences Visual Question Generator
// Based on dMAT Core Module - Figure Sequences subtest
// Generates SVG-based matrix sequence puzzles with transformation rules

import { generateId, shuffleArray, COLORS, COLOR_NAMES, SHAPE_NAMES, seededRandom } from './utils.js';

const GRID_SIZE = 4; // 4x4 matrix
const CELL_SIZE = 40;
const PADDING = 4;

// Border path positions (12 border cells in 4x4 matrix)
function getBorderPositions(size) {
  const positions = [];
  // Top row left to right
  for (let c = 0; c < size; c++) positions.push([0, c]);
  // Right column top to bottom
  for (let r = 1; r < size; r++) positions.push([r, size - 1]);
  // Bottom row right to left
  for (let c = size - 2; c >= 0; c--) positions.push([size - 1, c]);
  // Left column bottom to top
  for (let r = size - 2; r >= 1; r--) positions.push([r, 0]);
  return positions;
}

const BORDER_POSITIONS = getBorderPositions(GRID_SIZE);

// Closed-form triangle wave bounce formula on 1D grid
function bounceCoord(startCoord, speed, step, size = GRID_SIZE) {
  if (speed === 0) return startCoord;
  const period = 2 * (size - 1); // 6 for size 4
  const raw = startCoord + speed * step;
  const m = ((raw % period) + period) % period;
  return m < size ? m : period - m;
}

// Figure class
class Figure {
  constructor(shape, color, row, col, rotation = 0) {
    this.shape = shape;
    this.color = color;
    this.row = row;
    this.col = col;
    this.rotation = rotation; // degrees
  }

  clone() {
    return new Figure(this.shape, this.color, this.row, this.col, this.rotation);
  }
}

// Render a matrix of figures to SVG string
export function renderMatrix(figures, size = GRID_SIZE) {
  const cellSize = CELL_SIZE;
  const totalSize = cellSize * size + PADDING * 2;

  let svg = `<svg viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">`;

  // Background
  svg += `<rect width="${totalSize}" height="${totalSize}" fill="#f1f5f9" rx="6" />`;

  // Grid lines
  for (let i = 0; i <= size; i++) {
    const pos = PADDING + i * cellSize;
    svg += `<line x1="${PADDING}" y1="${pos}" x2="${totalSize - PADDING}" y2="${pos}" stroke="#cbd5e1" stroke-width="1" />`;
    svg += `<line x1="${pos}" y1="${PADDING}" x2="${pos}" y2="${totalSize - PADDING}" stroke="#cbd5e1" stroke-width="1" />`;
  }

  // Figures
  figures.forEach(fig => {
    const cx = PADDING + fig.col * cellSize + cellSize / 2;
    const cy = PADDING + fig.row * cellSize + cellSize / 2;
    const color = COLORS[fig.color] || fig.color;
    const fSize = cellSize * 0.65;

    svg += `<g transform="rotate(${fig.rotation || 0} ${cx} ${cy})">`;

    switch (fig.shape) {
      case 'circle':
        svg += `<circle cx="${cx}" cy="${cy}" r="${fSize / 2}" fill="${color}" />`;
        break;
      case 'square':
        svg += `<rect x="${cx - fSize / 2}" y="${cy - fSize / 2}" width="${fSize}" height="${fSize}" fill="${color}" rx="2" />`;
        break;
      case 'triangle': {
        const h = fSize * 0.866;
        svg += `<polygon points="${cx},${cy - h / 2} ${cx - fSize / 2},${cy + h / 2} ${cx + fSize / 2},${cy + h / 2}" fill="${color}" />`;
        break;
      }
      case 'diamond':
        svg += `<polygon points="${cx},${cy - fSize / 2} ${cx + fSize / 2},${cy} ${cx},${cy + fSize / 2} ${cx - fSize / 2},${cy}" fill="${color}" />`;
        break;
      case 'star': {
        const pts = [];
        for (let i = 0; i < 5; i++) {
          const outerAngle = (i * 72 - 90) * Math.PI / 180;
          const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
          pts.push(`${cx + fSize / 2 * Math.cos(outerAngle)},${cy + fSize / 2 * Math.sin(outerAngle)}`);
          pts.push(`${cx + fSize / 4 * Math.cos(innerAngle)},${cy + fSize / 4 * Math.sin(innerAngle)}`);
        }
        svg += `<polygon points="${pts.join(' ')}" fill="${color}" />`;
        break;
      }
      case 'cross': {
        const w = fSize / 3;
        svg += `<rect x="${cx - w / 2}" y="${cy - fSize / 2}" width="${w}" height="${fSize}" fill="${color}" rx="1" />`;
        svg += `<rect x="${cx - fSize / 2}" y="${cy - w / 2}" width="${fSize}" height="${w}" fill="${color}" rx="1" />`;
        break;
      }
      default:
        svg += `<circle cx="${cx}" cy="${cy}" r="${fSize / 2}" fill="${color}" />`;
        break;
    }

    svg += `</g>`;
  });

  svg += `</svg>`;
  return svg;
}

// Compute figure state at any step t using deterministic rules
function getFigureAtStep(initFig, rule, step) {
  const f = initFig.clone();

  switch (rule.type) {
    case 'linear-bounce': {
      f.row = bounceCoord(initFig.row, rule.dr, step, GRID_SIZE);
      f.col = bounceCoord(initFig.col, rule.dc, step, GRID_SIZE);
      break;
    }
    case 'border-cycle': {
      const len = BORDER_POSITIONS.length; // 12
      const newIdx = (((rule.startIdx + rule.direction * rule.steps * step) % len) + len) % len;
      f.row = BORDER_POSITIONS[newIdx][0];
      f.col = BORDER_POSITIONS[newIdx][1];
      break;
    }
  }

  // Rotation (meaningful for asymmetrical shapes)
  if (rule.rotateSpeed) {
    f.rotation = (initFig.rotation + rule.rotateSpeed * step) % 360;
  }

  // Color alternation
  if (rule.colors && rule.colors.length > 0) {
    f.color = rule.colors[step % rule.colors.length];
  }

  return f;
}

// Generate sequence of matrices
function generateMatrixSequence(initialFigures, rules, length = 6) {
  const sequence = [];
  for (let t = 0; t < length; t++) {
    const stepFigures = initialFigures.map((fig, i) => getFigureAtStep(fig, rules[i], t));
    sequence.push(stepFigures);
  }
  return sequence;
}

// Generate 3 unique wrong answer matrices
function generateDistractors(answerMatrix, sequence, initialFigures, rules) {
  const correctSvg = renderMatrix(answerMatrix);
  const seenSvgs = new Set([correctSvg]);
  const distractors = [];

  // Candidate 1: Step 3 (the previous matrix in sequence)
  const prevStepSvg = renderMatrix(sequence[3]);
  if (!seenSvgs.has(prevStepSvg)) {
    distractors.push(sequence[3]);
    seenSvgs.add(prevStepSvg);
  }

  // Candidate 2: Step 5 (the next matrix after target)
  const nextStepSvg = renderMatrix(sequence[5]);
  if (!seenSvgs.has(nextStepSvg)) {
    distractors.push(sequence[5]);
    seenSvgs.add(nextStepSvg);
  }

  // Candidate 3: Perturbed variations (shifted position or color/rotation)
  const candidatePerturbations = [
    // Shift row +1
    figs => figs.map(f => { const c = f.clone(); c.row = (c.row + 1) % GRID_SIZE; return c; }),
    // Shift col +1
    figs => figs.map(f => { const c = f.clone(); c.col = (c.col + 1) % GRID_SIZE; return c; }),
    // Shift row -1
    figs => figs.map(f => { const c = f.clone(); c.row = (c.row + GRID_SIZE - 1) % GRID_SIZE; return c; }),
    // Shift col -1
    figs => figs.map(f => { const c = f.clone(); c.col = (c.col + GRID_SIZE - 1) % GRID_SIZE; return c; }),
    // Rotate +90
    figs => figs.map(f => { const c = f.clone(); c.rotation = (c.rotation + 90) % 360; return c; }),
    // Change color
    figs => figs.map(f => {
      const c = f.clone();
      const otherColors = COLOR_NAMES.filter(clr => clr !== c.color && clr !== 'white' && clr !== 'grey');
      c.color = otherColors[Math.floor(Math.random() * otherColors.length)] || 'blue';
      return c;
    })
  ];

  for (const perturbFn of shuffleArray([...candidatePerturbations])) {
    if (distractors.length >= 3) break;
    const testFigs = perturbFn(answerMatrix);
    const testSvg = renderMatrix(testFigs);
    if (!seenSvgs.has(testSvg)) {
      distractors.push(testFigs);
      seenSvgs.add(testSvg);
    }
  }

  // Guarantee 3 distractors by systematic grid placement
  let attempt = 0;
  while (distractors.length < 3 && attempt < 25) {
    attempt++;
    const fallbackFigs = answerMatrix.map((f, i) => {
      const c = f.clone();
      c.row = (c.row + attempt) % GRID_SIZE;
      c.col = (c.col + attempt * 2) % GRID_SIZE;
      return c;
    });
    const fallbackSvg = renderMatrix(fallbackFigs);
    if (!seenSvgs.has(fallbackSvg)) {
      distractors.push(fallbackFigs);
      seenSvgs.add(fallbackSvg);
    }
  }

  return distractors.slice(0, 3);
}

// Generate a complete Figure Sequence question
export function generateFigureSequenceQuestion(difficulty = 'medium', seed = null) {
  const figureCount = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;

  // Shapes pool
  const shapesPool = ['triangle', 'square', 'circle', 'diamond', 'star', 'cross'];
  const colorsPool = ['red', 'blue', 'green', 'amber', 'purple', 'teal'];

  const selectedShapes = shuffleArray([...shapesPool]).slice(0, figureCount);
  const selectedColors = shuffleArray([...colorsPool]).slice(0, figureCount);

  const initialFigures = [];
  const rules = [];

  for (let i = 0; i < figureCount; i++) {
    const shape = selectedShapes[i];
    const color = selectedColors[i];

    let startRow, startCol, rule;

    if (difficulty === 'easy') {
      // Single element, linear bounce (horizontal or vertical)
      const isHorizontal = Math.random() > 0.5;
      startRow = isHorizontal ? Math.floor(Math.random() * GRID_SIZE) : Math.floor(Math.random() * 2) + 1;
      startCol = isHorizontal ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * GRID_SIZE);

      const dr = isHorizontal ? 0 : (Math.random() > 0.5 ? 1 : -1);
      const dc = isHorizontal ? (Math.random() > 0.5 ? 1 : -1) : 0;

      rule = {
        type: 'linear-bounce',
        dr,
        dc,
        rotateSpeed: 0,
        colors: null,
        description: `moves ${dr === 1 ? 'downwards' : dr === -1 ? 'upwards' : dc === 1 ? 'rightwards' : 'leftwards'} by 1 field per step and bounces cleanly upon reaching the grid boundary`
      };
    } else if (difficulty === 'medium') {
      // Linear bounce + rotation or color alternation
      const moveType = Math.random();
      if (moveType < 0.6) {
        // Diagonal or linear bounce
        const dirs = [
          { dr: 1, dc: 0, name: 'downwards' },
          { dr: -1, dc: 0, name: 'upwards' },
          { dr: 0, dc: 1, name: 'rightwards' },
          { dr: 0, dc: -1, name: 'leftwards' },
          { dr: 1, dc: 1, name: 'diagonally down-right' },
          { dr: -1, dc: 1, name: 'diagonally up-right' }
        ];
        const chosen = dirs[Math.floor(Math.random() * dirs.length)];
        startRow = Math.floor(Math.random() * GRID_SIZE);
        startCol = Math.floor(Math.random() * GRID_SIZE);

        const hasRotation = shape === 'triangle';
        const rotateSpeed = hasRotation ? (Math.random() > 0.5 ? 90 : -90) : 0;

        rule = {
          type: 'linear-bounce',
          dr: chosen.dr,
          dc: chosen.dc,
          rotateSpeed,
          colors: null,
          description: `moves ${chosen.name} and bounces off boundaries${hasRotation ? ` while rotating 90° ${rotateSpeed > 0 ? 'clockwise' : 'counter-clockwise'} each step` : ''}`
        };
      } else {
        // Border cycle clockwise or counter-clockwise
        const startIdx = Math.floor(Math.random() * BORDER_POSITIONS.length);
        startRow = BORDER_POSITIONS[startIdx][0];
        startCol = BORDER_POSITIONS[startIdx][1];
        const isCw = Math.random() > 0.5;

        rule = {
          type: 'border-cycle',
          startIdx,
          direction: isCw ? 1 : -1,
          steps: 1,
          rotateSpeed: 0,
          colors: null,
          description: `travels along the outer perimeter ${isCw ? 'clockwise' : 'counter-clockwise'} by 1 field per step`
        };
      }
    } else {
      // Hard / Challenge: Multiple interacting figures, diagonal bounces, color alternation
      startRow = Math.floor(Math.random() * GRID_SIZE);
      startCol = Math.floor(Math.random() * GRID_SIZE);

      const color2 = colorsPool.find(c => c !== color) || 'purple';
      const rotateSpeed = shape === 'triangle' ? 90 : 0;

      const dr = Math.random() > 0.5 ? 1 : -1;
      const dc = Math.random() > 0.5 ? 1 : -1;

      rule = {
        type: 'linear-bounce',
        dr,
        dc,
        rotateSpeed,
        colors: [color, color2],
        description: `moves diagonally (${dr > 0 ? 'down' : 'up'}-${dc > 0 ? 'right' : 'left'}) bouncing off boundaries while alternating colour between ${color} and ${color2}`
      };
    }

    initialFigures.push(new Figure(shape, color, startRow, startCol, 0));
    rules.push(rule);
  }

  // Generate sequence of 6 steps
  const sequence = generateMatrixSequence(initialFigures, rules, 6);

  // Shown: Step 0, 1, 2, 3 (first 4 matrices)
  const shownMatrices = sequence.slice(0, 4);
  // Target: Step 4 (Matrix 5)
  const answerMatrix = sequence[4];

  // Distractors
  const distractors = generateDistractors(answerMatrix, sequence, initialFigures, rules);

  // Render SVG strings
  const shownSVGs = shownMatrices.map(m => renderMatrix(m));
  const correctSVG = renderMatrix(answerMatrix);
  const distractorSVGs = distractors.map(m => renderMatrix(m));

  // Build 4 unique options
  const optionEntries = [
    { svg: correctSVG, isCorrect: true },
    { svg: distractorSVGs[0], isCorrect: false },
    { svg: distractorSVGs[1], isCorrect: false },
    { svg: distractorSVGs[2], isCorrect: false }
  ];

  // Shuffle options so correct answer is randomly A, B, C, or D
  const shuffledOptions = shuffleArray(optionEntries);
  const correctAnswerIndex = shuffledOptions.findIndex(o => o.isCorrect);

  // Option text labels
  const options = shuffledOptions.map(o => o.svg);

  // Solution explanation steps
  const solutionSteps = [
    `Analyze each figure independently across the 4 observed sequence matrices.`,
    ...rules.map((r, i) => `Figure ${i + 1} (${initialFigures[i].shape}, ${initialFigures[i].color}): ${r.description}.`),
    `At step 4 (position 5), the correct state corresponds to Option ${correctAnswerIndex + 1}.`
  ];

  const explanation = `In this visual sequence:\n${rules.map((r, i) => `• ${initialFigures[i].shape} (${initialFigures[i].color}): ${r.description}`).join('\n')}\n\nTracing this trajectory forward to the 5th matrix yields Option ${correctAnswerIndex + 1}.`;

  return {
    id: generateId('fs'),
    module: 'Core Module',
    submodule: 'Figure Sequences',
    topic: 'Figure Sequences',
    difficulty,
    questionType: 'visual_choice',
    question: 'Identify the logical pattern in the sequence of matrices and determine the next matrix.',
    questionText: 'Identify the logical pattern in the sequence of matrices and determine the next matrix.',
    sequenceSVGs: shownSVGs,
    options,
    optionSVGs: options,
    correctAnswer: correctAnswerIndex,
    explanation,
    solutionSteps,
    estimatedTimeSeconds: difficulty === 'easy' ? 45 : difficulty === 'medium' ? 75 : 100,
    tags: ['figure-sequences', 'core-module', difficulty, 'visual-matrix']
  };
}

// Generate bank of figure sequence questions
export function generateFigureSequenceBank(count = 50) {
  const bank = [];
  const difficulties = ['easy', 'medium', 'hard', 'challenge'];
  const perDiff = Math.ceil(count / difficulties.length);

  for (const diff of difficulties) {
    for (let i = 0; i < perDiff; i++) {
      try {
        bank.push(generateFigureSequenceQuestion(diff));
      } catch (e) {
        console.warn('Error generating figure sequence question:', e);
      }
    }
  }

  return bank.slice(0, count);
}
