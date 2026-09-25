// Research Strategies in Social Sciences Question Bank & Generator
// Based on dMAT Subject Module - Research Strategies in Social Sciences
// Comprehensive bank of 70+ scenario-based questions across all syllabus topics

import { generateId, shuffleArray, randInt } from './utils.js';

const RS_QUESTIONS = [
  // ========== DEDUCTIVE VS INDUCTIVE (TOPIC: rs-deductive-inductive) ==========
  {
    topic: 'rs-deductive-inductive',
    difficulty: 'easy',
    question: 'A sociologist formulates a specific hypothesis derived from Bourdieu\'s theory of cultural capital and tests it statistically on a representative sample of 2,000 university students. Which research strategy is being utilized?',
    correct: 'A deductive (theory-testing) strategy.',
    wrongs: [
      'An inductive (theory-building) strategy.',
      'A grounded theory strategy.',
      'An exploratory idiographic strategy.'
    ],
    explanation: 'Deductive research moves from general theories to specific hypotheses, which are then tested empirically using structured data collection.'
  },
  {
    topic: 'rs-deductive-inductive',
    difficulty: 'easy',
    question: 'An ethnographer spends six months observing daily interactions inside a software startup, conducting open-ended interviews to identify emerging themes and formulate a new theoretical framework of remote teamwork. What research approach is this?',
    correct: 'An inductive (theory-generating) strategy.',
    wrongs: [
      'A deductive strategy.',
      'A confirmatory experimental strategy.',
      'A strictly hypothetico-deductive design.'
    ],
    explanation: 'Inductive research starts with open empirical observations and searches for patterns from which broader concepts and theories are inductively generated.'
  },
  {
    topic: 'rs-deductive-inductive',
    difficulty: 'medium',
    question: 'Which of the following best characterizes the primary distinction between deductive and inductive research strategies in the social sciences?',
    correct: 'Deductive research tests existing theories against empirical data; inductive research develops new theories from empirical observations.',
    wrongs: [
      'Deductive research only uses qualitative data, whereas inductive research only uses quantitative numbers.',
      'Deductive research requires no hypotheses, whereas inductive research requires preregistered hypotheses.',
      'Deductive research is circular, whereas inductive research must always follow a rigid, linear four-phase sequence.'
    ],
    explanation: 'The classic distinction lies in direction: deduction is top-down (Theory → Hypotheses → Data → Confirmation/Falsification), while induction is bottom-up (Observation → Pattern → Tentative Theory).'
  },
  {
    topic: 'rs-deductive-inductive',
    difficulty: 'medium',
    question: 'In an inductive research design, what is typically the role of pre-existing literature and theoretical frameworks at the outset of the study?',
    correct: 'To provide sensitizing concepts without imposing rigid preconceptions on the emergent data.',
    wrongs: [
      'To formulate strict null hypotheses that must be accepted or rejected at p < 0.05.',
      'To calculate the exact statistical sample size required for high statistical power.',
      'To completely determine all coding categories prior to any fieldwork.'
    ],
    explanation: 'In inductive work (e.g. grounded theory), existing literature provides sensitizing concepts, but researchers avoid imposing premature theoretical closure.'
  },
  {
    topic: 'rs-deductive-inductive',
    difficulty: 'hard',
    question: 'A researcher discovers an unexpected negative correlation between social media use and political participation among young adults. Instead of discarding the finding, they conduct exploratory follow-up interviews to understand why. This combination of deduction and induction is best known as:',
    correct: 'Abductive reasoning (or a mixed-methods iterative cycle).',
    wrongs: [
      'HARKing (Hypothesizing After the Results are Known) with falsified data.',
      'Pure deductive positivism.',
      'Strict uncritical empiricism.'
    ],
    explanation: 'Abduction starts with an unexpected empirical observation that cannot be explained by existing theory and seeks plausible hypotheses to explain it, often bridging deduction and induction.'
  },

  // ========== LINEAR VS CIRCULAR RESEARCH PROCESS (TOPIC: rs-linear-vs-circular) ==========
  {
    topic: 'rs-linear-vs-circular',
    difficulty: 'easy',
    question: 'In an ideal-typical quantitative research project, what is the required relationship between data collection and hypothesis formulation?',
    correct: 'Hypotheses must be fully defined and operationalized before data collection and analysis begin.',
    wrongs: [
      'Hypotheses should be adjusted after preliminary data inspection to ensure statistical significance.',
      'Hypotheses are created during the final interpretation stage.',
      'Hypotheses can be added, deleted, or inverted at any point without documentation.'
    ],
    explanation: 'The ideal-typical quantitative process is linear and sequential: Phase 1 (Theory/Hypotheses) must precede Phase 2 (Design) and Phase 3 (Data Collection/Analysis).'
  },
  {
    topic: 'rs-linear-vs-circular',
    difficulty: 'medium',
    question: 'Which of the following methodological practices represents a circular element that is legitimate in qualitative research but constitutes a severe violation of scientific integrity in quantitative confirmatory research?',
    correct: 'Refining the research question and sampling criteria mid-stream based on insights gained from initial data collection.',
    wrongs: [
      'Using computer software to organize text transcripts.',
      'Maintaining detailed field notes and memos during data collection.',
      'Obtaining voluntary informed consent from all human participants.'
    ],
    explanation: 'Circular research processes in qualitative inquiry allow iterative adaptation of questions and theoretical sampling. In confirmatory quantitative research, changing hypotheses or samples post-hoc invalidates error probabilities.'
  },
  {
    topic: 'rs-linear-vs-circular',
    difficulty: 'hard',
    question: 'A psychologist tests whether mindfulness improves memory. After analyzing the data and finding no effect on memory, the researcher tests 15 other unpredicted outcome variables and only publishes the single outcome that reached p < 0.05. This problematic departure from the linear research process is known as:',
    correct: 'P-hacking (or data dredging / outcome switching).',
    wrongs: [
      'Legitimate inductive hypothesis generation.',
      'Triangulation of dependent variables.',
      'Robustness sensitivity testing.'
    ],
    explanation: 'Testing multiple unhypothesized outcomes and selectively reporting only statistically significant results inflates Type I error rates and violates the confirmatory linear process.'
  },

  // ========== VARIABLES & OPERATIONALIZATION (TOPIC: rs-variables) ==========
  {
    topic: 'rs-variables',
    difficulty: 'easy',
    question: 'A study examines whether the number of hours spent attending university lectures (X) influences students\' final exam scores (Y). In this research question, what is the role of "number of hours spent attending lectures"?',
    correct: 'The independent variable (cause/predictor).',
    wrongs: [
      'The dependent variable (outcome/effect).',
      'The confounding variable.',
      'The moderating variable.'
    ],
    explanation: 'The independent variable (IV) is the presumed cause or predictor that is hypothesized to influence the dependent variable (DV).'
  },
  {
    topic: 'rs-variables',
    difficulty: 'easy',
    question: 'In a study examining the effect of sleep deprivation on driving performance, what is "driving performance"?',
    correct: 'The dependent variable.',
    wrongs: [
      'The independent variable.',
      'The control variable.',
      'The mediating variable.'
    ],
    explanation: 'Driving performance is the outcome being measured and influenced; thus, it is the dependent variable (DV).'
  },
  {
    topic: 'rs-variables',
    difficulty: 'medium',
    question: 'Researchers find that higher household income is associated with higher child academic achievement. However, when controlling for parents\' educational attainment, the relationship between income and achievement largely disappears. What role does parents\' educational attainment play?',
    correct: 'A confounding variable (common cause / third variable).',
    wrongs: [
      'The dependent variable.',
      'A placebo variable.',
      'A suppressor variable.'
    ],
    explanation: 'A confounding variable is related to both the independent variable and the dependent variable, creating a spurious correlation between them.'
  },
  {
    topic: 'rs-variables',
    difficulty: 'medium',
    question: 'A study shows that employee autonomy increases job satisfaction, but this effect is much stronger for experienced employees than for newly hired employees. In this model, "employee experience level" acts as a:',
    correct: 'Moderating variable (moderator).',
    wrongs: [
      'Mediating variable (mediator).',
      'Dependent variable.',
      'Spurious artifact.'
    ],
    explanation: 'A moderating variable alters the direction or strength of the relationship between the independent variable and the dependent variable (an interaction effect).'
  },
  {
    topic: 'rs-variables',
    difficulty: 'hard',
    question: 'A health psychologist hypothesizes that a public health campaign increases sunscreen usage by first increasing individuals\' perceived skin cancer risk. In this causal chain (Campaign → Perceived Risk → Sunscreen Usage), "perceived risk" is classified as a:',
    correct: 'Mediating variable (mediator).',
    wrongs: [
      'Moderating variable.',
      'Confounding variable.',
      'Manipulated independent variable.'
    ],
    explanation: 'A mediating variable explains the mechanism or process through which the independent variable influences the dependent variable.'
  },
  {
    topic: 'rs-variables',
    difficulty: 'hard',
    question: 'What is meant by the "operationalization" of a theoretical construct in social research?',
    correct: 'Translating an abstract concept (e.g. intelligence, alienation) into measurable, concrete empirical indicators.',
    wrongs: [
      'Proving that the theoretical concept is logically true using deductive mathematics.',
      'Selecting an appropriate statistical significance threshold (alpha level).',
      'Securing institutional ethical approval prior to participant recruitment.'
    ],
    explanation: 'Operationalization is the process of defining measurement procedures for abstract or unobservable theoretical constructs.'
  },

  // ========== INTERNAL VALIDITY & THREATS (TOPIC: rs-internal-validity) ==========
  {
    topic: 'rs-internal-validity',
    difficulty: 'easy',
    question: 'What does "internal validity" refer to in an experimental or causal study?',
    correct: 'The extent to which changes in the dependent variable can be confidently attributed to the independent variable rather than confounding factors.',
    wrongs: [
      'The extent to which study findings generalize to the broader global population.',
      'The degree of agreement between two independent coders of interview text.',
      'Whether the survey questions look plausible to an untrained layperson.'
    ],
    explanation: 'Internal validity concerns the rigor of the causal inference: did X truly cause Y in this specific study?'
  },
  {
    topic: 'rs-internal-validity',
    difficulty: 'medium',
    question: 'A company implements a leadership training program in March. In April, the national economy enters a sudden boom, and company sales increase by 40%. Attributing the sales increase exclusively to the leadership training is threatened primarily by:',
    correct: 'A history threat (an external event occurring concurrently with the intervention).',
    wrongs: [
      'A maturation threat.',
      'A regression to the mean threat.',
      'A testing effect threat.'
    ],
    explanation: 'A history threat occurs when external environmental events taking place between pre-test and post-test produce the observed change rather than the intervention.'
  },
  {
    topic: 'rs-internal-validity',
    difficulty: 'medium',
    question: 'A school conducts a reading intervention for 6-year-old pupils from September to June. At the end of the year, their reading ability has improved significantly. Why is a control group necessary to rule out a "maturation" threat?',
    correct: 'Because children naturally grow, develop cognitive abilities, and learn over time even without the specific intervention.',
    wrongs: [
      'Because reading tests cannot be administered twice to the same children.',
      'Because maturation only occurs in laboratory settings, not in schools.',
      'Because teachers might deliberately score tests inaccurately.'
    ],
    explanation: 'Maturation refers to natural psychological, biological, or physiological changes within participants over time that can mimic intervention effects.'
  },
  {
    topic: 'rs-internal-validity',
    difficulty: 'hard',
    question: 'Researchers recruit the 50 students who scored lowest on an initial mathematics test and enroll them in a tutoring program. On the post-test, their scores show a noticeable increase. Which threat to internal validity is most acute here?',
    correct: 'Statistical regression to the mean (extreme baseline scores naturally drift closer to the average on re-testing).',
    wrongs: [
      'Instrumentation decay.',
      'Diffusion of treatment.',
      'Ecological invalidity.'
    ],
    explanation: 'When subjects are selected based on extreme scores, measurement error ensures that upon re-testing, their scores will naturally regress toward the population mean.'
  },
  {
    topic: 'rs-internal-validity',
    difficulty: 'hard',
    question: 'In a year-long clinical trial for a depression app, 45% of participants in the app group drop out because they find the exercises frustrating, while only 5% drop out of the waitlist control group. The final comparison of remaining participants is biased by:',
    correct: 'Attrition bias (differential experimental mortality).',
    wrongs: [
      'Pre-test sensitization.',
      'Hawthorne effect.',
      'John Henry effect.'
    ],
    explanation: 'Differential attrition between experimental conditions destroys the initial equivalence created by random assignment, leaving non-comparable survivor groups.'
  },
  {
    topic: 'rs-internal-validity',
    difficulty: 'challenge',
    question: 'In an educational experiment, teachers in the control group learn about the innovative instructional methods being used in the experimental classrooms and start adopting them informally. This threat to internal validity is known as:',
    correct: 'Diffusion (or spillover / contamination) of treatment.',
    wrongs: [
      'Compensatory rivalry (John Henry effect).',
      'Statistical regression to the mean.',
      'Instrumentation threat.'
    ],
    explanation: 'Treatment diffusion occurs when members of the control group inadvertently or intentionally receive elements of the intervention, reducing the observed between-group difference.'
  },

  // ========== EXTERNAL & ECOLOGICAL VALIDITY (TOPIC: rs-external-validity) ==========
  {
    topic: 'rs-external-validity',
    difficulty: 'easy',
    question: 'What is the primary concern of "external validity" in empirical research?',
    correct: 'The generalizability of the findings across different populations, settings, times, and operational measures.',
    wrongs: [
      'Whether the statistical tests were calculated without computational errors.',
      'Whether the researcher remained completely emotionally neutral during data collection.',
      'The length of time required to publish the results in an academic journal.'
    ],
    explanation: 'External validity assesses whether findings can be generalized beyond the specific sample and context of the original study.'
  },
  {
    topic: 'rs-external-validity',
    difficulty: 'medium',
    question: 'A behavioral study on consumer bargaining conducted in an artificial computer lab with university undergraduate students may lack "ecological validity" because:',
    correct: 'The artificial lab environment and abstract payoffs do not reflect real-world bargaining situations and market pressures.',
    wrongs: [
      'Undergraduate students cannot legally sign consent forms.',
      'Ecological validity only applies to environmental biology studies.',
      'Computer screens invalidate experimental random assignment.'
    ],
    explanation: 'Ecological validity reflects whether the study environment, materials, and tasks correspond to the everyday real-world conditions under investigation.'
  },
  {
    topic: 'rs-external-validity',
    difficulty: 'hard',
    question: 'A laboratory study on persuasion finds a large effect when participants are tested immediately after seeing an advertisement. However, when tested 3 weeks later in their daily lives, the effect has completely disappeared. This study demonstrates:',
    correct: 'High internal validity but limited temporal and ecological generalizability.',
    wrongs: [
      'Total methodological invalidity.',
      'A violation of deductive logic.',
      'A Type II statistical error.'
    ],
    explanation: 'Laboratory experiments often establish clear internal validity in the short term, but the persistence and generalizability of the effect to real-world contexts may be constrained.'
  },

  // ========== RELIABILITY & MEASUREMENT VALIDITY (TOPIC: rs-measurement-quality) ==========
  {
    topic: 'rs-measurement-quality',
    difficulty: 'easy',
    question: 'If a thermometer consistently measures temperature 4°C too high on every single measurement, the measurement is:',
    correct: 'Reliable, but not valid.',
    wrongs: [
      'Valid, but not reliable.',
      'Neither reliable nor valid.',
      'Both highly reliable and highly valid.'
    ],
    explanation: 'Reliability means consistency / repeatability of measurement. Validity means accuracy / measuring what is truly intended. Consistent systematic bias is reliable but invalid.'
  },
  {
    topic: 'rs-measurement-quality',
    difficulty: 'medium',
    question: 'Two independent raters watch video recordings of parent-child interactions and independently code instances of "supportive communication." If their code assignments show 92% agreement, the study has established high:',
    correct: 'Inter-rater (or inter-coder) reliability.',
    wrongs: [
      'Test-retest reliability.',
      'Construct validity.',
      'Internal validity.'
    ],
    explanation: 'Inter-rater reliability measures the degree of consistency across different observers evaluating the same phenomenon.'
  },
  {
    topic: 'rs-measurement-quality',
    difficulty: 'medium',
    question: 'Which metric is most commonly calculated in survey methodology to verify the "internal consistency" of a multi-item Likert scale measuring a single psychological construct?',
    correct: 'Cronbach\'s alpha (α).',
    wrongs: [
      'Pearson\'s correlation with an external criterion.',
      'Cohen\'s d effect size.',
      'Chi-square goodness of fit.'
    ],
    explanation: 'Cronbach\'s alpha measures the degree to which all items in a scale interrelate and tap into the same underlying latent construct.'
  },
  {
    topic: 'rs-measurement-quality',
    difficulty: 'hard',
    question: 'A researcher develops a new questionnaire to measure "academic self-efficacy." To establish "construct validity," the researcher demonstrates that scores correlate strongly with related constructs like academic persistence (convergent validity) and correlate weakly with unrelated constructs like physical athleticism. This demonstrates:',
    correct: 'Convergent and discriminant construct validity.',
    wrongs: [
      'Face validity and predictive criteria.',
      'Inter-rater reliability.',
      'Split-half equivalence.'
    ],
    explanation: 'Construct validity requires both convergent validity (high correlation with theoretically related traits) and discriminant validity (low correlation with theoretically distinct traits).'
  },
  {
    topic: 'rs-measurement-quality',
    difficulty: 'hard',
    question: 'A university admissions test is administered to high school seniors. Five years later, the researchers compare admission test scores with university graduation GPAs. If the test scores correlate strongly with future GPAs, the test possesses high:',
    correct: 'Predictive (criterion-related) validity.',
    wrongs: [
      'Concurrent validity.',
      'Test-retest reliability.',
      'Content validity.'
    ],
    explanation: 'Predictive validity evaluates how accurately an operational measurement forecasts a future relevant outcome criterion.'
  },

  // ========== EXPERIMENTAL DESIGNS (TOPIC: rs-experimental-designs) ==========
  {
    topic: 'rs-experimental-designs',
    difficulty: 'easy',
    question: 'What is the indispensable feature that distinguishes a "true experiment" from a "quasi-experiment"?',
    correct: 'Random assignment of participants to experimental conditions.',
    wrongs: [
      'The presence of a written research hypothesis.',
      'The use of computer-based questionnaires.',
      'A sample size greater than 1,000 individuals.'
    ],
    explanation: 'Random assignment (randomization) is the hallmark of a true experiment, ensuring that confounding individual differences are distributed evenly across groups.'
  },
  {
    topic: 'rs-experimental-designs',
    difficulty: 'medium',
    question: 'A researcher compares reading performance between Classroom A (which received a new tablet curriculum) and Classroom B (which used traditional textbooks). The classrooms existed before the study and students were NOT randomly assigned. This design is a:',
    correct: 'Quasi-experiment (non-equivalent group design).',
    wrongs: [
      'True randomized controlled trial.',
      'Pure correlational survey.',
      'Single-case narrative design.'
    ],
    explanation: 'When an intervention is manipulated across groups but participants cannot be randomly assigned (e.g. existing classes or hospital wards), the design is quasi-experimental.'
  },
  {
    topic: 'rs-experimental-designs',
    difficulty: 'medium',
    question: 'Why is random assignment (randomization) superior to matching for controlling confounding variables in an experiment?',
    correct: 'Randomization controls for both known and unknown/unmeasured confounding variables, whereas matching only controls for specifically identified variables.',
    wrongs: [
      'Randomization guarantees that the null hypothesis will be rejected.',
      'Randomization eliminates the need for a control group.',
      'Randomization ensures 100% external ecological validity.'
    ],
    explanation: 'Matching only equalizes groups on traits the researcher thought to measure; randomization distributes all pre-existing individual differences (known and unknown) probabilistically across conditions.'
  },
  {
    topic: 'rs-experimental-designs',
    difficulty: 'hard',
    question: 'In a medical or behavioral trial, what is the purpose of a "double-blind" procedure?',
    correct: 'To prevent both participant expectancy effects (placebo effect) and experimenter observation/interaction bias.',
    wrongs: [
      'To prevent participants from knowing their fellow participants\' names.',
      'To hide the statistical analysis plan from journal reviewers.',
      'To allow the study to proceed without institutional ethical oversight.'
    ],
    explanation: 'When neither participants nor researchers know who received the active intervention versus placebo, expectancy effects and subtle behavioral cues are neutralized.'
  },
  {
    topic: 'rs-experimental-designs',
    difficulty: 'hard',
    question: 'A research team wants to test both a new drug (Drug vs Placebo) and cognitive therapy (Therapy vs No Therapy) simultaneously to see if their combination produces synergistic benefits. Which experimental design should they use?',
    correct: 'A 2×2 factorial design.',
    wrongs: [
      'A simple A-B-A single-case reversal design.',
      'A cross-sectional cohort design.',
      'A pre-experimental one-shot case study.'
    ],
    explanation: 'A factorial design allows testing multiple independent variables simultaneously, including their main effects and interaction effects.'
  },

  // ========== LONGITUDINAL VS CROSS-SECTIONAL (TOPIC: rs-longitudinal-designs) ==========
  {
    topic: 'rs-longitudinal-designs',
    difficulty: 'easy',
    question: 'A researcher collects data on political attitudes from 1,000 citizens of different ages (20, 40, and 60 years old) on a single day in October 2026. What type of research design is this?',
    correct: 'A cross-sectional design.',
    wrongs: [
      'A panel longitudinal design.',
      'A cohort sequential design.',
      'A retrospective narrative design.'
    ],
    explanation: 'A cross-sectional study gathers data from participants at one single point in time.'
  },
  {
    topic: 'rs-longitudinal-designs',
    difficulty: 'medium',
    question: 'A researcher recruits 500 children born in the year 2000 and surveys the EXACT SAME individuals every five years until they reach age 30. This design is called a:',
    correct: 'Panel study (longitudinal design with identical individuals tracked over time).',
    wrongs: [
      'Trend study (different individuals from the same population).',
      'Cross-sectional study.',
      'Ecological momentary assessment.'
    ],
    explanation: 'A panel study tracks the exact same sample of specific individuals repeatedly across multiple measurement waves.'
  },
  {
    topic: 'rs-longitudinal-designs',
    difficulty: 'hard',
    question: 'In a cross-sectional study comparing digital literacy between 20-year-olds and 70-year-olds, the older adults score significantly lower. What primary confound limits concluding that "aging causes digital literacy to decline"?',
    correct: 'Cohort effects (generational differences in upbringing, technology exposure, and education).',
    wrongs: [
      'Participant attrition over 50 years of tracking.',
      'Hawthorne effect in the older group.',
      'Regression to the mean across generations.'
    ],
    explanation: 'In cross-sectional age comparisons, age is conflated with birth cohort. Generational differences in exposure to technology explain the gap, not biological aging per se.'
  },

  // ========== SAMPLING STRATEGIES (TOPIC: rs-sampling) ==========
  {
    topic: 'rs-sampling',
    difficulty: 'easy',
    question: 'A researcher polls the first 100 students who enter the campus cafeteria at noon on a Tuesday. What sampling method has been employed?',
    correct: 'Convenience sampling (non-probability sampling).',
    wrongs: [
      'Simple random sampling.',
      'Stratified random sampling.',
      'Cluster probability sampling.'
    ],
    explanation: 'Convenience sampling selects whoever is readily available and accessible, lacking random selection and representativeness.'
  },
  {
    topic: 'rs-sampling',
    difficulty: 'medium',
    question: 'A nationwide university survey divides the student population into subgroups by academic faculty (Law, Medicine, Humanities, Engineering) and randomly samples students proportionally from each faculty. What sampling method is this?',
    correct: 'Stratified random sampling.',
    wrongs: [
      'Cluster sampling.',
      'Snowball sampling.',
      'Systematic convenience sampling.'
    ],
    explanation: 'Stratified random sampling divides the population into mutually exclusive strata and draws random samples from each stratum, guaranteeing proportional representation.'
  },
  {
    topic: 'rs-sampling',
    difficulty: 'medium',
    question: 'A sociologist studying undocumented migrant workers recruits 3 initial participants, who then introduce the researcher to their peers, who in turn refer additional participants. What sampling technique is this?',
    correct: 'Snowball sampling (chain-referral sampling).',
    wrongs: [
      'Stratified probability sampling.',
      'Quota sampling.',
      'Simple random sampling.'
    ],
    explanation: 'Snowball sampling relies on referrals among participants and is widely used for hidden, marginalized, or hard-to-reach populations.'
  },
  {
    topic: 'rs-sampling',
    difficulty: 'hard',
    question: 'To study elementary school teaching practices across a large country, researchers randomly select 30 school districts, then randomly select 5 schools within each chosen district, and survey all teachers in those schools. This is an example of:',
    correct: 'Multi-stage cluster sampling.',
    wrongs: [
      'Simple random sampling.',
      'Theoretical purposive sampling.',
      'Convenience sampling.'
    ],
    explanation: 'Cluster sampling samples naturally occurring groups (clusters) rather than individuals directly, which is cost-effective when no exhaustive national list of individuals exists.'
  },

  // ========== QUALITATIVE METHODS (TOPIC: rs-qualitative-methods) ==========
  {
    topic: 'rs-qualitative-methods',
    difficulty: 'easy',
    question: 'Which data collection method allows a researcher to ask a set of predetermined open questions while retaining the flexibility to probe deeper into unexpected answers?',
    correct: 'A semi-structured interview.',
    wrongs: [
      'A standardized closed questionnaire.',
      'A covert laboratory experiment.',
      'A computerized reaction-time test.'
    ],
    explanation: 'Semi-structured interviews use an interview guide with flexible prompts, balancing thematic comparability with open exploration.'
  },
  {
    topic: 'rs-qualitative-methods',
    difficulty: 'medium',
    question: 'In qualitative research methodology, what is meant by "theoretical saturation"?',
    correct: 'The point in data collection where new interviews or observations no longer yield new insights, properties, or conceptual dimensions.',
    wrongs: [
      'When the researcher has read all books available in the university library.',
      'When the p-value reaches 0.001.',
      'When exactly 100 participants have completed surveys.'
    ],
    explanation: 'Theoretical saturation is the criterion for stopping data collection in qualitative research (especially Grounded Theory) when additional data produces no new thematic categories.'
  },
  {
    topic: 'rs-qualitative-methods',
    difficulty: 'hard',
    question: 'A researcher investigates employee burnout using three different approaches: a standardized stress questionnaire, qualitative focus groups, and company absenteeism records. Combining multiple data sources to study the same phenomenon is called:',
    correct: 'Triangulation (specifically, data or methodological triangulation).',
    wrongs: [
      'Data dredging.',
      'Confounding operationalization.',
      'Over-determination of constructs.'
    ],
    explanation: 'Triangulation uses multiple methods, data sources, or investigators to cross-verify findings, enhancing credibility and overcoming single-method bias.'
  },

  // ========== ETHICS IN SOCIAL RESEARCH (TOPIC: rs-ethics) ==========
  {
    topic: 'rs-ethics',
    difficulty: 'easy',
    question: 'What is the ethical cornerstone that requires researchers to provide participants with clear information regarding the study purpose, procedures, risks, and their right to withdraw at any time without penalty?',
    correct: 'Informed consent.',
    wrongs: [
      'Theoretical saturation.',
      'Double-blind randomization.',
      'Statistical debriefing.'
    ],
    explanation: 'Informed consent ensures participants understand what participation entails and voluntarily agree without coercion.'
  },
  {
    topic: 'rs-ethics',
    difficulty: 'medium',
    question: 'In a psychological study, participants are led to believe they are competing against another student in an adjoining room, when they are actually playing against a computer algorithm. What ethical obligation must the researcher fulfill at the end of the session?',
    correct: 'A thorough debriefing explaining the deception, its scientific rationale, and ensuring no participant leaves distressed.',
    wrongs: [
      'Offering participants course grades regardless of attendance.',
      'Publishing participants\' real names to verify authenticity.',
      'Destroying all computer records immediately without analysis.'
    ],
    explanation: 'Debriefing is ethically mandatory whenever deception is used, revealing the true nature of the experiment and repairing any misconception or negative affect.'
  },
  {
    topic: 'rs-ethics',
    difficulty: 'hard',
    question: 'What is the critical distinction between "confidentiality" and "anonymity" in research participant data management?',
    correct: 'In anonymous research, the researcher never knows participants\' identities; in confidential research, the researcher knows identities but protects them from public disclosure.',
    wrongs: [
      'Anonymity is used in qualitative research; confidentiality is used in quantitative research.',
      'Confidentiality means data is shared with government agencies; anonymity means data is destroyed.',
      'Anonymity allows the participant to remain silent; confidentiality allows the researcher to publish raw identifying information.'
    ],
    explanation: 'Anonymity means no identifying information is ever linked to responses (even by the researcher). Confidentiality means identifying information exists but is securely protected and kept private.'
  }
];

// Enrich RS_QUESTIONS with additional generated scenarios across all difficulties
function createMoreRSQuestions() {
  const extra = [];

  const hypothesisScenarios = [
    {
      topic: 'rs-hypotheses',
      diff: 'medium',
      q: 'A researcher hypothesizes: "Higher levels of workplace telecommuting lead to lower perceived team cohesion." What type of hypothesis is this?',
      c: 'A directional alternative hypothesis (H₁).',
      w: ['A non-directional null hypothesis (H₀).', 'A null hypothesis stating no relationship.', 'A qualitative exploratory observation.'],
      e: 'A directional hypothesis specifies both the presence and the expected direction (negative) of the relationship.'
    },
    {
      topic: 'rs-hypotheses',
      diff: 'easy',
      q: 'In statistical hypothesis testing, the Null Hypothesis (H₀) generally states that:',
      c: 'There is no true effect, difference, or association in the underlying population.',
      w: ['The researcher\'s new theoretical prediction is definitively true.', 'The sample size was too small to draw conclusions.', 'The dependent variable caused the independent variable.'],
      e: 'The null hypothesis posits zero difference or no effect, against which the alternative hypothesis is tested.'
    },
    {
      topic: 'rs-hypotheses',
      diff: 'hard',
      q: 'A medical trial concludes that a new cognitive training app is effective when in reality the app has zero true effect in the population. What type of statistical error has been committed?',
      c: 'A Type I error (false positive / rejecting a true null hypothesis).',
      w: ['A Type II error (false negative).', 'An instrumentation decay error.', 'A selection mortality error.'],
      e: 'A Type I error occurs when a researcher incorrectly rejects a true null hypothesis (declaring an effect that does not exist).'
    },
    {
      topic: 'rs-hypotheses',
      diff: 'hard',
      q: 'A sociological study fails to detect a genuine, real-world difference in civic engagement between two voting groups because the sample size was too small (statistical power was too low). This error is classified as:',
      c: 'A Type II error (false negative / failing to reject a false null hypothesis).',
      w: ['A Type I error (false positive).', 'A confounding artifact.', 'A Hawthorne effect.'],
      e: 'A Type II error occurs when an existing real effect is missed (failing to reject a false null hypothesis), often due to inadequate sample size.'
    },
    {
      topic: 'rs-experimental-designs',
      diff: 'medium',
      q: 'When factory workers increase their productivity simply because they know they are being observed by researchers, regardless of changes in lighting or break times, this phenomenon is known as the:',
      c: 'Hawthorne effect.',
      w: ['Pythagorean effect.', 'Placebo effect.', 'Contrast effect.'],
      e: 'The Hawthorne effect refers to participants modifying their behavior simply in response to the awareness of being observed.'
    },
    {
      topic: 'rs-experimental-designs',
      diff: 'medium',
      q: 'In a single-case experimental design where baseline behavior is measured (A), an intervention is introduced (B), and then the intervention is withdrawn (A), this structure is known as:',
      c: 'An A-B-A reversal design.',
      w: ['A latin square experiment.', 'A panel cohort design.', 'A Solomon four-group design.'],
      e: 'An A-B-A design demonstrates experimental control by observing if behavior returns toward baseline when the intervention is withdrawn.'
    },
    {
      topic: 'rs-internal-validity',
      diff: 'hard',
      q: 'In the Solomon Four-Group experimental design, two groups receive a pre-test and two groups do not receive a pre-test. What is the primary purpose of this design?',
      c: 'To evaluate and control for the testing effect (pre-test sensitization) on the post-test results.',
      w: ['To ensure inter-rater reliability among judges.', 'To replace the need for random assignment.', 'To eliminate the possibility of participant dropout.'],
      e: 'The Solomon Four-Group design enables explicit measurement of whether taking a pre-test influences participants\' sensitivity to the subsequent intervention.'
    },
    {
      topic: 'rs-sampling',
      diff: 'medium',
      q: 'If a researcher wants to estimate public opinion in Germany with a margin of error of ±3%, why is a random sample of 1,500 citizens sufficient, even though the total population is over 83 million?',
      c: 'Because statistical precision depends primarily on sample size itself, not on the fraction of the population sampled (provided the population is large).',
      w: ['Because 1,500 is mathematically equal to 10% of 83 million.', 'Because all citizens in a country have nearly identical political views.', 'Because census weighting replaces the laws of probability.'],
      e: 'The standard error of a sample depends on the absolute sample size N, not the proportion of the population sampled, once the population is large.'
    },
    {
      topic: 'rs-sampling',
      diff: 'hard',
      q: 'A telephone survey about daily smartphone usage is conducted exclusively using landline home phone numbers during working hours (9 AM to 5 PM). Which sampling bias most critically compromises the study?',
      c: 'Coverage bias (systematic exclusion of younger, mobile-only, and employed demographics).',
      w: ['Inter-rater coder bias.', 'Diffusion of treatment.', 'Experimental regression.'],
      e: 'Coverage bias occurs when the sampling frame systematically excludes certain segments of the target population.'
    },
    {
      topic: 'rs-measurement-quality',
      diff: 'medium',
      q: 'A survey question asks: "Do you agree that universities should reduce tuition fees and provide free transit passes?" Why is this item methodologically flawed?',
      c: 'It is a double-barreled question combining two separate issues into a single prompt.',
      w: ['It lacks a 7-point Likert scale.', 'It contains excessive qualitative terminology.', 'It violates informed consent.'],
      e: 'A double-barreled question asks about two distinct topics simultaneously, making it impossible to know which aspect the respondent agreed or disagreed with.'
    },
    {
      topic: 'rs-measurement-quality',
      diff: 'easy',
      q: 'When survey respondents tend to agree with statements regardless of the actual content, displaying a general tendency to answer "Yes" or "Agree", this response bias is called:',
      c: 'Acquiescence bias (yea-saying).',
      w: ['Extreme response bias.', 'Social desirability bias.', 'Recall bias.'],
      e: 'Acquiescence bias is the tendency of respondents to agree with survey statements passively.'
    },
    {
      topic: 'rs-measurement-quality',
      diff: 'medium',
      q: 'When survey respondents underreport socially disapproved behaviors (such as illegal drug use or tax evasion) and overreport socially praised behaviors (such as voting or charitable donations), this is known as:',
      c: 'Social desirability bias.',
      w: ['Attrition bias.', 'Selection mortality.', 'Cronbach contamination.'],
      e: 'Social desirability bias leads participants to present themselves in a favorable light according to prevailing social norms.'
    },
    {
      topic: 'rs-variables',
      diff: 'medium',
      q: 'A researcher is studying the effect of coffee consumption on heart disease. Cigarette smoking is strongly linked to coffee drinking and also directly causes heart disease. If cigarette smoking is omitted from the analysis, it acts as a:',
      c: 'Confounder that can produce a spurious association.',
      w: ['Mediator that explains the cellular mechanism.', 'Dependent outcome variable.', 'Reliability coefficient.'],
      e: 'Smoking is a classic confounding variable: it correlates with the exposure (coffee) and causes the outcome (heart disease), distorting the apparent relationship.'
    },
    {
      topic: 'rs-deductive-inductive',
      diff: 'challenge',
      q: 'Karl Popper argued that scientific theories can never be verified conclusively by accumulating supporting empirical observations, but they can be:',
      c: 'Falsified by a single contradictory empirical observation.',
      w: ['Proven with 100% inductive certainty.', 'Made immune to testing through operationalization.', 'Automatically converted into mathematical axioms.'],
      e: 'Popper\'s principle of falsificationism posits that scientific theories cannot be verified inductively, only tested and potentially falsified deductively.'
    },
    {
      topic: 'rs-methodology',
      diff: 'easy',
      q: 'Before launching a nationwide survey with 10,000 households, the research team administers the draft questionnaire to 50 respondents to evaluate question clarity, response timing, and instructions. This preliminary test is called a:',
      c: 'Pilot study (pre-test).',
      w: ['Post-hoc analysis.', 'Factor analysis.', 'Grounded validation.'],
      e: 'A pilot study tests procedures and instruments on a small sample prior to full-scale deployment.'
    },
    {
      topic: 'rs-methodology',
      diff: 'medium',
      q: 'A study observes that districts with higher average household income have higher rates of hybrid car ownership. The researcher concludes: "Therefore, any wealthy individual in this city owns a hybrid car." This error of inferring individual behavior from aggregate statistics is the:',
      c: 'Ecological fallacy.',
      w: ['Exception fallacy.', 'Attrition bias.', 'Confirmation bias.'],
      e: 'The ecological fallacy occurs when inferences about the nature of individuals are deduced solely from statistics about the group to which those individuals belong.'
    },
    {
      topic: 'rs-methodology',
      diff: 'medium',
      q: 'When an unexpected policy change (such as a sudden change in speed limits on a border highway) allows researchers to observe outcomes without having artificially assigned treatments, this design is known as a:',
      c: 'Natural experiment.',
      w: ['Laboratory double-blind trial.', 'Purposive ethnographic focus group.', 'Retrospective narrative enquiry.'],
      e: 'A natural experiment occurs when real-world events or policy shifts create comparison groups outside the researcher\'s direct experimental control.'
    },
    {
      topic: 'rs-experimental-designs',
      diff: 'hard',
      q: 'In an experiment on workplace authority, participants deduce what the experimenter wants to find and subtly adjust their behavior to confirm the researcher\'s perceived expectations. This threat is known as:',
      c: 'Demand characteristics.',
      w: ['Maturation.', 'History threat.', 'Instrument decay.'],
      e: 'Demand characteristics are subtle cues that make participants aware of what the experimenter expects to find, biasing their responses.'
    },
    {
      topic: 'rs-measurement-quality',
      diff: 'medium',
      q: 'A difficult mathematics test is given to a group of advanced graduate students, and every single student scores 100%. The test fails to differentiate among students\' abilities due to a:',
      c: 'Ceiling effect.',
      w: ['Floor effect.', 'Halo effect.', 'Placebo effect.'],
      e: 'A ceiling effect occurs when a test is too easy, causing scores to cluster at the maximum limit and obscuring differences among top performers.'
    },
    {
      topic: 'rs-measurement-quality',
      diff: 'medium',
      q: 'A test of advanced quantum physics is administered to primary school children, and all children score 0%. This measurement limitation is known as a:',
      c: 'Floor effect.',
      w: ['Ceiling effect.', 'Hawthorne effect.', 'Demand characteristic.'],
      e: 'A floor effect occurs when a measurement task is so difficult that all scores cluster at the lower limit.'
    },
    {
      topic: 'rs-measurement-quality',
      diff: 'medium',
      q: 'An interviewer rates a job applicant who is physically attractive as also possessing higher intelligence, punctuality, and technical competence, despite having no evidence for those traits. This cognitive evaluation bias is the:',
      c: 'Halo effect.',
      w: ['Horn effect.', 'Placebo effect.', 'Recency effect.'],
      e: 'The halo effect is a cognitive bias in which an overall positive impression of a person influences specific trait evaluations.'
    },
    {
      topic: 'rs-qualitative-methods',
      diff: 'hard',
      q: 'In Grounded Theory data analysis, what is the initial phase where text data is broken down into discrete segments, closely examined, and labeled with descriptive tags?',
      c: 'Open coding.',
      w: ['Axial coding.', 'Selective coding.', 'Confirmatory operationalization.'],
      e: 'Open coding is the initial exploratory stage of Grounded Theory where qualitative data is fractured into distinct conceptual codes.'
    },
    {
      topic: 'rs-qualitative-methods',
      diff: 'hard',
      q: 'In Grounded Theory, the process of relating categories to their subcategories along the lines of their properties and dimensions is known as:',
      c: 'Axial coding.',
      w: ['Open coding.', 'Selective coding.', 'Triangulation.'],
      e: 'Axial coding reassembles data fractured during open coding by making connections between categories and subcategories.'
    },
    {
      topic: 'rs-sampling',
      diff: 'easy',
      q: 'What is a major limitation of using volunteer or self-selected samples in internet-based public opinion polls?',
      c: 'Volunteers tend to have stronger opinions and higher interest in the topic than the general population (self-selection bias).',
      w: ['Internet surveys cannot collect quantitative data.', 'Volunteers are legally prohibited from participating.', 'The sample size can never exceed 100.'],
      e: 'Self-selection bias occurs when participants choose themselves into a study, resulting in individuals with extreme or enthusiastic attitudes being overrepresented.'
    },
    {
      topic: 'rs-sampling',
      diff: 'medium',
      q: 'In survey research, what is "non-response bias"?',
      c: 'A systematic difference between the characteristics of individuals who respond to the survey and those who choose not to respond.',
      w: ['The percentage of blank questions left by a single respondent.', 'A typing error made by the survey designer.', 'When a question has no right or wrong answer.'],
      e: 'Non-response bias compromises representativeness if people who refuse to participate differ systematically on key variables from respondents.'
    },
    {
      topic: 'rs-longitudinal-designs',
      diff: 'hard',
      q: 'Participants in a multi-year panel study become increasingly familiar with the questionnaire and testing procedures, causing their performance to improve simply through repeated practice. This longitudinal bias is known as:',
      c: 'Panel conditioning (or testing effect over waves).',
      w: ['Historical regression.', 'Instrumentation decay.', 'Construct dilution.'],
      e: 'Panel conditioning occurs when repeated participation in surveys alters subjects\' responses or knowledge over time.'
    },
    {
      topic: 'rs-ethics',
      diff: 'easy',
      q: 'Under social science research ethics standards, what must a researcher do if a participant decides midway through an experiment that they wish to stop and leave?',
      c: 'Immediately respect their decision and allow them to withdraw without penalty, withholding of rewards, or intimidation.',
      w: ['Insist they complete the session because they signed a consent form.', 'Report them to university authorities.', 'Discard all past research sessions from other participants.'],
      e: 'Informed consent explicitly includes the unconditional right to withdraw from a study at any time without negative consequences.'
    },
    {
      topic: 'rs-variables',
      diff: 'easy',
      q: 'Which level of measurement categorizes data into ordered ranks where the distance between categories is NOT necessarily equal (e.g. Likert scale: strongly disagree, disagree, neutral, agree, strongly agree)?',
      c: 'Ordinal scale.',
      w: ['Nominal scale.', 'Interval scale.', 'Ratio scale.'],
      e: 'An ordinal scale ranks observations in a meaningful sequence, but intervals between ranks are not measured or equal.'
    },
    {
      topic: 'rs-variables',
      diff: 'easy',
      q: 'Which level of measurement classifies data into distinct named categories without any natural ordering or ranking (e.g. eye color, nationality, university faculty)?',
      c: 'Nominal scale.',
      w: ['Ordinal scale.', 'Interval scale.', 'Ratio scale.'],
      e: 'A nominal scale provides qualitative categories without quantitative order or distance.'
    },
    {
      topic: 'rs-internal-validity',
      diff: 'challenge',
      q: 'In a quasi-experimental evaluation comparing two school districts, students in District A naturally mature and develop cognitive skills faster than students in District B due to socio-economic differences. This threat to internal validity is called a:',
      c: 'Selection-maturation interaction.',
      w: ['Instrumentation-history interaction.', 'Regression-testing interaction.', 'Ceiling-floor contamination.'],
      e: 'A selection-maturation interaction occurs when the pre-existing groups mature or develop at different rates over time, mimicking an intervention effect.'
    }
  ];

  return extra.concat(hypothesisScenarios.map(s => ({
    topic: s.topic,
    difficulty: s.diff,
    question: s.q,
    correct: s.c,
    wrongs: s.w,
    explanation: s.e
  })));
}

// Master pool of all RS questions
const ALL_RS_QUESTIONS = RS_QUESTIONS.concat(createMoreRSQuestions());

export function generateResearchStrategyQuestion(difficulty = 'medium') {
  // Filter questions by difficulty if available, or fallback
  let candidates = ALL_RS_QUESTIONS.filter(q => q.difficulty === difficulty);
  if (candidates.length === 0) {
    candidates = ALL_RS_QUESTIONS;
  }

  const raw = candidates[randInt(0, candidates.length - 1)];

  // Shuffle options so correct answer is at a random position
  const options = shuffleArray([raw.correct, ...raw.wrongs]);
  const correctAnswer = options.indexOf(raw.correct);

  return {
    id: generateId('rs'),
    module: 'Subject Module',
    submodule: 'Research Strategies in Social Sciences',
    topic: raw.topic,
    difficulty: raw.difficulty,
    questionType: 'single_choice',
    sourceType: 'generated',
    estimatedTimeSeconds: raw.difficulty === 'easy' ? 40 : raw.difficulty === 'medium' ? 60 : 75,
    question: raw.question,
    options,
    correctAnswer,
    explanation: raw.explanation,
    solutionSteps: [raw.explanation],
    skillsTested: ['scientific method', 'research methodology', 'critical reasoning'],
    commonTrap: 'Read the question carefully to distinguish between causes (independent), effects (dependent), mechanisms (mediators), and conditions (moderators).',
    tags: ['research-strategies', 'social-sciences', 'methodology', raw.difficulty]
  };
}

export function generateResearchStrategyBank(count = 75) {
  const bank = [];
  const difficulties = ['easy', 'medium', 'hard', 'challenge'];
  const perDiff = Math.ceil(count / difficulties.length);

  // To ensure 100% uniqueness in bank, track seen question texts
  const seenTexts = new Set();

  for (const diff of difficulties) {
    let pool = ALL_RS_QUESTIONS.filter(q => q.difficulty === diff);
    if (pool.length === 0) pool = ALL_RS_QUESTIONS;
    const shuffledPool = shuffleArray(pool);

    for (const raw of shuffledPool) {
      if (bank.length >= count) break;
      if (!seenTexts.has(raw.question)) {
        seenTexts.add(raw.question);
        const options = shuffleArray([raw.correct, ...raw.wrongs]);
        bank.push({
          id: generateId('rs'),
          module: 'Subject Module',
          submodule: 'Research Strategies in Social Sciences',
          topic: raw.topic,
          difficulty: raw.difficulty,
          questionType: 'single_choice',
          sourceType: 'generated',
          estimatedTimeSeconds: raw.difficulty === 'easy' ? 40 : raw.difficulty === 'medium' ? 60 : 75,
          question: raw.question,
          options,
          correctAnswer: options.indexOf(raw.correct),
          explanation: raw.explanation,
          solutionSteps: [raw.explanation],
          skillsTested: ['scientific method', 'research methodology', 'critical reasoning'],
          commonTrap: 'Read the question carefully to distinguish between variables and methodology principles.',
          tags: ['research-strategies', 'social-sciences', 'methodology', raw.difficulty]
        });
      }
    }
  }

  // If we need more to reach count, add remaining from ALL_RS_QUESTIONS
  for (const raw of ALL_RS_QUESTIONS) {
    if (bank.length >= count) break;
    if (!seenTexts.has(raw.question)) {
      seenTexts.add(raw.question);
      const options = shuffleArray([raw.correct, ...raw.wrongs]);
      bank.push({
        id: generateId('rs'),
        module: 'Subject Module',
        submodule: 'Research Strategies in Social Sciences',
        topic: raw.topic,
        difficulty: raw.difficulty,
        questionType: 'single_choice',
        sourceType: 'generated',
        estimatedTimeSeconds: 60,
        question: raw.question,
        options,
        correctAnswer: options.indexOf(raw.correct),
        explanation: raw.explanation,
        solutionSteps: [raw.explanation],
        skillsTested: ['scientific method', 'research methodology', 'critical reasoning'],
        tags: ['research-strategies', 'social-sciences', 'methodology']
      });
    }
  }

  return bank;
}
