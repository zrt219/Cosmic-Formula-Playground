import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  formulas, missions, unitDrills, chains,
  coreLabIds, coreEquationCount, AU, C, EPS0, E_CHARGE, M_E, M_P, K_B, MU0
} from '../formulas.mjs';

const near=(a,b,rel=1e-6,abs=1e-9)=>Math.abs(a-b)<=Math.max(abs,Math.abs(b)*rel);
const vals=f=>Object.fromEntries(f.inputs.map(i=>[i.k,i.v]));


// 2022 CODATA constants, latest NIST adjustment available when v0.2 was built.
assert.equal(C,299792458,'speed of light exact SI value');
assert.equal(E_CHARGE,1.602176634e-19,'elementary charge exact SI value');
assert.equal(K_B,1.380649e-23,'Boltzmann constant exact SI value');
assert.equal(EPS0,8.8541878188e-12,'2022 CODATA vacuum permittivity');
assert.equal(M_E,9.1093837139e-31,'2022 CODATA electron mass');
assert.equal(M_P,1.67262192595e-27,'2022 CODATA proton mass');
assert.equal(MU0,1.25663706127e-6,'2022 CODATA vacuum permeability');

assert.equal(formulas.length,25,'exactly 25 formula labs');
assert.deepEqual(formulas.map(f=>f.id),Array.from({length:25},(_,i)=>i+1),'ids are 1..25');
assert.equal(new Set(formulas.map(f=>f.id)).size,25,'formula ids unique');
assert.equal(coreLabIds.size,11,'Core 12 equations intentionally live in 11 numbered labs');
assert.equal(coreEquationCount,12,'source curriculum Core 12 count');

for(const f of formulas){
  assert.ok(f.title && f.tex && f.eli5 && f.mental && f.why,`lab ${f.id} core text fields`);
  assert.ok(Array.isArray(f.symbols) && f.symbols.length>0,`lab ${f.id} symbols`);
  assert.ok(Array.isArray(f.inputs) && f.inputs.length>0,`lab ${f.id} inputs`);
  assert.ok(Array.isArray(f.derive) && f.derive.length>=3,`lab ${f.id} derivation steps`);
  assert.ok(Array.isArray(f.assumptions) && f.assumptions.length>=1,`lab ${f.id} assumptions`);
  assert.ok(f.unitNote,`lab ${f.id} unit note`);
  for(const i of f.inputs){
    assert.ok(Number.isFinite(i.min)&&Number.isFinite(i.max)&&Number.isFinite(i.v),`lab ${f.id} finite input ${i.k}`);
    assert.ok(i.min<i.max,`lab ${f.id} input range ${i.k}`);
    assert.ok(i.v>=i.min&&i.v<=i.max,`lab ${f.id} default in range ${i.k}`);
  }
  const r=f.calc(vals(f));
  assert.ok(Number.isFinite(r.value),`lab ${f.id} default output finite`);
  for(let n=0;n<250;n++){
    const q=f.practice();
    assert.ok(q && q.values && Number.isFinite(q.answer) && q.hint,`lab ${f.id} practice generator valid run ${n}`);
  }
}

const expected={
  1:500,
  2:25,
  3:0.5,
  4:-19.25,
  5:0.7272727272727273,
  6:1,
  7:3,
  8:36.787944117144235,
  9:36.787944117144235,
  10:0.5,
  11:0.06658540301691307,
  12:1352.7673826380953,
  13:1.178e9,
  14:7,
  15:11.6,
  16:0.005929358860705196,
  17:29.784691831696804,
  18:42.12191513948876,
  19:4.043584127580157,
  20:0.15311107579291705,
  21:41.58373198634637,
  22:2839.302482646685,
  23:18.898887700144808,
  24:31.539156527334107,
  25:2.010619298032
};
for(const f of formulas) assert.ok(near(f.calc(vals(f)).value,expected[f.id],1e-10,1e-12),`lab ${f.id} default regression`);

const f5=formulas[4];
for(let i=0;i<1000;i++){
  const v={like:0.01+Math.random()*0.98,altLike:0.01+Math.random()*0.98,prior:0.01+Math.random()*0.98};
  const p=f5.calc(v).value;
  assert.ok(p>=0&&p<=1,'Bayes normalized posterior remains in [0,1]');
}

const f8=formulas[7], f9=formulas[8];
for(const tau of [0,0.1,0.5,1,2,5]){
  const a=f8.calc({I0:100,tau}).value;
  const b=f9.calc({tau,F:100}).value;
  assert.ok(near(a,b,1e-12,1e-12),'radiative transfer and extinction use equivalent exact transmission');
}

const f11=formulas[10];
assert.match(f11.calc({obs:1200,rest:600}).extra,/not shown/,'high-z warning suppresses simple cz display');

const f12=formulas[11];
assert.ok(f12.calc({z:0.2}).value<f12.calc({z:0.1}).value,'observed HI frequency decreases with redshift');

const f13=formulas[12];
const m1=f13.calc({D:10,flux:2}).value,m2=f13.calc({D:20,flux:2}).value;
assert.ok(near(m2/m1,4),'HI mass scales as D squared');

const f16=formulas[15];
const g1=f16.calc({mu:1,r:1}).value,g2=f16.calc({mu:1,r:2}).value;
assert.ok(near(g1/g2,4),'gravity inverse-square scaling');

const f17=formulas[16],f18=formulas[17];
const vc=f17.calc({r:1,a:1}).value,ve=f18.calc({r:1}).value;
assert.ok(near(ve/vc,Math.SQRT2,1e-10),'escape speed sqrt(2) times circular speed at same r');

const f19=formulas[18];
assert.ok(f19.calc({Isp:450,m0:1000,mf:400}).value>0,'rocket delta-v positive when m0>mf');
assert.ok(Number.isNaN(f19.calc({Isp:450,m0:400,mf:1000}).value),'rocket demo rejects m0<=mf');

const f20=formulas[19];
const b50=f20.calc({A:10000,M:50}).value,b100=f20.calc({A:10000,M:100}).value;
assert.ok(near(b50/b100,2),'sail beta inverse with total mass');

const f21=formulas[20];
assert.ok(near(f21.calc({d:1}).value*3600,AU/C,1e-12),'light time matches AU/c');

const f22=formulas[21];
assert.ok(near(f22.calc({ne:1}).value/f22.calc({ne:0.25}).value,2,1e-12),'plasma frequency sqrt density scaling');
const f23=formulas[22];
assert.ok(near(f23.calc({Te:10000,ne:0.1}).value/f23.calc({Te:2500,ne:0.1}).value,2,1e-12),'Debye length sqrt temperature scaling');
assert.ok(near(f23.calc({Te:10000,ne:0.1}).value/f23.calc({Te:10000,ne:0.4}).value,2,1e-12),'Debye length inverse sqrt density scaling');
const f24=formulas[23];
assert.ok(near(f24.calc({B:1,rho:1}).value/f24.calc({B:1,rho:4}).value,2,1e-12),'Alfven speed inverse sqrt density scaling');
const f25=formulas[24];
assert.ok(near(f25.calc({P:1,B:1}).value/f25.calc({P:1,B:2}).value,4,1e-12),'plasma beta inverse B squared scaling');

assert.equal(missions.length,4,'four guided missions');
assert.deepEqual([...new Set(missions.flatMap(m=>m.labs))].sort((a,b)=>a-b),Array.from({length:25},(_,i)=>i+1),'missions cover every lab through union');
assert.equal(missions.flatMap(m=>m.labs).length,25,'missions assign each lab exactly once');
for(const d of unitDrills){
  assert.ok(d.factor>0&&d.values.every(Number.isFinite),`unit drill ${d.id} valid`);
  assert.ok(Number.isFinite(d.values[0]*d.factor),`unit drill ${d.id} answer finite`);
}
for(const [name,c] of Object.entries(chains)){
  const inputs=name==='zoa'?{H0:70,d:50,cz:4000,a:1,f:0.55,div:-19.25}:name==='obscura'?{F:100,tau:1}:{distance:300,speedAUyr:20,r:1,Isp:450,massRatio:2.5};
  const out=c.run(inputs);
  for(const [k,v] of Object.entries(out)) if(typeof v==='number') assert.ok(Number.isFinite(v),`chain ${name}.${k} finite`);
}

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'HTML has no duplicate ids');
for(const required of ['formulaGrid','lab','controlList','missionGrid','chainControls','drillPrompt','coachQuestion','exportProgress']) assert.ok(ids.includes(required),`required DOM id ${required}`);

const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const opens=(css.match(/\{/g)||[]).length, closes=(css.match(/\}/g)||[]).length;
assert.equal(opens,closes,'CSS braces balanced');

console.log('QA PASS');
console.log(`25 labs; ${coreEquationCount} core equations across ${coreLabIds.size} core labs; 250 practice generations per lab; regression and invariant checks passed.`);
