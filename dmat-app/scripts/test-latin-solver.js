const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Exact check: does cell (targetRow, targetCol) have a STRICTLY UNIQUE answer?
function getPossibleTargetValues(initialGrid, targetRow, targetCol) {
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
        if (count > 10) return count; // early exit
      }
    }
    return count;
  }

  const validLetters = [];
  for (const l of LETTERS) {
    const testGrid = initialGrid.map(row => [...row]);
    const rowUsed = new Set(testGrid[targetRow].filter(Boolean));
    const colUsed = new Set();
    for (let i = 0; i < 5; i++) if (testGrid[i][targetCol]) colUsed.add(testGrid[i][targetCol]);

    if (!rowUsed.has(l) && !colUsed.has(l)) {
      testGrid[targetRow][targetCol] = l;
      if (countCompletions(testGrid, 0) > 0) {
        validLetters.push(l);
      }
    }
  }
  return validLetters;
}

// Logical deduction step-by-step
function solveLogicalDeduction(initialGrid, targetRow, targetCol) {
  const g = initialGrid.map(r => [...r]);
  const steps = [];

  let progress = true;
  while (progress) {
    progress = false;

    // 1. Naked singles
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (g[r][c] !== null) continue;

        const rowUsed = new Set(g[r].filter(Boolean));
        const colUsed = new Set();
        for (let i = 0; i < 5; i++) if (g[i][c]) colUsed.add(g[i][c]);

        const possible = LETTERS.filter(l => !rowUsed.has(l) && !colUsed.has(l));
        if (possible.length === 1) {
          const val = possible[0];
          g[r][c] = val;
          steps.push({
            r, c, val,
            description: `Row ${r + 1}, column ${c + 1}: only "${val}" is missing from row/column.`
          });
          progress = true;
          if (r === targetRow && c === targetCol) {
            return { solved: true, steps, answer: val };
          }
        }
      }
    }

    if (progress) continue;

    // 2. Hidden singles in rows
    for (let r = 0; r < 5; r++) {
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
          steps.push({
            r, c, val: l,
            description: `Row ${r + 1}: letter "${l}" can only be placed in column ${c + 1}.`
          });
          progress = true;
          if (r === targetRow && c === targetCol) {
            return { solved: true, steps, answer: l };
          }
        }
      }
    }

    if (progress) continue;

    // 3. Hidden singles in columns
    for (let c = 0; c < 5; c++) {
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
          steps.push({
            r, c, val: l,
            description: `Column ${c + 1}: letter "${l}" can only be placed in row ${r + 1}.`
          });
          progress = true;
          if (r === targetRow && c === targetCol) {
            return { solved: true, steps, answer: l };
          }
        }
      }
    }
  }

  return { solved: g[targetRow][targetCol] !== null, steps, answer: g[targetRow][targetCol] };
}

// Test screenshot puzzle:
const testGrid = [
  [null, null, null, null, 'B'],
  [null, 'A', null, null, 'C'],
  ['A', 'D', 'B', 'C', null],
  [null, null, null, null, null],
  ['E', 'B', 'C', null, 'D']
];

const targetValues = getPossibleTargetValues(testGrid, 0, 0);
console.log('Possible values for cell (0, 0):', targetValues);

const logicResult = solveLogicalDeduction(testGrid, 0, 0);
console.log('Solved by pure logic?', logicResult.solved);
console.log('Steps taken before stopping:');
logicResult.steps.forEach(s => console.log(' - ' + s.description));
