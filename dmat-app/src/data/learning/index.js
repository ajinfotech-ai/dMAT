import { CORE_SUBTOPICS } from './coreLearning.js';
import { VECTOR_SUBTOPICS } from './vectorLearning.js';
import { HYDROSTATICS_SUBTOPICS } from './hydrostaticsLearning.js';
import { BUSINESS_SUBTOPICS } from './businessLearning.js';
import { RESEARCH_SUBTOPICS } from './researchLearning.js';
import { getSubtestById, getSubjectTopicById } from '../syllabus.js';

export const ALL_SUBTOPICS = {
  ...CORE_SUBTOPICS,
  ...VECTOR_SUBTOPICS,
  ...HYDROSTATICS_SUBTOPICS,
  ...BUSINESS_SUBTOPICS,
  ...RESEARCH_SUBTOPICS
};

/**
 * Retrieve the full educational content for a specific subtopic.
 * If exact topicId is found, returns the comprehensive learning object.
 * If not found, falls back gracefully to syllabus metadata.
 */
export function getSubtopicLearningContent(moduleId, topicId) {
  if (topicId && ALL_SUBTOPICS[topicId]) {
    return ALL_SUBTOPICS[topicId];
  }

  // Fallback: look up in syllabus
  const subtest = getSubtestById(moduleId);
  const subjectTopic = getSubjectTopicById(moduleId);
  const parent = subtest || subjectTopic;

  const topicsList = parent?.topics || parent?.subtopics || [];
  const foundTopic = topicsList.find(t => t.id === topicId) || topicsList[0];

  if (!foundTopic) {
    return null;
  }

  return {
    id: foundTopic.id,
    title: foundTopic.name,
    submodule: parent?.name || 'dMAT Submodule',
    module: subtest ? 'Core Module' : 'Subject Module',
    overview: foundTopic.description || 'Detailed conceptual explanation and systematic problem solving methodology.',
    principles: [
      'Understand the core definition and underlying variables.',
      'Identify the target output and given constraints before calculating.',
      'Check units, dimensions, and sign consistency.',
      'Use elimination strategies to prune distractor choices.'
    ],
    formulas: [],
    examTricks: [
      {
        title: 'Systematic Elimination',
        description: 'Read all four answer choices before calculating. Often, 2 choices have impossible units, incorrect signs, or violate basic boundary limits.',
        ruleOfThumb: 'Eliminate extremes and sign errors first.'
      }
    ],
    commonTraps: [
      {
        trap: 'Rushing into calculations before reading the question carefully',
        whyItHappens: 'High time pressure causes misreading of requested variables.',
        howToAvoid: 'Identify the exact target variable and units first.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Direct Application Example',
        problem: `Explain the fundamental concept of ${foundTopic.name}. Which principle is always satisfied?`,
        options: [
          'All conditions and constraints are strictly satisfied simultaneously',
          'Only approximate estimations are required without verification',
          'Variables can take any arbitrary values outside the allowed bounds',
          'The solution depends solely on the trial order'
        ],
        correctIndex: 0,
        explanation: `In ${foundTopic.name}, solutions must satisfy all structural and mathematical requirements of the problem simultaneously.`,
        steps: [
          'Step 1: Identify the underlying rule.',
          'Step 2: Apply the governing constraint.',
          'Step 3: Confirm all conditions hold.'
        ],
        examTrick: 'Always verify that your answer satisfies all stated conditions.'
      },
      {
        difficulty: 'Medium',
        title: 'Multi-Step Application Example',
        problem: `In an applied ${foundTopic.name} problem with two interdependent conditions, how should you proceed?`,
        options: [
          'Isolate the first constraint, deduce intermediate parameters, and substitute into the second condition',
          'Guess one variable randomly and hope it satisfies the second',
          'Ignore the second condition if the first condition is satisfied',
          'Average the candidate options together'
        ],
        correctIndex: 0,
        explanation: 'Systematic problem solving requires isolating knowns, deducing intermediate values, and substituting them into the remaining constraints.',
        steps: [
          'Step 1: Isolate the most constrained condition.',
          'Step 2: Calculate intermediate values.',
          'Step 3: Substitute into the final target equation.'
        ],
        examTrick: 'Chain deductions from the most constrained to the least constrained.'
      },
      {
        difficulty: 'Hard',
        title: 'Complex Edge Case Example',
        problem: `Under extreme boundary conditions in ${foundTopic.name}, what is the critical factor to monitor?`,
        options: [
          'Boundary behaviors, asymptotic limits, and domain definitions',
          'Superficial pattern similarities that ignore mathematical rules',
          'Assuming parameters remain constant when boundary conditions change',
          'Overlooking units and dimensions'
        ],
        correctIndex: 0,
        explanation: 'Complex tasks frequently test edge cases (such as reflections at matrix boundaries, zero volume in triple products, or extreme depth pressure). Analyzing boundary conditions guarantees correct deduction.',
        steps: [
          'Step 1: Check upper and lower bounds of all variables.',
          'Step 2: Test behavior at the extremes.',
          'Step 3: Eliminate options that violate boundary limits.'
        ],
        examTrick: 'Check boundary limits (0, max, infinity) to quickly discard false options.'
      }
    ]
  };
}
