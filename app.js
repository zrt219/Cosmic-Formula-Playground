import {
  formulas, fmt, randInt, AU
} from './formulas.mjs';
import {
  EDUCATIONAL_CATEGORIES, LEARNING_STAGES, PLAYGROUND_BLOCKS,
  getPlaygroundBlocks, CONCEPT_TITLES
} from './v3-model.mjs';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const STORAGE_KEY = 'zspace-formula-sandbox-v3';

const CATEGORY_COLORS = {
  cosmology: '#6366f1',
  light: '#f59e0b',
  radio: '#0ea5e9',
  math: '#10b981',
  navigation: '#2563eb',
  spaceflight: '#f43f5e',
  plasma: '#8b5cf6'
};

const PLAY_COLORS = {
  indigo: '#6366f1',
  coral: '#f43f5e',
  emerald: '#10b981',
  amber: '#f59e0b',
  sky: '#0ea5e9'
};

function readJson(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function baseProgress(){
  return {
    version: 3,
    lastActive: 1,
    bookmarks: [],
    deriveChecks: [],
    notes: {}
  };
}

function normalizeProgress(p){
  const b = baseProgress();
  const ids = new Set(formulas.map(f=>f.id));
  const arr = (v) => Array.isArray(v) ? [...new Set(v.map(Number).filter(x=>ids.has(x)))] : [];
  const notes = {};
  if(p?.notes && typeof p.notes === 'object'){
    for(const f of formulas){
      const n = p.notes[f.id] ?? p.notes[String(f.id)];
      if(typeof n === 'string' && n.trim()) notes[f.id] = n.slice(0, 5000);
    }
  }
  return {
    ...b,
    lastActive: ids.has(Number(p?.lastActive)) ? Number(p.lastActive) : 1,
    bookmarks: arr(p?.bookmarks),
    deriveChecks: arr(p?.deriveChecks),
    notes
  };
}

const state = {
  activeView: 'home',
  activeCategory: 'all',
  active: formulas[0],
  values: {},
  activeTab: 'precision',
  practiceLabId: 1,
  practiceProblem: null,
  progress: normalizeProgress(readJson(STORAGE_KEY, baseProgress()))
};

function saveProgress(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  } catch {}
}

function bookmarkSet(){ return new Set(state.progress.bookmarks); }
function deriveSet(){ return new Set(state.progress.deriveChecks); }

function categoryColor(cat){ return CATEGORY_COLORS[cat] || '#6366f1'; }

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function typeset(elements){
  if(window.MathJax?.typesetPromise){
    window.MathJax.typesetPromise(elements.filter(Boolean)).catch(()=>{});
  }
}

// ---------------------------------------------------------------------------
// Sandbox Formulas & Presets
// ---------------------------------------------------------------------------
const SANDBOX_FORMULAS = [
  {
    id: 'sb-sphere',
    category: 'Geometry',
    catId: 'geometry',
    title: 'Volume of a Sphere',
    tex: 'V = \\frac{4}{3}\\pi r^3',
    question: 'How much space fills a celestial or physical sphere?',
    unit: 'm³',
    targetLab: 2,
    params: [
      { key: 'r', label: 'Radius (r)', min: 0.1, max: 100, step: 0.1, default: 2.5, unit: 'm' }
    ],
    presets: [
      { name: '🎾 Tennis Ball', values: { r: 0.033 } },
      { name: '🏀 Basketball', values: { r: 0.12 } },
      { name: '🛰️ Small Satellite', values: { r: 1.5 } },
      { name: '🛸 Space Habitat Module', values: { r: 8.0 } }
    ],
    compute(vals){
      const r = vals.r;
      const vol = (4/3) * Math.PI * Math.pow(r, 3);
      return {
        value: vol,
        display: vol.toLocaleString(undefined, { maximumFractionDigits: 3 }),
        unit: 'm³',
        steps: [
          `Base Formula: \\(V = \\frac{4}{3}\\pi r^3\\)`,
          `Substitute: \\(r = ${r}\\text{ m}\\)`,
          `Evaluate: \\(V = \\frac{4}{3} \\times 3.14159 \\times (${r})^3 = \\frac{4}{3} \\times 3.14159 \\times ${(r**3).toFixed(3)}\\)`,
          `Computed Volume: \\(V = ${vol.toFixed(3)}\\text{ m}^3\\)`
        ]
      };
    }
  },
  {
    id: 'sb-cube',
    category: 'Geometry',
    catId: 'geometry',
    title: 'Volume of a Cube',
    tex: 'V = s^3',
    question: 'How much volume inside a regular cube?',
    unit: 'm³',
    targetLab: 1,
    params: [
      { key: 's', label: 'Side Length (s)', min: 0.1, max: 50, step: 0.1, default: 3.0, unit: 'm' }
    ],
    presets: [
      { name: '📦 Delivery Box', values: { s: 0.5 } },
      { name: '🧊 CubeSat 1U', values: { s: 0.1 } },
      { name: '🏠 Living Room Cube', values: { s: 4.0 } },
      { name: '🏗️ Cargo Container Unit', values: { s: 6.0 } }
    ],
    compute(vals){
      const s = vals.s;
      const vol = Math.pow(s, 3);
      return {
        value: vol,
        display: vol.toLocaleString(undefined, { maximumFractionDigits: 3 }),
        unit: 'm³',
        steps: [
          `Base Formula: \\(V = s^3\\)`,
          `Substitute: \\(s = ${s}\\text{ m}\\)`,
          `Evaluate: \\(V = ${s} \\times ${s} \\times ${s}\\)`,
          `Computed Volume: \\(V = ${vol.toFixed(3)}\\text{ m}^3\\)`
        ]
      };
    }
  },
  {
    id: 'sb-cylinder',
    category: 'Geometry',
    catId: 'geometry',
    title: 'Volume of a Cylinder',
    tex: 'V = \\pi r^2 h',
    question: 'Volume inside a cylindrical fuel tank or can?',
    unit: 'm³',
    targetLab: 8,
    params: [
      { key: 'r', label: 'Radius (r)', min: 0.1, max: 20, step: 0.1, default: 2.0, unit: 'm' },
      { key: 'h', label: 'Height (h)', min: 0.1, max: 50, step: 0.5, default: 10.0, unit: 'm' }
    ],
    presets: [
      { name: '🥫 Soda Can', values: { r: 0.033, h: 0.12 } },
      { name: '⛽ Fuel Depot Tank', values: { r: 3.0, h: 12.0 } },
      { name: '🚀 Rocket 1st Stage Tank', values: { r: 4.5, h: 45.0 } }
    ],
    compute(vals){
      const r = vals.r, h = vals.h;
      const vol = Math.PI * Math.pow(r, 2) * h;
      return {
        value: vol,
        display: vol.toLocaleString(undefined, { maximumFractionDigits: 3 }),
        unit: 'm³',
        steps: [
          `Base Formula: \\(V = \\pi r^2 h\\)`,
          `Substitute: \\(r = ${r}\\text{ m}, \\; h = ${h}\\text{ m}\\)`,
          `Evaluate Area: \\(A_{\\text{base}} = \\pi \\times (${r})^2 = ${(Math.PI * r * r).toFixed(3)}\\text{ m}^2\\)`,
          `Computed Volume: \\(V = A_{\\text{base}} \\times ${h} = ${vol.toFixed(3)}\\text{ m}^3\\)`
        ]
      };
    }
  },
  {
    id: 'sb-hubble',
    category: 'Cosmology',
    catId: 'cosmology',
    title: "Hubble's Law Expansion",
    tex: 'v = H_0 \\cdot d',
    question: 'How fast is a distant galaxy receding due to universal expansion?',
    unit: 'km/s',
    targetLab: 1,
    params: [
      { key: 'H0', label: 'Hubble Constant (H₀)', min: 50, max: 90, step: 0.5, default: 70.0, unit: 'km/s/Mpc' },
      { key: 'd', label: 'Comoving Distance (d)', min: 1, max: 500, step: 1, default: 50.0, unit: 'Mpc' }
    ],
    presets: [
      { name: '🌌 Virgo Cluster', values: { H0: 70.0, d: 16.5 } },
      { name: '🌌 Coma Cluster', values: { H0: 70.0, d: 100.0 } },
      { name: '🔭 Deep Space (z ≈ 0.1)', values: { H0: 70.0, d: 430.0 } }
    ],
    compute(vals){
      const H0 = vals.H0, d = vals.d;
      const v = H0 * d;
      const c = 299792;
      const z = v / c;
      return {
        value: v,
        display: v.toLocaleString(undefined, { maximumFractionDigits: 1 }),
        unit: 'km/s',
        steps: [
          `Base Formula: \\(v = H_0 \\cdot d\\)`,
          `Substitute: \\(H_0 = ${H0}\\text{ km/s/Mpc}, \\; d = ${d}\\text{ Mpc}\\)`,
          `Recession Speed: \\(v = ${H0} \\times ${d} = ${v.toFixed(1)}\\text{ km/s}\\)`,
          `Equivalent Cosmological Redshift: \\(z \\approx \\frac{v}{c} = \\frac{${v.toFixed(1)}}{299,792} = ${z.toFixed(4)}\\)`
        ]
      };
    }
  },
  {
    id: 'sb-escape',
    category: 'Astrophysics',
    catId: 'astrophysics',
    title: 'Escape Velocity',
    tex: 'v_e = \\sqrt{\\frac{2GM}{R}}',
    question: 'Minimum speed needed to break free from a gravitational body?',
    unit: 'km/s',
    targetLab: 18,
    params: [
      { key: 'M_exp', label: 'Mass log₁₀(M in kg)', min: 20, max: 32, step: 0.1, default: 24.776, unit: 'log₁₀(kg)' },
      { key: 'R_km', label: 'Radius (R in km)', min: 500, max: 1000000, step: 100, default: 6371, unit: 'km' }
    ],
    presets: [
      { name: '🌕 Moon', values: { M_exp: 22.866, R_km: 1737 } },
      { name: '🌍 Earth', values: { M_exp: 24.776, R_km: 6371 } },
      { name: '🪐 Jupiter', values: { M_exp: 27.278, R_km: 69911 } },
      { name: '☀️ Sun', values: { M_exp: 30.298, R_km: 696340 } }
    ],
    compute(vals){
      const M = Math.pow(10, vals.M_exp);
      const R_m = vals.R_km * 1000;
      const G = 6.6743e-11;
      const ve_ms = Math.sqrt((2 * G * M) / R_m);
      const ve_kms = ve_ms / 1000;
      return {
        value: ve_kms,
        display: ve_kms.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        unit: 'km/s',
        steps: [
          `Base Formula: \\(v_e = \\sqrt{\\frac{2GM}{R}}\\)`,
          `Body Mass: \\(M = 10^{${vals.M_exp.toFixed(2)}} = ${(M).toExponential(3)}\\text{ kg}\\)`,
          `Body Radius: \\(R = ${vals.R_km.toLocaleString()}\\text{ km} = ${(R_m).toExponential(3)}\\text{ m}\\)`,
          `Computed Escape Velocity: \\(v_e = \\sqrt{\\frac{2 \\times 6.674 \\times 10^{-11} \\times ${(M).toExponential(3)}}{${(R_m).toExponential(3)}}} = ${ve_kms.toFixed(2)}\\text{ km/s}\\)`
        ]
      };
    }
  },
  {
    id: 'sb-kinetic',
    category: 'Mechanics',
    catId: 'mechanics',
    title: 'Kinetic Energy',
    tex: 'E_k = \\frac{1}{2}m v^2',
    question: 'How much energy does an object in motion possess?',
    unit: 'Joules (J)',
    targetLab: 18,
    params: [
      { key: 'm', label: 'Mass (m)', min: 1, max: 50000, step: 10, default: 1200, unit: 'kg' },
      { key: 'v', label: 'Velocity (v)', min: 1, max: 12000, step: 10, default: 50, unit: 'm/s' }
    ],
    presets: [
      { name: '🚗 Highway Car', values: { m: 1500, v: 30 } },
      { name: '🚅 Bullet Train', values: { m: 400000, v: 85 } },
      { name: '🛰️ Orbiting CubeSat', values: { m: 4, v: 7700 } }
    ],
    compute(vals){
      const m = vals.m, v = vals.v;
      const Ek = 0.5 * m * Math.pow(v, 2);
      return {
        value: Ek,
        display: Ek >= 1e6 ? `${(Ek / 1e6).toFixed(3)} MJ` : `${Ek.toLocaleString(undefined, { maximumFractionDigits: 1 })} J`,
        unit: Ek >= 1e6 ? 'Megajoules' : 'Joules',
        steps: [
          `Base Formula: \\(E_k = \\frac{1}{2}m v^2\\)`,
          `Substitute: \\(m = ${m.toLocaleString()}\\text{ kg}, \\; v = ${v.toLocaleString()}\\text{ m/s}\\)`,
          `Square Velocity: \\(v^2 = ${(v**2).toLocaleString()}\\text{ m}^2/\\text{s}^2\\)`,
          `Computed Energy: \\(E_k = 0.5 \\times ${m} \\times ${(v**2).toLocaleString()} = ${(Ek).toExponential(3)}\\text{ J}\\)`
        ]
      };
    }
  },
  {
    id: 'sb-relativity',
    category: 'Relativity',
    catId: 'relativity',
    title: 'Mass-Energy Equivalence',
    tex: 'E = m c^2',
    question: 'How much energy is locked inside pure physical mass?',
    unit: 'Joules (J)',
    targetLab: 19,
    params: [
      { key: 'm', label: 'Mass (m in grams)', min: 0.001, max: 1000, step: 0.001, default: 1.0, unit: 'g' }
    ],
    presets: [
      { name: '🪙 1 Gram Matter', values: { m: 1.0 } },
      { name: '🐜 1 mg Ant Mass', values: { m: 0.001 } },
      { name: '🍎 150g Apple', values: { m: 150.0 } },
      { name: '📦 1 kg Benchmark', values: { m: 1000.0 } }
    ],
    compute(vals){
      const m_kg = vals.m / 1000;
      const c = 299792458;
      const E = m_kg * Math.pow(c, 2);
      const megatonsTNT = E / 4.184e15;
      return {
        value: E,
        display: `${(E).toExponential(3)} J`,
        unit: `Joules (≈ ${megatonsTNT.toFixed(2)} Megatons TNT)`,
        steps: [
          `Base Formula: \\(E = m c^2\\)`,
          `Mass: \\(m = ${vals.m}\\text{ g} = ${m_kg}\\text{ kg}\\)`,
          `Speed of Light: \\(c = 299,792,458\\text{ m/s}\\)`,
          `Energy Output: \\(E = ${m_kg} \\times (2.998 \\times 10^8)^2 = ${(E).toExponential(3)}\\text{ Joules}\\)`,
          `Equivalent to \\(\\approx ${megatonsTNT.toFixed(2)}\\text{ Megatons}\\) of TNT explosive energy.`
        ]
      };
    }
  },
  {
    id: 'sb-kepler',
    category: 'Astrophysics',
    catId: 'astrophysics',
    title: "Kepler's Third Law",
    tex: 'T^2 = \\frac{4\\pi^2}{G M} a^3',
    question: 'What is the orbital period of a satellite or planet given its orbit radius?',
    unit: 'days / hours',
    targetLab: 17,
    params: [
      { key: 'a_km', label: 'Semi-major Axis (a in km)', min: 6500, max: 400000, step: 500, default: 6778, unit: 'km' }
    ],
    presets: [
      { name: '🛰️ ISS Low Earth Orbit', values: { a_km: 6778 } },
      { name: '📡 Geostationary Orbit', values: { a_km: 42164 } },
      { name: '🌕 Moon Orbit', values: { a_km: 384400 } }
    ],
    compute(vals){
      const G = 6.6743e-11;
      const M = 5.972e24; // Earth mass
      const a_m = vals.a_km * 1000;
      const T_sec = Math.sqrt((4 * Math.PI * Math.PI / (G * M)) * Math.pow(a_m, 3));
      const T_min = T_sec / 60;
      const T_hours = T_min / 60;
      const T_days = T_hours / 24;
      return {
        value: T_hours,
        display: T_hours < 24 ? `${T_hours.toFixed(2)} hours (${T_min.toFixed(0)} min)` : `${T_days.toFixed(2)} days`,
        unit: 'Orbital Period',
        steps: [
          `Base Formula: \\(T = 2\\pi \\sqrt{\\frac{a^3}{GM}}\\)`,
          `Orbital Radius: \\(a = ${vals.a_km.toLocaleString()}\\text{ km}\\)`,
          `Central Mass: Earth \\(M = 5.972 \\times 10^{24}\\text{ kg}\\)`,
          `Calculated Period: \\(T = ${T_sec.toFixed(0)}\\text{ s} = ${T_min.toFixed(1)}\\text{ min} = ${T_hours.toFixed(2)}\\text{ hours}\\)`
        ]
      };
    }
  }
];

let sandboxActiveFormula = SANDBOX_FORMULAS[0];
let sandboxParamValues = {};

// ---------------------------------------------------------------------------
// View Navigation & URL Routing Engine
// ---------------------------------------------------------------------------
function updateRouteHistory(viewName, labId=null){
  let path = '/';
  if(viewName === 'playground' || viewName === 'labs'){
    path = labId ? `/playground?lab=${labId}` : '/playground';
  } else if(viewName === 'sandbox'){
    path = '/sandbox';
  } else if(viewName === 'path' || viewName === 'syllabus'){
    path = '/syllabus';
  } else if(viewName === 'library'){
    path = '/library';
  } else if(viewName === 'practice'){
    path = labId ? `/practice?lab=${labId}` : '/practice';
  }
  
  if(window.location.pathname !== path && !window.location.pathname.endsWith(path)){
    try {
      history.pushState({ view: viewName, labId }, '', path);
    } catch(e) {
      window.location.hash = '#' + path.replace('/', '');
    }
  }
}

function switchView(viewName, labId=null, updateHistory=true){
  let normalized = viewName;
  if(viewName === 'playground' || viewName === 'labs') normalized = 'labs';
  if(viewName === 'syllabus' || viewName === 'path') normalized = 'path';

  state.activeView = normalized;

  $$('.nav-btn').forEach(btn => {
    const bNav = btn.dataset.nav;
    const isAct = (bNav === viewName) ||
                  (normalized === 'labs' && (bNav === 'playground' || bNav === 'labs')) ||
                  (normalized === 'path' && (bNav === 'syllabus' || bNav === 'path')) ||
                  (normalized === bNav);
    btn.classList.toggle('active', isAct);
  });

  const views = {
    home: $('#viewHome'),
    path: $('#viewPath'),
    library: $('#viewLibrary'),
    practice: $('#viewPractice'),
    labs: $('#viewLab'),
    sandbox: $('#viewSandbox')
  };

  Object.entries(views).forEach(([name, el]) => {
    if(el) el.classList.toggle('active', name === normalized);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if(normalized === 'labs' && labId){
    openFormula(labId);
  } else if(normalized === 'practice' && labId){
    loadPracticeProblem(labId);
  } else if(normalized === 'sandbox'){
    renderSandboxView();
  }

  // Refresh MathJax rendering for newly active view
  if(normalized === 'library') typeset([$('#libraryCardsGrid')]);
  if(normalized === 'practice') typeset([$('#practiceActiveCard')]);
  if(normalized === 'sandbox') typeset([$('#sandboxFormulaTex'), $('#sandboxStepBody')]);

  if(updateHistory){
    updateRouteHistory(viewName, labId);
  }
}

// ---------------------------------------------------------------------------
// Sandbox Workbench View Controller
// ---------------------------------------------------------------------------
function renderSandboxView(){
  renderSandboxCategoryTabs();
  renderSandboxEquationGrid();
  loadSandboxFormula(sandboxActiveFormula.id, false);
}

function renderSandboxCategoryTabs(){
  const container = $('#sandboxCategoryTabs');
  if(!container) return;
  const categories = [
    { id: 'all', name: 'All Formulas' },
    { id: 'geometry', name: 'Geometry' },
    { id: 'cosmology', name: 'Cosmology' },
    { id: 'astrophysics', name: 'Astrophysics' },
    { id: 'mechanics', name: 'Mechanics' },
    { id: 'relativity', name: 'Relativity' }
  ];
  const activeCat = state.sandboxCategory || 'all';

  container.innerHTML = categories.map(cat => `
    <button class="sandbox-tab-btn ${cat.id === activeCat ? 'active' : ''}" data-cat="${cat.id}" type="button">
      ${escapeHtml(cat.name)}
    </button>
  `).join('');

  $$('.sandbox-tab-btn', container).forEach(btn => {
    btn.addEventListener('click', () => {
      state.sandboxCategory = btn.dataset.cat;
      renderSandboxCategoryTabs();
      renderSandboxEquationGrid();
    });
  });
}

function renderSandboxEquationGrid(){
  const container = $('#sandboxEquationGrid');
  if(!container) return;
  const activeCat = state.sandboxCategory || 'all';
  const list = activeCat === 'all'
    ? SANDBOX_FORMULAS
    : SANDBOX_FORMULAS.filter(f => f.catId === activeCat);

  container.innerHTML = list.map(item => `
    <div class="sandbox-eq-card ${item.id === sandboxActiveFormula.id ? 'active' : ''}" data-eqid="${item.id}" tabindex="0" role="button">
      <div>
        <div class="sandbox-card-top">
          <span class="sandbox-card-cat">${escapeHtml(item.category)}</span>
        </div>
        <h3 class="sandbox-card-title">${escapeHtml(item.title)}</h3>
        <div class="sandbox-card-eq">\\(${item.tex}\\)</div>
      </div>
      <p class="sandbox-card-desc">${escapeHtml(item.question)}</p>
    </div>
  `).join('');

  typeset([container]);

  $$('.sandbox-eq-card', container).forEach(card => {
    const pick = () => {
      const eqid = card.dataset.eqid;
      loadSandboxFormula(eqid, true);
      $$('.sandbox-eq-card', container).forEach(c => c.classList.toggle('active', c.dataset.eqid === eqid));
    };
    card.addEventListener('click', pick);
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') pick(); });
  });
}

function loadSandboxFormula(formulaId, scrollToWorkbench=false){
  const found = SANDBOX_FORMULAS.find(f => f.id === formulaId) || SANDBOX_FORMULAS[0];
  sandboxActiveFormula = found;
  sandboxParamValues = {};
  found.params.forEach(p => {
    sandboxParamValues[p.key] = p.default;
  });

  const catBadge = $('#sandboxCatBadge');
  const titleEl = $('#sandboxActiveTitle');
  const formulaTex = $('#sandboxFormulaTex');
  const gotoPlaygroundBtn = $('#sandboxGotoPlaygroundBtn');

  if(catBadge) catBadge.textContent = found.category;
  if(titleEl) titleEl.textContent = found.title;
  if(formulaTex) formulaTex.innerHTML = `\\(${found.tex}\\)`;
  if(gotoPlaygroundBtn){
    gotoPlaygroundBtn.onclick = () => switchView('playground', found.targetLab);
  }

  // Render presets
  const presetsList = $('#sandboxPresetsList');
  if(presetsList){
    presetsList.innerHTML = found.presets.map((pr, idx) => `
      <button class="sandbox-preset-chip" data-idx="${idx}" type="button">${escapeHtml(pr.name)}</button>
    `).join('');

    $$('.sandbox-preset-chip', presetsList).forEach(chip => {
      chip.addEventListener('click', () => {
        const idx = Number(chip.dataset.idx);
        const preset = found.presets[idx];
        if(preset && preset.values){
          Object.assign(sandboxParamValues, preset.values);
          renderSandboxSliders();
          updateSandboxCalculation();
        }
      });
    });
  }

  renderSandboxSliders();
  updateSandboxCalculation();

  if(scrollToWorkbench){
    $('#sandboxActiveWorkbench')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderSandboxSliders(){
  const container = $('#sandboxSlidersGroup');
  if(!container) return;

  container.innerHTML = sandboxActiveFormula.params.map(p => {
    const curVal = sandboxParamValues[p.key] !== undefined ? sandboxParamValues[p.key] : p.default;
    return `
      <div class="sandbox-slider-item">
        <div class="sandbox-slider-head">
          <label class="sandbox-slider-label" for="sbSlider_${p.key}">${escapeHtml(p.label)} (${escapeHtml(p.unit)})</label>
          <input type="number" id="sbInput_${p.key}" class="sandbox-slider-val-input" value="${curVal}" min="${p.min}" max="${p.max}" step="${p.step}">
        </div>
        <input type="range" id="sbSlider_${p.key}" class="sandbox-slider-track" min="${p.min}" max="${p.max}" step="${p.step}" value="${curVal}" aria-label="${escapeHtml(p.label)}">
      </div>
    `;
  }).join('');

  sandboxActiveFormula.params.forEach(p => {
    const slider = $(`#sbSlider_${p.key}`);
    const input = $(`#sbInput_${p.key}`);

    const onValChange = (val) => {
      const num = Number(val);
      if(!isNaN(num)){
        sandboxParamValues[p.key] = num;
        if(slider) slider.value = num;
        if(input) input.value = num;
        updateSandboxCalculation();
      }
    };

    slider?.addEventListener('input', e => onValChange(e.target.value));
    input?.addEventListener('input', e => onValChange(e.target.value));
  });
}

function updateSandboxCalculation(){
  const result = sandboxActiveFormula.compute(sandboxParamValues);
  const heroVal = $('#sandboxHeroValue');
  const heroUnit = $('#sandboxHeroUnit');
  const stepBody = $('#sandboxStepBody');

  if(heroVal) heroVal.textContent = result.display;
  if(heroUnit) heroUnit.textContent = result.unit;

  if(stepBody && Array.isArray(result.steps)){
    stepBody.innerHTML = result.steps.map(st => `
      <div class="step-calc-line">${st}</div>
    `).join('');
    typeset([stepBody, $('#sandboxFormulaTex')]);
  }
}


// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Home Page Rendering
// ---------------------------------------------------------------------------
function renderLearnoMascotSvg(){
  return `
    <g class="home-learno-mascot-group" transform="translate(36, 160) scale(0.85)" role="img" aria-label="Learno Mascot">
      <line x1="45" y1="18" x2="45" y2="8" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
      <circle cx="45" cy="6" r="4" fill="#38bdf8"/>
      <rect x="25" y="18" width="40" height="28" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="2.5"/>
      <ellipse cx="36" cy="30" rx="3.5" ry="4" fill="#0284c7"/><ellipse cx="54" cy="30" rx="3.5" ry="4" fill="#0284c7"/>
      <circle cx="37" cy="28.5" r="1.2" fill="#ffffff"/><circle cx="55" cy="28.5" r="1.2" fill="#ffffff"/>
      <path d="M40 37 Q45 41 50 37" stroke="#2563eb" stroke-width="2" stroke-linecap="round" fill="none"/>
      <circle cx="31" cy="36" r="2" fill="#f43f5e" opacity="0.6"/><circle cx="59" cy="36" r="2" fill="#f43f5e" opacity="0.6"/>
      <rect x="41" y="46" width="8" height="4" rx="2" fill="#94a3b8"/>
      <rect x="22" y="50" width="46" height="34" rx="10" fill="#2563eb"/>
      <rect x="28" y="56" width="34" height="22" rx="6" fill="#ffffff"/>
      <path d="M32 67 L38 67 L42 61 L46 72 L50 67 L58 67" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 58 Q14 62 16 70" stroke="#2563eb" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M68 58 Q82 45 78 35" stroke="#2563eb" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="78" cy="35" r="3" fill="#38bdf8"/>
    </g>`;
}

const HOME_3D_SHAPES = [
  {
    name: 'Cube',
    labId: 1,
    formulaTex: 'V = s^3',
    verbal: 'Volume = side × side × side',
    getDimLabel: () => 'Side length <i>s</i>:',
    calcVol: (s) => s ** 3,
    getEq: (s, v) => `<i>V</i> = <i>s</i><sup>3</sup> = (${s.toFixed(1)})<sup>3</sup>`,
    getSub: (s, v) => `Volume = ${s.toFixed(1)} &times; ${s.toFixed(1)} &times; ${s.toFixed(1)} = ${v.toFixed(1)} cm³`,
    getSpeech: (s, v) => `A cube has 6 equal square faces. At side = ${s.toFixed(1)} cm, its volume holds ${v.toFixed(1)} cm³! Drag anywhere to tilt or rotate!`,
    renderSvg: (s, rotX, rotY) => {
      const sc = 0.5 + (s / 10) * 0.55;
      return `<svg viewBox="0 0 460 340" class="home-shape-svg" role="img" aria-label="3D Isometric Cube with side ${s.toFixed(1)} cm">
        <defs>
          <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#60a5fa"/>
          </linearGradient>
          <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/>
          </linearGradient>
          <linearGradient id="cubeRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/>
          </linearGradient>
        </defs>
        <ellipse cx="245" cy="290" rx="${110 * sc}" ry="24" fill="#e2e8f0" opacity="0.6"/>
        <g style="transform-origin: 245px 180px; transform: rotate(${rotY * 0.4}deg) skewY(${rotX * 0.22}deg) scale(${sc});">
          <polygon points="245,70 350,130 245,190 140,130" fill="url(#cubeTop)" stroke="#ffffff" stroke-width="2.5"/>
          <polygon points="140,130 245,190 245,280 140,220" fill="url(#cubeLeft)" stroke="#ffffff" stroke-width="2.5"/>
          <polygon points="245,190 350,130 350,220 245,280" fill="url(#cubeRight)" stroke="#ffffff" stroke-width="2.5"/>
          <line x1="192" y1="100" x2="297" y2="160" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4 3"/>
          <line x1="297" y1="100" x2="192" y2="160" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4 3"/>
          <line x1="125" y1="120" x2="230" y2="60" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 3"/>
          <text x="170" y="80" fill="#1e3a8a" font-weight="700" font-size="15" font-style="italic">s = ${s.toFixed(1)} cm</text>
          <line x1="260" y1="60" x2="365" y2="120" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 3"/>
          <text x="320" y="80" fill="#1e3a8a" font-weight="700" font-size="15" font-style="italic">s = ${s.toFixed(1)} cm</text>
          <line x1="365" y1="135" x2="365" y2="225" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 3"/>
          <text x="375" y="185" fill="#1e3a8a" font-weight="700" font-size="15" font-style="italic">s = ${s.toFixed(1)} cm</text>
        </g>
        ${renderLearnoMascotSvg()}
      </svg>`;
    }
  },
  {
    name: 'Cuboid',
    labId: 2,
    formulaTex: 'V = l \\times w \\times h',
    verbal: 'Volume = length × width × height',
    getDimLabel: () => 'Height <i>h</i> (<i>l</i>=1.6<i>h</i>, <i>w</i>=0.8<i>h</i>):',
    calcVol: (s) => (1.6 * s) * (0.8 * s) * s,
    getEq: (s, v) => `<i>V</i> = <i>l</i> &times; <i>w</i> &times; <i>h</i>`,
    getSub: (s, v) => `Volume = ${(1.6*s).toFixed(1)} &times; ${(0.8*s).toFixed(1)} &times; ${s.toFixed(1)} = ${v.toFixed(1)} cm³`,
    getSpeech: (s, v) => `A cuboid is a 3D box with rectangular faces. At h = ${s.toFixed(1)} cm, its volume holds ${v.toFixed(1)} cm³! Drag to rotate!`,
    renderSvg: (s, rotX, rotY) => {
      const sc = 0.5 + (s / 10) * 0.55;
      const l = (1.6 * s).toFixed(1);
      const w = (0.8 * s).toFixed(1);
      const h = s.toFixed(1);
      return `<svg viewBox="0 0 460 340" class="home-shape-svg" role="img" aria-label="3D Isometric Cuboid with height ${h} cm">
        <defs>
          <linearGradient id="cuboidTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a7f3d0"/><stop offset="100%" stop-color="#34d399"/>
          </linearGradient>
          <linearGradient id="cuboidLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#047857"/>
          </linearGradient>
          <linearGradient id="cuboidRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/>
          </linearGradient>
        </defs>
        <ellipse cx="245" cy="295" rx="${130 * sc}" ry="24" fill="#e2e8f0" opacity="0.6"/>
        <g style="transform-origin: 245px 180px; transform: rotate(${rotY * 0.4}deg) skewY(${rotX * 0.22}deg) scale(${sc});">
          <polygon points="225,80 375,130 265,180 115,130" fill="url(#cuboidTop)" stroke="#ffffff" stroke-width="2.5"/>
          <polygon points="115,130 265,180 265,270 115,220" fill="url(#cuboidLeft)" stroke="#ffffff" stroke-width="2.5"/>
          <polygon points="265,180 375,130 375,220 265,270" fill="url(#cuboidRight)" stroke="#ffffff" stroke-width="2.5"/>
          <text x="175" y="95" fill="#065f46" font-weight="700" font-size="15" font-style="italic">l = ${l}</text>
          <text x="330" y="150" fill="#065f46" font-weight="700" font-size="15" font-style="italic">w = ${w}</text>
          <text x="275" y="230" fill="#065f46" font-weight="700" font-size="15" font-style="italic">h = ${h}</text>
        </g>
        ${renderLearnoMascotSvg()}
      </svg>`;
    }
  },
  {
    name: 'Sphere',
    labId: 2,
    formulaTex: 'V = \\frac{4}{3}\\pi r^3',
    verbal: 'Volume = ⁴⁄₃ × π × radius³',
    getDimLabel: () => 'Radius <i>r</i>:',
    calcVol: (s) => (4 / 3) * Math.PI * (s ** 3),
    getEq: (s, v) => `<i>V</i> = <sup>4</sup>/<sub>3</sub>&pi;<i>r</i><sup>3</sup>`,
    getSub: (s, v) => `Volume = 4/3 &times; 3.1416 &times; (${s.toFixed(1)})&sup3; = ${v.toFixed(1)} cm³`,
    getSpeech: (s, v) => `A sphere is perfectly round in 3D. Every surface point is ${s.toFixed(1)} cm from center! Volume holds ${v.toFixed(1)} cm³! Drag to rotate!`,
    renderSvg: (s, rotX, rotY) => {
      const sc = 0.5 + (s / 10) * 0.55;
      const baseR = 100 * sc;
      const tiltRadX = ((rotX + 35) * Math.PI) / 180;
      const tiltRadY = (rotY * Math.PI) / 180;
      const ringTiltY = Math.max(8, Math.abs(Math.sin(tiltRadX)) * baseR);
      const ringTiltX = Math.max(8, Math.abs(Math.cos(tiltRadY)) * baseR);
      return `<svg viewBox="0 0 460 340" class="home-shape-svg" role="img" aria-label="3D Shaded Sphere with radius ${s.toFixed(1)} cm">
        <defs>
          <radialGradient id="sphereGrad" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stop-color="#bae6fd"/><stop offset="35%" stop-color="#38bdf8"/><stop offset="75%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/>
          </radialGradient>
        </defs>
        <ellipse cx="245" cy="290" rx="${baseR * 1.15}" ry="24" fill="#e2e8f0" opacity="0.6"/>
        <g style="transform-origin: 245px 170px; transform: rotate(${rotY * 0.25}deg);">
          <circle cx="245" cy="170" r="${baseR}" fill="url(#sphereGrad)" filter="drop-shadow(0 10px 20px rgba(2,132,199,0.3))"/>
          <ellipse cx="245" cy="170" rx="${baseR}" ry="${ringTiltY}" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" stroke-opacity="0.85"/>
          <ellipse cx="245" cy="170" rx="${ringTiltX}" ry="${baseR}" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 3" stroke-opacity="0.6"/>
          <line x1="245" y1="170" x2="${245 + baseR}" y2="170" stroke="#f43f5e" stroke-width="2.5"/>
          <circle cx="245" cy="170" r="4" fill="#ffffff"/><circle cx="${245 + baseR}" cy="170" r="4" fill="#f43f5e"/>
          <rect x="${245 + baseR * 0.3}" y="145" width="75" height="20" rx="4" fill="#0369a1" opacity="0.85"/>
          <text x="${245 + baseR * 0.35}" y="160" fill="#ffffff" font-weight="700" font-size="13" font-style="italic">r = ${s.toFixed(1)} cm</text>
        </g>
        ${renderLearnoMascotSvg()}
      </svg>`;
    }
  },
  {
    name: 'Cylinder',
    labId: 8,
    formulaTex: 'V = \\pi r^2 h',
    verbal: 'Volume = π × radius² × height',
    getDimLabel: () => 'Radius <i>r</i> (with <i>h</i>=1.5<i>r</i>):',
    calcVol: (s) => Math.PI * ((0.8 * s) ** 2) * (1.5 * s),
    getEq: (s, v) => `<i>V</i> = &pi;<i>r</i><sup>2</sup><i>h</i>`,
    getSub: (s, v) => `Volume = &pi; &times; (${(0.8*s).toFixed(1)})&sup2; &times; ${(1.5*s).toFixed(1)} = ${v.toFixed(1)} cm³`,
    getSpeech: (s, v) => `A cylinder has identical circular ends. Multiply circle area by height! Volume holds ${v.toFixed(1)} cm³! Drag to rotate!`,
    renderSvg: (s, rotX, rotY) => {
      const sc = 0.5 + (s / 10) * 0.55;
      const r = (0.8 * s).toFixed(1);
      const h = (1.5 * s).toFixed(1);
      return `<svg viewBox="0 0 460 340" class="home-shape-svg" role="img" aria-label="3D Cylinder with radius ${r} and height ${h}">
        <defs>
          <linearGradient id="cylSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7c3aed"/><stop offset="45%" stop-color="#a855f7"/><stop offset="85%" stop-color="#c084fc"/><stop offset="100%" stop-color="#6d28d9"/>
          </linearGradient>
          <linearGradient id="cylTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e9d5ff"/><stop offset="100%" stop-color="#c084fc"/>
          </linearGradient>
        </defs>
        <ellipse cx="245" cy="290" rx="${95 * sc}" ry="20" fill="#e2e8f0" opacity="0.6"/>
        <g style="transform-origin: 245px 180px; transform: rotate(${rotY * 0.3}deg) skewY(${rotX * 0.18}deg) scale(${sc});">
          <path d="M160 110 L160 255 A85 28 0 0 0 330 255 L330 110 Z" fill="url(#cylSide)"/>
          <ellipse cx="245" cy="110" rx="85" ry="28" fill="url(#cylTop)" stroke="#ffffff" stroke-width="2"/>
          <line x1="245" y1="110" x2="330" y2="110" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="3 3"/>
          <text x="265" y="102" fill="#ffffff" font-weight="700" font-size="14" font-style="italic">r = ${r}</text>
          <line x1="345" y1="110" x2="345" y2="255" stroke="#7c3aed" stroke-width="2" stroke-dasharray="3 3"/>
          <text x="355" y="185" fill="#581c87" font-weight="700" font-size="14" font-style="italic">h = ${h}</text>
        </g>
        ${renderLearnoMascotSvg()}
      </svg>`;
    }
  },
  {
    name: 'Cone',
    labId: 18,
    formulaTex: 'V = \\frac{1}{3}\\pi r^2 h',
    verbal: 'Volume = ⅓ × π × radius² × height',
    getDimLabel: () => 'Radius <i>r</i> (with <i>h</i>=1.5<i>r</i>):',
    calcVol: (s) => (1 / 3) * Math.PI * ((0.8 * s) ** 2) * (1.5 * s),
    getEq: (s, v) => `<i>V</i> = <sup>1</sup>/<sub>3</sub>&pi;<i>r</i><sup>2</sup><i>h</i>`,
    getSub: (s, v) => `Volume = 1/3 &times; &pi; &times; (${(0.8*s).toFixed(1)})&sup2; &times; ${(1.5*s).toFixed(1)} = ${v.toFixed(1)} cm³`,
    getSpeech: (s, v) => `A cone holds exactly one-third the volume of a cylinder! At r = ${(0.8*s).toFixed(1)} cm, volume holds ${v.toFixed(1)} cm³! Drag to tilt!`,
    renderSvg: (s, rotX, rotY) => {
      const sc = 0.5 + (s / 10) * 0.55;
      const r = (0.8 * s).toFixed(1);
      const h = (1.5 * s).toFixed(1);
      return `<svg viewBox="0 0 460 340" class="home-shape-svg" role="img" aria-label="3D Cone with radius ${r} and height ${h}">
        <defs>
          <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f59e0b"/><stop offset="40%" stop-color="#fbbf24"/><stop offset="80%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <ellipse cx="245" cy="290" rx="${95 * sc}" ry="20" fill="#e2e8f0" opacity="0.6"/>
        <g style="transform-origin: 245px 180px; transform: rotate(${rotY * 0.3}deg) skewY(${rotX * 0.18}deg) scale(${sc});">
          <path d="M245 65 L160 255 A85 26 0 0 0 330 255 Z" fill="url(#coneGrad)"/>
          <ellipse cx="245" cy="255" rx="85" ry="26" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" stroke-opacity="0.8"/>
          <line x1="245" y1="255" x2="330" y2="255" stroke="#ffffff" stroke-width="2.5"/>
          <text x="265" y="247" fill="#ffffff" font-weight="700" font-size="14" font-style="italic">r = ${r}</text>
          <line x1="245" y1="65" x2="245" y2="255" stroke="#78350f" stroke-width="2" stroke-dasharray="3 3"/>
          <text x="253" y="165" fill="#78350f" font-weight="700" font-size="14" font-style="italic">h = ${h}</text>
        </g>
        ${renderLearnoMascotSvg()}
      </svg>`;
    }
  }
];

let homeShapeIndex = 0;
let homeShapeDim = 5.0;
let homeShapeRotX = 15;
let homeShapeRotY = -25;
let isHomeDragging = false;
let homeDragLastX = 0;
let homeDragLastY = 0;

function renderHome3dStage(){
  const canvas = $('#home3dCanvas') || $('#home3dInteractiveCanvas');
  if(!canvas) return;
  const idx = ((homeShapeIndex % HOME_3D_SHAPES.length) + HOME_3D_SHAPES.length) % HOME_3D_SHAPES.length;
  const shape = HOME_3D_SHAPES[idx];
  const s = homeShapeDim;
  const vol = shape.calcVol(s);

  canvas.innerHTML = shape.renderSvg(s, homeShapeRotX, homeShapeRotY);

  const nameEl = $('#stageCubeCardName');
  if(nameEl) nameEl.textContent = shape.name;
  const eqEl = $('#stageCubeCardEq');
  if(eqEl) eqEl.innerHTML = shape.getEq(s, vol);
  const subEl = $('#stageCubeCardSub');
  if(subEl) subEl.innerHTML = shape.getSub(s, vol);
  const speechEl = $('#stageCubeSpeechText');
  if(speechEl) speechEl.textContent = shape.getSpeech(s, vol);
  const speechBubbleEl = $('#homeStageSpeechBubbleText');
  if(speechBubbleEl){
    speechBubbleEl.textContent = isHomeDragging ? 'Whoa, look at it spin! 🌟' : 'Rotate Explore Understand!';
  }

  const dimLabelEl = $('#homeShapeDimLabel');
  if(dimLabelEl) dimLabelEl.innerHTML = shape.getDimLabel();
  const dimValEl = $('#homeShapeDimVal');
  if(dimValEl) dimValEl.textContent = `${s.toFixed(1)} cm`;
  const volValEl = $('#homeShapeVolumeVal');
  if(volValEl) volValEl.textContent = `${vol.toFixed(1)} cm³`;
  const sliderEl = $('#homeShapeDimSlider');
  if(sliderEl && document.activeElement !== sliderEl) sliderEl.value = String(s);

  const dots = $$('.dot', $('#homeCarouselDots'));
  dots.forEach((dot, dIdx) => {
    dot.classList.toggle('active', dIdx === idx);
  });
}

function renderPopularFormulas(){
  const grid = $('#popularFormulasGrid');
  if(!grid) return;
  const shapes = [
    {
      title: 'Volume of a Cube',
      shape: 'Cube',
      formula: 'V = s³',
      verbal: 'Volume = side × side × side',
      desc: 'A cube is a box with equal sides. Its volume tells us how much 3D space it holds.',
      badge: '3D SHAPE · GEOMETRY',
      labId: 1,
      color: '#3b82f6',
      icon: '🧊'
    },
    {
      title: 'Volume of a Cuboid',
      shape: 'Cuboid',
      formula: 'V = l × w × h',
      verbal: 'Volume = length × width × height',
      desc: 'A 3D rectangular box. Volume is base rectangle area multiplied by height.',
      badge: '3D SHAPE · GEOMETRY',
      labId: 2,
      color: '#10b981',
      icon: '📦'
    },
    {
      title: 'Volume of a Sphere',
      shape: 'Sphere',
      formula: 'V = ⁴⁄₃πr³',
      verbal: 'Volume = ⁴⁄₃ × π × radius³',
      desc: 'A perfectly round 3D ball. Every point on its surface is equal distance from the center.',
      badge: '3D SHAPE · GEOMETRY',
      labId: 2,
      color: '#0ea5e9',
      icon: '🌐'
    },
    {
      title: 'Volume of a Cylinder',
      shape: 'Cylinder',
      formula: 'V = πr²h',
      verbal: 'Volume = π × radius² × height',
      desc: 'A can shape with circular ends. Multiply the circular base area by its height.',
      badge: '3D SHAPE · GEOMETRY',
      labId: 8,
      color: '#8b5cf6',
      icon: '🥫'
    },
    {
      title: 'Volume of a Cone',
      shape: 'Cone',
      formula: 'V = ⅓πr²h',
      verbal: 'Volume = ⅓ × π × radius² × height',
      desc: 'A circular base tapering smoothly to a point. Exactly one-third of cylinder volume.',
      badge: '3D SHAPE · GEOMETRY',
      labId: 18,
      color: '#f59e0b',
      icon: '🍦'
    },
    {
      title: 'Volume of a Pyramid',
      shape: 'Pyramid',
      formula: 'V = ⅓Bh',
      verbal: 'Volume = ⅓ × base area × height',
      desc: 'A flat polygon base with triangular faces meeting at a single apex.',
      badge: '3D SHAPE · GEOMETRY',
      labId: 14,
      color: '#f43f5e',
      icon: '🔺'
    }
  ];

  grid.innerHTML = shapes.map(s => `
    <article class="shape-formula-card" data-lab-id="${s.labId}" role="button" tabindex="0" aria-label="Explore ${s.title}">
      <div class="shape-card-badge-row">
        <span class="shape-card-badge" style="background:${s.color}15; color:${s.color}; border-color:${s.color}33">${s.badge}</span>
        <span class="shape-card-icon">${s.icon}</span>
      </div>
      <h3 class="shape-card-title">${escapeHtml(s.title)}</h3>
      <div class="shape-card-eq-display">
        <strong class="shape-card-eq">${s.formula}</strong>
        <span class="shape-card-verbal">${s.verbal}</span>
      </div>
      <p class="shape-card-desc">${s.desc}</p>
      <div class="shape-card-foot">
        <span class="shape-explore-btn" style="color:${s.color}">Explore formula &rarr;</span>
      </div>
    </article>
  `).join('');

  $$('.shape-formula-card', grid).forEach(card => {
    const lid = Number(card.dataset.labId);
    card.addEventListener('click', () => switchView('labs', lid));
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') switchView('labs', lid); });
  });
}

function renderHomePage(){
  renderHeroPreview();
  renderPopularConcepts();
  renderHome3dStage();
  renderPopularFormulas();
}

function renderHeroPreview(){
  const container = $('#heroPreviewStage');
  if(!container) return;
  const H0 = Number($('#heroExpansionSlider')?.value || 70);
  const spread = 55 + (H0 - 50) / 40 * 45;
  const lines = [-2,-1,0,1,2].map(i=>`<line x1="380" y1="140" x2="${380+i*spread*1.9}" y2="${140+i*spread*.55}" class="grid-ray"/>`).join('');
  const dots = [-2,-1,0,1,2].map(i=>`<circle cx="${380+i*spread}" cy="${140+i*20}" r="8" class="galaxy-dot stage-drift" style="--drift:${i*4}px"/>`).join('');

  container.innerHTML = `
    <svg viewBox="0 0 760 280" class="stage-svg" role="img" aria-label="Cosmic expansion interactive preview">
      <defs>
        <marker id="previewArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#f43f5e"/>
        </marker>
      </defs>
      <rect width="760" height="280" rx="20" class="stage-bg"/>
      ${lines}${dots}
      <circle cx="380" cy="140" r="16" class="home-dot"/>
      <text x="360" y="180" class="stage-label">OBSERVER</text>
      <line x1="560" y1="90" x2="620" y2="90" class="tug-arrow" marker-end="url(#previewArrow)"/>
      <text x="540" y="70" class="stage-label">local gravity tug</text>
      <text x="40" y="245" class="stage-label">Space stretch: galaxies drift apart as universe expands</text>
    </svg>`;
}

function renderPopularConcepts(){
  const grid = $('#popularConceptsGrid');
  if(!grid) return;
  const popularIds = [1, 8, 11, 4, 19, 20, 22, 16];

  grid.innerHTML = popularIds.map(id => {
    const f = formulas.find(x => x.id === id);
    const meta = getPlaygroundBlocks(id);
    const color = categoryColor(meta.category);
    return `
      <article class="concept-card" data-lab-id="${f.id}" role="button" tabindex="0" aria-label="Explore ${escapeHtml(meta.publicTitle)}">
        <div class="concept-card-top">
          <span class="concept-category" style="color:${color}">${escapeHtml(meta.category.toUpperCase())}</span>
          <span class="concept-lab-id">LAB ${String(f.id).padStart(2,'0')}</span>
        </div>
        <h3 class="concept-card-title">${escapeHtml(meta.publicTitle)}</h3>
        <p class="concept-card-question">${escapeHtml(meta.question)}</p>
        <div class="concept-card-footer">
          <span class="concept-formal-name">${escapeHtml(meta.scientificTitle)}</span>
          <span class="concept-launch-arrow">&rarr;</span>
        </div>
      </article>`;
  }).join('');

  $$('.concept-card', grid).forEach(card => {
    const labId = Number(card.dataset.labId);
    card.addEventListener('click', () => switchView('labs', labId));
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') switchView('labs', labId); });
  });
}

// ---------------------------------------------------------------------------
// Learning Path Rendering (6 Stages)
// ---------------------------------------------------------------------------
function renderLearningPath(){
  const flow = $('#stagesFlowContainer');
  if(!flow) return;

  flow.innerHTML = LEARNING_STAGES.map((stage, idx) => {
    return `
      <div class="stage-card">
        <div class="stage-card-head">
          <span class="stage-num-badge">${stage.num}</span>
          <div>
            <h2 class="stage-card-title">${escapeHtml(stage.title)}</h2>
            <p class="stage-card-desc">${escapeHtml(stage.description)}</p>
          </div>
        </div>
        <div class="stage-labs-list">
          ${stage.labs.map(lid => {
            const f = formulas.find(x => x.id === lid);
            const meta = getPlaygroundBlocks(lid);
            const isBookmarked = bookmarkSet().has(lid);
            return `
              <div class="stage-lab-item" data-lab-id="${lid}" role="button" tabindex="0">
                <span class="stage-lab-icon">${meta.blocks[0]?.icon || '✨'}</span>
                <div class="stage-lab-info">
                  <strong>${escapeHtml(meta.publicTitle)}</strong>
                  <small>${escapeHtml(meta.scientificTitle)} · \\(${f.tex.split('\\qquad')[0]}\\)</small>
                </div>
                ${isBookmarked ? '<span class="bookmark-flag" title="Bookmarked">★</span>' : ''}
              </div>`;
          }).join('')}
        </div>
        <div class="stage-card-foot">
          <button class="primary-btn stage-start-btn" data-start-lab="${stage.labs[0]}">Start Stage ${stage.num} &rarr;</button>
        </div>
      </div>`;
  }).join('');

  $$('.stage-lab-item', flow).forEach(item => {
    const lid = Number(item.dataset.labId);
    item.addEventListener('click', () => switchView('labs', lid));
    item.addEventListener('keydown', e => { if(e.key === 'Enter') switchView('labs', lid); });
  });

  $$('.stage-start-btn', flow).forEach(btn => {
    const lid = Number(btn.dataset.startLab);
    btn.addEventListener('click', () => switchView('labs', lid));
  });

  typeset([flow]);
}

// ---------------------------------------------------------------------------
// Formula Library Rendering
// ---------------------------------------------------------------------------
function renderCategoryFilters(){
  const row = $('#categoryFiltersRow');
  if(!row) return;

  row.innerHTML = EDUCATIONAL_CATEGORIES.map(cat => `
    <button class="filter-chip ${state.activeCategory === cat.id ? 'active' : ''}" data-cat-id="${cat.id}" role="tab" aria-selected="${state.activeCategory === cat.id}">
      <span>${cat.icon}</span> ${escapeHtml(cat.name)}
    </button>`).join('');

  $$('.filter-chip', row).forEach(chip => {
    chip.addEventListener('click', () => {
      state.activeCategory = chip.dataset.catId;
      renderCategoryFilters();
      renderFormulaLibrary();
    });
  });
}

function renderFormulaLibrary(){
  const grid = $('#libraryCardsGrid');
  const empty = $('#emptyLibraryNotice');
  if(!grid) return;

  const query = ($('#librarySearchInput')?.value || '').trim().toLowerCase();
  const visible = formulas.filter(f => {
    const meta = getPlaygroundBlocks(f.id);
    const catMatch = state.activeCategory === 'all' || meta.category === state.activeCategory;
    const blob = `${meta.publicTitle} ${meta.scientificTitle} ${meta.question} ${f.short} ${f.tex}`.toLowerCase();
    const queryMatch = !query || blob.includes(query);
    return catMatch && queryMatch;
  });

  empty?.classList.toggle('hidden', visible.length > 0);

  grid.innerHTML = visible.map(f => {
    const meta = getPlaygroundBlocks(f.id);
    const color = categoryColor(meta.category);
    return `
      <article class="library-card" data-lab-id="${f.id}" role="button" tabindex="0" aria-label="Open ${escapeHtml(meta.publicTitle)}">
        <div class="library-card-top">
          <span class="category-badge" style="background:${color}18; color:${color}; border-color:${color}33">
            ${escapeHtml(meta.category.toUpperCase())}
          </span>
          <span class="lib-num">LAB ${String(f.id).padStart(2,'0')}</span>
        </div>
        <h3 class="library-card-title">${escapeHtml(meta.publicTitle)}</h3>
        <p class="library-card-question">"${escapeHtml(meta.question)}"</p>
        <div class="library-math-preview">\\[${f.tex.split('\\qquad')[0]}\\]</div>
        <div class="library-card-foot">
          <span class="lib-formal-sub">${escapeHtml(meta.scientificTitle)}</span>
          <span class="lib-enter-btn">Open Lab &rarr;</span>
        </div>
      </article>`;
  }).join('');

  $$('.library-card', grid).forEach(card => {
    const lid = Number(card.dataset.labId);
    card.addEventListener('click', () => switchView('labs', lid));
    card.addEventListener('keydown', e => { if(e.key === 'Enter') switchView('labs', lid); });
  });

  typeset([grid]);
}

// ---------------------------------------------------------------------------
// Interactive Practice Rendering
// ---------------------------------------------------------------------------
const CHALLENGE_NAMES = {
  1: 'Galaxy Motion Challenge',
  8: 'See Through the Dust',
  11: 'Wave Stretch Challenge',
  12: 'Decode the Radio Signal',
  15: 'Sensor Fusion Challenge',
  16: 'Gravity Well Challenge',
  19: 'Rocket Propulsion Challenge',
  20: 'Design a Solar Sail',
  22: 'Decode the Space Plasma'
};

const PRACTICE_QUESTIONS = [
  {
    num: 4,
    shape: 'Sphere',
    icon: '🌐',
    category: 'GEOMETRY · 3D SHAPES',
    labId: 2,
    stageTitle: 'Sphere World',
    stageDesc: 'Explore how spheres appear in the real world, from planets to sports balls, and calculate their volume!',
    title: 'What is the volume of this sphere?',
    prompt: 'Use the formula <i>V</i> = <sup>4</sup>/<sub>3</sub>&pi;<i>r</i><sup>3</sup> and &pi; &approx; 3.14.',
    unit: 'cm³',
    params: { r: 5 },
    answer: 523.3,
    options: [
      { label: 'A', value: 314.0, text: '314.0 cm³' },
      { label: 'B', value: 418.7, text: '418.7 cm³' },
      { label: 'C', value: 523.3, text: '523.3 cm³' },
      { label: 'D', value: 628.0, text: '628.0 cm³' }
    ],
    hints: [
      'Identify the formula: For a sphere, Volume = ⁴⁄₃ × π × r³.',
      'Substitute r = 5: r³ = 5 × 5 × 5 = 125 cm³.',
      'Multiply through: V ≈ ⁴⁄₃ × 3.14 × 125 = ⁴⁄₃ × 392.5 ≈ 523.3 cm³.'
    ],
    steps: [
      { num: '1', title: 'Find r cubed', math: 'r^3 = 5^3 = 125\\text{ cm}^3' },
      { num: '2', title: 'Multiply by pi', math: '3.14 \\times 125 = 392.5' },
      { num: '3', title: 'Multiply by 4/3', math: 'V = \\frac{4}{3} \\times 392.5 = 523.33\\text{ cm}^3' }
    ]
  },
  {
    num: 5,
    shape: 'Cube',
    icon: '🧊',
    category: 'GEOMETRY · 3D SHAPES',
    labId: 1,
    stageTitle: 'Cube World',
    stageDesc: 'A cube has 6 congruent square faces. Find how much 3D space is enclosed by side length s.',
    title: 'What is the volume of this cube with side s = 4 cm?',
    prompt: 'Use the formula <i>V</i> = <i>s</i><sup>3</sup> = <i>s</i> &times; <i>s</i> &times; <i>s</i>.',
    unit: 'cm³',
    params: { s: 4 },
    answer: 64.0,
    options: [
      { label: 'A', value: 16.0, text: '16.0 cm³' },
      { label: 'B', value: 48.0, text: '48.0 cm³' },
      { label: 'C', value: 64.0, text: '64.0 cm³' },
      { label: 'D', value: 96.0, text: '96.0 cm³' }
    ],
    hints: [
      'The formula for a cube is V = s³ (side × side × side).',
      'Substitute side length s = 4 cm.',
      'Calculate: 4 × 4 = 16, then 16 × 4 = 64 cm³.'
    ],
    steps: [
      { num: '1', title: 'Identify side length', math: 's = 4\\text{ cm}' },
      { num: '2', title: 'Compute s squared', math: '4 \\times 4 = 16\\text{ cm}^2' },
      { num: '3', title: 'Compute volume s cubed', math: 'V = 4^3 = 64\\text{ cm}^3' }
    ]
  },
  {
    num: 6,
    shape: 'Cylinder',
    icon: '🥫',
    category: 'GEOMETRY · 3D SHAPES',
    labId: 8,
    stageTitle: 'Cylinder World',
    stageDesc: 'Cylinders have circular bases extruded through height h. Used in rocket tanks and storage silos.',
    title: 'Find the volume of a cylinder with radius r = 3 cm and height h = 7 cm:',
    prompt: 'Use the formula <i>V</i> = &pi;<i>r</i><sup>2</sup><i>h</i> and &pi; &approx; 3.14.',
    unit: 'cm³',
    params: { r: 3, h: 7 },
    answer: 197.8,
    options: [
      { label: 'A', value: 131.9, text: '131.9 cm³' },
      { label: 'B', value: 197.8, text: '197.8 cm³' },
      { label: 'C', value: 263.8, text: '263.8 cm³' },
      { label: 'D', value: 395.6, text: '395.6 cm³' }
    ],
    hints: [
      'First calculate the circular base area: A = π × r².',
      'With r = 3: A ≈ 3.14 × 9 = 28.26 cm².',
      'Multiply base area by height h = 7: V ≈ 28.26 × 7 ≈ 197.8 cm³.'
    ],
    steps: [
      { num: '1', title: 'Compute base area', math: 'A = \\pi r^2 = 3.14 \\times 3^2 = 28.26\\text{ cm}^2' },
      { num: '2', title: 'Multiply by height', math: 'V = A \\times h = 28.26 \\times 7 = 197.82\\text{ cm}^3' }
    ]
  },
  {
    num: 7,
    shape: 'Cone',
    icon: '🍦',
    category: 'GEOMETRY · 3D SHAPES',
    labId: 18,
    stageTitle: 'Cone World',
    stageDesc: 'A cone tapers from a circular base to an apex point. Crucial for rocket engine nozzles.',
    title: 'What is the volume of a cone with radius r = 3 cm and height h = 9 cm?',
    prompt: 'Use the formula <i>V</i> = <sup>1</sup>/<sub>3</sub>&pi;<i>r</i><sup>2</sup><i>h</i> and &pi; &approx; 3.14.',
    unit: 'cm³',
    params: { r: 3, h: 9 },
    answer: 84.8,
    options: [
      { label: 'A', value: 84.8, text: '84.8 cm³' },
      { label: 'B', value: 113.0, text: '113.0 cm³' },
      { label: 'C', value: 254.3, text: '254.3 cm³' },
      { label: 'D', value: 28.3, text: '28.3 cm³' }
    ],
    hints: [
      'A cone holds exactly ⅓ of the volume of a cylinder with the same base and height!',
      'Compute base area: A = π × 3² = 28.26 cm².',
      'Multiply by height and divide by 3: (28.26 × 9) / 3 = 28.26 × 3 = 84.78 ≈ 84.8 cm³.'
    ],
    steps: [
      { num: '1', title: 'Base area', math: 'A = \\pi r^2 = 3.14 \\times 9 = 28.26\\text{ cm}^2' },
      { num: '2', title: 'Cylinder volume', math: 'V_{\\text{cyl}} = 28.26 \\times 9 = 254.34\\text{ cm}^3' },
      { num: '3', title: 'Take one third', math: 'V = \\frac{1}{3} \\times 254.34 = 84.78\\text{ cm}^3' }
    ]
  },
  {
    num: 8,
    shape: 'Cuboid',
    icon: '📦',
    category: 'GEOMETRY · 3D SHAPES',
    labId: 2,
    stageTitle: 'Cuboid World',
    stageDesc: 'Rectangular prisms model satellite buses, cargo bays, and space station habitat modules.',
    title: 'Calculate the volume of a rectangular prism: l = 8 cm, w = 4 cm, h = 5 cm:',
    prompt: 'Use the formula <i>V</i> = <i>l</i> &times; <i>w</i> &times; <i>h</i>.',
    unit: 'cm³',
    params: { l: 8, w: 4, h: 5 },
    answer: 160.0,
    options: [
      { label: 'A', value: 80.0, text: '80.0 cm³' },
      { label: 'B', value: 120.0, text: '120.0 cm³' },
      { label: 'C', value: 160.0, text: '160.0 cm³' },
      { label: 'D', value: 200.0, text: '200.0 cm³' }
    ],
    hints: [
      'Multiply all three perpendicular edge lengths: l × w × h.',
      'Base area = 8 × 4 = 32 cm².',
      'Total volume = 32 × 5 = 160 cm³.'
    ],
    steps: [
      { num: '1', title: 'Base rectangle area', math: 'A = 8 \\times 4 = 32\\text{ cm}^2' },
      { num: '2', title: 'Multiply by height', math: 'V = 32 \\times 5 = 160\\text{ cm}^3' }
    ]
  },
  {
    num: 9,
    shape: 'Pyramid',
    icon: '🔺',
    category: 'GEOMETRY · 3D SHAPES',
    labId: 14,
    stageTitle: 'Pyramid World',
    stageDesc: 'Pyramidal geometry models descent heat shields, radar reflectors, and stellar antennas.',
    title: 'A square pyramid has base side b = 6 cm and height h = 10 cm. What is its volume?',
    prompt: 'Use the formula <i>V</i> = <sup>1</sup>/<sub>3</sub><i>Bh</i> where <i>B</i> = <i>b</i><sup>2</sup>.',
    unit: 'cm³',
    params: { b: 6, h: 10 },
    answer: 120.0,
    options: [
      { label: 'A', value: 60.0, text: '60.0 cm³' },
      { label: 'B', value: 120.0, text: '120.0 cm³' },
      { label: 'C', value: 180.0, text: '180.0 cm³' },
      { label: 'D', value: 360.0, text: '360.0 cm³' }
    ],
    hints: [
      'Base is a square with side b = 6 cm, so Base Area B = 6² = 36 cm².',
      'Pyramid volume is one-third of the prism: V = ⅓ × B × h.',
      'Multiply: ⅓ × 36 × 10 = 12 × 10 = 120 cm³.'
    ],
    steps: [
      { num: '1', title: 'Base area B', math: 'B = 6^2 = 36\\text{ cm}^2' },
      { num: '2', title: 'Prism volume', math: '36 \\times 10 = 360\\text{ cm}^3' },
      { num: '3', title: 'Take one third', math: 'V = \\frac{1}{3} \\times 360 = 120\\text{ cm}^3' }
    ]
  },
  {
    num: 10,
    shape: 'Sphere',
    icon: '🚀',
    category: 'SPACEFLIGHT APPLICATION',
    labId: 19,
    stageTitle: 'Space Tanker',
    stageDesc: 'Spacecraft propellant tanks are spherical to minimize structural mass while holding maximum fuel volume.',
    title: 'A spherical propellant tank has radius r = 3 m. What volume of fuel does it hold?',
    prompt: 'Use <i>V</i> = <sup>4</sup>/<sub>3</sub>&pi;<i>r</i><sup>3</sup> and &pi; &approx; 3.14.',
    unit: 'm³',
    params: { r: 3 },
    answer: 113.0,
    options: [
      { label: 'A', value: 84.8, text: '84.8 m³' },
      { label: 'B', value: 113.0, text: '113.0 m³' },
      { label: 'C', value: 141.3, text: '141.3 m³' },
      { label: 'D', value: 226.1, text: '226.1 m³' }
    ],
    hints: [
      'Volume of a spherical tank is V = ⁴⁄₃πr³.',
      'With r = 3 m: r³ = 3 × 3 × 3 = 27 m³.',
      'Calculate: ⁴⁄₃ × 3.14 × 27 = 4 × 3.14 × 9 ≈ 113.04 m³.'
    ],
    steps: [
      { num: '1', title: 'Radius cubed', math: 'r^3 = 3^3 = 27\\text{ m}^3' },
      { num: '2', title: 'Pi times radius cubed', math: '3.14 \\times 27 = 84.78' },
      { num: '3', title: 'Multiply by 4/3', math: 'V = \\frac{4}{3} \\times 84.78 = 113.04\\text{ m}^3' }
    ]
  },
  {
    num: 1,
    shape: 'Cube',
    icon: '🛰️',
    category: 'SATELLITE ENGINEERING',
    labId: 1,
    stageTitle: 'CubeSat Standard',
    stageDesc: 'A standard 1U CubeSat has 10 cm sides. Standardizing shape allows rideshare on modern launch vehicles.',
    title: 'A standard 1U CubeSat measures s = 10 cm on each side. What is its internal volume?',
    prompt: 'Use <i>V</i> = <i>s</i><sup>3</sup>.',
    unit: 'cm³',
    params: { s: 10 },
    answer: 1000.0,
    options: [
      { label: 'A', value: 100.0, text: '100.0 cm³' },
      { label: 'B', value: 600.0, text: '600.0 cm³' },
      { label: 'C', value: 1000.0, text: '1000.0 cm³' },
      { label: 'D', value: 3000.0, text: '3000.0 cm³' }
    ],
    hints: [
      'Each side is s = 10 cm.',
      'V = 10 × 10 × 10.',
      '10 × 10 = 100, then 100 × 10 = 1000 cm³ (which equals exactly 1 Liter!).'
    ],
    steps: [
      { num: '1', title: 'Side s', math: 's = 10\\text{ cm}' },
      { num: '2', title: 'Cube s', math: 'V = 10^3 = 1000\\text{ cm}^3 = 1\\text{ Liter}' }
    ]
  },
  {
    num: 2,
    shape: 'Cylinder',
    icon: '🚀',
    category: 'PROPULSION TANK',
    labId: 19,
    stageTitle: 'Booster Core',
    stageDesc: 'Cylindrical booster tanks provide aerodynamic efficiency while ascending through planetary atmosphere.',
    title: 'A rocket second stage cylinder has radius r = 2 m and height h = 10 m. What is its capacity?',
    prompt: 'Use <i>V</i> = &pi;<i>r</i><sup>2</sup><i>h</i> and &pi; &approx; 3.14.',
    unit: 'm³',
    params: { r: 2, h: 10 },
    answer: 125.6,
    options: [
      { label: 'A', value: 62.8, text: '62.8 m³' },
      { label: 'B', value: 125.6, text: '125.6 m³' },
      { label: 'C', value: 188.4, text: '188.4 m³' },
      { label: 'D', value: 251.2, text: '251.2 m³' }
    ],
    hints: [
      'Calculate circle area: A = π × r² = 3.14 × 2² = 12.56 m².',
      'Multiply by cylindrical height h = 10 m.',
      '12.56 × 10 = 125.6 m³.'
    ],
    steps: [
      { num: '1', title: 'Cross section area', math: 'A = 3.14 \\times 4 = 12.56\\text{ m}^2' },
      { num: '2', title: 'Total volume', math: 'V = 12.56 \\times 10 = 125.6\\text{ m}^3' }
    ]
  },
  {
    num: 3,
    shape: 'Cone',
    icon: '☄️',
    category: 'ATMOSPHERIC ENTRY',
    labId: 18,
    stageTitle: 'Aero-Shell',
    stageDesc: 'Conical aero-shells deflect supersonic shock waves during planetary atmospheric entry.',
    title: 'A conical re-entry capsule nose cone has radius r = 2 m and height h = 3 m. Find its volume:',
    prompt: 'Use <i>V</i> = <sup>1</sup>/<sub>3</sub>&pi;<i>r</i><sup>2</sup><i>h</i> and &pi; &approx; 3.14.',
    unit: 'm³',
    params: { r: 2, h: 3 },
    answer: 12.6,
    options: [
      { label: 'A', value: 8.4, text: '8.4 m³' },
      { label: 'B', value: 12.6, text: '12.6 m³' },
      { label: 'C', value: 25.1, text: '25.1 m³' },
      { label: 'D', value: 37.7, text: '37.7 m³' }
    ],
    hints: [
      'Use the formula V = ⅓πr²h.',
      'Notice that ⅓ and height h = 3 cancel out nicely: ⅓ × 3 = 1!',
      'So V = π × r² = 3.14 × 4 = 12.56 ≈ 12.6 m³.'
    ],
    steps: [
      { num: '1', title: 'Base area', math: 'A = 3.14 \\times 2^2 = 12.56\\text{ m}^2' },
      { num: '2', title: 'Multiply by height / 3', math: 'V = \\frac{1}{3} \\times 12.56 \\times 3 = 12.56\\text{ m}^3' }
    ]
  }
];

let practiceQuestionIndex = 0;
let practiceHintStep = 0;

function renderPracticeSection(){
  renderChallengesDeck();
  loadPracticeProblem();
}

function renderChallengesDeck(){
  const list = $('#challengeList');
  if(!list) return;

  list.innerHTML = Object.entries(CHALLENGE_NAMES).map(([lidStr, name]) => {
    const lid = Number(lidStr);
    const meta = getPlaygroundBlocks(lid);
    const isSelected = state.practiceLabId === lid;
    return `
      <button class="challenge-item-btn ${isSelected ? 'active' : ''}" data-lab-id="${lid}">
        <span>${meta.blocks[0]?.icon || '🎯'}</span>
        <div class="challenge-info">
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(meta.scientificTitle)}</small>
        </div>
      </button>`;
  }).join('');

  $$('.challenge-item-btn', list).forEach(btn => {
    btn.addEventListener('click', () => {
      const lid = Number(btn.dataset.labId);
      state.practiceLabId = lid;
      renderChallengesDeck();
      loadPracticeProblem(lid);
    });
  });
}

function renderStagePreviewGraphic(q){
  const canvas = $('#stagePreviewCanvas');
  if(!canvas) return;
  const shape = q?.shape || 'Sphere';

  if(shape === 'Cube'){
    canvas.innerHTML = `
      <svg viewBox="0 0 320 170" class="stage-preview-svg" role="img" aria-label="Cube World island preview">
        <rect width="320" height="170" rx="14" fill="#eff6ff"/>
        <ellipse cx="160" cy="140" rx="90" ry="18" fill="#cbd5e1" opacity="0.6"/>
        <polygon points="160,35 220,70 160,105 100,70" fill="#93c5fd" stroke="#ffffff" stroke-width="1.5"/>
        <polygon points="100,70 160,105 160,150 100,115" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5"/>
        <polygon points="160,105 220,70 220,115 160,150" fill="#60a5fa" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="260" cy="50" r="15" fill="#f59e0b" opacity="0.9"/>
      </svg>`;
  } else if(shape === 'Cylinder'){
    canvas.innerHTML = `
      <svg viewBox="0 0 320 170" class="stage-preview-svg" role="img" aria-label="Cylinder World preview">
        <rect width="320" height="170" rx="14" fill="#faf5ff"/>
        <ellipse cx="160" cy="140" rx="70" ry="15" fill="#e2e8f0"/>
        <path d="M110 50 L110 130 A50 18 0 0 0 210 130 L210 50 Z" fill="#a855f7"/>
        <ellipse cx="160" cy="50" rx="50" ry="18" fill="#d8b4fe" stroke="#ffffff" stroke-width="1.5"/>
      </svg>`;
  } else if(shape === 'Cone'){
    canvas.innerHTML = `
      <svg viewBox="0 0 320 170" class="stage-preview-svg" role="img" aria-label="Cone World preview">
        <rect width="320" height="170" rx="14" fill="#fffbeb"/>
        <ellipse cx="160" cy="145" rx="75" ry="16" fill="#fde68a" opacity="0.6"/>
        <path d="M160 30 L105 135 A55 18 0 0 0 215 135 Z" fill="#f59e0b"/>
        <ellipse cx="160" cy="135" rx="55" ry="18" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3"/>
      </svg>`;
  } else {
    canvas.innerHTML = `
      <svg viewBox="0 0 320 170" class="stage-preview-svg" role="img" aria-label="Sphere World floating island preview">
        <defs>
          <linearGradient id="islandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#34d399"/><stop offset="30%" stop-color="#059669"/><stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <radialGradient id="spherePreviewGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#67e8f9"/><stop offset="50%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#0e7490"/>
          </radialGradient>
        </defs>
        <rect width="320" height="170" rx="14" fill="#f0fdf4"/>
        <ellipse cx="60" cy="40" rx="30" ry="12" fill="#ffffff" opacity="0.8"/>
        <ellipse cx="260" cy="35" rx="35" ry="14" fill="#ffffff" opacity="0.8"/>
        <polygon points="50,115 160,105 270,115 220,155 100,155" fill="url(#islandGrad)"/>
        <ellipse cx="160" cy="112" rx="110" ry="16" fill="#10b981"/>
        <ellipse cx="160" cy="110" rx="38" ry="10" fill="#065f46" opacity="0.4"/>
        <circle cx="160" cy="72" r="36" fill="url(#spherePreviewGrad)"/>
        <ellipse cx="160" cy="72" rx="36" ry="11" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.8"/>
        <ellipse cx="160" cy="72" rx="55" ry="15" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4"/>
        <circle cx="212" cy="74" r="6.5" fill="#f43f5e"/>
      </svg>`;
  }
}

function loadPracticeProblem(param){
  if(typeof param === 'number'){
    if(param >= 0 && param < PRACTICE_QUESTIONS.length){
      practiceQuestionIndex = param;
    } else {
      const matchIdx = PRACTICE_QUESTIONS.findIndex(q => q.labId === param);
      if(matchIdx >= 0) practiceQuestionIndex = matchIdx;
    }
  } else if(typeof param === 'string'){
    const matches = PRACTICE_QUESTIONS.map((q, idx) => ({ q, idx })).filter(item => item.q.shape.toLowerCase() === param.toLowerCase());
    if(matches.length > 0){
      const currentMatchIdx = matches.findIndex(m => m.idx === practiceQuestionIndex);
      if(currentMatchIdx >= 0){
        practiceQuestionIndex = matches[(currentMatchIdx + 1) % matches.length].idx;
      } else {
        practiceQuestionIndex = matches[0].idx;
      }
    }
  }

  const q = PRACTICE_QUESTIONS[practiceQuestionIndex];
  state.practiceProblem = q;
  state.practiceLabId = q.labId;
  practiceHintStep = 0;

  const totalQ = PRACTICE_QUESTIONS.length;
  const currentNum = q.num || (practiceQuestionIndex + 1);

  const qNum = $('#practiceQuestionNum');
  if(qNum) qNum.textContent = `Question ${currentNum} of ${totalQ}`;

  const barFill = $('#practiceHeaderBarFill');
  if(barFill) barFill.style.width = `${((practiceQuestionIndex + 1) / totalQ * 100).toFixed(0)}%`;

  const catPill = $('#practiceCategoryPill');
  if(catPill){
    catPill.textContent = q.category;
    catPill.style.color = '#2563eb';
  }

  const labNum = $('#practiceLabNum');
  if(labNum) labNum.textContent = `Challenge · ${q.shape}`;

  const titleEl = $('#practiceTitle');
  if(titleEl) titleEl.textContent = q.title;

  const promptEl = $('#practicePromptBox');
  if(promptEl) promptEl.innerHTML = q.prompt;

  const unitEl = $('#practiceAnswerUnit');
  if(unitEl) unitEl.textContent = q.unit;

  const inputEl = $('#practiceAnswerInput');
  if(inputEl) inputEl.value = '';

  const fb = $('#practiceFeedbackBox');
  if(fb){
    fb.className = 'practice-feedback-box hidden';
    fb.textContent = '';
  }

  const hintText = $('#practiceHintText');
  if(hintText){
    hintText.className = 'hint-body hidden';
    hintText.innerHTML = '';
  }

  const hintBtn = $('#practiceHintBtn');
  if(hintBtn) hintBtn.textContent = 'Show Hint →';

  const eqRev = $('#practiceEquationReveal');
  if(eqRev){
    eqRev.className = 'practice-equation-reveal hidden';
    eqRev.innerHTML = '';
  }

  const stageCard = $('#stagePreviewCard');
  if(stageCard){
    const sTitle = stageCard.querySelector('.stage-preview-head strong');
    if(sTitle) sTitle.textContent = q.stageTitle;
    const sSmall = stageCard.querySelector('.stage-preview-head small');
    if(sSmall) sSmall.textContent = q.shape;
    const sBadge = stageCard.querySelector('.stage-badge-small');
    if(sBadge) sBadge.innerHTML = `Stage ${((practiceQuestionIndex % 5) + 1)}<br>${escapeHtml(q.shape)} in Space`;
    const sDesc = stageCard.querySelector('.stage-preview-desc');
    if(sDesc) sDesc.textContent = q.stageDesc;
  }

  // Render Multiple Choice Options Grid
  const grid = $('#practiceOptionsGrid');
  if(grid){
    grid.innerHTML = q.options.map(opt => `
      <button class="challenge-option-btn" type="button" data-val="${opt.value}" data-opt="${opt.label}">
        <span class="option-letter-badge">${opt.label}</span>
        <span class="option-val-text">${opt.text}</span>
      </button>
    `).join('');

    $$('.challenge-option-btn', grid).forEach(btn => {
      btn.addEventListener('click', () => {
        const val = Number(btn.dataset.val);
        $('#practiceAnswerInput').value = String(val);

        $$('.challenge-option-btn', grid).forEach(b => {
          b.classList.remove('selected-correct', 'selected-wrong', 'correct', 'wrong');
        });

        const isCorrect = Math.abs(val - q.answer) <= Math.max(0.2, q.answer * 0.03);

        if(isCorrect){
          btn.classList.add('selected-correct', 'correct');
          if(fb){
            fb.className = 'practice-feedback-box good';
            fb.innerHTML = `<strong>✓ Brilliant!</strong> Correct volume: <strong>${q.answer} ${q.unit}</strong>. You earned +60 XP! ⭐`;
            fb.classList.remove('hidden');
          }
          const xpFill = $('#xpProgressFill');
          if(xpFill) xpFill.style.width = `${Math.min(100, 50 + (practiceQuestionIndex + 1) * 5)}%`;
          const xpRatio = $('#xpRatioText');
          if(xpRatio) xpRatio.textContent = `${Math.min(20, 10 + practiceQuestionIndex * 2)} / 20 XP`;
          showMascot(`Awesome work! You found the exact volume of the ${q.shape}! 🌟`);
        } else {
          btn.classList.add('selected-wrong', 'wrong');
          if(fb){
            fb.className = 'practice-feedback-box bad';
            fb.innerHTML = `<strong>Not quite.</strong> Target was <strong>${q.answer} ${q.unit}</strong>. Click "Need a hint?" above!`;
            fb.classList.remove('hidden');
          }
          showMascot('Keep experimenting! Click "Need a hint?" or test it in the Live Lab!');
        }
      });
    });
  }

  // Update Equation block chips active state
  $$('.formula-chip-block', $('#practiceEquationBlocksRow')).forEach(chip => {
    const isAct = chip.dataset.shape && chip.dataset.shape.toLowerCase() === q.shape.toLowerCase();
    chip.classList.toggle('active', isAct);
  });

  renderPracticeVisual(q);
  renderStagePreviewGraphic(q);
  renderEquationBlockDetailCard(q.shape);
  typeset([$('#practicePromptBox'), $('#practiceActiveCard')]);
}

function renderEquationBlockDetailCard(shapeName){
  const card = $('#practiceEquationBlockDetailCard');
  if(!card) return;

  const shapeData = {
    'Cube': {
      title: 'Cube Volume',
      tex: 'V = s^3',
      verbal: 'Volume = side × side × side',
      icon: '🧊',
      desc: 'All 12 edges have equal length s. In space engineering, used for standardized CubeSat modular payloads.',
      defaultVal: 5,
      paramName: 'Side length s (cm)',
      calc: (s) => (s ** 3).toFixed(1) + ' cm³'
    },
    'Cuboid': {
      title: 'Cuboid Volume (Rectangular Prism)',
      tex: 'V = l \\times w \\times h',
      verbal: 'Volume = length × width × height',
      icon: '📦',
      desc: 'Three perpendicular pairs of parallel rectangular faces. Common for spacecraft avionics modules.',
      defaultVal: 4,
      paramName: 'Height h (with l=1.6h, w=0.8h)',
      calc: (h) => ((1.6 * h) * (0.8 * h) * h).toFixed(1) + ' cm³'
    },
    'Sphere': {
      title: 'Sphere Volume',
      tex: 'V = \\frac{4}{3}\\pi r^3',
      verbal: 'Volume = ⁴⁄₃ × π × radius³',
      icon: '🌐',
      desc: 'Maximal volume enclosed for minimal surface area. Ideal for pressurized fuel tanks and celestial bodies.',
      defaultVal: 3,
      paramName: 'Radius r (cm)',
      calc: (r) => ((4 / 3) * Math.PI * (r ** 3)).toFixed(1) + ' cm³'
    },
    'Cylinder': {
      title: 'Cylinder Volume',
      tex: 'V = \\pi r^2 h',
      verbal: 'Volume = π × radius² × height',
      icon: '🚀',
      desc: 'Circular base swept through straight height h. Standard shape for multi-stage rocket propellant tanks.',
      defaultVal: 3,
      paramName: 'Radius r (with h=2r)',
      calc: (r) => (Math.PI * (r ** 2) * (2 * r)).toFixed(1) + ' cm³'
    },
    'Cone': {
      title: 'Cone Volume',
      tex: 'V = \\frac{1}{3}\\pi r^2 h',
      verbal: 'Volume = ⅓ × π × radius² × height',
      icon: '🍦',
      desc: 'Holds exactly ⅓ of the volume of an equal-base cylinder. Used in rocket aerospike nozzles and re-entry heatshields.',
      defaultVal: 3,
      paramName: 'Radius r (with h=3r)',
      calc: (r) => ((1 / 3) * Math.PI * (r ** 2) * (3 * r)).toFixed(1) + ' cm³'
    },
    'Pyramid': {
      title: 'Square Pyramid Volume',
      tex: 'V = \\frac{1}{3} B h',
      verbal: 'Volume = ⅓ × base area × height',
      icon: '🔺',
      desc: 'Square base of side b tapering to a point. Used in planetary lander deceleration and deep space phased arrays.',
      defaultVal: 6,
      paramName: 'Base side b (with h=10)',
      calc: (b) => ((1 / 3) * (b ** 2) * 10).toFixed(1) + ' cm³'
    }
  };

  const data = shapeData[shapeName] || shapeData['Cube'];
  card.classList.remove('hidden');

  card.innerHTML = `
    <div class="eq-detail-head">
      <div class="eq-detail-title-wrap">
        <span class="eq-detail-icon">${data.icon}</span>
        <div>
          <h3 class="eq-detail-title">${escapeHtml(data.title)}</h3>
          <p class="eq-detail-sub">${escapeHtml(data.verbal)}</p>
        </div>
      </div>
      <button class="ghost-btn close-eq-detail-btn" type="button" aria-label="Close equation detail card">✕ Close</button>
    </div>
    <div class="eq-detail-body">
      <div class="eq-detail-formula-box">
        <div class="eq-detail-math">\\[${data.tex}\\]</div>
        <p class="eq-detail-desc">${escapeHtml(data.desc)}</p>
      </div>
      <div class="eq-calc-box">
        <span class="eq-calc-label">Interactive Mini-Calculator</span>
        <div class="eq-calc-row">
          <label for="eqCalcInput" style="font-size: 13px; font-weight: 600; color: #475569;">${escapeHtml(data.paramName)}:</label>
          <input type="number" id="eqCalcInput" class="eq-calc-input" min="1" max="50" step="0.5" value="${data.defaultVal}">
          <div class="eq-calc-result-tag" id="eqCalcResult">
            <span>Result:</span> <strong id="eqCalcResultVal">${data.calc(data.defaultVal)}</strong>
          </div>
        </div>
        <small style="color: #64748b;">Adjust input to watch volume compute live!</small>
      </div>
    </div>
  `;

  typeset([card]);

  const inp = card.querySelector('#eqCalcInput');
  const resVal = card.querySelector('#eqCalcResultVal');
  inp?.addEventListener('input', e => {
    const val = Number(e.target.value) || 0;
    if(resVal) resVal.textContent = data.calc(val);
  });

  card.querySelector('.close-eq-detail-btn')?.addEventListener('click', () => {
    card.classList.add('hidden');
  });
}

function renderPracticeVisual(q){
  const box = $('#practiceVisualBox');
  if(!box) return;

  const shape = q.shape;
  const p = q.params;

  if(shape === 'Cube'){
    const s = p.s || 4;
    box.innerHTML = `
      <svg viewBox="0 0 340 180" class="practice-shape-svg" role="img" aria-label="3D Cube with side s = ${s} cm">
        <defs>
          <linearGradient id="qCubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#60a5fa"/>
          </linearGradient>
          <linearGradient id="qCubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/>
          </linearGradient>
          <linearGradient id="qCubeRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/>
          </linearGradient>
        </defs>
        <ellipse cx="170" cy="160" rx="75" ry="16" fill="#e2e8f0" opacity="0.6"/>
        <g transform="translate(170, 95) scale(0.72)">
          <polygon points="0,-75 65,-35 0,5 -65,-35" fill="url(#qCubeTop)" stroke="#ffffff" stroke-width="2"/>
          <polygon points="-65,-35 0,5 0,85 -65,45" fill="url(#qCubeLeft)" stroke="#ffffff" stroke-width="2"/>
          <polygon points="0,5 65,-35 65,45 0,85" fill="url(#qCubeRight)" stroke="#ffffff" stroke-width="2"/>
          <text x="-85" y="15" fill="#1e3a8a" font-weight="700" font-size="15" font-style="italic">s = ${s} cm</text>
          <text x="75" y="15" fill="#1e3a8a" font-weight="700" font-size="15" font-style="italic">s = ${s} cm</text>
        </g>
      </svg>`;
  } else if(shape === 'Cylinder'){
    const r = p.r || 3;
    const h = p.h || 7;
    box.innerHTML = `
      <svg viewBox="0 0 340 180" class="practice-shape-svg" role="img" aria-label="3D Cylinder with radius r = ${r} cm and height h = ${h} cm">
        <defs>
          <linearGradient id="qCylSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7c3aed"/><stop offset="50%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6d28d9"/>
          </linearGradient>
        </defs>
        <ellipse cx="170" cy="155" rx="65" ry="15" fill="#e2e8f0" opacity="0.6"/>
        <g transform="translate(170, 95) scale(0.75)">
          <path d="M-60,-40 L-60,55 A60,18 0 0 0 60,55 L60,-40 Z" fill="url(#qCylSide)"/>
          <ellipse cx="0" cy="-40" rx="60" ry="18" fill="#d8b4fe" stroke="#ffffff" stroke-width="2"/>
          <line x1="0" y1="-40" x2="60" y2="-40" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 2"/>
          <text x="15" y="-45" fill="#ffffff" font-weight="700" font-size="14" font-style="italic">r = ${r} cm</text>
          <line x1="72" y1="-40" x2="72" y2="55" stroke="#7c3aed" stroke-width="2" stroke-dasharray="3 2"/>
          <text x="80" y="12" fill="#581c87" font-weight="700" font-size="14" font-style="italic">h = ${h} cm</text>
        </g>
      </svg>`;
  } else if(shape === 'Cone'){
    const r = p.r || 3;
    const h = p.h || 9;
    box.innerHTML = `
      <svg viewBox="0 0 340 180" class="practice-shape-svg" role="img" aria-label="3D Cone with radius r = ${r} cm and height h = ${h} cm">
        <defs>
          <linearGradient id="qConeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f59e0b"/><stop offset="50%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <ellipse cx="170" cy="155" rx="65" ry="15" fill="#e2e8f0" opacity="0.6"/>
        <g transform="translate(170, 95) scale(0.78)">
          <path d="M0,-60 L-60,55 A60,18 0 0 0 60,55 Z" fill="url(#qConeGrad)"/>
          <ellipse cx="0" cy="55" rx="60" ry="18" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 3"/>
          <line x1="0" y1="55" x2="60" y2="55" stroke="#ffffff" stroke-width="2"/>
          <text x="15" y="50" fill="#ffffff" font-weight="700" font-size="14" font-style="italic">r = ${r} cm</text>
          <line x1="0" y1="-60" x2="0" y2="55" stroke="#78350f" stroke-width="1.8" stroke-dasharray="3 3"/>
          <text x="6" y="-5" fill="#78350f" font-weight="700" font-size="14" font-style="italic">h = ${h} cm</text>
        </g>
      </svg>`;
  } else if(shape === 'Cuboid'){
    const l = p.l || 8;
    const w = p.w || 4;
    const h = p.h || 5;
    box.innerHTML = `
      <svg viewBox="0 0 340 180" class="practice-shape-svg" role="img" aria-label="3D Cuboid l=${l}, w=${w}, h=${h}">
        <defs>
          <linearGradient id="qCuboidTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a7f3d0"/><stop offset="100%" stop-color="#34d399"/>
          </linearGradient>
          <linearGradient id="qCuboidLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#047857"/>
          </linearGradient>
          <linearGradient id="qCuboidRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/>
          </linearGradient>
        </defs>
        <ellipse cx="170" cy="158" rx="85" ry="16" fill="#e2e8f0" opacity="0.6"/>
        <g transform="translate(170, 95) scale(0.68)">
          <polygon points="-15,-70 85,-40 -15,0 -115,-40" fill="url(#qCuboidTop)" stroke="#ffffff" stroke-width="2"/>
          <polygon points="-115,-40 -15,0 -15,70 -115,30" fill="url(#qCuboidLeft)" stroke="#ffffff" stroke-width="2"/>
          <polygon points="-15,0 85,-40 85,30 -15,70" fill="url(#qCuboidRight)" stroke="#ffffff" stroke-width="2"/>
          <text x="-75" y="-55" fill="#065f46" font-weight="700" font-size="14" font-style="italic">l = ${l}</text>
          <text x="45" y="-20" fill="#065f46" font-weight="700" font-size="14" font-style="italic">w = ${w}</text>
          <text x="-5" y="42" fill="#065f46" font-weight="700" font-size="14" font-style="italic">h = ${h}</text>
        </g>
      </svg>`;
  } else if(shape === 'Pyramid'){
    const b = p.b || 6;
    const h = p.h || 10;
    box.innerHTML = `
      <svg viewBox="0 0 340 180" class="practice-shape-svg" role="img" aria-label="3D Pyramid base=${b}, height=${h}">
        <ellipse cx="170" cy="155" rx="75" ry="15" fill="#e2e8f0" opacity="0.6"/>
        <g transform="translate(170, 90) scale(0.72)">
          <polygon points="0,-75 -70,55 20,65" fill="#f43f5e" stroke="#ffffff" stroke-width="1.8"/>
          <polygon points="0,-75 20,65 75,40" fill="#fb7185" stroke="#ffffff" stroke-width="1.8"/>
          <text x="-40" y="75" fill="#9f1239" font-weight="700" font-size="14" font-style="italic">base b = ${b} cm</text>
          <line x1="0" y1="-75" x2="0" y2="55" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 3"/>
          <text x="6" y="-5" fill="#ffffff" font-weight="700" font-size="14" font-style="italic">h = ${h} cm</text>
        </g>
      </svg>`;
  } else {
    const r = p.r || 5;
    box.innerHTML = `
      <svg viewBox="0 0 340 180" class="practice-shape-svg" role="img" aria-label="3D Sphere with radius r = ${r} cm">
        <defs>
          <radialGradient id="sphereQGrad" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stop-color="#bae6fd"/>
            <stop offset="35%" stop-color="#38bdf8"/>
            <stop offset="75%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </radialGradient>
        </defs>
        <ellipse cx="170" cy="155" rx="75" ry="16" fill="#e2e8f0" opacity="0.6"/>
        <circle cx="170" cy="85" r="62" fill="url(#sphereQGrad)" filter="drop-shadow(0 6px 12px rgba(2,132,199,0.25))"/>
        <ellipse cx="170" cy="85" rx="62" ry="19" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="4 3" stroke-opacity="0.85"/>
        <line x1="170" y1="85" x2="232" y2="85" stroke="#f43f5e" stroke-width="2.2"/>
        <circle cx="170" cy="85" r="3.5" fill="#ffffff"/>
        <circle cx="232" cy="85" r="3.5" fill="#f43f5e"/>
        <rect x="178" y="64" width="65" height="18" rx="4" fill="#ffffff" opacity="0.92"/>
        <text x="182" y="77" fill="#0369a1" font-weight="700" font-size="12" font-style="italic">r = ${r} ${q.unit === 'm³' ? 'm' : 'cm'}</text>
      </svg>`;
  }
}

function checkPracticeAnswer(){
  const q = state.practiceProblem;
  if(!q) return;
  const raw = $('#practiceAnswerInput')?.value.trim();
  const val = Number(raw);
  const fb = $('#practiceFeedbackBox');

  if(!Number.isFinite(val)){
    fb.className = 'practice-feedback-box bad';
    fb.textContent = 'Please enter a valid number.';
    fb.classList.remove('hidden');
    return;
  }

  const ok = Math.abs(val - q.answer) <= Math.max(0.2, q.answer * 0.03);

  if(ok){
    fb.className = 'practice-feedback-box good';
    fb.innerHTML = `
      <strong>Correct!</strong> Target volume = <strong>${q.answer} ${q.unit}</strong>. +60 XP earned! ⭐`;
    fb.classList.remove('hidden');
    showMascot(`Awesome work! You mastered the ${q.shape} formula! 🌟`);
  } else {
    fb.className = 'practice-feedback-box bad';
    fb.innerHTML = `
      <strong>Not quite.</strong> Target was ${q.answer} ${q.unit}. Click "Need a hint?" above!`;
    fb.classList.remove('hidden');
    showMascot('Keep experimenting! Click "Need a hint?" or test it in the Live Lab!');
  }
}

// ---------------------------------------------------------------------------
// Live Labs View: The Core Template
// ---------------------------------------------------------------------------
function inputByKey(f, key){
  return f.inputs.find(i=>i.k===key) || f.inputs[0];
}

function normInput(f, key, v){
  const inp = inputByKey(f, key);
  const val = Number.isFinite(v) ? v : inp.v;
  if(inp.log){
    const lo = Math.log10(inp.min), hi = Math.log10(inp.max);
    return Math.max(0, Math.min(1, (Math.log10(Math.max(inp.min, val)) - lo) / (hi - lo || 1)));
  }
  return Math.max(0, Math.min(1, (val - inp.min) / (inp.max - inp.min || 1)));
}

function clamp01(x){ return Math.max(0, Math.min(1, Number(x) || 0)); }

function sliderToValue(input, slider){
  if(!input.log) return Number(slider);
  const lo = Math.log10(input.min), hi = Math.log10(input.max);
  return 10**(lo + (hi - lo) * (Number(slider) / 1000));
}

function valueToSlider(input, value){
  if(!input.log) return value;
  const lo = Math.log10(input.min), hi = Math.log10(input.max);
  return ((Math.log10(Math.max(input.min, value)) - lo) / (hi - lo)) * 1000;
}

function applyPlaygroundValue(key, val){
  const inp = inputByKey(state.active, key);
  let num = Number(val);
  if(!Number.isFinite(num)) return;
  num = Math.max(inp.min, Math.min(inp.max, num));
  state.values[key] = num;
  updateLab();
  syncStandardControls();
}

function nudgePlaygroundValue(key, direction){
  const inp = inputByKey(state.active, key);
  const current = Number(state.values[key]);
  let next;
  if(inp.log){
    const lo = Math.log10(inp.min), hi = Math.log10(inp.max);
    const factor = 10**((hi - lo) / 50);
    next = direction > 0 ? current * factor : current / factor;
  } else {
    const step = inp.step || ((inp.max - inp.min) / 100);
    next = current + step * direction;
  }
  applyPlaygroundValue(key, next);
}

function blockCalculatedValue(f, block, result){
  if(block.role === 'output'){
    return { value: result.value, unit: f.unit || '' };
  }
  if(block.role === 'calculated'){
    if(f.id === 12) return { value: 1420.40575, unit: 'MHz' };
    if(f.id === 17 || f.id === 18) return { value: 1.327e20, unit: 'm³/s²' };
    if(f.id === 21) return { value: 299792, unit: 'km/s' };
  }
  return { value: null, unit: '' };
}

function getDynamicInsight(f, values, result){
  const v = Number(result?.value);
  if(!Number.isFinite(v)) return 'Calculated physical result.';
  if(f.id === 1){
    if(v < -50) return 'Slower than cosmic expansion alone (tugged toward us)';
    if(v > 50) return 'Faster than cosmic expansion alone (tugged away from us)';
    return 'Moving with the cosmic Hubble flow';
  }
  if(f.id === 2){
    return `Distance factor: ${(10**(v/5)).toFixed(0)}× baseline 10 pc distance`;
  }
  if(f.id === 3){
    if(v > 0.05) return `Overdense clump: ${(v*100).toFixed(0)}% above cosmic average`;
    if(v < -0.05) return `Underdense void: ${Math.abs(v*100).toFixed(0)}% below cosmic average`;
    return 'Matches average cosmic background density';
  }
  if(f.id === 4){
    return v < 0 ? 'Converging flow: collapsing onto mass attractor' : 'Diverging flow: expanding away from void';
  }
  if(f.id === 5){
    return 'Posterior belief updated with observational evidence';
  }
  if(f.id === 6){
    return v < 2 ? 'Good fit: model within expected noise' : 'High deviation: model differs significantly';
  }
  if(f.id === 7){
    return 'Wiener filter reconstructs signal from noisy background';
  }
  if(f.id === 8){
    const trans = Math.exp(-values.tau);
    return `Dimmed by ${((1-trans)*100).toFixed(0)}% due to dust extinction (${(trans*100).toFixed(0)}% survives)`;
  }
  if(f.id === 9){
    return 'Extinction curve scales inversely with wavelength';
  }
  if(f.id === 10){
    return `Color excess: blue light dimmed ${fmt(values.AB - values.AV)} mag more than visual`;
  }
  if(f.id === 11){
    const z = (values.obs - values.rest) / values.rest;
    return `Wave stretched by ${(1 + z).toFixed(3)}× cosmic expansion factor`;
  }
  if(f.id === 12){
    return `Redshifted 21-cm H I line shifted down from 1420.4 MHz`;
  }
  if(f.id === 13){
    return `Neutral gas mass reveals cold hydrogen reservoir`;
  }
  if(f.id === 14){
    return 'State transition propagated through time interval';
  }
  if(f.id === 15){
    return 'Measurement prediction mapped to observation space';
  }
  if(f.id === 16){
    return 'Kalman gain balances sensor noise against model confidence';
  }
  if(f.id === 17){
    return `Local gravitational acceleration toward central body`;
  }
  if(f.id === 18){
    return `Threshold speed needed to permanently leave gravity well`;
  }
  if(f.id === 19){
    return v >= 11.2 ? 'Sufficient for escape velocity trajectory' : v >= 7.8 ? 'Sufficient for low Earth orbit' : 'Suborbital velocity boost';
  }
  if(f.id === 20){
    return v >= 1 ? 'Radiation pressure exceeds gravity: sail accelerates outward!' : 'Gravity dominates: sail remains gravitationally bound';
  }
  if(f.id === 21){
    return `Radio latency: ${(v).toFixed(2)} hours one-way speed of light delay`;
  }
  if(f.id === 22){
    return `Electrons oscillate at ${fmt(v)} Hz (reflects waves below this cutoff)`;
  }
  if(f.id === 23){
    return `Debye sphere radius: charges shielded beyond ${fmt(v)} m`;
  }
  if(f.id === 24){
    return `Magnetic tension carries wave packet at ${fmt(v)} km/s`;
  }
  if(f.id === 25){
    return v >= 1 ? 'High beta: thermal plasma pressure dominates magnetic field' : 'Low beta: rigid magnetic field confines the plasma';
  }
  return `Physical output: ${fmt(v)} ${f.unit || ''}`;
}

function renderPlaygroundBlocks(f){
  const model = getPlaygroundBlocks(f.id);
  $('#playgroundStory').textContent = model.eli5Story;
  $('#storyIncreaseText').textContent = model.increases;
  $('#storyDecreaseText').textContent = model.decreases;
  $('#storyRealWorldText').textContent = model.realWorld;

  const result = f.calc(state.values);

  $('#playgroundBlocksWrap').innerHTML = model.blocks.map((block, idx)=>{
    if(block.operator){
      return `<div class="operator-badge" aria-hidden="true">${escapeHtml(block.operator)}</div>`;
    }
    const color = PLAY_COLORS[block.color] || PLAY_COLORS.indigo;

    if(block.role === 'input'){
      const inp = inputByKey(f, block.key);
      const rid = `pg-range-${f.id}-${idx}`;
      const nid = `pg-number-${f.id}-${idx}`;
      const curVal = state.values[block.key] !== undefined ? state.values[block.key] : inp.v;

      return `
        <article class="playground-block" style="--block-color:${color}" data-play-key="${escapeHtml(block.key)}">
          <button class="block-info" type="button" data-block-idx="${idx}" aria-label="Explain ${escapeHtml(block.name)} (${escapeHtml(block.subtitle)})">
            <span class="block-icon" aria-hidden="true">${block.icon}</span>
            <span>
              <strong>${escapeHtml(block.name)}</strong>
              <small>${escapeHtml(block.subtitle)}</small>
            </span>
          </button>
          <div class="block-value-row">
            <button class="block-nudge" data-dir="-1" type="button" aria-label="Decrease ${escapeHtml(block.name)}">−</button>
            <label class="sr-only" for="${nid}">${escapeHtml(block.name)} numeric value</label>
            <input id="${nid}" class="play-number" type="number" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${curVal}" aria-label="${escapeHtml(block.name)} numeric value">
            <span class="block-unit">${escapeHtml(inp.unit||'')}</span>
            <button class="block-nudge" data-dir="1" type="button" aria-label="Increase ${escapeHtml(block.name)}">+</button>
          </div>
          <label class="sr-only" for="${rid}">${escapeHtml(block.name)} slider</label>
          <input id="${rid}" class="play-range" type="range" min="${inp.log?0:inp.min}" max="${inp.log?1000:inp.max}" step="${inp.log?1:inp.step}" value="${valueToSlider(inp, curVal)}" aria-label="${escapeHtml(block.name)} slider">
        </article>`;
    }

    const display = blockCalculatedValue(f, block, result);
    return `
      <article class="playground-block calculated ${block.role==='output'?'output':''}" style="--block-color:${color}" data-play-role="${block.role}">
        <button class="block-info" type="button" data-block-idx="${idx}" aria-label="Explain ${escapeHtml(block.name)} (${escapeHtml(block.subtitle)})">
          <span class="block-icon" aria-hidden="true">${block.icon}</span>
          <span>
            <strong>${escapeHtml(block.name)}</strong>
            <small>${escapeHtml(block.subtitle)}</small>
          </span>
        </button>
        <div class="calculated-value" data-play-result>
          ${display.value === null ? 'fixed' : fmt(display.value)} <span>${escapeHtml(display.unit)}</span>
        </div>
        ${block.role === 'output' ? `
          <div class="block-insight-pill" id="playBlockInsightPill">
            <span class="check-pill-badge">✓</span>
            <span id="playBlockInsightText">${escapeHtml(getDynamicInsight(f, state.values, result))}</span>
          </div>
        ` : ''}
      </article>`;
  }).join('');

  $$('.playground-block[data-play-key]', $('#playgroundBlocksWrap')).forEach(block=>{
    const key = block.dataset.playKey;
    const inp = inputByKey(f, key);
    $('.play-range', block)?.addEventListener('input', e=>applyPlaygroundValue(key, sliderToValue(inp, e.target.value)));
    $('.play-number', block)?.addEventListener('change', e=>applyPlaygroundValue(key, e.target.value));
    $$('.block-nudge', block).forEach(btn=>btn.addEventListener('click', ()=>nudgePlaygroundValue(key, Number(btn.dataset.dir))));
  });

  $$('.block-info', $('#playgroundBlocksWrap')).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = Number(btn.dataset.blockIdx);
      const block = model.blocks[idx];
      showBlockExplanation(block, f);
      const card = btn.closest('.playground-block');
      $$('.playground-block', $('#playgroundBlocksWrap')).forEach(x=>x.classList.toggle('focused', x===card));
    });
  });
}

function showBlockExplanation(block, f){
  const explainer = $('#blockExplainer');
  const content = $('#explainerContent');
  if(!explainer || !content) return;

  const model = getPlaygroundBlocks(f.id);

  let valString = '';
  if(block.role === 'input'){
    const inp = inputByKey(f, block.key);
    valString = `<div class="explainer-val">Current Value: <b>${fmt(state.values[block.key])} ${escapeHtml(inp.unit||'')}</b></div>`;
  } else if(block.role === 'output'){
    const res = f.calc(state.values);
    valString = `<div class="explainer-val">Live Result: <b>${fmt(res.value)} ${escapeHtml(f.unit||'')}</b></div>`;
  }

  content.innerHTML = `
    <div class="explainer-body">
      <div class="explainer-title-row">
        <span class="explainer-icon">${block.icon}</span>
        <div>
          <h4>${escapeHtml(block.name)}</h4>
          <span class="explainer-symbol">${escapeHtml(block.subtitle)} · ${escapeHtml(model.scientificTitle)}</span>
        </div>
      </div>
      <p class="explainer-desc">${escapeHtml(block.desc || f.eli5)}</p>
      ${valString}
      <div class="explainer-analogy">
        <strong>Think of it like:</strong> ${escapeHtml(model.analogy)}
      </div>
      <div class="explainer-tip">
        💡 <em>Slide the block or use ± buttons to test how this variable influences the equation in real time.</em>
      </div>
    </div>`;

  explainer.classList.remove('hidden');
}

function syncPlaygroundFromState(result){
  if(!$('#playgroundBlocksWrap') || !state.active) return;
  $$('.playground-block[data-play-key]', $('#playgroundBlocksWrap')).forEach(block=>{
    const key = block.dataset.playKey;
    const inp = inputByKey(state.active, key);
    const value = state.values[key];
    $$('.play-number', block).forEach(el=>{
      if(document.activeElement !== el) el.value = inp.log ? Number(value.toPrecision(6)) : value;
    });
    $$('.play-range', block).forEach(el=>{
      if(document.activeElement !== el) el.value = valueToSlider(inp, value);
    });
  });
  const output = $('.playground-block.output [data-play-result]', $('#playgroundBlocksWrap'));
  if(output) output.innerHTML = `${fmt(result.value)} <span>${escapeHtml(state.active.unit||'')}</span>`;
  const insight = $('#playBlockInsightText');
  if(insight) insight.textContent = getDynamicInsight(state.active, state.values, result);
}

function syncStandardControls(){
  $$('.control', $('#controlList')).forEach(row=>{
    const key = row.dataset.key;
    const inp = inputByKey(state.active, key);
    const val = state.values[key];
    const range = $('.range', row);
    const num = $('.number', row);
    if(range && document.activeElement !== range) range.value = valueToSlider(inp, val);
    if(num && document.activeElement !== num) num.value = inp.log ? Number(val.toPrecision(6)) : val;
  });
}

function svgWave({x=80,y=180,width=720,amp=28,cycles=7,color='#0ea5e9',opacity=1}={}){
  const pts = [];
  for(let i=0; i<=120; i++){
    const px = x + width * i / 120;
    const py = y + Math.sin(i / 120 * Math.PI * 2 * cycles) * amp;
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity="${opacity}"/>`;
}

function stageFrame(inner, title, caption){
  return `
    <svg class="stage-svg" viewBox="0 0 900 360" role="img" aria-label="${escapeHtml(title)}">
      <title>${escapeHtml(title)}</title>
      <desc>${escapeHtml(caption)}</desc>
      <defs>
        <marker id="stageArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#64748b"/>
        </marker>
      </defs>
      <rect x="1" y="1" width="898" height="358" rx="28" class="stage-bg"/>
      ${inner}
    </svg>`;
}

function renderVisualStage(f, values, result){
  const model = getPlaygroundBlocks(f.id);
  const t = model.stageType;
  const n = k => normInput(f, k, values[k]);
  const safeResult = Number.isFinite(result.value) ? result.value : 0;
  let inner = '';
  const label = (x, y, text, cls='stage-label') => `<text x="${x}" y="${y}" class="${cls}">${escapeHtml(text)}</text>`;

  if(t === 'expanding-grid'){
    const spread = 55 + n('H0') * 45, tug = Math.max(-70, Math.min(70, safeResult / 50));
    const lines = [-2,-1,0,1,2].map(i=>`<line x1="450" y1="180" x2="${450+i*spread*1.9}" y2="${180+i*spread*.55}" class="grid-ray"/>`).join('');
    const dots = [-2,-1,0,1,2].map(i=>`<circle cx="${450+i*spread}" cy="${180+i*22}" r="8" class="galaxy-dot stage-drift" style="--drift:${i*4}px"/>`).join('');
    inner = `${lines}${dots}<circle cx="450" cy="180" r="18" class="home-dot"/>${label(418,220,'YOU')}<line x1="700" y1="115" x2="${700+tug}" y2="115" class="tug-arrow"/>${label(620,92,'local gravity tug')} ${label(60,315,`Hubble flow ≈ ${fmt(values.H0*values.d)} km/s`)}${label(610,315,`peculiar ≈ ${fmt(safeResult)} km/s`,'stage-value')}`;
  } else if(t === 'distance-ladder'){
    const dist = n('d'), x = 150 + dist * 600, glow = 38 - dist * 22;
    inner = `<line x1="125" y1="245" x2="780" y2="245" class="ruler"/>${[0,1,2,3,4,5].map(i=>`<line x1="${125+i*131}" y1="235" x2="${125+i*131}" y2="255" class="tick"/>`).join('')}<circle cx="125" cy="135" r="35" class="standard-star"/><circle cx="${x}" cy="135" r="${Math.max(8,glow)}" class="seen-star stage-pulse"/>${label(80,305,'near')} ${label(735,305,'far')} ${label(70,70,'same kind of light source')} ${label(x-75,205,`μ = ${fmt(safeResult)} mag`,'stage-value')}`;
  } else if(t === 'density-bubbles'){
    const local = n('rho'), mean = n('mean');
    inner = `<circle cx="265" cy="175" r="${55+local*60}" class="density-local stage-pulse"/><circle cx="635" cy="175" r="${55+mean*60}" class="density-mean"/>${label(205,315,'Stuff here ρ')}${label(570,315,'Average ρ̄')}${label(390,65,safeResult>=0?'OVERDENSE CLUMP':'UNDERDENSE VOID','stage-value')}${label(405,95,`δ = ${fmt(safeResult)}`)}`;
  } else if(t === 'flow-field'){
    const converge = values.delta >= 0, centerX = 450, centerY = 180;
    const arrows = [[170,80],[450,65],[730,80],[170,280],[450,295],[730,280]].map(([x,y])=>{
      const dx = (centerX - x) * .48, dy = (centerY - y) * .48;
      const x2 = converge ? x + dx : x - dx * .55;
      const y2 = converge ? y + dy : y - dy * .55;
      return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" class="flow-arrow"/>`;
    }).join('');
    inner = `<circle cx="450" cy="180" r="62" class="flow-core ${converge?'dense':'void'}"/>${arrows}${label(345,55,converge?'arrows converge → overdensity':'arrows spread → underdensity','stage-value')}${label(370,335,`∇·v = ${fmt(safeResult)} km/s/Mpc`)}`;
  } else if(t === 'belief-scale'){
    const post = clamp01(safeResult), angle = (.5 - post) * 24;
    inner = `<g transform="translate(450 195) rotate(${angle})"><rect x="-260" y="-8" width="520" height="16" rx="8" class="scale-bar"/><circle cx="-190" cy="-45" r="${25+n('prior')*30}" class="belief-prior"/><circle cx="190" cy="-45" r="${25+post*30}" class="belief-post"/></g><path d="M450 198 L405 290 L495 290 Z" class="scale-stand"/>${label(160,90,'starting belief')}${label(630,90,'updated belief')}${label(390,330,`posterior ${fmt(post)}`,'stage-value')}`;
  } else if(t === 'uncertainty-target'){
    const sigma = 20 + n('sigma') * 90, predX = 450, obsX = 450 + Math.max(-250, Math.min(250, (values.d - values.m) * 18));
    inner = `${[145,105,65].map(r=>`<circle cx="450" cy="180" r="${r}" class="target-ring"/>`).join('')}<circle cx="${predX}" cy="180" r="10" class="predict-dot"/><circle cx="${obsX}" cy="180" r="12" class="observe-dot"/><circle cx="${predX}" cy="180" r="${sigma}" class="sigma-ring"/>${label(365,55,'prediction ± uncertainty')}${label(350,330,`χ² = ${fmt(safeResult)}`,'stage-value')}`;
  } else if(t === 'signal-sieve'){
    const noise = n('N'), gain = Math.abs(safeResult) / (Math.abs(values.d) || 1);
    const dots = Array.from({length:30}, (_,i)=>`<circle cx="${90+(i*73)%720}" cy="${70+((i*47)%210)}" r="${2+noise*5}" class="noise-dot" opacity="${.2+noise*.55}"/>`).join('');
    inner = `${dots}${svgWave({x:80,y:170,width:300,amp:30+n('S')*25,cycles:4,color:'#6366f1'})}<path d="M420 70 L540 70 L505 290 L455 290 Z" class="sieve"/>${svgWave({x:560,y:180,width:260,amp:12+gain*28,cycles:3,color:'#10b981'})}${label(110,320,'noisy data')}${label(430,320,'signal + noise model')}${label(650,320,'estimate')}`;
  } else if(t === 'dust-filter' || t === 'dust-extinction'){
    const tau = values.tau, op = .15 + .12 * Math.min(6, tau), transmission = Math.exp(-tau), width = 18 + tau * 11;
    inner = `<circle cx="105" cy="180" r="38" class="source-glow stage-pulse"/><rect x="375" y="55" width="${width}" height="250" rx="18" class="dust-curtain" opacity="${op}"/><line x1="145" y1="180" x2="375" y2="180" class="photon-beam"/><line x1="${375+width}" y1="180" x2="800" y2="180" class="photon-beam" opacity="${Math.max(.05,transmission)}"/><rect x="800" y="115" width="36" height="130" rx="10" class="detector"/>${label(55,300,'source')}${label(360,330,'dust curtain')}${label(770,300,'detector')}${label(590,75,`${fmt(transmission*100)}% survives`,'stage-value')}`;
  } else if(t === 'color-prism'){
    const e = values.AB - values.AV, shift = Math.max(-80, Math.min(80, e * 35));
    inner = `<rect x="110" y="100" width="210" height="55" rx="18" class="blue-band"/><rect x="110" y="210" width="210" height="55" rx="18" class="visual-band"/><polygon points="420,70 520,180 420,290" class="prism"/><line x1="530" y1="180" x2="${760+shift}" y2="180" class="reddening-arrow"/>${label(145,135,`A_B ${fmt(values.AB)} mag`)}${label(145,245,`A_V ${fmt(values.AV)} mag`)}${label(590,145,`E(B−V) = ${fmt(e)}`,'stage-value')}`;
  } else if(t === 'wave-stretch'){
    const z = (values.obs - values.rest) / values.rest, cyclesRest = 8, cyclesObs = Math.max(2, cyclesRest / (1 + Math.max(-.8, z)));
    inner = `${svgWave({x:80,y:115,width:720,amp:24,cycles:cyclesRest,color:'#0ea5e9'})}${svgWave({x:80,y:245,width:720,amp:24,cycles:cyclesObs,color:'#f43f5e'})}${label(75,65,'rest wavelength')}${label(75,195,'observed wavelength')}${label(650,325,`z = ${fmt(z)}`,'stage-value')}`;
  } else if(t === 'radio-dish'){
    const freq = safeResult;
    inner = `<ellipse cx="160" cy="180" rx="95" ry="65" class="radio-galaxy"/><g class="radio-waves stage-wave">${[0,1,2,3].map(i=>`<path d="M260 ${135+i*30} Q440 ${90+i*25} 640 ${135+i*30}" class="radio-wave"/>`).join('')}</g><path d="M705 105 Q790 180 705 255" class="dish"/><line x1="705" y1="180" x2="660" y2="180" class="dish-arm"/>${label(75,300,'hidden H I galaxy')}${label(640,300,'radio dish')}${label(590,70,`${fmt(freq)} MHz`,'stage-value')}`;
  } else if(t === 'hi-mass'){
    const size = 65 + n('D') * 15 + Math.min(60, n('flux') * 45), mass = safeResult;
    inner = `<ellipse cx="270" cy="180" rx="${size*1.5}" ry="${size*.72}" class="hi-disk stage-pulse"/><ellipse cx="270" cy="180" rx="${size*.6}" ry="${size*.28}" class="stellar-disk"/><line x1="420" y1="180" x2="740" y2="180" class="distance-beam"/><path d="M770 120 Q835 180 770 240" class="dish"/>${label(130,315,'neutral hydrogen disk')}${label(690,315,`${fmt(values.D)} Mpc away`)}${label(570,70,`${fmt(mass)} M☉ H I`,'stage-value')}`;
  } else if(t === 'state-predictor'){
    const x0 = 190 + normInput(f, 'x') * 180, x1 = 430 + clamp01((safeResult + 20) / 40) * 180;
    inner = `<line x1="100" y1="210" x2="800" y2="210" class="state-track"/><circle cx="${x0}" cy="210" r="20" class="state-current"/><line x1="${x0+20}" y1="210" x2="${x1-20}" y2="210" class="predict-arrow"/><circle cx="${x1}" cy="210" r="23" class="state-next stage-pulse"/><path d="M700 80 Q770 115 700 150" class="sensor-ping"/>${label(x0-55,265,'current state')}${label(x1-45,265,'predicted next')}${label(640,60,'sensor sees a related state')}`;
  } else if(t === 'kalman-ping'){
    const predX = 250, measX = 650, gain = Math.max(0, Math.min(1, values.P * values.H / (values.H * values.H * values.P + values.R))), updX = predX + (measX - predX) * gain;
    inner = `<line x1="130" y1="190" x2="770" y2="190" class="state-track"/><circle cx="${predX}" cy="190" r="24" class="predict-dot"/><circle cx="${measX}" cy="190" r="24" class="observe-dot"/><circle cx="${updX}" cy="190" r="28" class="updated-dot stage-pulse"/>${label(200,255,'prediction')}${label(610,255,'sensor')}${label(updX-50,130,'updated state','stage-value')}${label(365,320,`Kalman gain ≈ ${fmt(gain)}`)}`;
  } else if(t === 'gravity-well'){
    const r = n('r'), pull = Math.max(.15, 1 - r * .82);
    inner = `<circle cx="450" cy="180" r="58" class="sun stage-pulse"/>${[105,145,190].map(rr=>`<circle cx="450" cy="180" r="${rr}" class="gravity-ring"/>`).join('')}<circle cx="${650+r*120}" cy="180" r="13" class="probe"/><line x1="${640+r*120}" y1="180" x2="${640+r*120-150*pull}" y2="180" class="gravity-arrow"/>${label(390,330,`|a| = ${fmt(safeResult)} m/s²`,'stage-value')}`;
  } else if(t === 'orbit-ellipse'){
    const r = n('r'), simAngle = ((state.simTime || 0) * 3.6), angle = 25 + r * 280 + simAngle, rad = (angle % 360) * Math.PI / 180, cx = 450 + 260 * Math.cos(rad), cy = 180 + 105 * Math.sin(rad);
    inner = `<ellipse cx="450" cy="180" rx="270" ry="110" class="orbit-line"/><circle cx="360" cy="180" r="34" class="sun"/><circle cx="${cx}" cy="${cy}" r="13" class="probe stage-drift"/><line x1="${cx}" y1="${cy}" x2="${cx+80}" y2="${cy-25}" class="speed-arrow"/>${label(340,330,`orbital speed ${fmt(safeResult)} km/s`,'stage-value')}`;
  } else if(t === 'escape-trajectory'){
    const speed = Math.min(1, safeResult / 190);
    inner = `<circle cx="215" cy="180" r="42" class="sun"/><path d="M265 180 Q460 65 610 180 Q470 295 265 180" class="bound-path"/><path d="M265 180 Q500 ${145-speed*70} 820 ${90-speed*35}" class="escape-path"/><circle cx="330" cy="150" r="12" class="probe"/>${label(520,315,'ellipse returns')}${label(650,80,'escape keeps going')}${label(370,55,`vesc = ${fmt(safeResult)} km/s`,'stage-value')}`;
  } else if(t === 'rocket-blast'){
    const ratio = values.m0 / values.mf;
    const rAngle = state.lab19Angle !== undefined ? state.lab19Angle : -42;
    const tBoost = state.lab19ThrustBoost !== undefined ? state.lab19ThrustBoost : 1.0;
    const flameFlicker = Math.sin(((state.simTime || 0) * 0.4) * Math.PI) * 12;
    const flame = (45 + Math.min(190, Math.abs(safeResult) * 18) + flameFlicker) * tBoost;
    const fuelPct = Math.round(Math.max(5, Math.min(95, (values.mf / values.m0) * 100)));
    const velMs = Math.round(safeResult * 1000);
    const simClimb = ((state.simTime || 0) * 0.8 - 40);
    const rX = 460 + Math.cos((rAngle - 90) * Math.PI / 180) * simClimb * 0.4;
    const rY = 195 + Math.sin((rAngle - 90) * Math.PI / 180) * simClimb * 0.4;
    inner = `
      <defs>
        <radialGradient id="rocketSky" cx="70%" cy="30%" r="90%">
          <stop offset="0%" stop-color="#0f172a"/><stop offset="60%" stop-color="#020617"/><stop offset="100%" stop-color="#000000"/>
        </radialGradient>
        <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f8fafc"/><stop offset="50%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
        <linearGradient id="rocketFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="25%" stop-color="#fef08a"/><stop offset="60%" stop-color="#f97316"/><stop offset="100%" stop-color="#ef4444"/>
        </linearGradient>
      </defs>
      ${[...Array(16)].map((_, i) => `<circle cx="${(i * 59 + 23) % 860}" cy="${(i * 37 + 19) % 320}" r="${(i % 3 === 0) ? 2 : 1.2}" fill="#ffffff" opacity="${0.4 + (i % 5) * 0.15}"/>`).join('')}
      <g transform="translate(40, 25)">
        <rect width="180" height="65" rx="10" fill="#0f172a" fill-opacity="0.88" stroke="#334155" stroke-width="1.5"/>
        <text x="14" y="24" fill="#94a3b8" font-size="11" font-weight="600" text-transform="uppercase" letter-spacing="0.5">Propellant Tank</text>
        <text x="14" y="48" fill="#38bdf8" font-size="19" font-weight="800">${fuelPct}%</text>
        <text x="65" y="47" fill="#cbd5e1" font-size="11">mass remaining</text>
        <rect x="14" y="53" width="150" height="5" rx="2.5" fill="#1e293b"/>
        <rect x="14" y="53" width="${Math.min(150, 1.5 * fuelPct)}" height="5" rx="2.5" fill="#38bdf8"/>
      </g>
      <g transform="translate(630, 25)">
        <rect width="220" height="65" rx="10" fill="#0f172a" fill-opacity="0.88" stroke="#334155" stroke-width="1.5"/>
        <text x="14" y="24" fill="#94a3b8" font-size="11" font-weight="600" text-transform="uppercase" letter-spacing="0.5">Current Velocity Gain</text>
        <text x="14" y="48" fill="#10b981" font-size="19" font-weight="800">${fmt(safeResult)} km/s</text>
        <text x="135" y="47" fill="#94a3b8" font-size="11">(${velMs.toLocaleString()} m/s)</text>
      </g>
      <g id="lab19RocketGroup" class="interactive-rocket" transform="translate(${rX.toFixed(1)}, ${rY.toFixed(1)}) rotate(${rAngle})" role="button" tabindex="0" aria-label="Interactive rocket. Drag to adjust launch trajectory angle.">
        <g id="lab19ExhaustGroup" class="interactive-exhaust" role="button" tabindex="0" title="Click to boost exhaust">
          <path d="M-16 65 Q-25 ${70 + flame * 0.6} 0 ${75 + flame} Q25 ${70 + flame * 0.6} 16 65 Z" fill="url(#rocketFlameGrad)" class="stage-pulse"/>
          <path d="M-8 65 Q-12 ${70 + flame * 0.4} 0 ${72 + flame * 0.7} Q12 ${70 + flame * 0.4} 8 65 Z" fill="#ffffff" opacity="0.9"/>
        </g>
        <path d="M0 -65 L24 15 L16 65 L-16 65 L-24 15 Z" fill="url(#rocketBodyGrad)" stroke="#cbd5e1" stroke-width="1.5"/>
        <polygon points="-16,40 -34,68 -16,65" fill="#ef4444"/>
        <polygon points="16,40 34,68 16,65" fill="#ef4444"/>
        <circle cx="0" cy="-5" r="9" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
        <circle cx="2" cy="-7" r="2.5" fill="#ffffff"/>
      </g>
      <g transform="translate(40, 260)">
        <rect width="280" height="28" rx="14" fill="#0f172a" fill-opacity="0.92" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="14" y="18" fill="#38bdf8" font-size="11" font-weight="700">🚀 Pitch: ${Math.abs(Math.round(rAngle))}° · Drag rocket to aim · Click flame to boost</text>
      </g>
      <g transform="translate(40, 298)">
        <rect width="125" height="24" rx="12" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1"/>
        <text x="14" y="16" fill="#34d399" font-size="11" font-weight="600">✓ Burn active</text>
      </g>
      <g transform="translate(175, 298)">
        <rect width="145" height="24" rx="12" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1"/>
        <text x="14" y="16" fill="#38bdf8" font-size="11" font-weight="600">✓ Mass ratio: ${fmt(ratio)}</text>
      </g>
      <g transform="translate(330, 298)">
        <rect width="160" height="24" rx="12" fill="#a855f7" fill-opacity="0.15" stroke="#a855f7" stroke-width="1"/>
        <text x="14" y="16" fill="#c084fc" font-size="11" font-weight="600">✓ Δv: ${fmt(safeResult)} km/s</text>
      </g>
    `;
  } else if(t === 'solar-sail'){
    const beta = Math.max(.1, Math.min(10, safeResult));
    const sail = 55 + n('A') * 65;
    const acceleratesOut = safeResult >= 1;
    const sTilt = state.lab20TiltAngle !== undefined ? state.lab20TiltAngle : 0;
    const rad = (sTilt * Math.PI) / 180;
    const effThrust = Math.cos(rad) ** 2;
    const pushLen = Math.min(160, 45 * beta * effThrust);
    const pushDx = pushLen * Math.cos(rad);
    const pushDy = pushLen * Math.sin(rad);
    const simDrift = (acceleratesOut ? 1 : -0.2) * ((state.simTime || 0) * 1.5 - 75);
    const sailX = Math.max(380, Math.min(780, 610 + simDrift));
    inner = `
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="90%" stop-color="#b45309"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="sailMirror" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0f2fe"/><stop offset="45%" stop-color="#7dd3fc"/><stop offset="85%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="180" r="80" fill="url(#sunGlow)" class="stage-pulse"/>
      <circle cx="120" cy="180" r="42" fill="#fbbf24"/>
      ${[0, 1, 2, 3, 4].map(i => `<line x1="170" y1="${100 + i * 40}" x2="${sailX - 50}" y2="${100 + i * 40}" stroke="#fbbf24" stroke-width="2" stroke-dasharray="8 6" opacity="0.8" class="stage-drift"/>`).join('')}
      <g id="lab20SailGroup" class="interactive-sail" transform="translate(${sailX.toFixed(1)}, 180) rotate(${sTilt})" role="button" tabindex="0" aria-label="Interactive solar sail. Drag up/down to tilt angle.">
        <polygon points="0,-${sail} 55,0 0,${sail} -20,0" fill="url(#sailMirror)" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 0 12px rgba(56,189,248,0.5))"/>
        <line x1="0" y1="-${sail}" x2="0" y2="${sail}" stroke="#0369a1" stroke-width="2"/>
        <line x1="-20" y1="0" x2="55" y2="0" stroke="#0369a1" stroke-width="2"/>
        <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
      </g>
      <line x1="${sailX + 55}" y1="160" x2="${sailX + 55 + Math.max(10, pushDx)}" y2="${160 + pushDy}" stroke="#10b981" stroke-width="3.5" marker-end="url(#stageArrow)"/>
      <text x="${sailX + 60}" y="150" fill="#34d399" font-size="12" font-weight="700">Light Push (F_rad) →</text>
      <line x1="${sailX - 20}" y1="200" x2="${sailX - 90}" y2="200" stroke="#f43f5e" stroke-width="3"/>
      <text x="${sailX - 180}" y="215" fill="#f43f5e" font-size="12" font-weight="700">Gravity Pull (F_grav) ←</text>
      <g transform="translate(450, 35)">
        <rect width="380" height="55" rx="10" fill="#0f172a" fill-opacity="0.88" stroke="#334155" stroke-width="1.5"/>
        <text x="14" y="23" fill="#94a3b8" font-size="11" font-weight="600" text-transform="uppercase">Lightness Number β</text>
        <text x="14" y="45" fill="${acceleratesOut ? '#34d399' : '#f59e0b'}" font-size="16" font-weight="800">β = ${fmt(safeResult)} · ${acceleratesOut ? 'Sail accelerates outward! (β > 1)' : 'Gravity dominates (β < 1)'}</text>
      </g>
      <g transform="translate(450, 96)">
        <rect width="380" height="30" rx="15" fill="#0f172a" fill-opacity="0.92" stroke="#10b981" stroke-width="1.2"/>
        <text x="14" y="19" fill="#34d399" font-size="11" font-weight="700">⛵ Sail Tilt: ${sTilt}° · Effective Push: ${(effThrust * 100).toFixed(0)}% (Drag sail up/down to tilt)</text>
      </g>
    `;
  } else if(t === 'light-time'){
    const d = n('d'), probeX = 350 + d * 420;
    inner = `<circle cx="120" cy="180" r="42" class="earth"/><circle cx="${probeX}" cy="180" r="16" class="probe stage-drift"/><line x1="165" y1="180" x2="${probeX-20}" y2="180" class="radio-ping stage-wave"/>${label(82,245,'Earth')}${label(probeX-38,245,'probe')}${label(340,80,`${fmt(safeResult)} hours one way`,'stage-value')}`;
  } else if(t === 'plasma-wave'){
    const density = n('ne'), count = 12 + Math.round(density * 18);
    const simPhase = ((state.simTime || 0) * 0.1);
    const ripples = (state.lab22Perturbations || []).slice(-4).map(p =>
      `<circle cx="${p.x}" cy="${p.y}" r="${Math.min(80, 20 + ((Date.now() - p.time)/30)%60)}" class="ripple-wave-circle" fill="none" stroke="#38bdf8" stroke-width="2.5"/>`
    ).join('');
    inner = `
      <defs>
        <linearGradient id="plasmaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#818cf8"/><stop offset="50%" stop-color="#c084fc"/><stop offset="100%" stop-color="#f43f5e"/>
        </linearGradient>
      </defs>
      <g id="lab22PlasmaGroup" class="plasma-stage-interactive">
        ${Array.from({length:count}, (_,i)=>{
          const oscX = Math.sin(simPhase * Math.PI * 2 + i) * 6;
          const oscY = Math.cos(simPhase * Math.PI * 2 + i * 1.3) * 6;
          return `<circle cx="${100+(i*67)%700 + oscX}" cy="${70+((i*47)%220) + oscY}" r="5" fill="#38bdf8" opacity="0.75" class="stage-pulse plasma-particle-clickable" data-p-idx="${i}" style="animation-delay:${(i%5)*-0.2}s"/>`;
        }).join('')}
        ${ripples}
        ${[-40, 0, 40].map(off => `<path d="M80 ${180+off} Q450 ${130+off} 820 ${180+off}" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.5"/>`).join('')}
        ${svgWave({x:90, y:180, width:720, amp:28+18*density, cycles:4+Math.round(density*8), color:'#6366f1', opacity:0.9})}
        <g transform="translate(450, 180)">
          <circle cx="0" cy="0" r="50" fill="#38bdf8" fill-opacity="0.12" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4 3" class="stage-pulse"/>
          <polygon points="-15,-8 15,-8 22,0 15,8 -15,8 -8,0" fill="#f8fafc" stroke="#2563eb" stroke-width="1.5"/>
          <line x1="-12" y1="-18" x2="-12" y2="18" stroke="#3b82f6" stroke-width="2"/>
          <line x1="12" y1="-18" x2="12" y2="18" stroke="#3b82f6" stroke-width="2"/>
        </g>
      </g>
      <g transform="translate(280, 35)">
        <rect width="320" height="45" rx="8" fill="#0f172a" fill-opacity="0.88" stroke="#334155" stroke-width="1.5"/>
        <text x="16" y="28" fill="#a5b4fc" font-size="14" font-weight="700">Electron Plasma Frequency: ${fmt(safeResult)} Hz</text>
      </g>
      <g transform="translate(280, 295)">
        <rect width="340" height="28" rx="14" fill="#0f172a" fill-opacity="0.92" stroke="#a855f7" stroke-width="1.2"/>
        <text x="16" y="18" fill="#c084fc" font-size="11" font-weight="700">⚡ Click particles to inject electric perturbations!</text>
      </g>
    `;
  } else if(t === 'debye-bubble'){
    const rr = 55 + Math.min(130, normInput(f, 'Te') * 85 + (1 - normInput(f, 'ne')) * 45);
    inner = `<circle cx="450" cy="180" r="16" class="charge-dot"/><circle cx="450" cy="180" r="${rr}" class="debye-shell stage-pulse"/>${Array.from({length:14}, (_,i)=>{const a=i/14*Math.PI*2,r=rr+25;return `<circle cx="${450+Math.cos(a)*r}" cy="${180+Math.sin(a)*r}" r="5" class="electron-dot"/>`;}).join('')}${label(315,330,`λD = ${fmt(safeResult)} m`,'stage-value')}`;
  } else if(t === 'alfven-wave'){
    const speed = Math.min(1, Math.abs(safeResult) / 300);
    inner = `${[-70,-35,0,35,70].map(off=>`<path d="M90 ${180+off} C300 ${130+off-speed*20} 560 ${230+off+speed*20} 810 ${180+off}" class="field-line"/>`).join('')}<circle cx="250" cy="180" r="12" class="wave-packet stage-wave"/><line x1="260" y1="115" x2="${260+220*speed}" y2="115" class="speed-arrow"/>${label(345,330,`vA = ${fmt(safeResult)} km/s`,'stage-value')}`;
  } else if(t === 'pressure-balance'){
    const beta = Math.max(.05, Math.min(8, Math.abs(safeResult))), left = Math.min(240, 70 + beta * 45), right = Math.min(240, 70 + (1 / beta) * 45);
    inner = `<line x1="450" y1="100" x2="450" y2="275" class="balance-divider"/><line x1="${450-left}" y1="180" x2="440" y2="180" class="thermal-arrow"/><line x1="${450+right}" y1="180" x2="460" y2="180" class="magnetic-arrow"/>${label(120,115,'thermal pressure')}${label(625,115,'magnetic pressure')}${label(375,325,`β = ${fmt(safeResult)}`,'stage-value')}`;
  } else {
    inner = `${label(320,180,'Interactive visual loading…','stage-value')}`;
  }

  $('#playgroundStage').innerHTML = stageFrame(inner, `${model.publicTitle} visual playground`, `${model.eli5Story} Visual is conceptual and not to scale.`);
  $('#stageCaption').textContent = `Real-time physical simulation · ${model.eli5Story}`;
}

function openFormula(id){
  const f = formulas.find(x=>x.id===id);
  if(!f) return;
  state.active = f;
  state.progress.lastActive = id;
  state.values = Object.fromEntries(f.inputs.map(i=>[i.k, i.v]));
  saveProgress();

  const meta = getPlaygroundBlocks(f.id);
  $('#labSelect').value = String(f.id);
  $('#labTrack').textContent = meta.category.toUpperCase();
  $('#labTrack').style.color = categoryColor(meta.category);
  $('#labNumBadge').textContent = `LAB ${String(f.id).padStart(2,'0')}`;
  $('#labConceptTitle').textContent = meta.publicTitle;
  $('#labFormalTitle').textContent = meta.scientificTitle;
  $('#labSubtitle').textContent = meta.question;

  $('#equationDisplay').innerHTML = `\\[${f.tex}\\]`;
  $('#eli5').textContent = f.eli5;
  $('#mentalModel').textContent = f.mental;
  $('#whyMatters').textContent = f.why;
  $('#workedExample').textContent = f.example;
  $('#symbolList').innerHTML = f.symbols.map(([s,d])=>`<div class="symbol-row"><b>${escapeHtml(s)}</b><span>${escapeHtml(d)}</span></div>`).join('');
  $('#deriveSteps').innerHTML = (f.derive||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('');
  $('#unitNote').textContent = f.unitNote || 'Keep every term dimensionally compatible.';
  $('#assumptionList').innerHTML = (f.assumptions||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('');
  $('#outputLabel').textContent = f.output;
  $('#deriveSelfCheck').checked = deriveSet().has(id);
  $('#notebookLabId').textContent = String(id).padStart(2,'0');
  $('#labNotes').value = state.progress.notes[id] || '';
  $('#notesSaved').textContent = '';

  updateBookmarkButton();
  updateLabCarouselActive(id);
  renderStageLegend(f);
  renderWorkedExample(f);
  renderLearnoMascot(f);
  renderKeepExploring(f);
  renderControls();
  renderPlaygroundBlocks(f);
  populateSweep();
  updateLab();
  makeUnitMini();
  $('#blockExplainer').classList.add('hidden');

  typeset([$('#equationDisplay')]);
}

function updateBookmarkButton(){
  const id = state.active.id;
  const isBookmarked = bookmarkSet().has(id);
  const btn = $('#bookmarkBtn');
  btn.textContent = isBookmarked ? '★ Bookmarked' : '☆ Bookmark';
  btn.classList.toggle('active', isBookmarked);
}

function renderControls(){
  const f = state.active;
  $('#controlList').innerHTML = f.inputs.map(inp=>`
    <div class="control" data-key="${inp.k}">
      <label><span>${escapeHtml(inp.label)}</span><small>${escapeHtml(inp.unit||'dimensionless')}</small></label>
      <input class="range" aria-label="${escapeHtml(inp.label)} slider" type="range" min="${inp.log?0:inp.min}" max="${inp.log?1000:inp.max}" step="${inp.log?1:inp.step}" value="${valueToSlider(inp, state.values[inp.k])}">
      <input class="number" aria-label="${escapeHtml(inp.label)} numeric value" type="number" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${state.values[inp.k]}">
    </div>`).join('');

  $$('.control', $('#controlList')).forEach(row=>{
    const key = row.dataset.key;
    const inp = f.inputs.find(i=>i.k===key);
    const range = $('.range', row);
    const num = $('.number', row);

    range.addEventListener('input', ()=>{
      const v = sliderToValue(inp, range.value);
      state.values[key] = v;
      num.value = inp.log ? Number(v.toPrecision(6)) : v;
      updateLab();
      syncPlaygroundFromState(f.calc(state.values));
    });

    num.addEventListener('input', ()=>{
      let v = Number(num.value);
      if(!Number.isFinite(v)) return;
      v = Math.max(inp.min, Math.min(inp.max, v));
      state.values[key] = v;
      num.value = String(v);
      range.value = valueToSlider(inp, v);
      updateLab();
      syncPlaygroundFromState(f.calc(state.values));
    });
  });
}

function validateActive(){
  const f = state.active, v = state.values;
  if(Object.values(v).some(x=>!Number.isFinite(Number(x)))){
    return {kind:'bad', text:'One or more inputs are not finite numbers.'};
  }
  if(f.id === 10){
    const e = v.AB - v.AV;
    if(Math.abs(e) < 1e-12) return {kind:'warn', text:'E(B-V)=0, so R_V is undefined. The color-excess result itself is still valid.'};
    if(e < 0) return {kind:'warn', text:'A_B < A_V gives negative color excess; that is not the ordinary dust-reddening case.'};
  }
  if(f.id === 11){
    const z = (v.obs - v.rest) / v.rest;
    if(Math.abs(z) > 0.1) return {kind:'warn', text:'Redshift is valid, but the simple v approx cz teaching approximation is intentionally suppressed beyond |z|=0.1.'};
  }
  if(f.id === 17){
    const inside = (2 / (v.r * AU) - 1 / (v.a * AU));
    if(inside <= 0) return {kind:'bad', text:'This positive-a combination makes the vis-viva square-root argument nonpositive. Increase a or reduce r.'};
  }
  if(f.id === 19 && v.m0 <= v.mf){
    return {kind:'bad', text:'Rocket equation requires initial mass m0 to be greater than final mass mf.'};
  }
  return {kind:'good', text:'Inputs are valid for this physical formula model.'};
}

function updateLab(){
  const result = state.active.calc(state.values);
  $('#outputValue').textContent = fmt(result.value);
  $('#outputUnit').textContent = [state.active.unit, result.extra].filter(Boolean).join(' | ');

  const val = validateActive();
  const line = $('#validationLine');
  line.textContent = val.text;
  line.className = `validation-line ${val.kind}`;

  renderPlot();
  syncPlaygroundFromState(result);
  renderVisualStage(state.active, state.values, result);
}

function populateSweep(){
  $('#sweepSelect').innerHTML = state.active.inputs.map(i=>`<option value="${i.k}">${escapeHtml(i.label)}</option>`).join('');
  $('#sweepName').textContent = state.active.inputs[0].label;
}

function renderPlot(){
  const f = state.active;
  const key = $('#sweepSelect').value || f.inputs[0].k;
  const inp = f.inputs.find(i=>i.k===key) || f.inputs[0];
  $('#sweepName').textContent = inp.label;
  const base = { ...state.values };
  const pts = [];

  for(let i=0; i<48; i++){
    let x;
    if(inp.log){
      const lo = Math.log10(inp.min), hi = Math.log10(inp.max);
      x = 10**(lo + (hi - lo) * i / 47);
    } else {
      x = inp.min + (inp.max - inp.min) * i / 47;
    }
    const y = f.calc({ ...base, [inp.k]: x }).value;
    if(Number.isFinite(y)) pts.push({ x, y });
  }

  const svg = $('#sensitivityPlot');
  if(pts.length < 2){
    svg.innerHTML = '<text x="30" y="90" fill="#8fa4b7">No finite sweep for this input range.</text>';
    return;
  }

  let ymin = Math.min(...pts.map(p=>p.y)), ymax = Math.max(...pts.map(p=>p.y));
  if(ymin === ymax){ ymin -= 1; ymax += 1; }
  const xMin = inp.log ? Math.log10(inp.min) : inp.min;
  const xMax = inp.log ? Math.log10(inp.max) : inp.max;
  const xMap = x => 28 + ((inp.log ? Math.log10(x) : x) - xMin) / (xMax - xMin || 1) * 466;
  const yMap = y => 150 - (y - ymin) / (ymax - ymin || 1) * 118;
  const points = pts.map(p=>`${xMap(p.x)},${yMap(p.y)}`).join(' ');
  const current = f.calc(base).value;
  const cx = xMap(base[inp.k]);
  const cy = Number.isFinite(current) ? yMap(current) : 150;

  svg.innerHTML = `
    <defs>
      <linearGradient id="plotGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <line class="plot-axis" x1="28" y1="150" x2="494" y2="150"/>
    <line class="plot-axis" x1="28" y1="25" x2="28" y2="150"/>
    <polygon class="plot-fill" points="28,150 ${points} 494,150"/>
    <polyline class="plot-line" points="${points}"/>
    ${Number.isFinite(current) ? `<circle class="plot-dot" cx="${cx}" cy="${cy}" r="5"/>` : ''}
    <text x="28" y="170" fill="#6f8ba0" font-size="10">${fmt(inp.min)}</text>
    <text x="465" y="170" fill="#6f8ba0" font-size="10">${fmt(inp.max)}</text>
    <text x="34" y="20" fill="#6f8ba0" font-size="10">${fmt(ymax)}</text>`;
}

let unitDrillActive = null;

function makeUnitMini(){
  const f = state.active;
  const inp = f.inputs[0];
  const mult = [0.1, 10, 1000, 1e6][randInt(0, 3)];
  unitDrillActive = { inp, mult, target: inp.v * mult };
  $('#unitMiniPrompt').textContent = `If ${inp.label} is measured as ${fmt(inp.v)} ${inp.unit||'units'}, what is it in ${fmt(mult)}× scale?`;
  $('#unitMiniInput').value = '';
  $('#unitMiniFeedback').textContent = '';
  $('#unitMiniFeedback').className = 'feedback';
}

function checkUnitMini(){
  if(!unitDrillActive) return;
  const raw = $('#unitMiniInput').value.trim();
  const val = Number(raw);
  const fb = $('#unitMiniFeedback');
  if(!Number.isFinite(val)){
    fb.textContent = 'Enter a valid number.';
    fb.className = 'feedback bad';
    return;
  }
  const ok = Math.abs(val - unitDrillActive.target) <= Math.max(1e-4, Math.abs(unitDrillActive.target) * 0.02);
  if(ok){
    fb.textContent = `Correct: ${fmt(unitDrillActive.target)}. Dimensional scale verified.`;
    fb.className = 'feedback good';
  } else {
    fb.textContent = `Not quite. Expected ${fmt(unitDrillActive.target)}. Check multiplier factor.`;
    fb.className = 'feedback bad';
  }
}

function saveLabNote(){
  const id = state.active.id;
  const text = $('#labNotes').value.trim();
  state.progress.notes[id] = text;
  saveProgress();
  const saved = $('#notesSaved');
  saved.textContent = 'Saved to browser storage.';
  setTimeout(()=>{ saved.textContent = ''; }, 3000);
}

function selectLabTab(tabKey){
  state.activeTab = tabKey;
  $$('.lab-tab').forEach(b=>{
    const isThis = b.dataset.tab === tabKey;
    b.classList.toggle('active', isThis);
    b.setAttribute('aria-selected', isThis ? 'true' : 'false');
  });
  $$('.lab-mode').forEach(panel=>{
    panel.classList.toggle('active', panel.dataset.panel === tabKey);
  });
}

function renderLabCarousel(){
  const container = $('#labThumbnailCarousel');
  if(!container) return;
  container.innerHTML = formulas.map(f=>{
    const meta = getPlaygroundBlocks(f.id);
    const active = f.id === state.active.id ? 'active' : '';
    return `<button class="lab-thumb-chip ${active}" type="button" data-lab-id="${f.id}" aria-label="Open Lab ${f.id}: ${escapeHtml(meta.publicTitle)}"><span class="chip-num">LAB ${String(f.id).padStart(2,'0')}</span><span class="chip-title">${escapeHtml(meta.publicTitle)}</span></button>`;
  }).join('');

  $$('.lab-thumb-chip', container).forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const id = Number(chip.dataset.labId);
      openFormula(id);
    });
  });
}

function updateLabCarouselActive(id){
  const container = $('#labThumbnailCarousel');
  if(!container) return;
  $$('.lab-thumb-chip', container).forEach(chip=>{
    const isActive = Number(chip.dataset.labId) === id;
    chip.classList.toggle('active', isActive);
    if(isActive){
      chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

function renderStageLegend(f){
  const legend = $('#stageLegendCard');
  if(!legend) return;

  if(f.id === 1){
    legend.innerHTML = `
      <div class="legend-formulas-wrap">
        <div class="legend-formula-item">
          <span class="legend-formula-label">Hubble Flow</span>
          <span class="legend-formula-eq" id="legendHubbleEq">&rarr; <i>v</i><sub>H</sub> = <i>H</i><sub>0</sub> <i>d</i></span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Peculiar Velocity</span>
          <span class="legend-formula-eq" id="legendPeculiarEq">&rarr; <i>v</i><sub>pec</sub></span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">What We Measure</span>
          <span class="legend-formula-eq" id="legendMeasureEq"><i>c</i><i>z</i> = <i>v</i><sub>H</sub> + <i>v</i><sub>pec</sub></span>
        </div>
      </div>
      <div class="legend-divider-vertical" aria-hidden="true"></div>
      <div class="legend-vectors-wrap">
        <div class="legend-vector-item">
          <span class="vector-arrow-blue">&rarr;</span>
          <span>Hubble expansion</span>
        </div>
        <div class="legend-vector-item">
          <span class="vector-arrow-red">&rarr;</span>
          <span>Peculiar motion</span>
        </div>
      </div>
    `;
  } else if(f.id === 8){
    legend.innerHTML = `
      <div class="legend-formulas-wrap">
        <div class="legend-formula-item">
          <span class="legend-formula-label">Original Starlight</span>
          <span class="legend-formula-eq" id="legendHubbleEq">&rarr; <i>I</i><sub>0</sub></span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Dust Screen</span>
          <span class="legend-formula-eq" id="legendPeculiarEq">&rarr; e<sup>−&tau;</sup></span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Observed Starlight</span>
          <span class="legend-formula-eq" id="legendMeasureEq"><i>I</i> = <i>I</i><sub>0</sub> e<sup>−&tau;</sup></span>
        </div>
      </div>
      <div class="legend-divider-vertical" aria-hidden="true"></div>
      <div class="legend-vectors-wrap">
        <div class="legend-vector-item">
          <span class="vector-arrow-blue">&rarr;</span>
          <span>Starlight beam</span>
        </div>
        <div class="legend-vector-item">
          <span class="vector-arrow-red">&#9632;</span>
          <span>Dust curtain absorption</span>
        </div>
      </div>
    `;
  } else if(f.id === 11){
    legend.innerHTML = `
      <div class="legend-formulas-wrap">
        <div class="legend-formula-item">
          <span class="legend-formula-label">Rest Wavelength</span>
          <span class="legend-formula-eq" id="legendHubbleEq">&rarr; &lambda;<sub>rest</sub></span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Cosmic Stretch</span>
          <span class="legend-formula-eq" id="legendPeculiarEq">&rarr; (1 + <i>z</i>)</span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Observed Wave</span>
          <span class="legend-formula-eq" id="legendMeasureEq">&lambda;<sub>obs</sub> = &lambda;<sub>rest</sub>(1+<i>z</i>)</span>
        </div>
      </div>
      <div class="legend-divider-vertical" aria-hidden="true"></div>
      <div class="legend-vectors-wrap">
        <div class="legend-vector-item">
          <span class="vector-arrow-blue">&#8767;</span>
          <span>Rest wavelength (blue)</span>
        </div>
        <div class="legend-vector-item">
          <span class="vector-arrow-red">&#8767;</span>
          <span>Observed wavelength (red)</span>
        </div>
      </div>
    `;
  } else if(f.id === 19){
    legend.innerHTML = `
      <div class="legend-formulas-wrap">
        <div class="legend-formula-item">
          <span class="legend-formula-label">Exhaust Velocity</span>
          <span class="legend-formula-eq" id="legendHubbleEq">&rarr; <i>v</i><sub>e</sub></span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Mass Ratio</span>
          <span class="legend-formula-eq" id="legendPeculiarEq">&rarr; ln(<i>m</i><sub>0</sub> / <i>m</i><sub>f</sub>)</span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Velocity Budget</span>
          <span class="legend-formula-eq" id="legendMeasureEq">&Delta;<i>v</i> = <i>v</i><sub>e</sub> ln(<i>m</i><sub>0</sub>/<i>m</i><sub>f</sub>)</span>
        </div>
      </div>
      <div class="legend-divider-vertical" aria-hidden="true"></div>
      <div class="legend-vectors-wrap">
        <div class="legend-vector-item">
          <span class="vector-arrow-blue">&uarr;</span>
          <span>Rocket acceleration</span>
        </div>
        <div class="legend-vector-item">
          <span class="vector-arrow-red">&darr;</span>
          <span>Exhaust plume</span>
        </div>
      </div>
    `;
  } else if(f.id === 20){
    legend.innerHTML = `
      <div class="legend-formulas-wrap">
        <div class="legend-formula-item">
          <span class="legend-formula-label">Radiation Push</span>
          <span class="legend-formula-eq" id="legendHubbleEq">&rarr; <i>F</i><sub>rad</sub></span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Solar Gravity</span>
          <span class="legend-formula-eq" id="legendPeculiarEq">&rarr; <i>F</i><sub>grav</sub></span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Lightness Ratio</span>
          <span class="legend-formula-eq" id="legendMeasureEq">&beta; = <i>F</i><sub>rad</sub> / <i>F</i><sub>grav</sub></span>
        </div>
      </div>
      <div class="legend-divider-vertical" aria-hidden="true"></div>
      <div class="legend-vectors-wrap">
        <div class="legend-vector-item">
          <span class="vector-arrow-blue">&rarr;</span>
          <span>Photon radiation push</span>
        </div>
        <div class="legend-vector-item">
          <span class="vector-arrow-red">&larr;</span>
          <span>Solar gravity pull</span>
        </div>
      </div>
    `;
  } else {
    const meta = getPlaygroundBlocks(f.id);
    legend.innerHTML = `
      <div class="legend-formulas-wrap">
        <div class="legend-formula-item">
          <span class="legend-formula-label">Concept</span>
          <span class="legend-formula-eq" id="legendHubbleEq">${escapeHtml(meta.publicTitle)}</span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Formal Law</span>
          <span class="legend-formula-eq" id="legendPeculiarEq">${escapeHtml(meta.scientificTitle)}</span>
        </div>
        <div class="legend-formula-item">
          <span class="legend-formula-label">Primary Output</span>
          <span class="legend-formula-eq" id="legendMeasureEq">${escapeHtml(f.output)}</span>
        </div>
      </div>
      <div class="legend-divider-vertical" aria-hidden="true"></div>
      <div class="legend-vectors-wrap">
        <div class="legend-vector-item">
          <span class="vector-arrow-blue">&bull;</span>
          <span>${escapeHtml(f.symbols[0]?.[0] || 'Input')} &mdash; ${escapeHtml(f.symbols[0]?.[1] || '')}</span>
        </div>
        <div class="legend-vector-item">
          <span class="vector-arrow-red">&bull;</span>
          <span>${escapeHtml(f.symbols[1]?.[0] || 'Target')} &mdash; ${escapeHtml(f.symbols[1]?.[1] || '')}</span>
        </div>
      </div>
    `;
  }
}

function renderWorkedExample(f){
  const lead = $('#workedExampleLead');
  const steps = $('#workedExampleSteps');
  const pill = $('#workedExamplePillText');
  if(!lead || !steps || !pill) return;

  if(f.id === 1){
    lead.textContent = 'A galaxy is 100 Mpc away with a peculiar velocity of −500 km/s.';
    steps.innerHTML = `
      <div class="step-row"><span class="step-name">Hubble flow:</span><span class="step-calc" id="calcStepHubble"><i>v</i><sub>H</sub> = <i>H</i><sub>0</sub> <i>d</i> = 70 &times; 100 = 7,000 km/s</span></div>
      <div class="step-row"><span class="step-name">Peculiar velocity:</span><span class="step-calc" id="calcStepPeculiar"><i>v</i><sub>pec</sub> = −500 km/s (toward us)</span></div>
      <div class="step-row"><span class="step-name">Observed velocity:</span><span class="step-calc" id="calcStepObserved"><i>c</i><i>z</i> = <i>v</i><sub>H</sub> + <i>v</i><sub>pec</sub> = 7,000 − 500 = 6,500 km/s</span></div>
    `;
    pill.innerHTML = 'So we measure <i>c</i><i>z</i> = 6,500 km/s, which is smaller than the Hubble flow alone due to the local tug.';
  } else if(f.id === 8){
    lead.textContent = 'Starlight passes through an interstellar dust cloud with optical depth τ = 1.0.';
    steps.innerHTML = `
      <div class="step-row"><span class="step-name">Initial intensity:</span><span class="step-calc" id="calcStepHubble"><i>I</i><sub>0</sub> = 100%</span></div>
      <div class="step-row"><span class="step-name">Transmission:</span><span class="step-calc" id="calcStepPeculiar"><i>T</i> = e<sup>−1.0</sup> &approx; 0.368 (36.8%)</span></div>
      <div class="step-row"><span class="step-name">Extinction loss:</span><span class="step-calc" id="calcStepObserved">&Delta;<i>I</i> = 100% − 36.8% = 63.2% absorbed</span></div>
    `;
    pill.innerHTML = 'The dust cloud dims the starlight by over 63%, shifting the remaining light toward redder wavelengths.';
  } else if(f.id === 11){
    lead.textContent = 'A distant galaxy emits hydrogen light at 500 nm, observed at 550 nm on Earth.';
    steps.innerHTML = `
      <div class="step-row"><span class="step-name">Wavelength shift:</span><span class="step-calc" id="calcStepHubble">&Delta;&lambda; = 550 − 500 = 50 nm</span></div>
      <div class="step-row"><span class="step-name">Cosmic redshift:</span><span class="step-calc" id="calcStepPeculiar"><i>z</i> = &Delta;&lambda; / &lambda;<sub>rest</sub> = 50 / 500 = 0.10</span></div>
      <div class="step-row"><span class="step-name">Expansion scale:</span><span class="step-calc" id="calcStepObserved">1 + <i>z</i> = 1.10 (space stretched by 10%)</span></div>
    `;
    pill.innerHTML = 'The observed wavelength is 1.10&times; longer than when emitted, confirming universal cosmic expansion.';
  } else if(f.id === 19){
    lead.textContent = 'A rocket stage has an exhaust velocity of 3.0 km/s and a mass ratio of 5:1.';
    steps.innerHTML = `
      <div class="step-row"><span class="step-name">Exhaust speed:</span><span class="step-calc" id="calcStepHubble"><i>v</i><sub>e</sub> = 3.0 km/s</span></div>
      <div class="step-row"><span class="step-name">Mass ratio log:</span><span class="step-calc" id="calcStepPeculiar">ln(<i>m</i><sub>0</sub> / <i>m</i><sub>f</sub>) = ln(5) &approx; 1.609</span></div>
      <div class="step-row"><span class="step-name">Velocity gain:</span><span class="step-calc" id="calcStepObserved">&Delta;<i>v</i> = 3.0 &times; 1.609 &approx; 4.83 km/s</span></div>
    `;
    pill.innerHTML = 'Burning 80% of its initial mass in propellant provides &Delta;<i>v</i> = 4.83 km/s of velocity capability.';
  } else if(f.id === 20){
    lead.textContent = 'A solar sail is deployed with an area-to-mass ratio designed for interplanetary propulsion.';
    steps.innerHTML = `
      <div class="step-row"><span class="step-name">Solar radiation push:</span><span class="step-calc" id="calcStepHubble"><i>P</i> / <i>c</i> &approx; 4.56 &mu;N/m<sup>2</sup></span></div>
      <div class="step-row"><span class="step-name">Solar gravity:</span><span class="step-calc" id="calcStepPeculiar"><i>g</i><sub>solar</sub> &approx; 5.93 mm/s<sup>2</sup> at 1 AU</span></div>
      <div class="step-row"><span class="step-name">Lightness number:</span><span class="step-calc" id="calcStepObserved">&beta; = <i>F</i><sub>rad</sub> / <i>F</i><sub>grav</sub> &approx; 0.45</span></div>
    `;
    pill.innerHTML = 'With &beta; = 0.45, sunlight offsets nearly half of the Sun\'s gravity, widening solar transfer trajectories.';
  } else {
    lead.textContent = f.example || 'Example calculation showing physical inputs and resulting prediction.';
    const res = f.calc(state.values);
    steps.innerHTML = f.inputs.slice(0, 3).map(inp => `
      <div class="step-row"><span class="step-name">${escapeHtml(inp.label)}:</span><span class="step-calc">${fmt(state.values[inp.k])} ${escapeHtml(inp.unit||'')}</span></div>
    `).join('') + `
      <div class="step-row"><span class="step-name">${escapeHtml(f.output)}:</span><span class="step-calc">${fmt(res.value)} ${escapeHtml(f.unit||'')}</span></div>
    `;
    pill.innerHTML = escapeHtml(f.eli5);
  }
}

const MASCOT_RULES = {
  1: "Galaxies follow the expansion, but gravity still has a say!",
  2: "Every 10× in distance drops apparent brightness by 5 magnitudes!",
  3: "Don't count every atom — measure whether a place is crowded or empty!",
  4: "When velocity arrows point inward from all sides, hidden mass is pulling!",
  5: "New clues update old beliefs — that's the heart of Bayesian science!",
  6: "Good models balance matching the data against overreacting to noise!",
  7: "Wiener filters act like noise-canceling headphones for telescope data!",
  8: "Interstellar dust acts like sunglasses: blue light scatters, red gets through!",
  9: "Shorter ultraviolet wavelengths scatter much more violently than infrared!",
  10: "Color excess tells you exactly how much extra dust is hiding the target!",
  11: "Light waves get stretched by expanding space itself on their journey!",
  12: "Neutral hydrogen's 21-cm radio line passes right through thick dust!",
  13: "Total radio emission reveals the cold hydrogen gas reservoir!",
  14: "Physics models carry a spacecraft's state forward step-by-step through time!",
  15: "Sensors don't measure the state directly; they measure a function of it!",
  16: "Trust the model when sensors are noisy; trust the sensors when model drifts!",
  17: "Gravity weakens with distance squared — double the distance, quarter the pull!",
  18: "Escape speed is always √2 times the circular orbital speed!",
  19: "Every extra kilometer per second requires exponential fuel payload!",
  20: "Photons carry momentum — pure sunlight can push a gossamer sail through space!",
  21: "Light takes minutes to Mars and hours to deep space probes — plan ahead!",
  22: "Radio signals below the plasma frequency bounce off like mirrors!",
  23: "In plasma, charged particles swarm together to shield out electric fields!",
  24: "Alfvén waves travel along magnetic field lines like vibrations on a guitar string!",
  25: "Beta tells you whether hot plasma pushes the field or the field steers the plasma!"
};

function renderLearnoMascot(f){
  const speech = $('#eli5MascotSpeech');
  if(speech) speech.textContent = MASCOT_RULES[f.id] || f.eli5;
  const svg = $('#eli5MascotSvg');
  if(svg && !svg.hasChildNodes()){
    svg.innerHTML = `
      <svg viewBox="0 0 90 95" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Learno the friendly space robot mascot">
        <line x1="45" y1="18" x2="45" y2="8" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
        <circle cx="45" cy="6" r="4" fill="#38bdf8"/>
        <rect x="25" y="18" width="40" height="28" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="2.5"/>
        <ellipse cx="36" cy="30" rx="3.5" ry="4" fill="#0284c7"/>
        <ellipse cx="54" cy="30" rx="3.5" ry="4" fill="#0284c7"/>
        <circle cx="37" cy="28.5" r="1.2" fill="#ffffff"/>
        <circle cx="55" cy="28.5" r="1.2" fill="#ffffff"/>
        <path d="M40 37 Q45 41 50 37" stroke="#2563eb" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="31" cy="36" r="2" fill="#f43f5e" opacity="0.6"/>
        <circle cx="59" cy="36" r="2" fill="#f43f5e" opacity="0.6"/>
        <rect x="41" y="46" width="8" height="4" rx="2" fill="#94a3b8"/>
        <rect x="22" y="50" width="46" height="34" rx="10" fill="#2563eb"/>
        <rect x="28" y="56" width="34" height="22" rx="6" fill="#ffffff"/>
        <path d="M32 67 L38 67 L42 61 L46 72 L50 67 L58 67" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 58 Q14 62 16 70" stroke="#2563eb" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M68 58 Q78 52 74 44" stroke="#2563eb" stroke-width="4" stroke-linecap="round" fill="none"/>
        <circle cx="74" cy="44" r="3" fill="#38bdf8"/>
      </svg>`;
  }
}

function renderKeepExploring(f){
  const container = $('#keepExploringCards');
  if(!container) return;

  const candidates = [
    f.id + 1 <= 25 ? f.id + 1 : 1,
    f.id - 1 >= 1 ? f.id - 1 : 25,
    (f.id + 3) % 25 + 1
  ];
  const uniqueIds = [...new Set(candidates)].filter(id => id !== f.id).slice(0, 3);

  container.innerHTML = uniqueIds.map(id => {
    const target = formulas.find(x => x.id === id);
    const meta = getPlaygroundBlocks(id);
    return `
      <article class="explore-card" data-lab-id="${target.id}" role="button" tabindex="0" aria-label="Explore Lab ${target.id}: ${escapeHtml(meta.publicTitle)}">
        <span class="explore-card-icon">${meta.blocks[0]?.icon || '🚀'}</span>
        <div class="explore-card-info">
          <strong>${escapeHtml(meta.publicTitle)}</strong>
          <small>LAB ${String(target.id).padStart(2,'0')} · ${escapeHtml(meta.scientificTitle)}</small>
        </div>
        <span class="explore-card-arrow" aria-hidden="true">&rarr;</span>
      </article>
    `;
  }).join('');

  $$('.explore-card', container).forEach(card => {
    const id = Number(card.dataset.labId);
    card.addEventListener('click', () => openFormula(id));
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') openFormula(id); });
  });
}

function renderLibraryHeroGraphic(){
  const container = $('#libHeroMascot');
  if(!container) return;
  container.innerHTML = `
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Learno exploring formulas illustration">
      <circle cx="160" cy="120" r="100" fill="#e0f2fe" opacity="0.6"/>
      <g transform="translate(45 50) rotate(-15)">
        <polygon points="20,0 40,10 40,30 20,20" fill="#38bdf8"/>
        <polygon points="0,10 20,0 20,20 0,30" fill="#0284c7"/>
        <polygon points="0,30 20,20 40,30 20,40" fill="#0369a1"/>
      </g>
      <circle cx="260" cy="70" r="22" fill="#f43f5e" opacity="0.9"/>
      <ellipse cx="254" cy="64" rx="7" ry="5" fill="#ffffff" opacity="0.5"/>
      <g transform="translate(230 150) rotate(20)">
        <rect x="0" y="0" width="34" height="42" rx="4" fill="#6366f1"/>
        <rect x="4" y="3" width="26" height="36" rx="2" fill="#ffffff"/>
        <line x1="8" y1="12" x2="26" y2="12" stroke="#6366f1" stroke-width="2"/>
        <line x1="8" y1="20" x2="22" y2="20" stroke="#94a3b8" stroke-width="2"/>
        <line x1="8" y1="28" x2="24" y2="28" stroke="#94a3b8" stroke-width="2"/>
      </g>
      <ellipse cx="65" cy="180" rx="28" ry="12" fill="none" stroke="#f59e0b" stroke-width="4" transform="rotate(-25 65 180)"/>
      <path d="M120 40 L122 46 L128 48 L122 50 L120 56 L118 50 L112 48 L118 46 Z" fill="#f59e0b"/>
      <path d="M210 30 L211 34 L215 35 L211 36 L210 40 L209 36 L205 35 L209 34 Z" fill="#38bdf8"/>
      <g transform="translate(110 50) scale(1.1)">
        <line x1="45" y1="18" x2="45" y2="8" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
        <circle cx="45" cy="6" r="4" fill="#38bdf8"/>
        <rect x="25" y="18" width="40" height="28" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="2.5"/>
        <ellipse cx="36" cy="30" rx="3.5" ry="4" fill="#0284c7"/>
        <ellipse cx="54" cy="30" rx="3.5" ry="4" fill="#0284c7"/>
        <circle cx="37" cy="28.5" r="1.2" fill="#ffffff"/>
        <circle cx="55" cy="28.5" r="1.2" fill="#ffffff"/>
        <path d="M40 37 Q45 41 50 37" stroke="#2563eb" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="31" cy="36" r="2" fill="#f43f5e" opacity="0.6"/>
        <circle cx="59" cy="36" r="2" fill="#f43f5e" opacity="0.6"/>
        <rect x="41" y="46" width="8" height="4" rx="2" fill="#94a3b8"/>
        <rect x="22" y="50" width="46" height="34" rx="10" fill="#2563eb"/>
        <rect x="28" y="56" width="34" height="22" rx="6" fill="#ffffff"/>
        <path d="M32 67 L38 67 L42 61 L46 72 L50 67 L58 67" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 58 Q12 50 14 40" stroke="#2563eb" stroke-width="4" stroke-linecap="round" fill="none"/>
        <circle cx="14" cy="40" r="3" fill="#38bdf8"/>
        <path d="M68 58 Q78 52 74 44" stroke="#2563eb" stroke-width="4" stroke-linecap="round" fill="none"/>
        <circle cx="74" cy="44" r="3" fill="#38bdf8"/>
      </g>
    </svg>`;
}

function openLabTourModal(){
  const existing = document.getElementById('labTourModal');
  if(existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'labTourModal';
  backdrop.className = 'tour-modal-backdrop';
  backdrop.innerHTML = `
    <div class="tour-modal-content" role="dialog" aria-modal="true" aria-label="1-Minute Tour of Cosmic Formula Playground">
      <div class="tour-modal-head">
        <span class="tour-badge">QUICK TOUR · 1 MINUTE</span>
        <button class="tour-close-btn" id="closeTourModalBtn" aria-label="Close tour">✕</button>
      </div>
      <h3 class="tour-title">How to explore space formulas intuitively ✨</h3>
      <div class="tour-steps-wrap">
        <div class="tour-step-card">
          <div class="tour-step-num">1</div>
          <div class="tour-step-info">
            <strong>See the Simulation Stage</strong>
            <p>Every formula features a real-time animated physics stage showing starlight, wave stretch, rocket plumes, or plasma fields.</p>
          </div>
        </div>
        <div class="tour-step-card">
          <div class="tour-step-num">2</div>
          <div class="tour-step-info">
            <strong>Touch the Tactile Blocks</strong>
            <p>Slide variables and press ± buttons. The equation recalculates instantly with plain-English insights.</p>
          </div>
        </div>
        <div class="tour-step-card">
          <div class="tour-step-num">3</div>
          <div class="tour-step-info">
            <strong>Connect Concept to Math</strong>
            <p>Read the ELI5 mental model first, inspect the worked example, and unfold the formal proof whenever you are ready.</p>
          </div>
        </div>
      </div>
      <div class="tour-modal-foot">
        <button class="primary-btn" id="finishTourBtn" type="button">Got it, let's explore! &rarr;</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  backdrop.addEventListener('click', e => { if(e.target === backdrop) close(); });
  backdrop.querySelector('#closeTourModalBtn')?.addEventListener('click', close);
  backdrop.querySelector('#finishTourBtn')?.addEventListener('click', close);
}

function populateLabSelect(){
  const sel = $('#labSelect');
  if(!sel) return;
  sel.innerHTML = formulas.map(f=>{
    const meta = getPlaygroundBlocks(f.id);
    return `<option value="${f.id}">[${meta.category.toUpperCase()}] ${String(f.id).padStart(2,'0')}. ${escapeHtml(meta.publicTitle)}</option>`;
  }).join('');
}

function showMascot(msg){
  const text = $('#mascotText');
  const bubble = $('#mascotBubble');
  if(text) text.textContent = msg;
  if(bubble) bubble.classList.remove('hidden');
}

function exportProgress(){
  const payload = {
    ...state.progress,
    exportedAt: new Date().toISOString(),
    app: 'Cosmic Formula Playground'
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cosmic-formula-notes.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 500);
}

async function importProgress(file){
  if(!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    state.progress = normalizeProgress(parsed);
    saveProgress();
    openFormula(state.progress.lastActive || 1);
    alert('Notes and bookmarks imported successfully.');
  } catch {
    alert('Import failed: invalid JSON format.');
  }
}

function registerServiceWorker(){
  if('serviceWorker' in navigator && location.protocol.startsWith('http')){
    navigator.serviceWorker.register('./sw.js?v=3.7.0').then(reg => {
      try { reg.update(); } catch {}
    }).catch(()=>{});
  }
}

function bindEvents(){
  // Navigation tabs
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.nav));
  });

  $('.brand')?.addEventListener('click', e => {
    e.preventDefault();
    switchView('home');
  });

  $('#topLaunchLabBtn')?.addEventListener('click', () => switchView('playground', state.active.id));
  $('#heroPlaygroundBtn')?.addEventListener('click', () => switchView('playground', 1));
  $('#heroSandboxBtn')?.addEventListener('click', () => switchView('sandbox'));
  $('#heroStartBtn')?.addEventListener('click', () => switchView('playground', 1));
  $('#heroHowBtn')?.addEventListener('click', () => switchView('path'));
  $('#sandboxResetParamBtn')?.addEventListener('click', () => {
    loadSandboxFormula(sandboxActiveFormula.id, false);
    showMascot('Reset sandbox parameters to default values.');
  });

  $$('.portal-card').forEach(card => {
    card.addEventListener('click', () => switchView(card.dataset.portal));
  });

  $('#heroExpansionSlider')?.addEventListener('input', e => {
    const val = e.target.value;
    $('#heroExpansionVal').textContent = `${val} km/s/Mpc`;
    renderHeroPreview();
  });

  // Global search input
  $('#globalSearch')?.addEventListener('input', e => {
    const query = e.target.value.trim();
    if(query.length > 0){
      switchView('library');
      const libSearch = $('#librarySearchInput');
      if(libSearch){
        libSearch.value = query;
        renderFormulaLibrary();
      }
    }
  });

  $('#librarySearchInput')?.addEventListener('input', renderFormulaLibrary);

  // Practice event listeners
  $('#practiceSubmitBtn')?.addEventListener('click', checkPracticeAnswer);
  $('#practiceAnswerInput')?.addEventListener('keydown', e => {
    if(e.key === 'Enter') checkPracticeAnswer();
  });

  $('#practiceHintBtn')?.addEventListener('click', () => {
    const q = state.practiceProblem;
    if(!q || !Array.isArray(q.hints)) return;
    const hintEl = $('#practiceHintText');
    const btn = $('#practiceHintBtn');
    if(!hintEl || !btn) return;
    if(practiceHintStep >= q.hints.length && !hintEl.classList.contains('hidden')){
      hintEl.classList.add('hidden');
      btn.textContent = 'Show Hint →';
      practiceHintStep = 0;
      return;
    }
    hintEl.classList.remove('hidden');
    practiceHintStep = Math.min(q.hints.length, practiceHintStep + 1);
    hintEl.innerHTML = `
      <div class="hint-step-badge">HINT ${practiceHintStep} OF ${q.hints.length}</div>
      ${q.hints.slice(0, practiceHintStep).map((h, i) => `<p style="margin: 4px 0;"><strong>Step ${i+1}:</strong> ${h}</p>`).join('')}
    `;
    if(practiceHintStep < q.hints.length){
      btn.textContent = `Next Hint (${practiceHintStep + 1}/${q.hints.length}) →`;
    } else {
      btn.textContent = 'All Hints Revealed ✓ (Click to Hide)';
    }
  });

  $('#practiceRevealEquationBtn')?.addEventListener('click', () => {
    const rev = $('#practiceEquationReveal');
    if(!rev) return;
    const isHidden = rev.classList.contains('hidden');
    rev.classList.toggle('hidden', !isHidden);
    if(isHidden){
      const q = state.practiceProblem;
      if(q && q.steps){
        rev.innerHTML = `
          <div class="practice-steps-container" style="padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px;">
            <div style="font-weight: 800; font-size: 14px; margin-bottom: 8px; color: #1e293b;">
              📐 Step-by-Step Calculation Reveal:
            </div>
            ${q.steps.map(s => `
              <div class="step-check-item">
                <span><strong>Step ${s.num}: ${escapeHtml(s.title)}</strong> &nbsp; \\(${s.math}\\)</span>
                <span class="step-badge-check">✓</span>
              </div>
            `).join('')}
            <div style="margin-top: 10px; font-weight: 800; color: #10b981; font-size: 14px;">
              Target Volume: ${q.answer} ${q.unit} ✓
            </div>
          </div>
        `;
        typeset([rev]);
      }
    }
  });

  $('#practiceNewProblemBtn')?.addEventListener('click', () => {
    practiceQuestionIndex = (practiceQuestionIndex + 1) % PRACTICE_QUESTIONS.length;
    loadPracticeProblem();
  });

  // Equation blocks tray click interaction
  $$('.formula-chip-block', $('#practiceEquationBlocksRow')).forEach(chip => {
    chip.addEventListener('click', () => {
      const shape = chip.dataset.shape;
      if(shape){
        loadPracticeProblem(shape);
        renderEquationBlockDetailCard(shape);
        showMascot(`Loaded ${shape} challenge! Let's solve it together! 🌟`);
        $('#practiceActiveCard')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    chip.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        chip.click();
      }
    });
  });

  // Timed mission challenge cards click to start
  $$('.mission-card .mission-start-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.mission-card');
      const title = card?.querySelector('strong')?.textContent || 'Timed Mission';
      showMascot(`🚀 Mission started: ${title}! Solve the challenge to earn XP!`);
      practiceQuestionIndex = (practiceQuestionIndex + 1) % PRACTICE_QUESTIONS.length;
      loadPracticeProblem();
      $('#practiceActiveCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Lab topbar controls
  $('#labSelect')?.addEventListener('change', e => {
    openFormula(Number(e.target.value));
  });

  $('#prevLabBtn')?.addEventListener('click', () => {
    const cur = state.active.id;
    openFormula(cur > 1 ? cur - 1 : formulas.length);
  });

  $('#nextLabBtn')?.addEventListener('click', () => {
    const cur = state.active.id;
    openFormula(cur < formulas.length ? cur + 1 : 1);
  });

  $('#randomLabBtn')?.addEventListener('click', () => {
    openFormula(randInt(1, formulas.length));
  });

  $('#resetDefaultsBtn')?.addEventListener('click', () => {
    state.values = Object.fromEntries(state.active.inputs.map(i=>[i.k, i.v]));
    updateLab();
    renderControls();
    showMascot('Reset lab values to default.');
  });

  $('#resetInputs')?.addEventListener('click', () => {
    state.values = Object.fromEntries(state.active.inputs.map(i=>[i.k, i.v]));
    updateLab();
    renderControls();
  });

  $('#bookmarkBtn')?.addEventListener('click', () => {
    const id = state.active.id;
    const set = bookmarkSet();
    if(set.has(id)){
      state.progress.bookmarks = state.progress.bookmarks.filter(x=>x!==id);
    } else {
      state.progress.bookmarks.push(id);
    }
    saveProgress();
    updateBookmarkButton();
  });

  // Toggle Math collapse
  $('#toggleMathBtn')?.addEventListener('click', () => {
    const collapse = $('#formalMathCollapse');
    const btn = $('#toggleMathBtn');
    const isHidden = collapse.classList.contains('hidden');
    collapse.classList.toggle('hidden', !isHidden);
    btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    btn.innerHTML = isHidden ? '📐 Hide Formal Math &uarr;' : '📐 Show the Math &amp; Derivations &darr;';
    if(isHidden) typeset([collapse]);
  });

  $('#deriveSelfCheck')?.addEventListener('change', e => {
    const id = state.active.id;
    if(e.target.checked && !deriveSet().has(id)){
      state.progress.deriveChecks.push(id);
      saveProgress();
    }
    if(!e.target.checked){
      state.progress.deriveChecks = state.progress.deriveChecks.filter(x=>x!==id);
      saveProgress();
    }
  });

  $$('.lab-tab').forEach(b => b.addEventListener('click', () => selectLabTab(b.dataset.tab)));
  $('#sweepSelect')?.addEventListener('change', renderPlot);
  $('#unitMiniCheck')?.addEventListener('click', checkUnitMini);
  $('#unitMiniInput')?.addEventListener('keydown', e => { if(e.key === 'Enter') checkUnitMini(); });
  $('#saveLabNotes')?.addEventListener('click', saveLabNote);

  $('#closeExplainer')?.addEventListener('click', () => {
    $('#blockExplainer')?.classList.add('hidden');
    $$('.playground-block', $('#playgroundBlocksWrap')).forEach(x => x.classList.remove('focused'));
  });

  $('#mascotClose')?.addEventListener('click', () => {
    $('#mascotBubble')?.classList.add('hidden');
  });

  $('#mascotAvatar')?.addEventListener('click', () => {
    showMascot('Hi! I\'m Nova. Touch any equation block above to see the universe change!');
  });

  $('#exportProgress')?.addEventListener('click', exportProgress);
  $('#importProgress')?.addEventListener('change', e => importProgress(e.target.files?.[0]));

  // Simulation loop runner
  function runSimulationLoop(){
    if(!state.isPlayingSimulation) return;
    const scrub = $('#stageTimelineScrub');
    if(scrub){
      let cur = Number(scrub.value);
      cur = (cur + 0.35) % 100;
      scrub.value = String(cur);
      scrub.dispatchEvent(new Event('input'));
    }
    requestAnimationFrame(runSimulationLoop);
  }

  // Stage Playback Controls
  $('#stagePlayPauseBtn')?.addEventListener('click', () => {
    const stage = $('#playgroundStage');
    const btn = $('#stagePlayPauseBtn');
    if(!stage || !btn) return;
    state.isPlayingSimulation = !state.isPlayingSimulation;
    const isPaused = stage.classList.toggle('paused', !state.isPlayingSimulation);
    btn.textContent = state.isPlayingSimulation ? '⏸' : '▶';
    btn.setAttribute('aria-label', state.isPlayingSimulation ? 'Pause simulation' : 'Resume simulation');
    if(state.isPlayingSimulation){
      runSimulationLoop();
    }
  });

  $('#stageTimelineScrub')?.addEventListener('input', e => {
    const val = Number(e.target.value);
    state.simTime = val;
    const readout = $('#stageTimeReadout');
    const fId = state.active.id;
    if(readout){
      if(fId === 1) readout.textContent = `Time: ${(val * 0.138).toFixed(1)} Gyr`;
      else if(fId === 17 || fId === 18) readout.textContent = `Orbital Phase: ${(val * 3.6).toFixed(0)}°`;
      else if(fId === 19) readout.textContent = `Burn Time: T+ ${(val * 1.2).toFixed(1)} s`;
      else if(fId === 20) readout.textContent = `Mission Day: ${(val * 3.65).toFixed(0)} d`;
      else if(fId === 21) readout.textContent = `Radio Signal Time: ${(val * 0.42).toFixed(2)} h`;
      else if(fId === 22) readout.textContent = `Plasma Oscillation: ${(val * 1.5).toFixed(1)} μs`;
      else readout.textContent = `Simulation Time: ${val.toFixed(0)}%`;
    }
    if(fId === 1){
      const simulatedH0 = 50 + (val / 100) * 40;
      state.values.H0 = Math.round(simulatedH0 * 10) / 10;
      updateLab();
      syncStandardControls();
    } else {
      updateLab();
    }
  });

  // Stage Tactile Drag & Click Feedback (Lab 19, 20, 22)
  const labStage = $('#playgroundStage');
  if(labStage){
    let isLabDragging = false;
    let labDragMode = null;
    let dragStartY = 0;
    let initialAngle = 0;

    labStage.addEventListener('pointerdown', e => {
      if(state.active.id === 19){
        const exhaust = e.target.closest('#lab19ExhaustGroup') || e.target.closest('.interactive-exhaust');
        if(exhaust){
          e.stopPropagation();
          state.lab19ThrustBoost = (state.lab19ThrustBoost || 1.0) > 1.2 ? 1.0 : 1.6;
          showMascot('🚀 Boosted engine thrust! Exhaust velocity and Δv increased!');
          updateLab();
          return;
        }
        const rocket = e.target.closest('#lab19RocketGroup') || e.target.closest('.interactive-rocket');
        if(rocket){
          isLabDragging = true;
          labDragMode = 'rocket';
          dragStartY = e.clientY;
          initialAngle = state.lab19Angle !== undefined ? state.lab19Angle : -42;
          labStage.setPointerCapture?.(e.pointerId);
          return;
        }
      } else if(state.active.id === 20){
        const sail = e.target.closest('#lab20SailGroup') || e.target.closest('.interactive-sail');
        if(sail){
          isLabDragging = true;
          labDragMode = 'sail';
          dragStartY = e.clientY;
          initialAngle = state.lab20TiltAngle !== undefined ? state.lab20TiltAngle : 0;
          labStage.setPointerCapture?.(e.pointerId);
          return;
        }
      } else if(state.active.id === 22){
        const rect = labStage.getBoundingClientRect();
        const svgW = 900, svgH = 360;
        const clickX = Math.round((e.clientX - rect.left) / (rect.width || 1) * svgW);
        const clickY = Math.round((e.clientY - rect.top) / (rect.height || 1) * svgH);
        if(!state.lab22Perturbations) state.lab22Perturbations = [];
        state.lab22Perturbations.push({ x: clickX, y: clickY, time: Date.now() });
        showMascot('⚡ Electric charge perturbation injected! Watch collective electrons oscillate to restore neutrality!');
        updateLab();
      }
    });

    labStage.addEventListener('pointermove', e => {
      if(!isLabDragging) return;
      const dy = e.clientY - dragStartY;
      if(labDragMode === 'rocket'){
        const next = Math.max(-85, Math.min(0, initialAngle - dy * 0.5));
        state.lab19Angle = Math.round(next * 10) / 10;
        updateLab();
      } else if(labDragMode === 'sail'){
        const next = Math.max(-60, Math.min(60, initialAngle + dy * 0.5));
        state.lab20TiltAngle = Math.round(next * 10) / 10;
        updateLab();
      }
    });

    const stopLabDrag = e => {
      if(isLabDragging){
        isLabDragging = false;
        labDragMode = null;
        try { labStage.releasePointerCapture?.(e.pointerId); } catch {}
      }
    };
    labStage.addEventListener('pointerup', stopLabDrag);
    labStage.addEventListener('pointercancel', stopLabDrag);
  }

  $('#stageFullscreenBtn')?.addEventListener('click', () => {
    const card = $('#visualStageCard');
    if(!card) return;
    if(!document.fullscreenElement){
      card.requestFullscreen?.().catch(()=>{});
    } else {
      document.exitFullscreen?.().catch(()=>{});
    }
  });

  $('#liveLabOpenBtn')?.addEventListener('click', () => {
    $('#playgroundBlocksWrap')?.scrollIntoView({ behavior: 'smooth' });
  });

  $('#liveLabTourBtn')?.addEventListener('click', openLabTourModal);

  // Home 3D Shape Interactive Canvas Drag Rotation & Slider
  const homeCanvas = $('#home3dInteractiveCanvas');
  if(homeCanvas){
    homeCanvas.addEventListener('pointerdown', e => {
      isHomeDragging = true;
      homeDragLastX = e.clientX;
      homeDragLastY = e.clientY;
      homeCanvas.classList.add('grabbing', 'is-dragging');
      homeCanvas.setPointerCapture?.(e.pointerId);
      const hint = $('#homeShapeDragHint');
      if(hint) hint.textContent = 'Rotating 3D shape live...';
    });

    homeCanvas.addEventListener('pointermove', e => {
      if(!isHomeDragging) return;
      const dx = e.clientX - homeDragLastX;
      const dy = e.clientY - homeDragLastY;
      homeDragLastX = e.clientX;
      homeDragLastY = e.clientY;
      homeShapeRotY += dx * 0.75;
      homeShapeRotX = Math.max(-50, Math.min(50, homeShapeRotX - dy * 0.6));
      renderHome3dStage();
    });

    const stopHomeDrag = e => {
      if(isHomeDragging){
        isHomeDragging = false;
        homeCanvas.classList.remove('grabbing', 'is-dragging');
        try { homeCanvas.releasePointerCapture?.(e.pointerId); } catch {}
        const hint = $('#homeShapeDragHint');
        if(hint) hint.textContent = 'Drag canvas to tilt & spin shape in 3D';
        renderHome3dStage();
      }
    };
    homeCanvas.addEventListener('pointerup', stopHomeDrag);
    homeCanvas.addEventListener('pointercancel', stopHomeDrag);
  }

  $('#homeShapeDimSlider')?.addEventListener('input', e => {
    homeShapeDim = Number(e.target.value);
    renderHome3dStage();
  });

  // Home 3D Shape Carousel Controls
  $('#homeCarouselPrevBtn')?.addEventListener('click', () => {
    homeShapeIndex = (homeShapeIndex - 1 + HOME_3D_SHAPES.length) % HOME_3D_SHAPES.length;
    renderHome3dStage();
  });

  $('#homeCarouselNextBtn')?.addEventListener('click', () => {
    homeShapeIndex = (homeShapeIndex + 1) % HOME_3D_SHAPES.length;
    renderHome3dStage();
  });

  $$('#homeCarouselDots .dot').forEach((dot, idx) => {
    const pick = () => {
      homeShapeIndex = idx;
      renderHome3dStage();
    };
    dot.addEventListener('click', pick);
    dot.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        pick();
      }
    });
  });

  $('#homeViewAllFormulasBtn')?.addEventListener('click', () => switchView('library'));

  // Explore Portals
  $$('.explore-portal-card').forEach(card => {
    card.addEventListener('click', () => switchView(card.dataset.portal));
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') switchView(card.dataset.portal); });
  });

  // Practice View Action buttons
  $('#viewStatsBtn')?.addEventListener('click', () => showMascot('Level 3 Space Explorer: 18 Correct, 68% accuracy!'));
  $('#viewAllMissionsBtn')?.addEventListener('click', () => showMascot('4 Timed Missions active! Pick a challenge to start!'));
  $('#viewAllFormulasPracticeBtn')?.addEventListener('click', () => switchView('library'));

  document.addEventListener('keydown', e => {
    if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
    if(state.activeView === 'labs'){
      if(e.key === 'ArrowLeft'){
        e.preventDefault();
        $('#prevLabBtn')?.click();
      } else if(e.key === 'ArrowRight'){
        e.preventDefault();
        $('#nextLabBtn')?.click();
      } else if(e.key === 'Escape'){
        $('#blockExplainer')?.classList.add('hidden');
      }
    }
  });
}

function parseCurrentRouteAndSwitch(updateHistory=false){
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const urlParams = new URLSearchParams(window.location.search);
  const labParam = urlParams.get('lab') ? parseInt(urlParams.get('lab'), 10) : null;

  if(hash.startsWith('lab-')){
    const lid = Number(hash.replace('lab-', ''));
    if(lid >= 1 && lid <= 25){
      switchView('playground', lid, updateHistory);
      return;
    }
  }

  if(pathname.endsWith('/playground') || hash === 'playground' || pathname.endsWith('/labs') || hash === 'labs'){
    switchView('playground', labParam || 1, updateHistory);
  } else if(pathname.endsWith('/sandbox') || hash === 'sandbox'){
    switchView('sandbox', null, updateHistory);
  } else if(pathname.endsWith('/syllabus') || hash === 'syllabus' || pathname.endsWith('/path') || hash === 'path'){
    switchView('path', null, updateHistory);
  } else if(pathname.endsWith('/library') || hash === 'library'){
    switchView('library', null, updateHistory);
  } else if(pathname.endsWith('/practice') || hash === 'practice'){
    switchView('practice', labParam || 1, updateHistory);
  } else {
    switchView('home', null, updateHistory);
  }
}

function init(){
  populateLabSelect();
  renderLabCarousel();
  bindEvents();
  renderHomePage();
  renderLearningPath();
  renderCategoryFilters();
  renderFormulaLibrary();
  renderLibraryHeroGraphic();
  renderPracticeSection();
  openFormula(state.progress.lastActive || 1);
  selectLabTab('precision');
  registerServiceWorker();

  window.addEventListener('popstate', (e) => {
    if(e.state && e.state.view){
      switchView(e.state.view, e.state.labId, false);
    } else {
      parseCurrentRouteAndSwitch(false);
    }
  });

  parseCurrentRouteAndSwitch(false);
}

init();
