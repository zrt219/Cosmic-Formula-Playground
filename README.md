# Cosmic Formula Playground & Sandbox v3.0

An airy, interactive visual science museum, tactile formula playground, and physics sandbox across 25 verified physical laws.

## 🚀 Overview
Cosmic Formula Playground & Sandbox helps curious minds understand 3D geometry, kinematics, astrophysics, orbital mechanics, and plasma physics through tactile, visual exploration before confronting formal mathematics.

The core learning philosophy:
**SEE → TOUCH → CHANGE → WATCH → UNDERSTAND → CALCULATE → PRACTICE**

## What changed

### Airy whitespace system

- Clean `#f8fafc` canvas, white/glass cards, soft borders and restrained shadows.
- 40–80 px page breathing room on desktop, rounded 20–30 px surfaces and simplified navigation.
- Friendly palette: Indigo `#6366f1`, Coral `#f43f5e`, Emerald `#10b981`, Amber `#f59e0b`, Sky `#0ea5e9`.
- Syllabus, Library, practice, missions, chains, drills, adaptive sessions, exams, scenarios and notebook now share the same visual language.

### 25 tactile equation playgrounds

Every numbered lab now has a `PLAYGROUND_BLOCKS` model in `v3-model.mjs` with:

- ELI5 block names;
- formal symbol subtitles;
- friendly icon + color coding;
- input keys tied directly to the existing formula state;
- operators and output/calculated blocks;
- a stage type;
- a short physical story.

Inline block sliders, number badges and +/- controls update the **same `state.values`** used by the verified formula engine and precision sandbox. There is no second calculator.

### 25 live visual stages

Each lab has a distinct conceptual SVG stage that responds to the active formula values in real time:

1. expanding grid + peculiar tug
2. distance ladder
3. density clump / void bubbles
4. converging or diverging flow field
5. Bayesian belief scale
6. uncertainty target
7. Wiener signal / noise sieve
8. dust attenuation beam
9. extinction / observed-flux curtain
10. color-excess prism
11. stretched light wave
12. redshifted 21-cm radio scene
13. H I mass disk
14. state predictor + sensor
15. Kalman trust-weighted update
16. gravity well
17. Keplerian orbit
18. escape trajectory
19. rocket fuel / exhaust
20. solar-sail photon pressure
21. deep-space light-time
22. electron plasma oscillation
23. Debye shielding bubble
24. Alfvén wave
25. thermal-vs-magnetic pressure balance

The visuals are explicitly labeled as ELI5 / not-to-scale representations.

### ELI5-first hierarchy

- Lab headers lead with the friendly output concept and place the scientific title underneath.
- Library cards lead with the intuitive concept, followed by the formal title/equation.
- Practice cards show the friendly target first and the formal equation as secondary notation.
- Clicking a playground block explains its friendly name alongside the formal symbol.

## Existing v3 systems retained

- Five-stage Z-Space syllabus.
- Adaptive Practice Engine.
- Mission Exams.
- Equation Dependency Map.
- Engineering Notebook.
- Mission Scenario Console.
- Guided Missions.
- Equation Chains.
- Unit Drills.
- Socratic Coach.
- Mastery gates, XP, streaks, bookmarks and progress portability.
- PWA / offline shell.
- v2 → v3 local progress migration.

## Mathematical scope

The playground changes presentation, not numerical definitions. Teaching-model limits remain explicitly labeled:

- Wiener and Kalman labs use scalar analogues for matrix intuition.
- Z-ZOA scenario density inference uses supplied velocity divergence and the linear-theory relation.
- Z-VLISM cruise time is a distance / cruise-speed envelope, not a propagated trajectory.
- Solar escape speed is a two-body scale, not mission delta-v.
- Rocket-equation results are idealized.
- The `v ≈ cz` redshift approximation is only presented in the low-z teaching regime.

## Accessibility

- Every playground range/number input has an accessible name.
- Visual stages use SVG titles/descriptions and `role="img"` semantics.
- Motion is reduced when the operating system requests `prefers-reduced-motion`.
- Friendly visible labels remain primary; ARIA is used as support, not as a replacement for visible instructions.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## QA

```bash
npm run check
```

The inherited numerical suite still runs unchanged. The v3 suite now additionally checks all 25 playground models, input-key validity, output blocks, palette tokens, stage renderer coverage, required DOM surfaces and reduced-motion support.

## Deploy to Vercel

The app is static. Deploy the folder directly or upload the packaged ZIP to Vercel Drop.
