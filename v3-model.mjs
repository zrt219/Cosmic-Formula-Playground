import {formulas, chains} from './formulas.mjs';

// ---------------------------------------------------------------------------
// Public Educational Categories (No internal names exposed)
// ---------------------------------------------------------------------------
export const EDUCATIONAL_CATEGORIES = [
  { id: 'all', name: 'All Concepts', icon: '✨' },
  { id: 'cosmology', name: 'Cosmology & Galaxies', icon: '🌌' },
  { id: 'light', name: 'Light & Observation', icon: '🔭' },
  { id: 'radio', name: 'Radio Astronomy', icon: '📻' },
  { id: 'math', name: 'Math & Inference', icon: '🎯' },
  { id: 'navigation', name: 'Navigation & Estimation', icon: '🧭' },
  { id: 'spaceflight', name: 'Spaceflight & Orbits', icon: '🚀' },
  { id: 'plasma', name: 'Plasma & Space Environment', icon: '⚡' }
];

export const SIDEBAR_CATEGORIES = [
  { id: 'all', name: 'All Formulas', count: 120, icon: '⊞' },
  { id: 'geometry', name: 'Geometry', count: 28, icon: '⬡' },
  { id: 'algebra', name: 'Algebra', count: 18, icon: 'x²' },
  { id: 'trigonometry', name: 'Trigonometry', count: 16, icon: '📐' },
  { id: 'calculus', name: 'Calculus', count: 14, icon: '∫' },
  { id: 'analytic', name: 'Analytic Geometry', count: 12, icon: '✛' },
  { id: 'vectors', name: 'Vectors & 3D', count: 10, icon: '🧊' },
  { id: 'probability', name: 'Probability', count: 10, icon: '🎲' },
  { id: 'statistics', name: 'Statistics', count: 8, icon: '📊' },
  { id: 'physics', name: 'Physics', count: 10, icon: '⚛️' }
];

export const FEATURED_PATHS = [
  { id: 'path-cosmic', name: 'Cosmic Flows', level: 'Beginner', icon: '🚀', desc: 'Cosmic expansion & large-scale structure' },
  { id: 'path-observation', name: 'Deep Observation', level: 'Intermediate', icon: '🌐', desc: 'Dust obscuration & 21-cm radio' },
  { id: 'path-navigation', name: 'Precision Navigation', level: 'Advanced', icon: '🧭', desc: 'Autonomous navigation & filtering' },
  { id: 'path-space', name: 'Space Environments', level: 'Real World', icon: '✨', desc: 'Interstellar physics & plasma' }
];

export const FOUNDATION_FORMULAS = [
  {
    id: 'f-cube',
    title: 'Volume of a Cube',
    question: 'How much space inside a box shape?',
    tex: 'V = s^3',
    path: 'Cosmic Flows',
    category: 'Geometry',
    catId: 'geometry',
    level: 'Beginner',
    progress: 80,
    shape: 'cube',
    targetLab: 1
  },
  {
    id: 'f-sphere',
    title: 'Volume of a Sphere',
    question: 'How much space inside a ball?',
    tex: 'V = \\frac{4}{3}\\pi r^3',
    path: 'Cosmic Flows',
    category: 'Geometry',
    catId: 'geometry',
    level: 'Beginner',
    progress: 60,
    shape: 'sphere',
    targetLab: 2
  },
  {
    id: 'f-pythagoras',
    title: 'Pythagorean Theorem',
    question: 'How to find the missing side of a right triangle?',
    tex: 'a^2 + b^2 = c^2',
    path: 'Cosmic Flows',
    category: 'Geometry',
    catId: 'geometry',
    level: 'Beginner',
    progress: 100,
    shape: 'triangle',
    targetLab: 14
  },
  {
    id: 'f-cylinder',
    title: 'Volume of a Cylinder',
    question: 'How much space inside a can shape?',
    tex: 'V = \\pi r^2 h',
    path: 'Deep Observation',
    category: 'Geometry',
    catId: 'geometry',
    level: 'Intermediate',
    progress: 40,
    shape: 'cylinder',
    targetLab: 8
  },
  {
    id: 'f-circle',
    title: 'Area of a Circle',
    question: 'How much space inside a circle?',
    tex: 'A = \\pi r^2',
    path: 'Cosmic Flows',
    category: 'Geometry',
    catId: 'geometry',
    level: 'Beginner',
    progress: 90,
    shape: 'circle',
    targetLab: 9
  },
  {
    id: 'f-sphere-sa',
    title: 'Surface Area of a Sphere',
    question: 'How much surface covers a ball?',
    tex: 'A = 4\\pi r^2',
    path: 'Deep Observation',
    category: 'Geometry',
    catId: 'geometry',
    level: 'Intermediate',
    progress: 20,
    shape: 'sphere-wire',
    targetLab: 10
  },
  {
    id: 'f-cone',
    title: 'Volume of a Cone',
    question: 'How much space inside a cone?',
    tex: 'V = \\frac{1}{3}\\pi r^2 h',
    path: 'Deep Observation',
    category: 'Geometry',
    catId: 'geometry',
    level: 'Intermediate',
    progress: 50,
    shape: 'cone',
    targetLab: 18
  },
  {
    id: 'f-distance',
    title: 'Distance Between Two Points',
    question: 'How far apart are two points on a coordinate plane?',
    tex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
    path: 'Precision Navigation',
    category: 'Analytic Geometry',
    catId: 'analytic',
    level: 'Intermediate',
    progress: 30,
    shape: 'distance',
    targetLab: 14
  },
  {
    id: 'f-quadratic',
    title: 'Quadratic Formula',
    question: 'How to solve a quadratic equation?',
    tex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
    path: 'Precision Navigation',
    category: 'Algebra',
    catId: 'algebra',
    level: 'Advanced',
    progress: 10,
    shape: 'parabola',
    targetLab: 16
  }
];

export const RECENTLY_VIEWED_ITEMS = [
  { id: 'f-cube', title: 'Cube', tex: 'V = s^3', shape: 'cube', targetLab: 1 },
  { id: 'f-sphere', title: 'Sphere', tex: 'V = \\frac{4}{3}\\pi r^3', shape: 'sphere', targetLab: 2 },
  { id: 'f-pythagoras', title: 'Pythagorean', tex: 'a^2 + b^2 = c^2', shape: 'triangle', targetLab: 14 },
  { id: 'f-cylinder', title: 'Cylinder', tex: 'V = \\pi r^2 h', shape: 'cylinder', targetLab: 8 },
  { id: 'f-cone', title: 'Cone', tex: 'V = \\frac{1}{3}\\pi r^2 h', shape: 'cone', targetLab: 18 }
];

export const SAVED_FORMULAS_ITEMS = [
  { id: 'f-pythagoras', title: 'Pythagorean', tex: 'a^2 + b^2 = c^2', shape: 'triangle', targetLab: 14 },
  { id: 'f-quadratic', title: 'Quadratic Formula', tex: 'x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}', shape: 'parabola', targetLab: 16 },
  { id: 'f-distance', title: 'Distance Formula', tex: 'd = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}', shape: 'distance', targetLab: 14 },
  { id: 'f-sphere', title: 'Sphere Volume', tex: 'V = \\frac{4}{3}\\pi r^3', shape: 'sphere', targetLab: 2 }
];

// ---------------------------------------------------------------------------
// Public 6-Stage Learning Path (Section 19)
// ---------------------------------------------------------------------------
export const LEARNING_STAGES = [
  {
    num: '01',
    id: 'stage-1',
    title: 'Stage 1 — Measuring the Universe',
    description: 'Distance, cosmic expansion, and light wave stretching: establish what space observations actually mean.',
    labs: [1, 2, 11]
  },
  {
    num: '02',
    id: 'stage-2',
    title: 'Stage 2 — Finding Hidden Structure',
    description: 'Density clumps, flow lines, and Bayesian inference: turn messy telescope data into hidden structure.',
    labs: [3, 4, 5, 6, 7]
  },
  {
    num: '03',
    id: 'stage-3',
    title: 'Stage 3 — Seeing Through Dust',
    description: 'Interstellar absorption, color reddening, and 21-cm radio waves: peer through cosmic dust curtains.',
    labs: [8, 9, 10, 12, 13]
  },
  {
    num: '04',
    id: 'stage-4',
    title: 'Stage 4 — Predicting Motion',
    description: 'Spacecraft state propagation, sensor noise, and Kalman filtering: fuse predictions with instruments.',
    labs: [14, 15, 16, 17]
  },
  {
    num: '05',
    id: 'stage-5',
    title: 'Stage 5 — Traveling Farther',
    description: 'Gravity escape, rocket staging, solar sailing, and light latency: conquer interplanetary energy budgets.',
    labs: [18, 19, 20, 21]
  },
  {
    num: '06',
    id: 'stage-6',
    title: 'Stage 6 — Exploring Space Plasma',
    description: 'Electron plasma rhythms, Debye shielding bubbles, Alfvén waves, and magnetic pressure balance.',
    labs: [22, 23, 24, 25]
  }
];

// Compatibility alias for existing test suites
export const ACADEMY_STAGES = LEARNING_STAGES.slice(0, 5);

export const GRAPH_POSITIONS = {
  1:[90,90],2:[90,180],3:[90,270],4:[90,360],5:[90,450],6:[90,540],7:[90,630],
  8:[350,90],9:[350,190],10:[350,290],11:[350,390],12:[350,500],13:[350,610],
  14:[610,230],15:[610,390],
  16:[870,60],17:[870,130],18:[870,200],19:[870,270],20:[870,340],21:[870,410],22:[870,500],23:[870,570],24:[870,640],25:[870,710]
};

export const GRAPH_EDGES = [
  [2,1],[11,1],[1,3],[1,4],[3,4],[4,7],[5,7],[6,7],
  [8,9],[9,10],[11,12],[12,13],[5,14],[6,15],[14,15],
  [16,17],[17,18],[17,20],[18,20],[19,20],[21,14],[22,23],[22,24],[24,25],[23,25]
];

export const SCENARIOS = {
  zoa:{
    name:'Galaxy Drift & Local Attractor',
    description:'Combine galaxy distance, observed recession speed and local velocity divergence to separate cosmic expansion from peculiar motion.',
    inputs:[
      ['H0','H₀','km/s/Mpc',70,50,90],['d','Distance','Mpc',50,1,200],['cz','Observed cz','km/s',4000,0,20000],
      ['a','Scale factor','',1,0.2,1],['f','Growth rate','',0.55,0.1,1.2],['div','Velocity divergence','km/s/Mpc',-19.25,-150,150]
    ]
  },
  obscura:{
    name:'Dust Screen & Radio Sightline',
    description:'Combine dust attenuation with redshifted 21-cm hydrogen signals to estimate what reaches the telescope and how much gas is hidden.',
    inputs:[
      ['tau','Optical depth τ','',1,0,6],['F','Intrinsic flux','arb.',100,1,1000],['z','Redshift z','',0.05,0,0.2],
      ['D','Distance','Mpc',50,1,250],['flux','Integrated H I flux','Jy km/s',2,0.01,50]
    ]
  },
  vlism:{
    name:'Deep Space Interstellar Probe',
    description:'Build a deep space mission envelope: travel time, light latency, local escape context, rocket capability, and space plasma diagnostics.',
    inputs:[
      ['distance','Target distance','AU',300,10,1000],['speedAUyr','Cruise speed','AU/yr',20,1,50],['r','Solar distance for escape context','AU',1,0.05,10],
      ['Isp','Specific impulse','s',450,100,10000],['massRatio','Mass ratio m0/mf','',2.5,1.01,20],['ne','Electron density','cm^-3',0.1,0.001,10],
      ['B','Magnetic field','nT',0.5,0.01,10],['rho','Mass density ρ','10^-22 kg/m^3',2,0.01,1000],['P','Thermal pressure','pPa',0.2,0.001,100]
    ]
  }
};

export function priorityScore(stat={}, {mastered=false, daysSince=999}={}){
  const attempts=Math.max(0,Number(stat.attempts)||0);
  const correct=Math.max(0,Math.min(attempts,Number(stat.correct)||0));
  const accuracy=attempts?correct/attempts:0;
  const unseen=attempts===0?3:0;
  const weak=(1-accuracy)*3;
  const due=Math.min(Math.max(0,daysSince)/7,2);
  const unmastered=mastered?0:1.2;
  return unseen+weak+due+unmastered;
}

export function runScenarioModel(name,v){
  if(!SCENARIOS[name]) throw new Error(`Unknown scenario: ${name}`);
  if(Object.values(v).some(x=>!Number.isFinite(Number(x)))) throw new Error('Scenario inputs must be finite.');
  if(name==='zoa'){
    const r=chains.zoa.run(v);
    return [
      {label:'Expansion speed',value:r.hubble,unit:'km/s',note:'Expected Hubble expansion speed H₀d'},
      {label:'Local tug velocity',value:r.peculiar,unit:'km/s',note:r.label},
      {label:'Matter density contrast',value:r.delta,unit:'',note:'From local divergence via −∇·v/(aHf)'}
    ];
  }
  if(name==='obscura'){
    const r=chains.obscura.run(v);
    const nu=formulas.find(f=>f.id===12).calc({z:v.z}).value;
    const mass=formulas.find(f=>f.id===13).calc({D:v.D,flux:v.flux}).value;
    return [
      {label:'Dust extinction',value:r.A,unit:'mag',note:'Starlight dimming in magnitudes'},
      {label:'Light transmission',value:r.transmission*100,unit:'%',note:'Percentage of intrinsic light surviving'},
      {label:'Observed brightness',value:r.flux,unit:'arb.',note:'Detected flux after dust curtain'},
      {label:'Observed radio frequency',value:nu,unit:'MHz',note:'21-cm radio line redshifted by z'},
      {label:'Hydrogen mass',value:mass,unit:'M☉',note:'Total neutral hydrogen mass'}
    ];
  }
  const r=chains.vlism.run(v);
  const fp=formulas.find(f=>f.id===22).calc({ne:v.ne}).value;
  const va=formulas.find(f=>f.id===24).calc({B:v.B,rho:v.rho}).value;
  const beta=formulas.find(f=>f.id===25).calc({P:v.P,B:v.B}).value;
  return [
    {label:'One-way light time',value:r.lightHours,unit:'h',note:'Communication radio latency'},
    {label:'Cruise travel time',value:r.travelYears,unit:'yr',note:'Distance / cruise speed'},
    {label:'Solar escape speed',value:r.escape,unit:'km/s',note:'Threshold speed to leave solar gravity'},
    {label:'Rocket velocity gain',value:r.deltaV,unit:'km/s',note:'Velocity change capability Δv'},
    {label:'Electron plasma frequency',value:fp,unit:'Hz',note:'Electrostatic oscillation frequency'},
    {label:'Magnetic wave speed',value:va,unit:'km/s',note:'Transverse Alfvén wave speed'},
    {label:'Plasma pressure ratio',value:beta,unit:'',note:'Thermal / magnetic pressure beta'}
  ];
}

// ---------------------------------------------------------------------------
// Concept Metadata & Structured Playground Blocks
// Plain English leads; formal notation is secondary.
// ---------------------------------------------------------------------------
const PB=(name,subtitle,icon,color,key=null,role='input',desc='')=>({name,subtitle,icon,color,key,role,desc});
const PO=(operator)=>({operator});

export const PLAYGROUND_BLOCKS = {
  1:{
    category:'cosmology',
    publicTitle:'Space Stretch & Galaxy Drift',
    scientificTitle:'Hubble Flow & Peculiar Velocity',
    question:'How does cosmic expansion compete with local gravitational pull?',
    stageType:'expanding-grid',
    eli5Story:'Imagine dots painted on stretchy fabric. Expansion carries galaxies apart, while nearby gravity pulls individual galaxies faster or slower than average.',
    increases:'Increasing distance boosts the expansion speed. Increasing local tug increases the galaxy\'s deviation from smooth expansion.',
    decreases:'Decreasing distance brings the galaxy into the realm where local gravity dominates over cosmic expansion.',
    realWorld:'Astronomers use this to map cosmic flows, Great Attractors, and hidden dark matter filaments across millions of light-years.',
    analogy:'Walking inside a moving passenger train: the train has its velocity, and your walking adds or subtracts from it.',
    blocks:[
      PB('What We Measure','cz','🔭','sky','cz','input','Telescope radial speed measured from spectral Doppler lines.'),
      PO('−'),
      PB('Expansion Rate','H₀','🌌','indigo','H0','input','Cosmic expansion rate: how fast space stretches per megaparsec.'),
      PO('×'),
      PB('How Far Away','d','📏','amber','d','input','True geometric distance to the target galaxy in megaparsecs.'),
      PO('='),
      PB('Local Tug','vₚₑc','🧲','coral',null,'output','Net motion caused purely by gravitational pull of nearby structures.')
    ]
  },
  2:{
    category:'cosmology',
    publicTitle:'Light Dimming & Cosmic Distance',
    scientificTitle:'Distance Modulus',
    question:'How does a star\'s brightness reveal how far away it is?',
    stageType:'distance-ladder',
    eli5Story:'Light spreads across a widening sphere. Every time a star is 10× farther away, its brightness drops by exactly 5 brightness steps (magnitudes).',
    increases:'Pushing a star farther away increases its distance modulus by 5 magnitudes for every 10× distance increase.',
    decreases:'Moving closer makes the apparent brightness approach the absolute brightness.',
    realWorld:'Used with standard candles (Cepheid variable stars and Type Ia supernovae) to measure the scale of the universe.',
    analogy:'A 60W lightbulb in your room is blinding, but seen from a mile away on a dark highway, it looks like a faint dot.',
    blocks:[
      PB('How Far Away','d','📏','sky','d','input','Actual distance in parsecs (1 parsec ≈ 3.26 light-years).'),
      PO('→'),
      PB('Brightness Gap','μ = m − M','💡','indigo',null,'output','Difference between apparent and absolute magnitude: every 5 magnitudes is 10× distance.')
    ]
  },
  3:{
    category:'cosmology',
    publicTitle:'Cosmic Clumps & Cosmic Voids',
    scientificTitle:'Density Contrast',
    question:'Is this region crowded or hollowed out compared to the cosmic average?',
    stageType:'density-bubbles',
    eli5Story:'Instead of counting every atom, cosmologists ask: is this pocket crowded (a cluster) or hollowed out (a cosmic void) compared to the cosmic average?',
    increases:'Increasing local density above the mean pushes δ positive, indicating gravitationally collapsing structure.',
    decreases:'Lowering local density below the mean makes δ negative, representing an expanding underdense cosmic void.',
    realWorld:'Maps of cosmic density contrast trace the cosmic web of filaments, cluster nodes, and empty supervoids.',
    analogy:'Counting people in a subway car versus the average density across the entire transit network.',
    blocks:[
      PB('Stuff Here','ρ','🫧','coral','rho','input','Local mass density inside this selected cosmic region.'),
      PO('vs'),
      PB('Average Stuff','ρ̄','⚖️','amber','mean','input','Mean background density of the universe averaged over large scales.'),
      PO('→'),
      PB('Clump / Void Score','δ','🗺️','indigo',null,'output','Dimensionless contrast: positive is a massive cluster, negative is a cosmic void.')
    ]
  },
  4:{
    category:'cosmology',
    publicTitle:'Inflowing Streams & Hidden Mass',
    scientificTitle:'Linear Continuity Equation',
    question:'When galaxies flow inward toward a point, how much matter must be pulling them?',
    stageType:'flow-field',
    eli5Story:'Picture arrows floating through space. If the velocity arrows converge inward from all directions, an overdense mass is pulling them.',
    increases:'Greater matter overdensity or faster growth rate causes stronger inward convergence of peculiar velocity.',
    decreases:'An underdense region causes peculiar velocity to diverge outward like gas escaping a container.',
    realWorld:'Used to reconstruct dark matter distribution directly from peculiar velocity surveys without needing starlight.',
    analogy:'Watching leaves blowing across a field: when they all blow toward one ditch, you know that is where the slope dips.',
    blocks:[
      PB('Cosmic Scale','a','🪐','sky','a','input','Scale factor representing the expansion size of the universe.'),
      PO('×'),
      PB('Expansion Rate','H','🌌','indigo','H','input','Hubble parameter at this cosmological epoch.'),
      PO('×'),
      PB('Growth Response','f','🌱','emerald','f','input','Logarithmic growth rate of cosmic structure ~ Ωm^0.55.'),
      PO('×'),
      PB('Matter Clump','δₘ','🫧','coral','delta','input','Fractional matter overdensity driving the gravitational flow.'),
      PO('→'),
      PB('Flow Squeeze','∇·v','🌀','amber',null,'output','Divergence of velocity field: negative means converging inward onto an attractor.')
    ]
  },
  5:{
    category:'math',
    publicTitle:'Updating Beliefs with Evidence',
    scientificTitle:'Bayes\' Theorem',
    question:'How does new telescope data shift our confidence in a scientific idea?',
    stageType:'belief-scale',
    eli5Story:'Start with a prior belief, then let new evidence tip the balance. Strong evidence for your idea raises its probability; strong evidence for the alternative pushes back.',
    increases:'Stronger likelihood or higher prior probability tilts the posterior belief toward certainty.',
    decreases:'If alternative explanations fit the data better, your belief in the hypothesis drops.',
    realWorld:'Core mathematical foundation for cosmological model selection, exoplanet confirmation, and autonomous spacecraft state estimation.',
    analogy:'A weather forecast said 10% chance of rain. When you look out and see dark thunderclouds, you update your belief.',
    blocks:[
      PB('Idea Fits Data','P(D|θ)','🎯','emerald','like','input','Likelihood that observations would occur if the attractor hypothesis is true.'),
      PO('×'),
      PB('Starting Belief','P(θ)','🧠','indigo','prior','input','Prior probability before seeing the latest telescope measurement.'),
      PO('vs'),
      PB('Alternative Fits','P(D|¬θ)','↔️','coral','altLike','input','Likelihood that the data came from alternative background models.'),
      PO('→'),
      PB('Updated Belief','P(θ|D)','✨','sky',null,'output','Posterior probability of the hypothesis given the combined evidence.')
    ]
  },
  6:{
    category:'math',
    publicTitle:'The Bullseye Mismatch Score',
    scientificTitle:'Gaussian Likelihood & Chi-Square',
    question:'How far is our model from actual observations once we account for fuzziness?',
    stageType:'uncertainty-target',
    eli5Story:'Missing the bullseye by 2 can be tiny or huge depending on how fuzzy the measurement is. Chi-square measures the miss in units of uncertainty.',
    increases:'A larger gap between prediction and observation increases the mismatch score quadratically.',
    decreases:'Smaller measurement uncertainty penalizes errors more severely, while large error bars forgive small discrepancies.',
    realWorld:'Used across every scientific discipline to find best-fit parameters and determine goodness-of-fit.',
    analogy:'Throwing darts in the dark: missing by 2 inches is huge for a laser dart, but tiny in high wind.',
    blocks:[
      PB('What We Saw','d','🎯','sky','d','input','Actual observed telemetry or telescope measurement value.'),
      PO('−'),
      PB('What We Expected','m','🧮','indigo','m','input','Theoretical model prediction for this observable.'),
      PO('÷'),
      PB('Measurement Fuzziness','σ','☁️','amber','sigma','input','Measurement uncertainty (standard deviation) of the instrument.'),
      PO('→'),
      PB('Mismatch Score','χ²','📍','coral',null,'output','Squared error standardized by uncertainty: lower values mean better agreement.')
    ]
  },
  7:{
    category:'math',
    publicTitle:'The Smart Signal Sieve',
    scientificTitle:'Wiener Reconstruction',
    question:'How do you reconstruct true cosmic structure through noisy instrument data?',
    stageType:'signal-sieve',
    eli5Story:'Think of a smart sieve that knows what real signal should look like and how noisy the instrument is. It lets trustworthy structure through and damps the rest.',
    increases:'Higher signal-to-noise ratio instructs the filter to trust small features in the raw data.',
    decreases:'When noise overwhelms signal, the filter prudently pulls the estimate back toward the cosmological mean.',
    realWorld:'Used to reconstruct whole-sky dark matter density maps from noisy peculiar velocity catalogs.',
    analogy:'Noise-cancelling headphones filtering out background hiss to reveal the true acoustic signal.',
    blocks:[
      PB('Signal Pattern','S','🧩','indigo','S','input','Prior expected variance or power spectrum of true physical signal.'),
      PB('Sensor Response','R','📡','sky','R','input','Instrument transfer function mapping physical states to raw readouts.'),
      PB('Measurement Messiness','N','🌫️','coral','N','input','Measurement noise variance in the detector.'),
      PB('Raw Data','d','📥','amber','d','input','Raw telemetry or survey measurement received.'),
      PO('→'),
      PB('Best Reconstruction','ŝ','✨','emerald',null,'output','Optimal minimum mean square error estimate of the underlying physical signal.')
    ]
  },
  8:{
    category:'light',
    publicTitle:'See How Dust Dims Starlight',
    scientificTitle:'Radiative Transfer',
    question:'What fraction of starlight makes it through an interstellar dust cloud?',
    stageType:'dust-filter',
    eli5Story:'Send a beam of light through a dust curtain. Each extra layer of dust particles removes another fixed fraction of the photons through scattering and absorption.',
    increases:'Adding optical depth exponentially extinguishes the emerging starlight beam: e^(-τ).',
    decreases:'Lowering dust optical depth allows pristine starlight to pass unattenuated.',
    realWorld:'Explains why galaxies behind the Milky Way plane are heavily obscured and dimmed.',
    analogy:'Shining a flashlight through layers of tissue paper: each sheet absorbs and scatters a fraction of the photons.',
    blocks:[
      PB('Glow Source','I₀','🔦','amber','I0','input','Intrinsic radiation intensity before entering the absorbing medium.'),
      PO('through'),
      PB('Dust Curtain','τ','🌫️','coral','tau','input','Optical depth: dimensionless thickness of the scattering and absorbing cloud.'),
      PO('→'),
      PB('What Gets Through','I','✨','sky',null,'output','Attenuated intensity surviving through the medium according to e^(-τ).')
    ]
  },
  9:{
    category:'light',
    publicTitle:'Dust Curtain Thickness',
    scientificTitle:'Optical Extinction',
    question:'How do astronomers measure dust thickness in magnitudes of light lost?',
    stageType:'dust-extinction',
    eli5Story:'Astronomers describe dust curtains as optical depth or as magnitudes of extinction. A dust curtain of τ=1 dims light by approximately 1.086 magnitudes.',
    increases:'Higher optical depth increases the magnitude loss, hiding distant stars from optical telescopes.',
    decreases:'Thin dust clouds produce negligible magnitude loss.',
    realWorld:'Used to correct Hubble and James Webb Space Telescope observations for interstellar dust obscuration.',
    analogy:'Wearing tinted sunglasses: darker tint absorbs a greater percentage of incoming solar radiation.',
    blocks:[
      PB('Dust Thickness','τ','🌫️','coral','tau','input','Optical depth of the interstellar dust layer.'),
      PB('True Brightness','F₀','💡','amber','F','input','Intrinsic stellar flux that would be detected without dust.'),
      PO('→'),
      PB('Observed Brightness','Fobs','👁️','sky',null,'output','Received flux after dust extinction attenuation.')
    ]
  },
  10:{
    category:'light',
    publicTitle:'Why Interstellar Dust Reddens Light',
    scientificTitle:'Color Excess',
    question:'Why does dust scatter blue photons away while letting red photons through?',
    stageType:'color-prism',
    eli5Story:'Interstellar dust grains are microscopic. They easily scatter short blue wavelengths of light away in all directions, while letting longer red wavelengths pass straight through.',
    increases:'More intervening dust causes greater differential blue loss, increasing color excess E(B-V).',
    decreases:'Pristine sightlines with zero dust produce zero selective reddening.',
    realWorld:'Crucial for determining true stellar temperatures and mapping interstellar dust clouds across the Milky Way.',
    analogy:'Sunsets on Earth look deep red because atmospheric particles scatter the blue light away first.',
    blocks:[
      PB('Blue Dimming','A_B','🔵','sky','AB','input','Total extinction in the blue photometric filter band (magnitudes).'),
      PO('−'),
      PB('Visual Dimming','A_V','🟡','amber','AV','input','Total extinction in the visual (green-yellow) filter band (magnitudes).'),
      PO('='),
      PB('Color Excess','E(B−V)','🌈','coral',null,'output','Selective reddening: measures how much redder a star appears than its intrinsic color.')
    ]
  },
  11:{
    category:'light',
    publicTitle:'The Stretching Light Wave',
    scientificTitle:'Cosmological Redshift',
    question:'How does traveling through expanding space stretch the wavelength of light?',
    stageType:'wave-stretch',
    eli5Story:'Draw a wave on a rubber band and stretch the band. As space expands during the billions of years light travels, the wavelength physically stretches toward the red.',
    increases:'More distant galaxies have light that traveled longer through expanding space, yielding larger redshift z.',
    decreases:'Nearby objects exhibit tiny cosmological redshifts, easily dominated by local peculiar motions.',
    realWorld:'The universal benchmark for cosmological distance and the history of cosmic expansion.',
    analogy:'Drawing a wave on a rubber band and stretching the band: the crests pull apart into longer wavelengths.',
    blocks:[
      PB('Starting Wave','λrest','🔵','sky','rest','input','Laboratory rest wavelength of the atomic or molecular spectral line.'),
      PO('→'),
      PB('What We See','λobs','🔴','coral','obs','input','Wavelength measured at the telescope after cosmic transit.'),
      PO('='),
      PB('Wave Stretch','z','↔️','amber',null,'output','Cosmological redshift z: directly measures the scale expansion factor 1+z.')
    ]
  },
  12:{
    category:'radio',
    publicTitle:'Tuning In to Cosmic Hydrogen',
    scientificTitle:'21-cm H I Redshifted Frequency',
    question:'What frequency must a radio telescope tune to hear a distant hydrogen cloud?',
    stageType:'radio-dish',
    eli5Story:'Neutral hydrogen atom electrons flip their magnetic spin, broadcasting at an exact rest frequency of 1420.4 MHz. Cosmic expansion stretches those radio waves to lower frequencies.',
    increases:'Higher redshift slides the broadcast lower down the radio spectrum.',
    decreases:'Unshifted local hydrogen appears right at the 1420.4 MHz laboratory frequency.',
    realWorld:'Allows radio telescopes to see right through interstellar dust and detect galaxies invisible to optical telescopes.',
    analogy:'A radio broadcast station transmitting at 100 MHz will sound shifted if the car is speeding away.',
    blocks:[
      PB('Wave Stretch','z','↔️','coral','z','input','Cosmic redshift of the galaxy containing the neutral hydrogen gas.'),
      PB('Hydrogen Station','ν₂₁ = 1420.4 MHz','📻','indigo',null,'calculated','Rest frequency of the hyperfine spin-flip transition of neutral hydrogen.'),
      PO('→'),
      PB('Tuned Radio Dial','νobs','📡','sky',null,'output','Frequency you must tune your radio telescope dish to detect the hidden galaxy.')
    ]
  },
  13:{
    category:'radio',
    publicTitle:'Weighing Invisible Gas Clouds',
    scientificTitle:'Neutral Hydrogen Mass',
    question:'How do radio waves tell us the total mass of neutral hydrogen in a galaxy?',
    stageType:'hi-mass',
    eli5Story:'Every spin-flip produces one radio photon. Because 21-cm emission is optically thin, counting the total radio flux tells us the exact total mass of hydrogen gas in the galaxy.',
    increases:'Greater integrated radio flux or larger distance indicates a far more massive gas reservoir.',
    decreases:'Fainter radio emissions correspond to dwarf galaxies or gas-depleted systems.',
    realWorld:'Measures the raw fuel reservoir available for future star formation in distant galaxies.',
    analogy:'Listening to rainfall: a louder shower on your roof means more raindrops are falling per minute.',
    blocks:[
      PB('How Far Away','D','📏','indigo','D','input','Luminosity distance to the galaxy in megaparsecs.'),
      PO('² ×'),
      PB('Radio Line Strength','∫Sdv','📻','sky','flux','input','Integrated 21-cm radio line flux density in Jansky kilometers per second.'),
      PO('→'),
      PB('Hydrogen Mass','M_HI','☁️','emerald',null,'output','Total mass of neutral hydrogen gas fueling star formation in solar masses.')
    ]
  },
  14:{
    category:'navigation',
    publicTitle:'Predicting Spacecraft Motion',
    scientificTitle:'State-Space Propagation',
    question:'How does a flight computer project where a spacecraft will be next second?',
    stageType:'state-predictor',
    eli5Story:'Your spacecraft starts somewhere, orbital physics pushes it forward, control thrusters nudge it, and sensors report what they see. Navigation combines these into an optimal state.',
    increases:'Larger control inputs or physics velocity components project the state further along its orbit.',
    decreases:'Process noise and external disturbances add uncertainty to the projected position.',
    realWorld:'Core orbital propagation loop used in every spacecraft guidance computer from Apollo to Artemis.',
    analogy:'A baseball outfielder projecting the trajectory of a fly ball while sprinting to make the catch.',
    blocks:[
      PB('Where We Are','xₖ','🚀','indigo','x','input','Spacecraft position and velocity at current time step k.'),
      PB('Physics Step','F','⏭️','sky','F','input','Orbital dynamics transition matrix carrying states forward in time.'),
      PB('Control Push','uₖ','🕹️','coral','u','input','Commanded thruster acceleration vector.'),
      PB('Process Wiggle','wₖ','🌫️','emerald','w','input','Unmodeled physical disturbances like solar radiation pressure fluctuations.'),
      PO('→'),
      PB('Next State Guess','xₖ₊₁','📍','indigo',null,'output','Updated predicted spacecraft state at time step k+1.')
    ]
  },
  15:{
    category:'navigation',
    publicTitle:'Who Gets More Say: Model or Sensor?',
    scientificTitle:'Kalman Gain & Update',
    question:'When your prediction and your sensor disagree, how do you find the best guess?',
    stageType:'kalman-ping',
    eli5Story:'You have a theoretical prediction and a noisy sensor reading. The Kalman gain decides how far to nudge your belief toward the sensor based on which one is more trustworthy.',
    increases:'High prediction uncertainty makes the filter trust the sensor reading almost completely (K ≈ 1).',
    decreases:'High sensor noise causes the filter to rely predominantly on the orbital physics model (K ≈ 0).',
    realWorld:'Autonomous rendezvous, GPS navigation, and deep space probe trajectory reconstruction.',
    analogy:'Two witnesses describing an accident: you trust the one with clear vision and glasses more.',
    blocks:[
      PB('Model Uncertainty','P','☁️','amber','P','input','Variance of the prior state prediction.'),
      PB('Sensor Noise','R','🌫️','coral','R','input','Variance of the measurement sensor noise.'),
      PB('Model Prediction','x⁻','🚀','indigo','x','input','Predicted state before incorporating the new measurement.'),
      PB('Sensor Ping','z','📍','emerald','z','input','Actual sensor measurement returned by radar or optical tracker.'),
      PO('→'),
      PB('Best Combined Guess','x̂','✨','sky',null,'output','Optimal state update combining model prediction and sensor evidence.')
    ]
  },
  16:{
    category:'spaceflight',
    publicTitle:'The Gravity Well',
    scientificTitle:'Inverse-Square Gravitational Acceleration',
    question:'How does gravitational pull drop off as you fly farther from a planet or sun?',
    stageType:'gravity-well',
    eli5Story:'Gravity is like a steep funnel well. Close to a star or planet, the gravitational slope is steep. Step twice as far away, and the pull drops to one quarter.',
    increases:'A more massive central primary deepens the gravity well and steepens acceleration.',
    decreases:'Doubling distance reduces gravitational acceleration by a factor of 4.',
    realWorld:'Calculates orbital attraction, trajectory deflections, and gravitational slingshot maneuvers.',
    analogy:'A campfire: stepping twice as far away cuts the warmth you feel to one quarter.',
    blocks:[
      PB('Gravity Strength','μ = GM','☀️','amber','mu','input','Standard gravitational parameter of the primary central body.'),
      PO('÷'),
      PB('Distance²','r²','📏','indigo','r','input','Distance from central body squared (inverse square law).'),
      PO('='),
      PB('Gravity Pull','|a|','⬇️','coral',null,'output','Local gravitational acceleration vector magnitude in meters per second squared.')
    ]
  },
  17:{
    category:'spaceflight',
    publicTitle:'Trading Height for Speed',
    scientificTitle:'Vis-Viva Equation',
    question:'How fast does a spacecraft race at the low point of an orbit versus the high point?',
    stageType:'orbit-ellipse',
    eli5Story:'An elliptical orbit is a constant trade between altitude and speed. Near the Sun (perihelion), the craft races at maximum speed; far out (aphelion), it slows to a crawl.',
    increases:'Decreasing distance r causes kinetic speed to surge as potential energy drops.',
    decreases:'Larger orbital size (semi-major axis a) corresponds to higher total mechanical energy.',
    realWorld:'Fundamental formula for planning orbit insertion, interplanetary transfer, and flybys.',
    analogy:'A roller coaster: zooming fast at the bottom of the dip and crawling slowly at the peak.',
    blocks:[
      PB('Where You Are','r','📍','coral','r','input','Current distance from the Sun in astronomical units.'),
      PB('Orbit Size','a','🛰️','indigo','a','input','Semi-major axis defining the overall energy and size of the orbit.'),
      PB('Solar Gravity','μ☉','☀️','amber',null,'calculated','Sun standard gravitational parameter.'),
      PO('→'),
      PB('Orbital Speed','v','⚡','sky',null,'output','Instantaneous orbital speed derived from conservation of energy.')
    ]
  },
  18:{
    category:'spaceflight',
    publicTitle:'The Cosmic Escape Threshold',
    scientificTitle:'Two-Body Escape Velocity',
    question:'What speed guarantees a spacecraft will never fall back to its home world?',
    stageType:'escape-trajectory',
    eli5Story:'Escape speed is the exact kinetic threshold where a spacecraft has enough energy to coast away into infinity without falling back into the gravitational well.',
    increases:'Starting deeper in the gravitational well (smaller r) requires a higher escape speed.',
    decreases:'Farther out from the primary, the escape threshold drops steadily.',
    realWorld:'Determines launch booster requirements for interplanetary and interstellar exploration missions.',
    analogy:'Throwing a ball so hard it never arcs back to Earth.',
    blocks:[
      PB('Distance From Sun','r','📏','indigo','r','input','Radial distance from the central gravitating body in AU.'),
      PB('Solar Gravity','μ☉','☀️','amber',null,'calculated','Central gravitational mass parameter.'),
      PO('→'),
      PB('Escape Speed','vesc','🚀','coral',null,'output','Minimum speed needed for parabolic or hyperbolic escape with zero remaining energy at infinity.')
    ]
  },
  19:{
    category:'spaceflight',
    publicTitle:'The Fuel Penalty & Velocity Gain',
    scientificTitle:'Tsiolkovsky Rocket Equation',
    question:'Why does every extra km/s of speed require exponentially more fuel?',
    stageType:'rocket-blast',
    eli5Story:'A rocket speeds up by hurling mass out its engine nozzle. The brutal catch is that propellant must also accelerate all the unused propellant still inside the tanks.',
    increases:'Higher exhaust speed (specific impulse) dramatically increases the velocity gained per kilogram of propellant.',
    decreases:'Adding payload mass quickly shrinks the available velocity budget.',
    realWorld:'The foundational tyranny of rocketry governing every space mission architecture.',
    analogy:'Pushing a heavy cart while having to push all the extra snacks you packed for the trip.',
    blocks:[
      PB('Engine Efficiency','Isp','🔥','coral','Isp','input','Specific impulse in seconds: measures how much thrust you get per propellant burn rate.'),
      PB('Wet Launch Mass','m₀','⛽','amber','m0','input','Fully fueled initial launch or maneuver mass.'),
      PO('÷'),
      PB('Dry Empty Mass','mf','🚀','indigo','mf','input','Final payload and empty stage dry mass after propellant burn.'),
      PO('→'),
      PB('Velocity Gain','Δv','⚡','sky',null,'output','Total velocity change capability available for mission maneuvers.')
    ]
  },
  20:{
    category:'spaceflight',
    publicTitle:'Riding the Sunlight Beam',
    scientificTitle:'Solar Sail Lightness Number',
    question:'How big and light must a reflective mirror be to overcome the Sun\'s gravity?',
    stageType:'solar-sail',
    eli5Story:'Sunlight photons carry momentum. When they bounce off a giant reflective sail, they transfer a tiny physical push. If the sail is light enough, solar pressure can exceed gravity.',
    increases:'Larger reflective area per unit mass boosts lightness number β above 1, enabling pure solar levitation.',
    decreases:'Heavier payloads diminish the radiation pressure acceleration.',
    realWorld:'Enables propellantless propulsion for deep-space science probes like IKAROS and LightSail.',
    analogy:'A giant kite pushed by the wind, except the wind is pure sunlight photons.',
    blocks:[
      PB('Sail Membrane Area','A','⛵','sky','A','input','Reflective solar sail membrane area in square meters.'),
      PO('÷'),
      PB('Total Spacecraft Mass','M','🧱','coral','M','input','Total spacecraft and deployed sail mass in kilograms.'),
      PO('→'),
      PB('Sail Lightness Power','β','☀️','amber',null,'output','Dimensionless lightness number: ratio of solar radiation pressure force to solar gravity pull.')
    ]
  },
  21:{
    category:'spaceflight',
    publicTitle:'The Deep Space Delay',
    scientificTitle:'One-Way Communication Delay',
    question:'How long must mission control wait for a radio signal across deep space?',
    stageType:'light-time',
    eli5Story:'Radio waves travel at the speed of light (~300,000 km/s). Across planetary distances, light travel time introduces communication delays from minutes to hours.',
    increases:'Reaching the edge of the solar system (300 AU) introduces over 41 hours of one-way latency.',
    decreases:'Inner planet distances allow command rounds within minutes.',
    realWorld:'Requires deep-space probes like Voyager and New Horizons to make autonomous real-time decisions.',
    analogy:'Sending a letter across the ocean: you cannot have a real-time phone conversation with a 1-day delivery lag.',
    blocks:[
      PB('How Far Away','d','📏','indigo','d','input','Distance between probe and Earth tracking antenna in AU.'),
      PO('÷'),
      PB('Signal Speed','c','✨','amber',null,'calculated','Speed of light in vacuum (~299,792 km/s).'),
      PO('='),
      PB('One-Way Message Delay','t','📡','sky',null,'output','One-way communications travel time in hours: doubled for round-trip commands.')
    ]
  },
  22:{
    category:'plasma',
    publicTitle:'The Plasma Electron Rhythm',
    scientificTitle:'Electron Plasma Frequency',
    question:'How fast do electrons slosh back and forth when disturbed in space plasma?',
    stageType:'plasma-wave',
    eli5Story:'Electrons in space plasma are mobile while ions are heavy and sluggish. When displaced, the electrostatic restoring force makes the electron sea oscillate at a natural frequency.',
    increases:'Denser electron populations oscillate at higher frequencies: f_pe ∝ √n_e.',
    decreases:'Tenous solar wind plasma oscillates slowly at audio frequencies.',
    realWorld:'Voyager 1 used plasma wave oscillations to prove it had crossed the heliopause into the pristine interstellar medium.',
    analogy:'A bowl of gelatin: tap it, and the entire mass jiggles at a specific natural frequency.',
    blocks:[
      PB('Electron Crowd','nₑ','🔹','sky','ne','input','Number density of electrons per cubic centimeter in the local plasma.'),
      PO('→'),
      PB('Plasma Rhythm','fpe','🎵','indigo',null,'output','Characteristic frequency of collective electrostatic electron oscillations.')
    ]
  },
  23:{
    category:'plasma',
    publicTitle:'The Electrostatic Shielding Bubble',
    scientificTitle:'Debye Screening Length',
    question:'Over what distance does warm space plasma hide an electric charge?',
    stageType:'debye-bubble',
    eli5Story:'A plasma rearranges mobile charges around any intruder. Opposite charges crowd around the test particle, forming a shielding bubble that cancels out its electric field.',
    increases:'Higher electron temperature gives particles more thermal kinetic energy to escape tight screening, expanding the bubble.',
    decreases:'Denser plasma contains more mobile charges, shrinking the Debye screening distance.',
    realWorld:'Determines whether an interstellar probe interacts with space plasma as an individual object or as a bulk fluid.',
    analogy:'A celebrity surrounded by a swarm of fans: someone standing outside the crowd cannot see the celebrity.',
    blocks:[
      PB('Particle Energy','Tₑ','🔥','coral','Te','input','Thermal temperature of the electron gas in Kelvin.'),
      PB('Particle Crowd','nₑ','🔹','sky','ne','input','Number density of free electrons per cubic centimeter.'),
      PO('→'),
      PB('Shielding Bubble Size','λD','🫧','emerald',null,'output','Scale distance over which mobile electrons screen out external electrostatic fields.')
    ]
  },
  24:{
    category:'plasma',
    publicTitle:'Magnetic Waves on Plasma Strings',
    scientificTitle:'Alfvén Wave Speed',
    question:'How fast do magnetic vibrations travel across magnetized space plasma?',
    stageType:'alfven-wave',
    eli5Story:'Magnetic field lines threaded through conducting plasma act like plucked guitar strings. Stronger magnetic fields carry ripples faster; denser plasma adds inertia and slows waves down.',
    increases:'Higher magnetic field strength increases magnetic tension and wave propagation velocity.',
    decreases:'Higher mass density increases plasma inertia, slowing the Alfvén wave.',
    realWorld:'Explains solar corona heating, interstellar turbulence, and planetary magnetospheric pulsations.',
    analogy:'Plucking a guitar string: tighter strings send waves racing faster; heavier strings slow them down.',
    blocks:[
      PB('Magnetic Strength','B','🧲','indigo','B','input','Magnetic field strength in nanoTeslas providing magnetic tension.'),
      PO('÷'),
      PB('Plasma Heaviness','ρ','☁️','amber','rho','input','Mass density of ions in 10^-22 kg/m^3 providing fluid inertia.'),
      PO('→'),
      PB('Magnetic Wave Speed','vA','〰️','sky',null,'output','Propagation speed of transverse magnetohydrodynamic waves along magnetic field lines.')
    ]
  },
  25:{
    category:'plasma',
    publicTitle:'Particle Push vs. Magnetic Grip',
    scientificTitle:'Plasma Beta',
    question:'Who controls the space environment: the gas thermal pressure or magnetic field lines?',
    stageType:'pressure-balance',
    eli5Story:'Plasma beta is a cosmic tug of war between thermal particle pressure and magnetic field pressure. When β > 1, gas dynamics control the flow; when β < 1, magnetic field lines dictate motion.',
    increases:'Higher thermal pressure pushes β > 1 into the gas-dominated fluid regime.',
    decreases:'Stronger magnetic fields force β < 1, trapping and guiding charged particles along field lines.',
    realWorld:'Determines magnetic reconnection, heliopause boundary stability, and solar flare trigger mechanisms.',
    analogy:'A tug of war between expanding steam and strong steel bands wrapped around the pipe.',
    blocks:[
      PB('Particle Push','Pthermal','🔥','coral','P','input','Kinetic thermal pressure of plasma particles in picoPascals.'),
      PO('vs'),
      PB('Magnetic Grip','B²/2μ₀','🧲','indigo','B','input','Magnetic field energy density in nanoTeslas resisting compression.'),
      PO('='),
      PB('Who Dominates?','βplasma','⚖️','emerald',null,'output','Ratio of kinetic to magnetic pressure: beta > 1 is gas-dominated, beta < 1 is magnetically controlled.')
    ]
  }
};

export function getPlaygroundBlocks(id){
  const model = PLAYGROUND_BLOCKS[Number(id)];
  if(!model) throw new Error(`No playground model for lab ${id}`);
  return model;
}

export const CONCEPT_TITLES = Object.fromEntries(
  Object.entries(PLAYGROUND_BLOCKS).map(([k, v]) => [k, { concept: v.publicTitle, formal: v.scientificTitle }])
);
