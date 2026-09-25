# dMAT General Academic Module – Complete Exam Preparation Platform

A full-featured, production-grade web application built for the **dMAT (Digital Master Test) General Academic Module** preparatory curriculum.

Based directly on the official German academic aptitude syllabus: **`260902_dMAT_General-Academic-Module_Preparatoy-Materials_EN.pdf`**.

---

## 🎯 Platform Highlights

### 1. 📚 Complete In-Depth Learning Curriculum (43 Subtopics)
Every module and subtopic features:
- **Concept Theory & Mechanics**: Clear mathematical and logical foundations.
- **Core Principles**: Numbered governing rules and axioms.
- **Formulas & Equations**: Standard notation and LaTeX mathematical equations.
- **High-Yield Exam Tricks & Shortcuts**: Practical time-saving heuristics and *"Rule of Thumb"* guides.
- **Common Traps to Avoid**: Pitfall explanations and avoidance strategies under exam time pressure.
- **3 Difficulty-Graded Worked Examples**: Interactive **Easy**, **Medium**, and **Hard / Challenge** examples with step-by-step walkthroughs and speed shortcuts.

### 2. 🧩 Complete Syllabus Coverage
- **Core Module (Cognitive & Analytical Skills)**:
  - **Figure Sequences (20 tasks · 25 min)**: Position tracking, color changes, rotation/reflection, movement acceleration ($x + 1$), and boundary bounce vs. glide interactions.
  - **Mathematical Equations (20 tasks · 25 min)**: Single & multi-variable systems, exponential scaling, operator balance, and polynomial roots without calculators.
  - **Latin Squares (20 tasks · 25 min)**: 5×5 Greek-letter grids with 100% mathematically proven unique solutions, naked/hidden singles, and step-by-step deduction paths.
- **Subject Module (Academic Problem Solving · 90 min)**:
  - **Vector Calculations**: 2D/3D vectors, dot products, cross products, scalar triple products, angles, areas, and coplanarity.
  - **Hydrostatics**: Hydrostatic pressure gradients, Pascal's principle, Archimedes' buoyancy, floating body equilibrium, U-tubes, and density stratification.
  - **Optimal Order Quantity (EOQ)**: Andler formula, setup/ordering costs, holding costs, total cost minimization, and sensitivity analysis.
  - **Research Strategies in Social Sciences**: Causality, third-variable confounding, experimental & quasi-experimental designs, validity threats, and reliability.

### 3. 📝 Exam Engines
- **Practice Exam Wizard**: Filter by module, submodule, difficulty, and question count.
- **Official Exam Simulation**: Full 180-minute dMAT simulation with official section timers and strict rules.
- **Dynamic Question Bank**: 498 pre-seeded questions + deterministic on-demand generators.

### 4. 🤖 Context-Aware AI Assistant
- Floating bottom-right assistant orb with edge-snapping and smooth physics.
- Responsive side drawer with active context tracking (module, subtopic, difficulty, mistakes).
- Secure backend API proxy via Omni Route API (`/api/ai/chat`) with SSE streaming.
- Automatically disabled during Exam Simulation to replicate real test conditions.

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/ajinfotech-ai/dMAT.git
cd dMAT/dmat-app

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Deploy to Render

This repository includes a production Express server and Render Blueprint configuration (`render.yaml`).

### Deploy in 2 Minutes:
1. Log into [Render](https://dashboard.render.com).
2. Click **New +** → **Blueprint** and select this repository (`ajinfotech-ai/dMAT`).
3. Render automatically sets up:
   - **Environment**: Node.js
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check**: `/health`
4. Add your `OMNIROUTE_API_KEY` in Render environment variables.
5. Click **Apply**.
