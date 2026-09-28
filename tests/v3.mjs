import assert from 'node:assert/strict';
import fs from 'node:fs';
import {formulas} from '../formulas.mjs';
import {
  ACADEMY_STAGES, GRAPH_POSITIONS, GRAPH_EDGES, SCENARIOS,
  priorityScore, runScenarioModel,
  PLAYGROUND_BLOCKS, getPlaygroundBlocks, CONCEPT_TITLES
} from '../v3-model.mjs';

const ids = formulas.map(f=>f.id);

// Scenario Models
for(const [name,scenario] of Object.entries(SCENARIOS)){
  const values=Object.fromEntries(scenario.inputs.map(([k,,,v])=>[k,v]));
  const rows=runScenarioModel(name,values);
  assert.ok(rows.length>=3,`${name} scenario returns several outputs`);
  for(const row of rows){
    assert.ok(row.label&&row.note,`${name} scenario row has explanatory labels`);
    assert.ok(Number.isFinite(row.value),`${name} scenario ${row.label} finite`);
  }
}
const zoa=runScenarioModel('zoa',{H0:70,d:50,cz:4000,a:1,f:0.55,div:-19.25});
assert.equal(zoa[0].value,3500,'ZOA scenario Hubble flow regression');
assert.equal(zoa[1].value,500,'ZOA scenario peculiar velocity regression');
assert.ok(Math.abs(zoa[2].value-0.5)<1e-12,'ZOA scenario density contrast regression');
const obscura=runScenarioModel('obscura',{tau:1,F:100,z:0.05,D:50,flux:2});
assert.ok(Math.abs(obscura[1].value-36.787944117144235)<1e-10,'OBSCURA scenario transmission regression');
assert.ok(Math.abs(obscura[4].value-1.178e9)<1,'OBSCURA scenario H I mass regression');
const vlism=runScenarioModel('vlism',{distance:300,speedAUyr:20,r:1,Isp:450,massRatio:2.5,ne:0.1,B:0.5,rho:2,P:0.2});
assert.ok(Math.abs(vlism[0].value-41.58373198634637)<1e-10,'VLISM scenario light-time regression');
assert.equal(vlism[1].value,15,'VLISM scenario cruise estimate regression');
assert.ok(vlism.find(r=>r.label==='Electron plasma frequency').value>2800,'VLISM scenario plasma frequency present');

// Pure Sandbox DOM surfaces
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const requiredIds = [
  'labSelect','prevLabBtn','nextLabBtn','randomLabBtn','resetDefaultsBtn','bookmarkBtn',
  'lab','labTrack','labNumBadge','labTitle','labConceptTitle','labFormalTitle','labSubtitle',
  'playgroundStage','stageCaption','playgroundStory','playgroundBlocksWrap','blockExplainer',
  'closeExplainer','explainerContent','equationDisplay','eli5','symbolList','mentalModel',
  'controlList','validationLine','outputLabel','outputValue','outputUnit',
  'sweepSelect','sweepName','sensitivityPlot','resetInputs','whyMatters','workedExample',
  'deriveSteps','deriveSelfCheck','unitNote','unitMiniPrompt','unitMiniInput','unitMiniCheck','unitMiniFeedback',
  'assumptionList','notebookLabId','labNotes','saveLabNotes','notesSaved','exportProgress','importProgress'
];
for(const id of requiredIds){
  assert.match(html, new RegExp(`id="${id}"`), `pure sandbox DOM includes #${id}`);
}
assert.match(html,/(Cosmic Formula Playground|Z-Space Formula Playground|Formula Sandbox v3\.0)/,'playground branding present');
for(const viewId of ['viewHome','viewPath','viewLibrary','viewPractice','viewLab']){
  assert.match(html, new RegExp(`id="${viewId}"`), `5 views architecture includes #${viewId}`);
}
// Enforce no internal research names in public UI tags
assert.doesNotMatch(html, />\s*Z-(ZOA|OBSCURA|NAV|VLISM)/, 'no internal research names in public UI tags');
for(const file of ['index.html','manifest.webmanifest']){
  const content = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  assert.doesNotMatch(content, /Z-ZOA|Z-OBSCURA|Z-NAV|Z-VLISM/, `no internal research names in public ${file}`);
}


// Playground model QA
for(const id of ids){
  const pb=PLAYGROUND_BLOCKS[id];
  assert.ok(pb,`lab ${id} has entry in PLAYGROUND_BLOCKS`);
  assert.ok(pb.eli5Story,`lab ${id} has eli5Story`);
  assert.ok(pb.stageType,`lab ${id} has stageType`);
  assert.ok(Array.isArray(pb.blocks) && pb.blocks.length>=2,`lab ${id} has at least 2 blocks`);

  const f=formulas.find(x=>x.id===id);
  assert.ok(CONCEPT_TITLES[id],`lab ${id} has entry in CONCEPT_TITLES`);
  assert.ok(CONCEPT_TITLES[id].concept && CONCEPT_TITLES[id].formal,`lab ${id} concept titles are complete`);

  for(const b of pb.blocks){
    if(b.operator) continue;
    assert.ok(b.name && b.subtitle,`lab ${id} block has name and subtitle`);
    assert.ok(['indigo','coral','emerald','amber','sky'].includes(b.color),`lab ${id} block uses approved palette: ${b.color}`);
    if(b.role==='input'){
      const inp=f.inputs.find(i=>i.k===b.key);
      assert.ok(inp,`lab ${id} input block ${b.key} maps to valid formula input`);
    }
  }
  const helperModel=getPlaygroundBlocks(id);
  assert.equal(helperModel.stageType, pb.stageType, `getPlaygroundBlocks(${id}) returns matching model`);
}

// Package, Manifest & SW
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
assert.equal(pkg.version,'3.0.0','package version is 3.0.0');
assert.match(pkg.scripts.check,/tests\/v3\.mjs/,'package check includes v3 tests');

const manifest=JSON.parse(fs.readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));
assert.equal(manifest.display,'standalone','PWA manifest standalone');
assert.match(manifest.name,/v3\.0/,'manifest v3 branded');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
for(const asset of ['index.html','styles.css','app.js','formulas.mjs','v3-model.mjs','manifest.webmanifest','icon.svg']){
  assert.ok(sw.includes(asset),`service worker caches ${asset}`);
}

// App JS Direct Selector Invariant
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const htmlIds=new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
const generatedIds=new Set([...app.matchAll(/\sid="([A-Za-z0-9_-]+)"/g)].map(m=>m[1]));
const availableIds=new Set([...htmlIds,...generatedIds]);
const directIdSelectors=[...app.matchAll(/\$\('#([A-Za-z0-9_-]+)'\)/g)].map(m=>m[1]);
for(const id of directIdSelectors){
  assert.ok(availableIds.has(id),`app direct selector #${id} exists in static or generated DOM`);
}

assert.match(app,/renderPlaygroundBlocks/,'ELI5 playground blocks renderer wired');
assert.match(app,/renderVisualStage/,'live visual stage renderer wired');
assert.match(app,/openFormula/,'formula open engine wired');

for(const stage of new Set(Object.values(PLAYGROUND_BLOCKS).map(x=>x.stageType))){
  assert.ok(app.includes(`t === '${stage}'`)||app.includes(`t==='${stage}'`),`visual renderer handles stage type ${stage}`);
}

// Stylesheet Tokens & Reduced Motion
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
for(const token of ['--bg:#f8fafc','--indigo:#6366f1','--coral:#f43f5e','--emerald:#10b981','--amber:#f59e0b','--sky:#0ea5e9']){
  assert.ok(css.includes(token),`airy playground theme includes ${token}`);
}
assert.match(css,/prefers-reduced-motion/,'reduced-motion accessibility is implemented');

console.log('V3 QA PASS');
console.log('Pure sandbox architecture, tactile equation blocks, 25 visual stages, concept navigation, and accessible styles passed.');
