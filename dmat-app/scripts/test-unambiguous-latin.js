import { generateId, shuffleArray } from '../src/generators/utils.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const GREEK_COLS = ['α', 'β', 'γ', 'δ', 'ε'];

/**
 * Generate a complete valid 5x5 Latin square using backtracking
 */
function generateCompleteLatin() {
  const grid = Array.from({ length: 5 }, () => Array(5).fill(null));
  const rows = Array.from({ length: 5 }, () => new Set());
  const cols = Array.from({ length: 5 }, () => new Set());

  function solve(pos) {
    if (pos === 25) return true;
    const r = Math.floor(pos / 5);
    const c = pos % 5;
    const available = LETTERS.filter(l => !rows[r].has(l) && !cols[c].has(l));
    const shuffled = shuffleArray(available);

    for (const letter of shuffled) {
      grid[r][c] = letter;
      rows[r].add(letter);
      cols[c].add(letter);

      if (solve(pos + 1)) return true;

      grid[r][c] = null;
      rows[r].delete(letter);
      cols[c].delete(letter);
    }
    return false;
  }

  solve(0);
  return grid;
}

/**
 * Test whether the target cell (targetRow, targetCol) has a UNIQUE valid solution
 * by verifying that NO alternative letter in LETTERS can complete the grid.
 */
function isTargetUniquelyDetermined(initialGrid, targetRow, targetCol, expectedAnswer) {
  function countCompletions(g, pos) {
    if (pos === 25) return 1;
    const r = Math.floor(pos / 5);
    const c = pos % 5;
    if (g[r][c] !== null) return countCompletions(g, pos + 1);

    let count = 0;
    const rowUsed = new Set(g[r].filter(Boolean));
    const colUsed = new Set();
    for (let i = 0; i < 5; i++) if (g[i][c]) colUsed.add(g[i][c]);

    for (const l of LETTERS) {
      if (!rowUsed.has(l) && !colUsed.has(l)) {
        g[r][c] = l;
        count += countCompletions(g, pos + 1);
        g[r][c] = null;
        if (count > 0) return count; // early exit as soon as one completion is found
      }
    }
    return count;
  }

  // Check every alternative letter
  for (const altLetter of LETTERS) {
    if (altLetter === expectedAnswer) continue;
    const testGrid = initialGrid.map(row => [...row]);
    const rowUsed = new Set(testGrid[targetRow].filter(Boolean));
    const colUsed = new Set();
    for (let i = 0; i < 5; i++) if (testGrid[i][targetCol]) colUsed.add(testGrid[i][targetCol]);

    // If altLetter cannot even fit in the target cell, it's immediately disqualified
    if (rowUsed.has(altLetter) || colUsed.has(altLetter)) continue;

    // Place altLetter in target cell and check if it can be completed
    testGrid[targetRow][targetCol] = altLetter;
    if (countCompletions(testGrid, 0) > 0) {
      // Ambiguous! altLetter forms a valid completion
      return false;
    }
  }

  return true;
}

/**
 * Simulate human step-by-step logical deduction:
 * 1. Naked singles (only 1 letter can legally fit in a cell given its row and col)
 * 2. Hidden singles in rows (a missing letter can only go in one empty column of that row)
 * 3. Hidden singles in cols (a missing letter can only go in one empty row of that col)
 * Prioritizes directly deducing the target cell '?' whenever possible.
 */
function solveStepByStep(initialGrid, targetRow, targetCol) {
  const g = initialGrid.map(r => [...r]);
  const steps = [];

  function checkNakedSingle(r, c) {
    if (g[r][c] !== null) return null;
    const rowUsed = new Set(g[r].filter(Boolean));
    const colUsed = new Set();
    for (let i = 0; i < 5; i++) if (g[i][c]) colUsed.add(g[i][c]);
    const possible = LETTERS.filter(l => !rowUsed.has(l) && !colUsed.has(l));
    if (possible.length === 1) return { val: possible[0], rowUsed: [...rowUsed], colUsed: [...colUsed] };
    return null;
  }

  function checkHiddenSingleRow(r, targetC) {
    if (g[r][targetC] !== null) return null;
    const rowLetters = new Set(g[r].filter(Boolean));
    for (const l of LETTERS) {
      if (rowLetters.has(l)) continue;
      const candidateCols = [];
      for (let c = 0; c < 5; c++) {
        if (g[r][c] === null) {
          let colHas = false;
          for (let i = 0; i < 5; i++) if (g[i][c] === l) { colHas = true; break; }
          if (!colHas) candidateCols.push(c);
        }
      }
      if (candidateCols.length === 1 && candidateCols[0] === targetC) {
        return { val: l };
      }
    }
    return null;
  }

  function checkHiddenSingleCol(targetR, c) {
    if (g[targetR][c] !== null) return null;
    const colLetters = new Set();
    for (let i = 0; i < 5; i++) if (g[i][c]) colLetters.add(g[i][c]);
    for (const l of LETTERS) {
      if (colLetters.has(l)) continue;
      const candidateRows = [];
      for (let r = 0; r < 5; r++) {
        if (g[r][c] === null && !g[r].includes(l)) {
          candidateRows.push(r);
        }
      }
      if (candidateRows.length === 1 && candidateRows[0] === targetR) {
        return { val: l };
      }
    }
    return null;
  }

  let progress = true;
  while (progress) {
    progress = false;

    // 1. Check if target cell '?' can be deduced immediately
    const targetNaked = checkNakedSingle(targetRow, targetCol);
    if (targetNaked) {
      const greekCol = GREEK_COLS[targetCol];
      const otherLetters = LETTERS.filter(x => x !== targetNaked.val).join(', ');
      steps.push({
        r: targetRow, c: targetCol, val: targetNaked.val, isTarget: true,
        description: `Target cell "?" at Row ${targetRow + 1}, Column ${greekCol} (${greekCol}${targetRow + 1}): All other letters (${otherLetters}) already appear in Row ${targetRow + 1} or Column ${greekCol}. Therefore, "?" must be "${targetNaked.val}".`
      });
      return { solved: true, steps, answer: targetNaked.val };
    }

    const targetHRow = checkHiddenSingleRow(targetRow, targetCol);
    if (targetHRow) {
      const greekCol = GREEK_COLS[targetCol];
      steps.push({
        r: targetRow, c: targetCol, val: targetHRow.val, isTarget: true,
        description: `Target cell "?" at Row ${targetRow + 1}, Column ${greekCol} (${greekCol}${targetRow + 1}): Letter "${targetHRow.val}" is missing in Row ${targetRow + 1}, and all other empty cells in Row ${targetRow + 1} have "${targetHRow.val}" in their columns. Therefore, "?" must be "${targetHRow.val}".`
      });
      return { solved: true, steps, answer: targetHRow.val };
    }

    const targetHCol = checkHiddenSingleCol(targetRow, targetCol);
    if (targetHCol) {
      const greekCol = GREEK_COLS[targetCol];
      steps.push({
        r: targetRow, c: targetCol, val: targetHCol.val, isTarget: true,
        description: `Target cell "?" at Row ${targetRow + 1}, Column ${greekCol} (${greekCol}${targetRow + 1}): Letter "${targetHCol.val}" is missing in Column ${greekCol}, and all other empty cells in Column ${greekCol} have "${targetHCol.val}" in their rows. Therefore, "?" must be "${targetHCol.val}".`
      });
      return { solved: true, steps, answer: targetHCol.val };
    }

    // 2. Find any naked single helper cell
    let foundHelper = false;
    for (let r = 0; r < 5 && !foundHelper; r++) {
      for (let c = 0; c < 5 && !foundHelper; c++) {
        if (r === targetRow && c === targetCol) continue;
        const naked = checkNakedSingle(r, c);
        if (naked) {
          g[r][c] = naked.val;
          const greekCol = GREEK_COLS[c];
          steps.push({
            r, c, val: naked.val, isTarget: false,
            description: `Helper cell at Row ${r + 1}, Column ${greekCol} (${greekCol}${r + 1}): All letters except "${naked.val}" appear in Row ${r + 1} or Column ${greekCol}, forcing this cell to "${naked.val}".`
          });
          progress = true;
          foundHelper = true;
        }
      }
    }

    if (progress) continue;

    // 3. Find hidden single in rows
    for (let r = 0; r < 5 && !foundHelper; r++) {
      const rowLetters = new Set(g[r].filter(Boolean));
      for (const l of LETTERS) {
        if (rowLetters.has(l)) continue;
        const candidateCols = [];
        for (let c = 0; c < 5; c++) {
          if (g[r][c] === null) {
            let colHas = false;
            for (let i = 0; i < 5; i++) if (g[i][c] === l) { colHas = true; break; }
            if (!colHas) candidateCols.push(c);
          }
        }
        if (candidateCols.length === 1) {
          const c = candidateCols[0];
          g[r][c] = l;
          const greekCol = GREEK_COLS[c];
          steps.push({
            r, c, val: l, isTarget: r === targetRow && c === targetCol,
            description: `Row ${r + 1}: Letter "${l}" can only fit in Column ${greekCol} (${greekCol}${r + 1}) because other empty positions have "${l}" in their columns.`
          });
          progress = true;
          foundHelper = true;
          if (r === targetRow && c === targetCol) {
            return { solved: true, steps, answer: l };
          }
          break;
        }
      }
    }

    if (progress) continue;

    // 4. Find hidden single in columns
    for (let c = 0; c < 5 && !foundHelper; c++) {
      const colLetters = new Set();
      for (let i = 0; i < 5; i++) if (g[i][c]) colLetters.add(g[i][c]);
      for (const l of LETTERS) {
        if (colLetters.has(l)) continue;
        const candidateRows = [];
        for (let r = 0; r < 5; r++) {
          if (g[r][c] === null && !g[r].includes(l)) {
            candidateRows.push(r);
          }
        }
        if (candidateRows.length === 1) {
          const r = candidateRows[0];
          g[r][c] = l;
          const greekCol = GREEK_COLS[c];
          steps.push({
            r, c, val: l, isTarget: r === targetRow && c === targetCol,
            description: `Column ${greekCol}: Letter "${l}" can only fit in Row ${r + 1} (${greekCol}${r + 1}) because other empty positions have "${l}" in their rows.`
          });
          progress = true;
          foundHelper = true;
          if (r === targetRow && c === targetCol) {
            return { solved: true, steps, answer: l };
          }
          break;
        }
      }
    }
  }

  return { solved: g[targetRow][targetCol] !== null, steps, answer: g[targetRow][targetCol] };
}

/**
 * Generate a guaranteed unambiguous Latin Square question
 */
export function generateLatinSquareQuestion(difficulty = 'medium', seed = null) {
  const stepRequirements = {
    easy: { minSteps: 1, maxSteps: 2, minClues: 16, maxClues: 19 },
    medium: { minSteps: 2, maxSteps: 4, minClues: 13, maxClues: 16 },
    hard: { minSteps: 3, maxSteps: 6, minClues: 10, maxClues: 13 },
    challenge: { minSteps: 4, maxSteps: 9, minClues: 8, maxClues: 11 }
  }[difficulty] || { minSteps: 2, maxSteps: 4, minClues: 13, maxClues: 16 };

  let bestPuzzle = null;

  for (let attempt = 0; attempt < 60; attempt++) {
    const fullGrid = generateCompleteLatin();
    const targetRow = Math.floor(Math.random() * 5);
    const targetCol = Math.floor(Math.random() * 5);
    const answer = fullGrid[targetRow][targetCol];

    const revealed = fullGrid.map(r => [...r]);
    revealed[targetRow][targetCol] = null;

    const cells = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r !== targetRow || c !== targetCol) {
          cells.push([r, c]);
        }
      }
    }
    const shuffledCells = shuffleArray(cells);

    let cluesLeft = 24;
    for (const [r, c] of shuffledCells) {
      if (cluesLeft <= stepRequirements.minClues) break;
      const originalVal = revealed[r][c];
      revealed[r][c] = null;

      // Uniqueness check: NO other letter can complete the grid
      if (!isTargetUniquelyDetermined(revealed, targetRow, targetCol, answer)) {
        revealed[r][c] = originalVal;
        continue;
      }

      // Logic check: Can target be solved by pure logic?
      const logic = solveStepByStep(revealed, targetRow, targetCol);
      if (!logic.solved) {
        revealed[r][c] = originalVal;
        continue;
      }

      cluesLeft--;
    }

    const finalLogic = solveStepByStep(revealed, targetRow, targetCol);
    if (finalLogic.solved && isTargetUniquelyDetermined(revealed, targetRow, targetCol, answer)) {
      const stepCount = finalLogic.steps.length;
      const meetsSteps = stepCount >= stepRequirements.minSteps && stepCount <= stepRequirements.maxSteps;

      bestPuzzle = {
        grid: fullGrid,
        revealed,
        targetRow,
        targetCol,
        answer,
        steps: finalLogic.steps,
        cluesCount: cluesLeft
      };

      if (meetsSteps) break;
    }
  }

  // Fallback if loop didn't find exact step match: create guaranteed direct puzzle
  if (!bestPuzzle) {
    const fullGrid = generateCompleteLatin();
    const targetRow = Math.floor(Math.random() * 5);
    const targetCol = Math.floor(Math.random() * 5);
    const answer = fullGrid[targetRow][targetCol];
    const revealed = fullGrid.map(r => [...r]);
    revealed[targetRow][targetCol] = null;
    const finalLogic = solveStepByStep(revealed, targetRow, targetCol);
    bestPuzzle = {
      grid: fullGrid,
      revealed,
      targetRow,
      targetCol,
      answer,
      steps: finalLogic.steps,
      cluesCount: 24
    };
  }

  const correctAnswer = bestPuzzle.answer;
  const options = ['A', 'B', 'C', 'D', 'E'];
  const correctIndex = options.indexOf(correctAnswer);

  const greekTargetCol = GREEK_COLS[bestPuzzle.targetCol];
  const targetCoord = `${greekTargetCol}${bestPuzzle.targetRow + 1}`;

  const explanationLines = [
    `Target: Find the letter for "?" at position ${targetCoord} (Row ${bestPuzzle.targetRow + 1}, Column ${greekTargetCol}).`,
    ``,
    `Step-by-Step Solution Path:`,
    ...bestPuzzle.steps.map((st, i) => `${i + 1}. ${st.description}`),
    ``,
    `Conclusion: The letter that belongs in the cell marked "?" is "${correctAnswer}".`
  ];

  const estimatedTime = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 60 : difficulty === 'hard' ? 90 : 120;

  return {
    id: generateId('ls'),
    module: 'Core Module',
    submodule: 'Latin Squares',
    topic: bestPuzzle.steps.length <= 1 ? 'ls-direct-elimination' : 'ls-multi-step',
    difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: estimatedTime,
    question: `In the 5×5 grid below, each letter (A–E) appears exactly once in each row and column. Which letter belongs in the cell marked with "?"?`,
    gridData: {
      grid: bestPuzzle.revealed,
      targetRow: bestPuzzle.targetRow,
      targetCol: bestPuzzle.targetCol,
      fullGrid: bestPuzzle.grid,
      columnLabels: GREEK_COLS,
      rowLabels: [1, 2, 3, 4, 5]
    },
    options,
    correctAnswer: correctIndex,
    explanation: explanationLines.join('\n'),
    solutionSteps: explanationLines,
    skillsTested: ['logical deduction', 'constraint satisfaction', 'elimination strategies'],
    commonTrap: 'Do not guess or check only the immediate row/column. When letters are missing in multiple positions, trace forced deductions step-by-step.',
    tags: ['latin-square', 'logic', 'grid-puzzle', 'dmat-core']
  };
}

// Generate full question bank
export function generateLatinSquareBank(count = 75) {
  const questions = [];
  const difficulties = { easy: 0.25, medium: 0.35, hard: 0.25, challenge: 0.15 };

  Object.entries(difficulties).forEach(([diff, ratio]) => {
    const n = Math.ceil(count * ratio);
    for (let i = 0; i < n; i++) {
      questions.push(generateLatinSquareQuestion(diff));
    }
  });

  return questions;
}

// Self-test
console.log('Testing generateLatinSquareBank(20)...');
const sampleBank = generateLatinSquareBank(20);
console.log(`Generated ${sampleBank.length} questions.`);

let ambiguousCount = 0;
let unsolvableCount = 0;

sampleBank.forEach((q, idx) => {
  const gd = q.gridData;
  const isUniq = isTargetUniquelyDetermined(gd.grid, gd.targetRow, gd.targetCol, q.options[q.correctAnswer]);
  const logic = solveStepByStep(gd.grid, gd.targetRow, gd.targetCol);
  if (!isUniq) {
    ambiguousCount++;
    console.error(`Question ${idx + 1} is AMBIGUOUS!`);
  }
  if (!logic.solved) {
    unsolvableCount++;
    console.error(`Question ${idx + 1} is NOT logically solvable!`);
  }
});

console.log(`Results: Ambiguous = ${ambiguousCount}, Unsolvable = ${unsolvableCount}`);
if (ambiguousCount === 0 && unsolvableCount === 0) {
  console.log('ALL PUZZLES 100% UNAMBIGUOUS AND 100% LOGICALLY SOLVABLE!');
}
