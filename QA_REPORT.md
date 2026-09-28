# Z-Space Formula Playground v3.0 — QA Report

Release candidate: **v3.0.0 · Airy ELI5 Playground rebuild**

## Result

**PASS for formula/model/static/asset QA.**

The redesign changes presentation and interaction while preserving `formulas.mjs` as the calculation source of truth.

## Inherited numerical regression

`npm run check` still passes the full verified equation suite:

- exactly **25** numbered formula labs;
- **Core 12** represented across **11** numbered lab cards;
- default-output regressions for all 25 labs;
- **250 generated practice cases per lab = 6,250 generated cases** per QA run;
- **1,000 randomized Bayes normalization cases**;
- radiative-transfer/extinction equivalence checks;
- H I redshift-frequency behavior;
- H I mass distance-squared scaling;
- Newtonian inverse-square scaling;
- vis-viva / escape-speed consistency;
- rocket-equation domain checks;
- solar-sail lightness scaling;
- light-time regression;
- plasma-frequency, Debye-length, Alfvén-speed and plasma-beta scaling checks;
- mission coverage, chain-model finiteness and unit-drill validity;
- duplicate HTML ID and CSS-brace checks.

## Playground-model QA

The updated `tests/v3.mjs` passes:

- `PLAYGROUND_BLOCKS` contains **all 25 labs**;
- every lab has a non-empty `stageType` and ELI5 story;
- every lab has an output block;
- every input block key resolves to a real input in the corresponding formula definition;
- every block uses the approved Indigo / Coral / Emerald / Amber / Sky palette;
- all **25 distinct stage types** are handled by `renderVisualStage()`;
- `renderPlaygroundBlocks()` and `renderVisualStage()` are wired into the app;
- the live playground DOM surfaces are present: `playgroundStage`, `playgroundBlocksWrap`, `playgroundStory`, `stageCaption`;
- the light theme tokens and `prefers-reduced-motion` rule are present.

## Existing v3 systems QA

Still passing:

- five syllabus stages cover all 25 labs exactly once;
- dependency map coordinates + edges reference valid labs;
- adaptive-priority behavior;
- Hidden Attractor scenario numerical regressions;
- Dust + H I scenario numerical regressions;
- 300 AU Probe scenario numerical regressions;
- scenario outputs finite at default settings;
- v3 storage and v2 migration wiring;
- PWA manifest + service-worker asset coverage;
- package version remains `3.0.0`.

## Static/server QA

- JavaScript syntax: **PASS**.
- `index.html` strict lxml parse (`recover=False`): **PASS**.
- Lab count: **25**.
- Playground model count: **25**.
- Distinct visual-stage types: **25**.
- Local HTTP responses: **200** for `/`, `index.html`, `styles.css`, `app.js`, `formulas.mjs`, `v3-model.mjs`, `manifest.webmanifest`, `sw.js`, and `icon.svg`.

## Browser-runtime limitation

The required `agent-browser` binary is not installed in this runtime. The available Chromium binary also fails to complete a headless render before application execution, so this report does **not** claim a real visual-browser smoke test.

That limitation is environmental and is kept explicit. The build is verified at formula regression, pure-model, HTML parse, DOM contract, asset serving, JavaScript syntax and package-integrity layers. A deployed Vercel preview should receive the final real-browser visual check.
