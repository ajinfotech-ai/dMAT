import questionBank from '../src/data/questionBank.js';
import { generateLatinSquareQuestion } from '../src/generators/latinSquares.js';

console.log('--- AUDITING LATIN SQUARE QUESTIONS IN QUESTION BANK ---');

// Initialize QuestionBank
questionBank.initialize();

const lsQuestions = questionBank.getBySubmodule('Latin Squares');
console.log(`Found ${lsQuestions.length} Latin Square questions in QuestionBank.`);

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

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
      if (count > 1) return count;
    }
  }
  return count;
}

let ambiguousCount = 0;
let errors = [];

lsQuestions.forEach((q, idx) => {
  const { grid, targetRow, targetCol } = q.gridData;
  const expectedAnswer = q.options[q.correctAnswer];

  const validLetters = [];
  for (const letter of LETTERS) {
    const testGrid = grid.map(r => [...r]);
    const rowUsed = new Set(testGrid[targetRow].filter(Boolean));
    const colUsed = new Set();
    for (let i = 0; i < 5; i++) if (testGrid[i][targetCol]) colUsed.add(testGrid[i][targetCol]);

    if (!rowUsed.has(letter) && !colUsed.has(letter)) {
      testGrid[targetRow][targetCol] = letter;
      const completions = countCompletions(testGrid, 0);
      if (completions > 0) {
        validLetters.push(letter);
      }
    }
  }

  if (validLetters.length !== 1) {
    ambiguousCount++;
    errors.push({
      id: q.id,
      index: idx + 1,
      difficulty: q.difficulty,
      expectedAnswer,
      validLetters
    });
  } else if (validLetters[0] !== expectedAnswer) {
    ambiguousCount++;
    errors.push({
      id: q.id,
      index: idx + 1,
      difficulty: q.difficulty,
      expectedAnswer,
      validLetters,
      reason: 'Mismatch between expectedAnswer and valid letter'
    });
  }
});

console.log(`\nAudit Results:`);
console.log(`Total Latin Square Questions Audited: ${lsQuestions.length}`);
console.log(`Ambiguous Questions Found: ${ambiguousCount}`);

if (ambiguousCount > 0) {
  console.error('FAILED! The following questions are ambiguous:', errors);
  process.exit(1);
} else {
  console.log('PASSED! 100% of Latin Square questions have a STRICTLY UNIQUE answer!');
  console.log('Zero ambiguous questions in the entire QuestionBank!');
}
