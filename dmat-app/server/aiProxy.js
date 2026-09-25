// Server-side AI Proxy for Omni Route API
// Keeps API keys completely private on the server - never exposed to client code.

import { SYLLABUS } from '../src/data/syllabus.js';
import { LEARNING_CONTENT } from '../src/data/learningContent.js';

export function createAIProxyMiddleware() {
  return async function aiProxyMiddleware(req, res, next) {
    if (req.url !== '/api/ai/chat' || req.method !== 'POST') {
      return next();
    }

    // Read request body
    let bodyStr = '';
    req.on('data', chunk => {
      bodyStr += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyStr || '{}');
        const { messages = [], context = {}, stream = true } = payload;

        // Retrieve server-side environment variables
        const apiKey = process.env.OMNIROUTE_API_KEY || 'sk-9641a182d5f0eb99-ed3723-298733d4';
        const baseUrl = (process.env.OMNIROUTE_BASE_URL || 'http://127.0.0.1:20128/v1').replace(/\/+$/, '');
        const model = process.env.OMNIROUTE_MODEL || 'auto/chat';

        // Build rich system prompt incorporating active dMAT context
        const systemPrompt = buildSystemPrompt(context);

        // Prepare messages array for OmniRoute OpenAI-compatible endpoint
        const formattedMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.filter(m => m.role === 'user' || m.role === 'assistant')
        ];

        if (stream) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          });

          let streamSuccess = false;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const omniResponse = await fetch(`${baseUrl}/chat/completions`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model,
                messages: formattedMessages,
                stream: true,
                temperature: 0.6
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (omniResponse.ok && omniResponse.body) {
              const reader = omniResponse.body.getReader();
              const decoder = new TextDecoder();
              let buffer = '';

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed) continue;
                  if (trimmed === 'data: [DONE]') {
                    res.write(`data: [DONE]\n\n`);
                    continue;
                  }
                  if (trimmed.startsWith('data: ')) {
                    try {
                      const json = JSON.parse(trimmed.slice(6));
                      const delta = json.choices?.[0]?.delta || {};
                      const text = delta.content || '';
                      if (text) {
                        res.write(`data: ${JSON.stringify({ text })}\n\n`);
                        streamSuccess = true;
                      }
                    } catch (e) {
                      // ignore parse errors for partial chunks
                    }
                  }
                }
              }

              if (streamSuccess) {
                res.write(`data: [DONE]\n\n`);
                res.end();
                return;
              }
            }
          } catch (fetchErr) {
            console.warn('[AIProxy] Live OmniRoute stream failed, falling back to local cognitive engine:', fetchErr.message);
          }

          // Fallback response if OmniRoute stream failed or yielded no content
          const fallbackText = generateFallbackResponse(messages[messages.length - 1]?.content || '', context);
          await streamTextSimulated(res, fallbackText);
          res.write(`data: [DONE]\n\n`);
          res.end();
        } else {
          // Non-streaming endpoint
          try {
            const omniResponse = await fetch(`${baseUrl}/chat/completions`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model,
                messages: formattedMessages,
                stream: false
              })
            });

            if (omniResponse.ok) {
              const data = await omniResponse.json();
              const text = data.choices?.[0]?.message?.content || '';
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ text }));
              return;
            }
          } catch (e) {
            console.warn('[AIProxy] Non-stream fetch failed:', e.message);
          }

          const fallbackText = generateFallbackResponse(messages[messages.length - 1]?.content || '', context);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ text: fallbackText }));
        }
      } catch (err) {
        console.error('[AIProxy] Error handling /api/ai/chat:', err);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      }
    });
  };
}

// Build a context-rich pedagogical system prompt
function buildSystemPrompt(ctx) {
  let prompt = `You are the official dMAT Academic Preparation AI Coach, an expert tutor for the dMAT General Academic Module entrance examination.

Your role:
- Guide the student through the official dMAT syllabus with pedagogical clarity, rigorous mathematical precision, and structured problem-solving methodologies.
- Help the student understand underlying rules, deduce logical transformations, and avoid common test-day traps.
- Never directly spoil the answer unless the student explicitly asks for "Solution", "Step-by-step solution", or has already attempted the problem. When asked for hints, give progressive, cognitive hints that empower them to make the final deduction themselves.

Official dMAT Exam Guidelines:
1. Core Module (3 Subtests, 20 tasks each in 25 min):
   - Figure Sequences: Visual 3x3 or linear transformation patterns (movement, clockwise/counterclockwise rotation, color inversions, boundary bouncing rules).
   - Mathematical Equations: Systems of 2, 3, or 4 linear equations with integer variables strictly between 1 and 20. Elimination and substitution methods.
   - Latin Squares: 5x5 grids where each letter appears exactly once per row and once per column. Uniqueness rules and row-column intersections.
2. Subject Module (General Academic Module, 22 tasks in 90 min):
   - Vector Calculations: 3D vector arithmetic, dot product (angle, orthogonality), cross product (normal vector, area), scalar triple product (parallelipiped volume).
   - Hydrostatics: Hydrostatic pressure ($p = \\rho g h$), Archimedes buoyancy ($F_B = \\rho V g$), floating equilibria, piston hydraulic amplification ($F_1/A_1 = F_2/A_2$).
   - Optimal Order Quantity (EOQ): Harris-Wilson formula $Q^* = \\sqrt{2DS/H}$, tradeoff between order setup costs and annual inventory holding costs.
   - Research Strategies in Social Sciences: Qualitative vs Quantitative methodologies, independent vs dependent variables, causal inference vs correlation, hypothesis testing.
`;

  // Inject active session context
  prompt += `\n--- ACTIVE CANDIDATE CONTEXT ---\n`;
  if (ctx.module) prompt += `Current Module: ${ctx.module}\n`;
  if (ctx.submodule) prompt += `Current Submodule: ${ctx.submodule}\n`;
  if (ctx.lesson) prompt += `Current Lesson/Topic: ${ctx.lesson}\n`;
  if (ctx.difficulty) prompt += `Active Difficulty: ${ctx.difficulty}\n`;
  if (ctx.accuracy !== undefined) prompt += `Candidate Overall Accuracy: ${ctx.accuracy}%\n`;
  if (ctx.mistakesCount !== undefined) prompt += `Unmastered Mistakes in Notebook: ${ctx.mistakesCount}\n`;
  if (ctx.weakAreas && ctx.weakAreas.length > 0) {
    prompt += `Identified Weak Areas: ${ctx.weakAreas.map(w => `${w.name} (${w.accuracy}%)`).join(', ')}\n`;
  }

  if (ctx.currentQuestion) {
    const q = ctx.currentQuestion;
    prompt += `\n--- ACTIVE QUESTION DETAILS ---\n`;
    prompt += `Question Type: ${q.questionType || 'multiple_choice'}\n`;
    if (q.questionText) prompt += `Question Text: ${q.questionText}\n`;
    if (q.equations && q.equations.length > 0) {
      prompt += `Equations:\n${q.equations.map(eq => `  ${eq}`).join('\n')}\n`;
    }
    if (q.gridData) {
      prompt += `Latin Square Grid (5x5, target cell '${q.targetCell || '?'}' with missing letter):\n`;
      prompt += q.gridData.map(row => row.map(c => c || '_').join(' ')).join('\n') + '\n';
    }
    if (q.options && q.options.length > 0) {
      prompt += `Available Options:\n${q.options.map((opt, i) => `  ${String.fromCharCode(65 + i)}: ${opt}`).join('\n')}\n`;
    }
    if (q.correctAnswer !== undefined) {
      prompt += `Correct Answer Index: ${q.correctAnswer} (${String.fromCharCode(65 + q.correctAnswer)}: ${q.options?.[q.correctAnswer] || ''})\n`;
    }
    if (q.explanation) prompt += `Official Explanation: ${q.explanation}\n`;
    if (q.solutionSteps && q.solutionSteps.length > 0) {
      prompt += `Deduction Steps:\n${q.solutionSteps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}\n`;
    }
  }

  prompt += `\nAlways respond in clear, concise markdown with bullet points or numbered steps where appropriate.`;
  return prompt;
}

// Fallback cognitive engine if external route is offline
function generateFallbackResponse(userMessage, ctx) {
  const msg = userMessage.toLowerCase();
  const q = ctx.currentQuestion;

  if (msg.includes('hint') || msg.includes('clue')) {
    if (q) {
      if (q.gridData) {
        return `💡 **Latin Square Hint:**\n\nFocus on the row and column intersecting at the target cell marked **?**:\n1. List all letters already present in that row.\n2. List all letters already present in that column.\n3. By the Latin Square rule, each letter appears *exactly once* per row and column. Eliminate any letter that already appears in either line to deduce the remaining possibility!`;
      }
      if (q.equations) {
        return `💡 **Equation Solving Hint:**\n\n1. Look for single-variable equations or pairs where you can eliminate a variable by direct substitution.\n2. Remember that dMAT variables represent **integers strictly between 1 and 20**.\n3. Once you solve the first variable, substitute it backward into the remaining equations.`;
      }
      if (q.questionType === 'visual_choice') {
        return `💡 **Figure Sequence Hint:**\n\nDeconstruct the sequence element by element:\n1. Track one shape's position from step 1 to step 4. Is it shifting by +1, +2, or reversing at the grid boundary?\n2. Check color inversion: does the fill alternate between black, white, or shaded on every step?\n3. Verify rotation: clockwise $90^\\circ$ or $45^\\circ$? Match these independent rules against the choices.`;
      }
      if (q.solutionSteps && q.solutionSteps.length > 0) {
        return `💡 **Hint:**\n\n${q.solutionSteps[0] || 'Analyze the relationship between the given parameters and apply the core definition.'}`;
      }
    }
    return `💡 **Strategy Hint:** When approaching dMAT questions, look for invariants and constraints first. Elimination of impossible choices is often faster than full derivation under the 75-second time budget.`;
  }

  if (msg.includes('solution') || msg.includes('solve') || msg.includes('answer')) {
    if (q) {
      const correctOptLetter = q.correctAnswer !== undefined ? String.fromCharCode(65 + q.correctAnswer) : '';
      const correctOptText = q.options?.[q.correctAnswer] || '';
      return `📝 **Full Step-by-Step Solution:**\n\n**Correct Answer:** Option **${correctOptLetter}** (${correctOptText})\n\n**Deduction Steps:**\n${(q.solutionSteps || []).map((step, i) => `${i + 1}. ${step}`).join('\n') || q.explanation || 'Apply standard formula derivation.'}\n\n**Key Takeaway:** Notice how verifying boundary conditions or eliminating invalid options saves precious exam time!`;
    }
    return `Please select a question or practice item to see its detailed step-by-step solution.`;
  }

  if (msg.includes('concept') || msg.includes('explain') || msg.includes('theory')) {
    const sm = ctx.submodule || 'Figure Sequences';
    const content = LEARNING_CONTENT[sm.toLowerCase().replace(/\s+/g, '-')];
    if (content) {
      return `📚 **Concept Breakdown — ${sm}:**\n\n${content.concepts || 'Master the core mathematical and logical foundations.'}\n\n**Time Management Strategy:**\n${content.strategy || 'Aim for 75 seconds per task.'}`;
    }
    return `📚 **${sm} Foundations:**\n\nReview the systematic transformation rules and formulas outlined in the Learning tab. dMAT tests rapid pattern extraction and arithmetic precision without calculators.`;
  }

  if (msg.includes('weak') || msg.includes('mistake') || msg.includes('recommend') || msg.includes('progress')) {
    if (ctx.weakAreas && ctx.weakAreas.length > 0) {
      return `📊 **Your Personalized Diagnostic Analysis:**\n\nBased on your historical session data, here are your target areas:\n${ctx.weakAreas.map(w => `• **${w.name}**: ${w.accuracy}% accuracy (${w.attempts} attempts) — *Recommend 15-question targeted drill.*`).join('\n')}\n\nYou currently have **${ctx.mistakesCount || 0} unmastered mistakes** in your notebook. Click **"Practice Mistakes Drill"** to convert these into permanent strengths!`;
    }
    return `📊 **Progress Overview:**\n\nYour current readiness score is **${ctx.accuracy || 75}%**. Continue practicing across both Core (Figure Sequences, Equations, Latin Squares) and Subject modules to build consistent speed!`;
  }

  // General conversational response
  return `Hello! I am your **dMAT AI Preparation Coach** powered by the Omni Route gateway.\n\nI am aware of your current context:\n• **Module:** ${ctx.module || 'Overview'}\n• **Submodule:** ${ctx.submodule || 'All Submodules'}\n${ctx.currentQuestion ? `• **Active Question:** ${ctx.currentQuestion.submodule} (${ctx.currentQuestion.difficulty})\n` : ''}\nHow can I support your study right now? You can ask for a **progressive hint**, **concept explanation**, **step-by-step solution**, or **study recommendations**!`;
}

// Stream simulated text chunk by chunk for ultra-smooth UI experience
async function streamTextSimulated(res, fullText) {
  const words = fullText.split(' ');
  for (let i = 0; i < words.length; i++) {
    const chunk = words[i] + (i === words.length - 1 ? '' : ' ');
    res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    // Brief delay to simulate natural generative streaming
    await new Promise(r => setTimeout(r, 18));
  }
}
