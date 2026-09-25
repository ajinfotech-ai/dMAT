// Research Strategies in Social Sciences In-Depth Learning Content
// Covers all 6 official dMAT Research Strategy subtopics with theory, methodology, exam tricks, and 3 difficulty-graded examples.

export const RESEARCH_SUBTOPICS = {
  'rs-quant-vs-qual': {
    id: 'rs-quant-vs-qual',
    title: 'Quantitative vs Qualitative Research Paradigms',
    submodule: 'Research Strategies in Social Sciences',
    module: 'Subject Module',
    overview: `The dMAT General Academic Module tests foundational knowledge of empirical research methodology.
1. Quantitative Research (Deductive / Theory-Testing):
• Epistemology: Positivism, post-positivism, objective reality.
• Aim: Tests pre-formulated hypotheses, examines statistical relationships, measures variance, quantifies frequency.
• Logic: Top-down (Theory → Hypothesis → Operationalization → Data Collection → Statistical Analysis).
• Sample: Large, representative probability samples allowing statistical generalization to a population.
2. Qualitative Research (Inductive / Theory-Generating):
• Epistemology: Interpretivism, constructivism, contextual meaning.
• Aim: Discovers new phenomena, understands subjective perspectives, reconstructs social processes and causal mechanisms.
• Logic: Bottom-up (Observations → Pattern Recognition → Conceptual Categorization → Tentative Theory).
• Sample: Purposive, theoretical, small samples focusing on depth and saturation rather than population generalization.`,
    principles: [
      'Deduction = Theory Testing (Quantitative): From general theory to specific empirical test.',
      'Induction = Theory Generation (Qualitative): From specific empirical observations to general theory.',
      'Generalizability Trade-off: Quantitative achieves statistical generalizability; Qualitative achieves theoretical / transferability depth.',
      'Role of Hypotheses: Mandatory and pre-fixed in quantitative; open-ended / emergent in qualitative.'
    ],
    formulas: [
      '\\text{Quantitative: Theory } \\implies \\text{Hypothesis } \\implies \\text{Observation } \\implies \\text{Confirmation/Falsification}',
      '\\text{Qualitative: Observation } \\implies \\text{Pattern } \\implies \\text{Tentative Hypothesis } \\implies \\text{Theory}'
    ],
    examTricks: [
      {
        title: 'The "Deductive = Testing, Inductive = Generating" Rule',
        description: 'Whenever a question asks which paradigm tests existing theory, the answer is ALWAYS Quantitative/Deductive. Whenever it asks about developing new theories from field observations, it is ALWAYS Qualitative/Inductive.',
        ruleOfThumb: 'Deductive = Testing theory (Quant). Inductive = Generating theory (Qual).'
      }
    ],
    commonTraps: [
      {
        trap: 'Claiming qualitative research can measure population prevalence',
        whyItHappens: 'Thinking 20 interviews can prove "70% of all citizens feel X".',
        howToAvoid: 'Qualitative research CANNOT establish population percentages or statistical significance.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Core Paradigm Differentiation',
        problem: 'A sociologist conducts 1,500 structured survey questionnaires to test whether household income predicts voter turnout using logistic regression. Which research strategy is being utilized?',
        options: [
          'Quantitative, deductive strategy aimed at testing a theoretical relationship',
          'Qualitative, inductive strategy aimed at generating exploratory concepts',
          'Purely descriptive case study with zero hypothesis testing',
          'Ethnographic immersion strategy'
        ],
        correctIndex: 0,
        explanation: 'A large structured sample (N = 1,500), numerical measurement, and statistical regression to test a pre-specified relationship are defining hallmarks of a quantitative, deductive research strategy.',
        steps: [
          'Step 1: Large sample (1500) + structured questionnaire + regression = Quantitative.',
          'Step 2: Testing an existing theoretical link = Deductive.'
        ],
        examTrick: 'Structured survey + statistical regression = Quantitative, Deductive.'
      },
      {
        difficulty: 'Medium',
        title: 'Inductive Theory Generation',
        problem: 'A researcher spends 6 months conducting open-ended in-depth interviews and participant observation with 12 climate activists to understand how they construct their moral identity. What is the primary methodological purpose?',
        options: [
          'Qualitative, inductive exploration to generate conceptual frameworks and understand subjective meaning',
          'Quantitative verification of population-wide psychological traits',
          'Statistical hypothesis testing with causal inference',
          'Experimental manipulation to control confounding variables'
        ],
        correctIndex: 0,
        explanation: 'Small sample (N = 12), open-ended interviews, and seeking to understand subjective meaning and identity formation are core characteristics of qualitative, inductive research.',
        steps: [
          'Step 1: Open-ended interviews + small sample (N=12) = Qualitative.',
          'Step 2: Focus on subjective meaning and concept generation = Inductive.'
        ],
        examTrick: 'Open-ended + small sample + subjective meaning = Qualitative / Inductive.'
      },
      {
        difficulty: 'Hard',
        title: 'Methodological Fallacy Detection',
        problem: 'Which of the following research claims represents a fundamental methodological error?',
        options: [
          'Based on 15 in-depth qualitative interviews, we conclude that exactly 73% of German university students experience burnout',
          'Based on a representative sample of 2,000 citizens, we reject the null hypothesis at p < 0.01',
          'Based on grounded theory coding of field notes, we propose a new conceptual model of workplace resistance',
          'Based on a randomized controlled trial with N = 400, we find a statistically significant treatment effect'
        ],
        correctIndex: 0,
        explanation: 'Qualitative research with a purposive sample of 15 participants CANNOT make statistical percentage claims about a broader population. Calculating "73%" from 15 non-probability interviews is a severe methodological violation.',
        steps: [
          'Step 1: Analyze Option A: 15 interviews claiming exact population prevalence (73%).',
          'Step 2: Qualitative non-random samples cannot infer population percentages.',
          'Step 3: Option A is a severe methodological error.'
        ],
        examTrick: 'Small qualitative samples can NEVER make statistical percentage claims about populations.'
      }
    ]
  },

  'rs-causal-relationships': {
    id: 'rs-causal-relationships',
    title: 'Causal Relationships vs Causal Mechanisms',
    submodule: 'Research Strategies in Social Sciences',
    module: 'Subject Module',
    overview: `A vital distinction in the dMAT syllabus is between establishing a Causal Relationship and uncovering a Causal Mechanism:
1. Causal Relationship (Covariation & Attribution):
• Addresses: "Does variable X have a measurable effect on variable Y?"
• Established via: Quantitative experiments, panel regressions, instrumental variables.
• Requirements: (a) Temporal precedence (X precedes Y), (b) Covariation (X and Y correlate), (c) Non-spuriousness (controlling for confounders Z).
2. Causal Mechanism (The "How" and "Why"):
• Addresses: "HOW and by what micro-level process does X produce change in Y?"
• Uncovered via: Qualitative process tracing, in-depth interviews, mediator analysis.
• Unpacks the "black box" connecting cause and effect.`,
    principles: [
      'Correlation ≠ Causation: Statistical association alone does not establish cause without ruling out common causes (confounders).',
      'Spuriousness: A third variable Z causes both X and Y, producing a false correlation.',
      'Mediator: Variable through which X influences Y: X → M → Y (the mechanism).',
      'Moderator: Variable that changes the strength or direction of the relationship between X and Y.'
    ],
    formulas: [
      '\\text{Causality} \\implies \\text{Temporal Precedence } \\land \\text{ Covariation } \\land \\text{ Non-spuriousness (No Confounder Z)}'
    ],
    examTricks: [
      {
        title: 'The Ice Cream & Drowning Trap (Confounders)',
        description: 'Classic dMAT example: Ice cream sales correlate strongly with drowning deaths. Does ice cream cause drowning? No! Summer heat (Z) causes both. Whenever two unrelated variables correlate, look for the underlying confounder Z.',
        ruleOfThumb: 'Spurious correlation is caused by an unobserved common cause Z.'
      }
    ],
    commonTraps: [
      {
        trap: 'Confusing a Mediator with a Moderator',
        whyItHappens: 'Both are third variables.',
        howToAvoid: 'A Mediator is the intermediate step in the chain (X → M → Y); a Moderator changes the strength of the link (like age or gender).'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Spurious Correlation Identification',
        problem: 'A study finds that cities with more fire trucks experience greater total property damage from fires. What explains this correlation?',
        options: [
          'Fire size is a confounding variable: larger fires cause both more fire trucks to be dispatched and greater damage',
          'Fire trucks cause property damage directly',
          'The correlation proves that fire trucks are ineffective',
          'Reverse causality: damage causes fire trucks to be purchased'
        ],
        correctIndex: 0,
        explanation: 'Fire severity/size is a classic confounding variable (Z). Larger fires attract more trucks (X) and cause more damage (Y). The correlation between X and Y is non-causal (spurious).',
        steps: [
          'Step 1: Identify X (trucks) and Y (damage).',
          'Step 2: Identify third variable Z (fire size).',
          'Step 3: Z causes both X and Y. Confounding correlation.'
        ],
        examTrick: 'Third variable (fire size) explains both.'
      },
      {
        difficulty: 'Medium',
        title: 'Mediator vs Moderator Differentiation',
        problem: 'A study shows that employee autonomy (X) increases job satisfaction (Y) because autonomy increases feelings of personal empowerment (M). In this study, personal empowerment acts as a:',
        options: ['Mediator (explaining the mechanism)', 'Moderator (altering the strength)', 'Confounder (biasing the link)', 'Independent variable'],
        correctIndex: 0,
        explanation: 'Empowerment lies directly in the causal chain: Autonomy → Empowerment → Satisfaction. It explains HOW and WHY X affects Y, making it a mediator variable.',
        steps: [
          'Step 1: Check causal flow: X → M → Y.',
          'Step 2: An intermediate variable that transmits the effect is a Mediator.'
        ],
        examTrick: 'Chain link (X → M → Y) = Mediator.'
      },
      {
        difficulty: 'Hard',
        title: 'Establishing Non-Spuriousness',
        problem: 'To prove that an educational intervention (X) causally improved student test scores (Y) in an observational study without random assignment, what must the researcher primarily demonstrate?',
        options: [
          'That the effect of X on Y persists after controlling for prior academic ability, socioeconomic status, and other confounding variables (Z)',
          'That the correlation coefficient r is greater than 0.90',
          'That all students in the school were surveyed without sampling error',
          'That qualitative interviews confirm students enjoyed the intervention'
        ],
        correctIndex: 0,
        explanation: 'In non-experimental designs, proving causality requires ruling out alternative explanations (spuriousness). The researcher must demonstrate that the relationship holds when controlling for all relevant confounders Z.',
        steps: [
          'Step 1: Causality requires non-spuriousness.',
          'Step 2: Must control for confounding variables like prior ability and socioeconomic background.'
        ],
        examTrick: 'Causality in observational data requires controlling for confounders Z.'
      }
    ]
  },

  'rs-research-phases': {
    id: 'rs-research-phases',
    title: 'The Phases of the Scientific Research Process',
    submodule: 'Research Strategies in Social Sciences',
    module: 'Subject Module',
    overview: `The scientific research process proceeds through five standard phases:
1. Problem Formulation: Defining the research question, reviewing existing literature, establishing theoretical framework.
2. Research Design: Selecting strategy (experimental, quasi-experimental, longitudinal, cross-sectional, case study), operationalizing variables.
3. Sampling & Instrument Construction: Choosing sampling frame, designing questionnaire/interview guide, establishing validity and reliability.
4. Data Collection: Conducting field experiments, distributing surveys, recording interviews.
5. Data Analysis & Interpretation: Statistical testing / qualitative coding, evaluating hypotheses, documenting findings and limitations.`,
    principles: [
      'Sequential Integrity: Research design must precede data collection.',
      'Operationalization: Translating abstract theoretical constructs into measurable empirical indicators.',
      'Pre-Registration: In quantitative science, hypotheses and analysis plans should be fixed before inspecting data.'
    ],
    formulas: [
      '\\text{Concept (Abstract)} \\xrightarrow{\\text{Operationalization}} \\text{Variable (Empirical Indicator)}'
    ],
    examTricks: [
      {
        title: 'The Operationalization Step',
        description: 'Whenever a question asks how an abstract concept like "alienation" or "intelligence" becomes measurable, the answer is ALWAYS "Operationalization".',
        ruleOfThumb: 'Abstract concept → measurable indicator = Operationalization.'
      }
    ],
    commonTraps: [
      {
        trap: 'Collecting data before specifying the research design',
        whyItHappens: 'Rushing into the field.',
        howToAvoid: 'Research design and ethical clearance always precede data collection.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Definition of Operationalization',
        problem: 'A researcher defines "academic stress" as "the number of self-reported insomnia episodes per month". This process of translating an abstract concept into a measurable empirical variable is called:',
        options: ['Operationalization', 'Standardization', 'Randomization', 'Generalization'],
        correctIndex: 0,
        explanation: 'Operationalization is the formal process of defining abstract theoretical concepts in terms of concrete, measurable empirical indicators.',
        steps: [
          'Step 1: Abstract concept: Academic stress.',
          'Step 2: Measurable indicator: Insomnia episodes per month.',
          'Step 3: This translation is Operationalization.'
        ],
        examTrick: 'Concept to measurable indicator = Operationalization.'
      },
      {
        difficulty: 'Medium',
        title: 'Chronological Sequence of Research Phases',
        problem: 'Which of the following represents the correct chronological sequence of phases in a deductive quantitative research project?',
        options: [
          'Literature Review → Hypothesis Formulation → Research Design → Data Collection → Data Analysis',
          'Data Collection → Literature Review → Hypothesis Formulation → Data Analysis',
          'Research Design → Data Analysis → Data Collection → Hypothesis Formulation',
          'Hypothesis Formulation → Data Collection → Literature Review → Research Design'
        ],
        correctIndex: 0,
        explanation: 'In deductive science, one must review literature first, formulate hypotheses based on theory, design the study, collect empirical data, and finally analyze the data.',
        steps: [
          'Step 1: Literature review establishes what is known.',
          'Step 2: Hypotheses formulated.',
          'Step 3: Research design set up.',
          'Step 4: Data collected.',
          'Step 5: Data analyzed.'
        ],
        examTrick: 'Design comes BEFORE Data Collection; Analysis comes AFTER Data Collection.'
      },
      {
        difficulty: 'Hard',
        title: 'Threats to Internal Validity in Design Phase',
        problem: 'A researcher evaluates a training program by measuring participant scores before the training (pre-test) and after the training (post-test) without a control group. What major threat to internal validity exists?',
        options: [
          'History and Maturation: changes could be caused by natural passage of time or external events rather than the training',
          'Sampling bias during randomized assignment',
          'Over-controlling for mediator variables',
          'Excessive external validity'
        ],
        correctIndex: 0,
        explanation: 'Without a randomized control group, one cannot determine whether score improvements were caused by the training or by natural learning over time (maturation) or concurrent external events (history).',
        steps: [
          'Step 1: Single group pre-test/post-test lacks a control group.',
          'Step 2: Natural maturation or external events cannot be separated from treatment effect.',
          'Step 3: Classic threat to internal validity: History & Maturation.'
        ],
        examTrick: 'No control group = Maturation/History threat to internal validity.'
      }
    ]
  },

  'rs-linear-vs-circular': {
    id: 'rs-linear-vs-circular',
    title: 'Linear vs Circular Research Processes',
    submodule: 'Research Strategies in Social Sciences',
    module: 'Subject Module',
    overview: `dMAT specifically emphasizes the structural difference between Linear and Circular research procedures:
1. Linear Research Process (Standard Quantitative):
• Strictly sequential: Step 1 → Step 2 → Step 3 → Step 4 → Step 5.
• No backtracking: Hypotheses cannot be altered after data collection starts.
• Instrument is frozen: Survey questions cannot be rephrased mid-study.
• Objective: Replicability, objectivity, prevention of p-hacking and confirmation bias.
2. Circular / Iterative Research Process (Standard Qualitative):
• Dynamic and reflexive: Data collection and data analysis occur SIMULTANEOUSLY.
• Emergent design: Findings from interview 3 inform the questions asked in interview 4.
• Theoretical sampling: Sampling continues until theoretical saturation is reached.
• Requisite rule: All modifications to questions and theories must be transparently documented in a research audit trail.`,
    principles: [
      'Quantitative = Linear & Rigid: Guarantees standardized measurement across all cases.',
      'Qualitative = Circular & Adaptive: Allows deep responsiveness to unexpected discoveries in the field.',
      'Audit Trail Obligation: Any circular revision must be recorded to preserve methodological rigor.'
    ],
    formulas: [
      '\\text{Linear: } \\text{Design} \\to \\text{Collect} \\to \\text{Analyze} \\to \\text{Conclude (One-way)}',
      '\\text{Circular: } \\text{Collect} \\rightleftarrows \\text{Analyze} \\rightleftarrows \\text{Refine Theory (Iterative loop)}'
    ],
    examTricks: [
      {
        title: 'The Simultaneous Collection & Analysis Keyword',
        description: 'Whenever a question mentions that "data analysis begins while data collection is still ongoing", the answer is ALWAYS a Circular / Qualitative process.',
        ruleOfThumb: 'Simultaneous collection and analysis = Circular process.'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming circularity means lack of scientific rigor',
        whyItHappens: 'Thinking changing questions mid-study is "cheating".',
        howToAvoid: 'In qualitative grounded theory, circular theoretical sampling is the standard gold-standard methodology.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Circular Process Characteristic',
        problem: 'In which type of research process do data collection, data analysis, and conceptual refinement take place in continuous, iterative loops?',
        options: [
          'Circular research process (typical of qualitative methodology)',
          'Linear research process (typical of quantitative randomized trials)',
          'Strict laboratory experimental process',
          'Census statistical accounting'
        ],
        correctIndex: 0,
        explanation: 'A circular research process is iterative: interim analysis informs subsequent data collection, allowing concepts to emerge dynamically.',
        steps: [
          'Step 1: Continuous iterative loops = Circular process.',
          'Step 2: Characteristic of qualitative research.'
        ],
        examTrick: 'Iterative loops = Circular process.'
      },
      {
        difficulty: 'Medium',
        title: 'Linear Process Rule in Quantitative Research',
        problem: 'A researcher analyzing survey data from 500 respondents finds that Hypothesis 1 is not statistically supported. The researcher then retroactively alters the hypothesis to match the observed result without disclosing the change. What principle is violated?',
        options: [
          'The linear requirement that hypotheses in deductive research must be formulated a priori before data analysis',
          'The principle of theoretical saturation',
          'The rule of iterative interview adaptation',
          'The law of diminishing marginal returns'
        ],
        correctIndex: 0,
        explanation: 'In linear quantitative research, hypotheses must be formulated a priori (before data inspection). Altering hypotheses after seeing the data (HARKing - Hypothesizing After Results are Known) invalidates statistical inference.',
        steps: [
          'Step 1: Deductive research requires a priori hypotheses.',
          'Step 2: Altering hypotheses post-hoc violates linear integrity.'
        ],
        examTrick: 'Hypotheses must be fixed BEFORE data analysis (a priori).'
      },
      {
        difficulty: 'Hard',
        title: 'Requirement for Legitimate Circular Adaptation',
        problem: 'When a qualitative researcher modifies their interview guide after the fifth interview based on emergent themes, what must they do to maintain scientific validity?',
        options: [
          'Transparently document and justify the changes in a methodological audit trail',
          'Discard the first five interviews completely',
          'Convert the research into a quantitative regression',
          'Pause the research until an ethics committee re-approves the entire study'
        ],
        correctIndex: 0,
        explanation: 'The dMAT syllabus explicitly specifies: In a circular research process, modifications are permissible and expected, BUT all adjustments must be documented transparently in an audit trail so external evaluators can trace the research trajectory.',
        steps: [
          'Step 1: Circular processes permit adaptive changes.',
          'Step 2: Crucial requirement: transparent documentation in research logs/audit trails.'
        ],
        examTrick: 'Changes in circular research MUST be documented transparently.'
      }
    ]
  },

  'rs-hypothesis-testing': {
    id: 'rs-hypothesis-testing',
    title: 'Hypothesis Formulation, Null Hypothesis & Errors',
    submodule: 'Research Strategies in Social Sciences',
    module: 'Subject Module',
    overview: `Hypothesis testing in deductive research follows Karl Popper\'s falsificationist logic:
1. Null Hypothesis (H_0):
States that there is NO effect, no relationship, or no difference between groups:
H_0: \\mu_1 = \\mu_2 \\quad \\text{or} \\quad H_0: \\rho = 0
2. Alternative Hypothesis (H_1 or H_A):
States that an effect or relationship exists:
• Directional (one-tailed): H_1: \\mu_{\\text{trained}} > \\mu_{\\text{control}}
• Non-directional (two-tailed): H_1: \\mu_{\\text{trained}} \\neq \\mu_{\\text{control}}
Statistical Errors:
• Type I Error (\\alpha, False Positive): Rejecting H_0 when H_0 is actually TRUE.
• Type II Error (\\beta, False Negative): Failing to reject H_0 when H_0 is actually FALSE.
Statistical significance (p < 0.05) means there is less than a 5% probability of observing the data if the null hypothesis were true.`,
    principles: [
      'Falsification Logic: Science never "proves" H_1; it rejects H_0 with a given probability of error.',
      'Pre-specification: Hypotheses must be empirically testable, falsifiable, and stated prior to data analysis.',
      'Type I Error (\\alpha): Convicting an innocent person (False Alarm).',
      'Type II Error (\\beta): Letting a guilty person go free (Missed Detection).'
    ],
    formulas: [
      'p < 0.05 \\implies \\text{Reject } H_0 \\quad (\\text{Statistically Significant})',
      '\\text{Power} = 1 - \\beta \\quad (\\text{Probability of detecting a true effect})'
    ],
    examTricks: [
      {
        title: 'The Type I vs Type II Memory Aid',
        description: `• Type I Error: Finding an effect that IS NOT THERE (False Positive / False Alarm).
• Type II Error: Missing an effect that IS THERE (False Negative / Missed Discovery).`,
        ruleOfThumb: 'Type 1 = False Positive. Type 2 = False Negative.'
      }
    ],
    commonTraps: [
      {
        trap: 'Believing p = 0.03 means the hypothesis is 97% true',
        whyItHappens: 'Misinterpreting the p-value.',
        howToAvoid: 'The p-value is the probability of obtaining data at least as extreme, assuming H_0 is true.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Null Hypothesis Definition',
        problem: 'A researcher tests whether a new memory drug improves recall. What is the appropriate Null Hypothesis (H_0)?',
        options: [
          'The drug has no effect on memory recall (mean difference = 0)',
          'The drug significantly improves memory recall',
          'The drug impairs memory recall',
          'The drug is safe for human consumption'
        ],
        correctIndex: 0,
        explanation: 'The null hypothesis always posits NO effect, no difference, or no relationship (status quo). Here, H_0 states that the drug has zero effect on recall.',
        steps: [
          'Step 1: Null hypothesis = statement of no effect / zero difference.',
          'Step 2: H_0: drug effect = 0.'
        ],
        examTrick: 'Null hypothesis = NO effect, zero difference.'
      },
      {
        difficulty: 'Medium',
        title: 'Type I Error Identification',
        problem: 'A clinical trial concludes that a medication cures insomnia (rejecting the null hypothesis), but in reality the medication is completely ineffective. What type of error occurred?',
        options: [
          'Type I Error (False Positive)',
          'Type II Error (False Negative)',
          'Measurement calibration error',
          'Sampling frame coverage error'
        ],
        correctIndex: 0,
        explanation: 'Rejecting a true null hypothesis (declaring an effect when none actually exists) is a Type I Error (False Positive).',
        steps: [
          'Step 1: Real situation: H_0 is true (ineffective).',
          'Step 2: Decision made: Reject H_0 (claimed cure).',
          'Step 3: Rejecting true H_0 = Type I Error.'
        ],
        examTrick: 'False alarm = Type I error.'
      },
      {
        difficulty: 'Hard',
        title: 'Directional vs Non-Directional Hypotheses',
        problem: 'Which of the following is formulated as a directional (one-tailed) alternative hypothesis?',
        options: [
          'Students who complete mock exams will score significantly HIGHER on the final dMAT than students who do not',
          'There is a difference in dMAT scores between male and female students',
          'Study group participation is associated with exam performance',
          'Sleep duration correlates with cognitive test reaction time'
        ],
        correctIndex: 0,
        explanation: 'A directional hypothesis explicitly specifies the direction of the expected effect (higher, lower, positive, negative). Option A specifies "HIGHER", whereas the others simply state a non-directional "difference" or "association".',
        steps: [
          'Step 1: Directional hypothesis specifies a sign/direction (+ or -).',
          'Step 2: "HIGHER" explicitly states direction.',
          'Step 3: Option A is directional (one-tailed).'
        ],
        examTrick: 'Look for directional comparative words: "higher", "faster", "greater".'
      }
    ]
  },

  'rs-mixed-methods': {
    id: 'rs-mixed-methods',
    title: 'Mixed Methods Research Designs',
    submodule: 'Research Strategies in Social Sciences',
    module: 'Subject Module',
    overview: `Mixed Methods research purposefully integrates both quantitative and qualitative data collection and analysis within a single empirical study:
Key Mixed Methods Designs:
1. Convergent Parallel Design:
Quantitative and qualitative data are collected concurrently during the same phase, analyzed separately, and then compared or merged to cross-validate findings (Triangulation).
2. Sequential Explanatory Design:
Quantitative data is collected and analyzed FIRST, followed by a qualitative phase to explain or contextualize the statistical findings (Quant → Qual).
3. Sequential Exploratory Design:
Qualitative exploration occurs FIRST to identify variables or develop a measurement scale, followed by quantitative testing on a large sample (Qual → Quant).`,
    principles: [
      'Triangulation: Using multiple methods to examine the same phenomenon from complementary perspectives.',
      'Complementarity: Quantitative provides breadth and generalizability; Qualitative provides depth, nuances, and mechanisms.',
      'Integration: Mixing must occur during data collection, analysis, or interpretation (not just two disconnected chapters).'
    ],
    formulas: [
      '\\text{Explanatory: } \\text{QUANT} \\to \\text{qual (Explain results)}',
      '\\text{Exploratory: } \\text{QUAL} \\to \\text{quant (Develop instrument)}',
      '\\text{Convergent: } \\text{QUANT} + \\text{QUAL} \\text{ (Concurrent Triangulation)}'
    ],
    examTricks: [
      {
        title: 'The Sequence Determines the Name',
        description: `• Explanatory: QUANT first, then qualitative to explain the numbers.
• Exploratory: QUAL first to explore concepts, then quantitative to measure.`,
        ruleOfThumb: 'Numbers first = Explanatory. Words first = Exploratory.'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming mixed methods means two independent studies',
        whyItHappens: 'Doing a survey and 5 interviews with zero integration.',
        howToAvoid: 'True mixed methods requires integrating the two datasets to produce insights greater than the sum of parts.'
      }
    ],
    examples: [
      {
        difficulty: 'Easy',
        title: 'Core Definition of Triangulation',
        problem: 'In social research, combining different methodologies (such as surveys and observational interviews) to study the same research question from multiple vantage points is called:',
        options: ['Methodological Triangulation', 'Double Blind Experimentation', 'Falsification', 'Stratified Randomization'],
        correctIndex: 0,
        explanation: 'Methodological Triangulation refers to using multiple data collection methods or data sources to gain a more comprehensive understanding of a phenomenon and cross-validate findings.',
        steps: [
          'Step 1: Multiple methods + same research question = Triangulation.',
          'Step 2: Correct term is Methodological Triangulation.'
        ],
        examTrick: 'Combining methods for cross-validation = Triangulation.'
      },
      {
        difficulty: 'Medium',
        title: 'Sequential Explanatory Design Identification',
        problem: 'A researcher first conducts a large-scale statistical survey with 2,000 employees and finds an unexpected negative correlation between remote work and team cohesion. To understand WHY this negative correlation exists, the researcher then conducts 20 follow-up qualitative interviews with affected teams. What design is this?',
        options: [
          'Sequential Explanatory Design (Quant → Qual)',
          'Sequential Exploratory Design (Qual → Quant)',
          'Pure Experimental Laboratory Design',
          'Cross-sectional Observational Survey'
        ],
        correctIndex: 0,
        explanation: 'Quantitative survey conducted FIRST, followed by qualitative interviews to EXPLAIN the statistical anomaly = Sequential Explanatory Design.',
        steps: [
          'Step 1: First phase: Quantitative survey.',
          'Step 2: Second phase: Qualitative interviews to explain statistical findings.',
          'Step 3: Quant followed by Qual = Sequential Explanatory.'
        ],
        examTrick: 'Quant first → Qual to explain = Sequential Explanatory.'
      },
      {
        difficulty: 'Hard',
        title: 'Sequential Exploratory Scale Development',
        problem: 'To measure "digital leadership", a researcher first conducts open-ended interviews with 15 corporate executives to discover the key dimensions of the construct. Based on these interview themes, the researcher drafts a 30-item survey scale and validates it statistically with a sample of 800 managers. What design is this?',
        options: [
          'Sequential Exploratory Design (Qual → Quant)',
          'Sequential Explanatory Design (Quant → Qual)',
          'Convergent Parallel Design',
          'Retrospective Cohort Design'
        ],
        correctIndex: 0,
        explanation: 'Qualitative exploration conducted FIRST to discover dimensions and design an instrument, followed by large-scale quantitative testing to validate the scale = Sequential Exploratory Design.',
        steps: [
          'Step 1: First phase: Qualitative interviews to explore and discover construct.',
          'Step 2: Second phase: Quantitative survey to validate instrument.',
          'Step 3: Qual followed by Quant = Sequential Exploratory.'
        ],
        examTrick: 'Qual first to explore → Quant to test = Sequential Exploratory.'
      }
    ]
  }
};
