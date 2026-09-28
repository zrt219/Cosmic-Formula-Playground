const C = 299792458;
const C_KMS = 299792.458;
const AU = 1.495978707e11;
const MU_SUN = 1.32712440018e20;
const EPS0 = 8.8541878188e-12;
const E_CHARGE = 1.602176634e-19;
const M_E = 9.1093837139e-31;
const M_P = 1.67262192595e-27;
const K_B = 1.380649e-23;
const MU0 = 1.25663706127e-6;
const G0 = 9.80665;
const S0 = 1361;

const formulas = [
  {
    id:1, track:'Z-ZOA', core:true, title:'Hubble flow + peculiar velocity', short:'Separate cosmic expansion from local motion.',
    tex:'v_H = H_0 d \\qquad v_{\\rm pec} \\approx cz-H_0d',
    eli5:'A galaxy has the speed expected from expansion, plus its own local motion. Subtract the expected Hubble flow to expose the peculiar part.',
    mental:'Observed recession is not the same thing as pure distance. The leftover motion contains information about gravity and hidden mass.',
    why:'This is the front door to Cosmicflows. Independent distance + redshift lets Z-ZOA infer peculiar motion instead of assuming every km/s comes from expansion.',
    symbols:[['H₀','Hubble constant'],['d','distance'],['cz','observed low-redshift recession speed'],['vₚₑc','peculiar velocity']],
    inputs:[
      {k:'H0',label:'H₀',unit:'km/s/Mpc',min:50,max:90,step:0.5,v:70},
      {k:'d',label:'Distance d',unit:'Mpc',min:1,max:250,step:1,v:50},
      {k:'cz',label:'Observed cz',unit:'km/s',min:0,max:25000,step:50,v:4000}
    ], output:'Peculiar velocity', unit:'km/s',
    calc:v=>({value:v.cz-v.H0*v.d, extra:`Hubble flow = ${fmt(v.H0*v.d)} km/s`}),
    example:'With H₀ = 70 km/s/Mpc, d = 50 Mpc and cz = 4,000 km/s: vH = 3,500 km/s, so vpec ≈ +500 km/s.',
    practice:()=>{const H0=70,d=randInt(10,100),pec=randInt(-6,6)*100,cz=H0*d+pec;return q({H0,d,cz},pec,`Compute cz − H₀d. The sign tells you whether the galaxy is moving faster or slower than the local Hubble flow.`)}
  },
  {
    id:2, track:'Z-ZOA', core:false, title:'Distance modulus', short:'Turn brightness difference into distance.',
    tex:'\\mu=m-M=5\\log_{10}\\left(\\frac{d}{10\\,\\mathrm{pc}}\\right)',
    eli5:'Compare how bright an object really is with how bright it looks. The difference tells you how far away it must be.',
    mental:'Every factor of 10 in distance adds 5 magnitudes to distance modulus.',
    why:'Independent galaxy distances are what make peculiar-velocity work possible. Distance indicators ultimately feed the Z-ZOA reconstruction chain.',
    symbols:[['m','apparent magnitude'],['M','absolute magnitude'],['μ','distance modulus'],['d','distance in parsecs']],
    inputs:[{k:'d',label:'Distance d',unit:'pc',min:10,max:1e8,step:1000,v:1e6,log:true}], output:'Distance modulus μ', unit:'mag',
    calc:v=>({value:5*Math.log10(v.d/10)}),
    example:'At 1,000,000 pc (1 Mpc), μ = 25 mag.',
    practice:()=>{const d=[100,1000,10000,1e6][randInt(0,3)];return q({d},5*Math.log10(d/10),'Use μ = 5 log₁₀(d/10 pc).')}
  },
  {
    id:3, track:'Z-ZOA', core:true, title:'Density contrast', short:'Measure how overdense or underdense a place is.',
    tex:'\\delta=\\frac{\\rho-\\bar\\rho}{\\bar\\rho}',
    eli5:'Instead of asking “how much matter is here?”, ask “how different is here from average?”',
    mental:'δ = 0 is average. δ > 0 is overdense. δ < 0 is underdense.',
    why:'Filaments, walls, voids and attractors are naturally described by contrast relative to the mean density.',
    symbols:[['ρ','local density'],['ρ̄','mean density'],['δ','dimensionless density contrast']],
    inputs:[{k:'rho',label:'Local density ρ',unit:'arb.',min:0,max:5,step:0.05,v:1.5},{k:'mean',label:'Mean density ρ̄',unit:'arb.',min:0.1,max:3,step:0.05,v:1}], output:'Density contrast δ', unit:'',
    calc:v=>({value:(v.rho-v.mean)/v.mean, extra:(v.rho>v.mean?'Overdensity':v.rho<v.mean?'Underdensity':'Mean density')}),
    example:'If a region has ρ = 1.5 and ρ̄ = 1, then δ = +0.5: it is 50% above the mean.',
    practice:()=>{const mean=randInt(1,5),rho=mean+randInt(-mean+1,mean*2);return q({rho,mean},(rho-mean)/mean,'Subtract the mean first, then divide by the mean.')}
  },
  {
    id:4, track:'Z-ZOA', core:true, title:'Velocity divergence ↔ matter density', short:'Connect converging flows to overdensity.',
    tex:'\\nabla\\!\\cdot\\mathbf v=-aHf\\,\\delta_m',
    eli5:'If matter is flowing inward from many directions, something overdense is probably pulling it. Divergence compresses that idea into one number.',
    mental:'Positive δ gives negative divergence in this linear convention: overdensity ↔ convergence.',
    why:'This is close to the mathematical heart of turning peculiar velocities into a reconstructed matter field.',
    symbols:[['a','scale factor'],['H','Hubble parameter'],['f','growth rate'],['δₘ','matter overdensity'],['∇·v','velocity divergence']],
    inputs:[{k:'a',label:'Scale factor a',unit:'',min:0.2,max:1,step:0.02,v:1},{k:'H',label:'H',unit:'km/s/Mpc',min:50,max:150,step:1,v:70},{k:'f',label:'Growth rate f',unit:'',min:0.1,max:1.2,step:0.02,v:0.55},{k:'delta',label:'Matter δₘ',unit:'',min:-0.9,max:3,step:0.05,v:0.5}], output:'Velocity divergence', unit:'km/s/Mpc',
    calc:v=>({value:-v.a*v.H*v.f*v.delta}),
    example:'At a=1, H=70, f=0.55 and δ=0.5, ∇·v ≈ −19.25 km/s/Mpc: a converging flow.',
    practice:()=>{const a=1,H=70,f=0.5,delta=[-0.5,0.5,1,2][randInt(0,3)];return q({a,H,f,delta},-a*H*f*delta,'Multiply aHfδ, then apply the leading minus sign.')}
  },
  {
    id:5, track:'Z-ZOA', core:true, title:"Bayes' theorem", short:'Update belief when new data arrive.',
    tex:'P(\\theta|D)=\\frac{P(D|\\theta)P(\\theta)}{P(D)}',
    eli5:'Start with what you believed before. Ask how compatible the data are with that idea. Then update your belief.',
    mental:'Posterior ∝ likelihood × prior. New evidence should change confidence, not erase uncertainty.',
    why:'Z-OBSCURA and Z-FUSION need to infer hidden structure from partial evidence while carrying uncertainty forward.',
    symbols:[['P(θ)','prior'],['P(D|θ)','likelihood'],['P(D)','evidence'],['P(θ|D)','posterior']],
    inputs:[{k:'like',label:'Likelihood P(D|θ)',unit:'',min:0.01,max:1,step:0.01,v:0.8},{k:'prior',label:'Prior P(θ)',unit:'',min:0.01,max:1,step:0.01,v:0.4},{k:'evidence',label:'Evidence P(D)',unit:'',min:0.01,max:1,step:0.01,v:0.5}], output:'Posterior P(θ|D)', unit:'',
    calc:v=>({value:(v.like*v.prior)/v.evidence, extra:(v.like*v.prior/v.evidence>1?'Inputs are not a self-consistent probability model':'')}),
    example:'Likelihood 0.8 × prior 0.4 ÷ evidence 0.5 gives posterior 0.64.',
    practice:()=>{const like=[0.2,0.4,0.6,0.8][randInt(0,3)],prior=[0.25,0.5][randInt(0,1)],evidence=[0.25,0.5,0.8][randInt(0,2)];return q({like,prior,evidence},like*prior/evidence,'Posterior = likelihood × prior ÷ evidence.')}
  },
  {
    id:6, track:'Z-ZOA', core:true, title:'Gaussian likelihood / χ²', short:'Measure disagreement in units of uncertainty.',
    tex:'\\chi^2=\\sum_i\\frac{(d_i-m_i)^2}{\\sigma_i^2}\\qquad \\mathcal L\\propto e^{-\\chi^2/2}',
    eli5:'Being off by 10 is not equally bad in every experiment. χ² asks how wrong you are compared with how uncertain the measurement is.',
    mental:'Residual ÷ uncertainty is the core unit. Square it so large misses hurt more.',
    why:'Model fitting, reconstruction quality and uncertainty calibration all need a disciplined notion of “close enough.”',
    symbols:[['d','observed datum'],['m','model prediction'],['σ','measurement uncertainty'],['χ²','squared normalized residual']],
    inputs:[{k:'d',label:'Observed d',unit:'',min:-20,max:20,step:0.2,v:10},{k:'m',label:'Model m',unit:'',min:-20,max:20,step:0.2,v:8},{k:'sigma',label:'Uncertainty σ',unit:'',min:0.1,max:10,step:0.1,v:2}], output:'χ² (single datum)', unit:'',
    calc:v=>{const x=((v.d-v.m)/v.sigma)**2;return {value:x,extra:`Relative likelihood ∝ ${fmt(Math.exp(-x/2))}`}},
    example:'Observed 10, predicted 8, σ=2 → residual is 1σ → χ²=1 and e^(−χ²/2)≈0.607.',
    practice:()=>{const sigma=[1,2,5][randInt(0,2)],m=randInt(0,10),r=[1,2,3][randInt(0,2)]*sigma,d=m+r;return q({d,m,sigma},((d-m)/sigma)**2,'Compute (d−m)/σ first, then square it.')}
  },
  {
    id:7, track:'Z-ZOA', core:true, title:'Wiener filter', short:'Balance signal structure against noise.',
    tex:'\\hat{\\mathbf s}=SR^T(RSR^T+N)^{-1}\\mathbf d',
    eli5:'Trust the data when they are informative, but pull noisy or missing regions toward what the signal model says is plausible.',
    mental:'Signal covariance says what structures are plausible. Noise covariance says what measurements deserve less trust.',
    why:'Wiener reconstruction is built for noisy, sparse and incomplete data — exactly the Zone-of-Avoidance problem.',
    symbols:[['S','signal covariance'],['N','noise covariance'],['R','response operator'],['d','observed data'],['ŝ','reconstructed signal']],
    inputs:[{k:'S',label:'Signal S',unit:'',min:0.1,max:10,step:0.1,v:3},{k:'R',label:'Response R',unit:'',min:0.1,max:2,step:0.05,v:1},{k:'N',label:'Noise N',unit:'',min:0.1,max:10,step:0.1,v:2},{k:'d',label:'Datum d',unit:'',min:-10,max:10,step:0.1,v:5}], output:'Scalar Wiener estimate ŝ', unit:'',
    calc:v=>({value:(v.S*v.R/(v.R*v.R*v.S+v.N))*v.d,extra:'Learning-scale scalar analogue of the matrix equation'}),
    example:'For S=3, R=1, N=2, d=5: gain = 3/(3+2)=0.6, so ŝ=3.',
    practice:()=>{const S=[1,2,4][randInt(0,2)],R=1,N=[1,2,4][randInt(0,2)],d=randInt(1,8);return q({S,R,N,d},(S*R/(R*R*S+N))*d,'For R=1, the scalar gain is S/(S+N). Multiply by d.')}
  },
  {
    id:8, track:'Z-OBSCURA', core:true, title:'Radiative transfer', short:'Track what survives absorption and emission.',
    tex:'\\frac{dI_\\nu}{ds}=-\\alpha_\\nu I_\\nu+j_\\nu \\qquad I_\\nu=I_{\\nu,0}e^{-\\tau_\\nu}',
    eli5:'Light is removed by absorption and added by emission. In the simplest dust-screen case, intensity falls exponentially with optical depth.',
    mental:'Every extra unit of optical depth multiplies surviving light by e⁻¹ ≈ 0.37.',
    why:'This is the physics underneath Z-OBSCURA: something exists behind dust — what fraction of its light reaches us?',
    symbols:[['Iν','specific intensity'],['αν','absorption coefficient'],['jν','emission coefficient'],['τν','optical depth']],
    inputs:[{k:'I0',label:'Intrinsic I₀',unit:'arb.',min:0.1,max:100,step:0.5,v:100},{k:'tau',label:'Optical depth τ',unit:'',min:0,max:6,step:0.05,v:1}], output:'Observed intensity I', unit:'arb.',
    calc:v=>({value:v.I0*Math.exp(-v.tau),extra:`Transmission = ${fmt(100*Math.exp(-v.tau))}%`}),
    example:'I₀=100 and τ=1 → I≈36.8. At τ=3 only about 5% survives.',
    practice:()=>{const I0=100,tau=[0,1,2][randInt(0,2)];return q({I0,tau},I0*Math.exp(-tau),'Use I = I₀e^(−τ). For τ=1, e⁻¹≈0.368.')}
  },
  {
    id:9, track:'Z-OBSCURA', core:true, title:'Optical depth + extinction', short:'Translate dust opacity into magnitudes and lost flux.',
    tex:'A_\\lambda=1.086\\tau_\\lambda \\qquad F_{\\rm obs}=F_{\\rm int}10^{-0.4A_\\lambda}',
    eli5:'Optical depth is the physics language; extinction in magnitudes is the astronomy language. They describe the same dimming.',
    mental:'More τ → more A → exponentially less observed flux.',
    why:'Z-OBSCURA needs to know not just that a sightline is blocked, but how strongly each wavelength is suppressed.',
    symbols:[['τλ','optical depth'],['Aλ','extinction in magnitudes'],['Fint','intrinsic flux'],['Fobs','observed flux']],
    inputs:[{k:'tau',label:'Optical depth τ',unit:'',min:0,max:8,step:0.05,v:1},{k:'F',label:'Intrinsic flux',unit:'arb.',min:1,max:100,step:1,v:100}], output:'Observed flux', unit:'arb.',
    calc:v=>{const A=(2.5/Math.log(10))*v.tau;return {value:v.F*10**(-0.4*A),extra:`Aλ = ${fmt(A)} mag (1.086 tau rounded)`}},
    example:'τ=1 gives A≈1.086 mag. A source with intrinsic flux 100 is observed at roughly 36.8.',
    practice:()=>{const tau=[0,0.5,1,2][randInt(0,3)],F=100,A=(2.5/Math.log(10))*tau;return q({tau,F},F*10**(-0.4*A),'Use A approximately 1.086 tau, then Fobs=Fint x 10^(-0.4A).')}
  },
  {
    id:10, track:'Z-OBSCURA', core:false, title:'Colour excess + extinction law', short:'Quantify reddening caused by dust.',
    tex:'E(B-V)=A_B-A_V \\qquad R_V=\\frac{A_V}{E(B-V)}',
    eli5:'Dust usually dims blue light more than visual light. The difference is colour excess; Rᵥ summarizes the shape of the extinction law.',
    mental:'If B is dimmed much more than V, reddening is strong.',
    why:'Dust maps and extinction corrections use these quantities constantly when reconstructing hidden stellar structure.',
    symbols:[['AB','B-band extinction'],['AV','V-band extinction'],['E(B−V)','colour excess'],['RV','total-to-selective extinction ratio']],
    inputs:[{k:'AB',label:'Aᴮ',unit:'mag',min:0,max:8,step:0.05,v:2.3},{k:'AV',label:'Aⱽ',unit:'mag',min:0.01,max:8,step:0.05,v:1.8}], output:'Colour excess E(B−V)', unit:'mag',
    calc:v=>{const E=v.AB-v.AV;return {value:E,extra:E!==0?`Rᵥ = ${fmt(v.AV/E)}`:'Rᵥ undefined when E=0'}},
    example:'AB=2.3 mag, AV=1.8 mag → E(B−V)=0.5 mag and RV=3.6.',
    practice:()=>{const AV=randInt(1,4),E=[0.5,1,1.5][randInt(0,2)],AB=AV+E;return q({AB,AV},E,'Subtract AV from AB.')}
  },
  {
    id:11, track:'Z-OBSCURA', core:true, title:'Redshift', short:'Measure how much a spectral feature moved.',
    tex:'z=\\frac{\\lambda_{\\rm obs}-\\lambda_{\\rm rest}}{\\lambda_{\\rm rest}} \\qquad v\\approx cz',
    eli5:'Compare where a known spectral line should be with where you observe it. The fractional shift is redshift.',
    mental:'At low z, multiply z by c for an approximate recession speed — but remember peculiar velocity can also contribute.',
    why:'Redshift gives line-of-sight velocity information and is fundamental to locating galaxies and H I detections in 3-D.',
    symbols:[['λobs','observed wavelength'],['λrest','rest wavelength'],['z','redshift'],['c','speed of light']],
    inputs:[{k:'obs',label:'Observed λ',unit:'nm',min:100,max:2000,step:1,v:700},{k:'rest',label:'Rest λ',unit:'nm',min:100,max:1500,step:1,v:656.3}], output:'Redshift z', unit:'',
    calc:v=>{const z=(v.obs-v.rest)/v.rest;return {value:z,extra:`Low-z v ≈ ${fmt(C_KMS*z)} km/s`}},
    example:'Hα rest λ≈656.3 nm observed at 700 nm gives z≈0.0666.',
    practice:()=>{const rest=[500,600,700][randInt(0,2)],z=[0.01,0.05,0.1][randInt(0,2)],obs=rest*(1+z);return q({obs,rest},z,'Subtract λrest from λobs, then divide by λrest.')}
  },
  {
    id:12, track:'Z-OBSCURA', core:false, title:'21-cm H I frequency', short:'Turn redshift into the observed neutral-hydrogen frequency.',
    tex:'\\nu_{\\rm obs}=\\frac{\\nu_{21}}{1+z} \\qquad \\nu_{21}\\approx1420.4\\,\\mathrm{MHz}',
    eli5:'Expansion stretches the 21-cm signal, so its frequency arrives lower than the rest frequency.',
    mental:'Higher redshift → lower observed frequency.',
    why:'21-cm radio can detect gas-rich galaxies through the Galactic plane and is central to WALLABY, MeerKAT and hidden-galaxy work.',
    symbols:[['ν21','H I rest frequency'],['z','redshift'],['νobs','observed frequency']],
    inputs:[{k:'z',label:'Redshift z',unit:'',min:0,max:1,step:0.005,v:0.05}], output:'Observed H I frequency', unit:'MHz',
    calc:v=>({value:1420.40575177/(1+v.z)}),
    example:'At z=0.05, the 21-cm line appears near 1,352.8 MHz.',
    practice:()=>{const z=[0,0.1,0.2,0.5][randInt(0,3)];return q({z},1420.40575177/(1+z),'Divide 1420.4 MHz by (1+z).')}
  },
  {
    id:13, track:'Z-OBSCURA', core:true, title:'H I mass from 21-cm flux', short:'Convert a radio spectrum into neutral-hydrogen mass.',
    tex:'\\frac{M_{\\rm HI}}{M_\\odot}\\approx2.356\\times10^5\\left(\\frac{D}{\\rm Mpc}\\right)^2\\left(\\frac{\\int Sdv}{\\rm Jy\\,km\\,s^{-1}}\\right)',
    eli5:'A brighter 21-cm line means more neutral hydrogen, but the inferred mass rises with distance squared because distant sources look fainter.',
    mental:'Double the distance with the same observed integrated flux → inferred H I mass becomes four times larger.',
    why:'This connects WALLABY/MeerKAT spectra directly to physical gas mass in hidden galaxies.',
    symbols:[['D','distance in Mpc'],['∫Sdv','integrated 21-cm flux'],['MHI','neutral-hydrogen mass']],
    inputs:[{k:'D',label:'Distance D',unit:'Mpc',min:1,max:300,step:1,v:50},{k:'flux',label:'Integrated flux',unit:'Jy km/s',min:0.05,max:20,step:0.05,v:2}], output:'H I mass', unit:'M☉',
    calc:v=>({value:2.356e5*v.D*v.D*v.flux}),
    example:'D=50 Mpc and ∫Sdv=2 Jy km/s → MHI≈1.18×10⁹ M☉.',
    practice:()=>{const D=[10,20,50][randInt(0,2)],flux=[1,2,5][randInt(0,2)];return q({D,flux},2.356e5*D*D*flux,'Use 2.356×10⁵ × D² × integrated flux.')}
  },
  {
    id:14, track:'Z-NAV', core:true, title:'State + measurement model', short:'Predict the next state, then compare with sensors.',
    tex:'x_{k+1}=Fx_k+Bu_k+w_k \\qquad z_k=Hx_k+v_k',
    eli5:'Physics predicts where you should be next. A sensor measures something related to where you are. Navigation lives in the gap between them.',
    mental:'Predict → measure → update. Nearly every estimator is some sophisticated version of this loop.',
    why:'This is the foundation of Z-NAV and Z-FUSION: turn dynamics plus imperfect sensors into an evolving belief about spacecraft state.',
    symbols:[['x','state'],['F','state transition'],['B','control mapping'],['u','control input'],['w','process noise'],['z','measurement'],['H','measurement mapping']],
    inputs:[{k:'x',label:'Current state x',unit:'',min:-20,max:20,step:0.1,v:5},{k:'F',label:'Transition F',unit:'',min:-2,max:2,step:0.05,v:1},{k:'B',label:'Control B',unit:'',min:-2,max:2,step:0.05,v:1},{k:'u',label:'Control u',unit:'',min:-10,max:10,step:0.1,v:2},{k:'w',label:'Process term w',unit:'',min:-5,max:5,step:0.1,v:0}], output:'Predicted next state', unit:'',
    calc:v=>({value:v.F*v.x+v.B*v.u+v.w}),
    example:'x=5, F=1, B=1, u=2, w=0 → next state = 7.',
    practice:()=>{const x=randInt(-5,10),F=1,B=1,u=randInt(-3,5),w=0;return q({x,F,B,u,w},F*x+B*u+w,'Compute Fx + Bu + w.')}
  },
  {
    id:15, track:'Z-NAV', core:false, title:'Kalman gain + update', short:'Trust the measurement in proportion to its uncertainty.',
    tex:'K=PH^T(HPH^T+R)^{-1} \\qquad \\hat x=\\hat x^-+K(z-H\\hat x^-)',
    eli5:'If your prediction is uncertain and the sensor is good, trust the sensor more. If the sensor is noisy, correct less.',
    mental:'New estimate = prediction + trust-weighted innovation.',
    why:'Kalman-style estimation is central to navigation, sensor fusion and autonomous state estimation.',
    symbols:[['P','predicted state uncertainty'],['R','measurement noise'],['H','measurement mapping'],['K','Kalman gain'],['z−Hx⁻','innovation']],
    inputs:[{k:'P',label:'Predicted variance P',unit:'',min:0.1,max:20,step:0.1,v:4},{k:'H',label:'Measurement H',unit:'',min:0.2,max:2,step:0.05,v:1},{k:'R',label:'Sensor variance R',unit:'',min:0.1,max:20,step:0.1,v:1},{k:'x',label:'Prediction x⁻',unit:'',min:-20,max:20,step:0.1,v:10},{k:'z',label:'Measurement z',unit:'',min:-20,max:20,step:0.1,v:12}], output:'Updated estimate x̂', unit:'',
    calc:v=>{const K=v.P*v.H/(v.H*v.H*v.P+v.R);return {value:v.x+K*(v.z-v.H*v.x),extra:`Scalar Kalman gain K = ${fmt(K)}`}},
    example:'P=4, H=1, R=1 gives K=0.8. Prediction 10 and measurement 12 update to 11.6.',
    practice:()=>{const P=[1,3,4][randInt(0,2)],H=1,R=[1,2][randInt(0,1)],x=10,z=12,K=P/(P+R);return q({P,H,R,x,z},x+K*(z-x),'First K=P/(P+R) for H=1. Then x̂=x⁻+K(z−x⁻).')}
  },
  {
    id:16, track:'Z-VLISM', core:false, title:'Newtonian gravity', short:'Compute gravitational acceleration toward a central body.',
    tex:'\\ddot{\\mathbf r}=-\\frac{\\mu}{r^3}\\mathbf r',
    eli5:'Gravity pulls inward. Its strength falls with the square of distance.',
    mental:'In magnitude, a = μ/r². Double r → one quarter of the acceleration.',
    why:'First-order spacecraft trajectory models begin here before adding planets, radiation pressure, thrust and other perturbations.',
    symbols:[['μ','GM of central body'],['r','distance from center'],['r̈','acceleration vector']],
    inputs:[{k:'mu',label:'μ',unit:'10²⁰ m³/s²',min:0.01,max:3,step:0.01,v:1.327},{k:'r',label:'Radius r',unit:'10⁹ m',min:0.1,max:300,step:0.1,v:149.6,log:true}], output:'Gravity magnitude', unit:'m/s²',
    calc:v=>({value:(v.mu*1e20)/((v.r*1e9)**2)}),
    example:'Using solar μ≈1.327×10²⁰ m³/s² at 1 AU (149.6×10⁹ m) gives ≈0.00593 m/s².',
    practice:()=>{const mu=1,r=[1,2,4][randInt(0,2)];return q({mu,r},(mu*1e20)/((r*1e9)**2),'Use acceleration magnitude μ/r². Units in this lab are scaled.')}
  },
  {
    id:17, track:'Z-VLISM', core:true, title:'Vis-viva equation', short:'Find orbital speed anywhere on a Keplerian orbit.',
    tex:'v^2=\\mu\\left(\\frac{2}{r}-\\frac{1}{a}\\right)',
    eli5:'Speed depends on where you are in the orbit and on the orbit’s total energy, encoded by the semi-major axis.',
    mental:'Closer to the Sun → faster. Deep perihelion is where an Oberth burn gets powerful.',
    why:'Z-VLISM trajectory trades, solar Oberth concepts and high-energy escape discussions all lean on orbital-energy intuition.',
    symbols:[['μ','gravitational parameter'],['r','current radius'],['a','semi-major axis'],['v','orbital speed']],
    inputs:[{k:'r',label:'Radius r',unit:'AU',min:0.05,max:5,step:0.01,v:1},{k:'a',label:'Semi-major axis a',unit:'AU',min:0.1,max:10,step:0.05,v:1}], output:'Orbital speed', unit:'km/s',
    calc:v=>{const r=v.r*AU,a=v.a*AU,inside=MU_SUN*(2/r-1/a);return {value:inside>0?Math.sqrt(inside)/1000:NaN,extra:inside<=0?'This r,a combination is not a bound physical state in this simple demo':''}},
    example:'At r=a=1 AU, vis-viva returns Earth-like circular speed ≈29.8 km/s.',
    practice:()=>{const r=1,a=1;return q({r,a},Math.sqrt(MU_SUN*(2/AU-1/AU))/1000,'At r=a, this reduces to v=√(μ/r).')}
  },
  {
    id:18, track:'Z-VLISM', core:false, title:'Escape velocity', short:'Find the speed needed for zero-energy escape.',
    tex:'v_{\\rm esc}=\\sqrt{\\frac{2\\mu}{r}}',
    eli5:'Escape speed is the boundary between coming back and never returning in a two-body model.',
    mental:'Move closer to the central body and escape speed rises as 1/√r.',
    why:'It gives an immediate scale for high-energy solar-system departures and why deep-perihelion trajectories are extreme.',
    symbols:[['μ','gravitational parameter'],['r','radius'],['vesc','escape speed']],
    inputs:[{k:'r',label:'Radius r',unit:'AU',min:0.05,max:10,step:0.01,v:1}], output:'Solar escape speed', unit:'km/s',
    calc:v=>({value:Math.sqrt(2*MU_SUN/(v.r*AU))/1000}),
    example:'At 1 AU from the Sun, escape speed is about 42.1 km/s.',
    practice:()=>{const r=[1,2,4][randInt(0,2)];return q({r},Math.sqrt(2*MU_SUN/(r*AU))/1000,'Use vesc=√(2μ/r).')}
  },
  {
    id:19, track:'Z-VLISM', core:true, title:'Rocket equation', short:'See why extreme Δv becomes brutally mass-expensive.',
    tex:'\\Delta v=v_e\\ln\\left(\\frac{m_0}{m_f}\\right)=I_{sp}g_0\\ln\\left(\\frac{m_0}{m_f}\\right)',
    eli5:'To go faster you throw propellant backward. But every extra chunk of propellant also has to accelerate the propellant you burn later.',
    mental:'Δv grows only logarithmically with mass ratio — doubling propellant does not double capability.',
    why:'It explains why chemical propulsion alone struggles with very high-speed Z-VLISM architectures.',
    symbols:[['Isp','specific impulse'],['g₀','standard gravity'],['m₀','initial mass'],['mf','final mass'],['Δv','velocity change']],
    inputs:[{k:'Isp',label:'Specific impulse Isp',unit:'s',min:100,max:10000,step:10,v:450},{k:'m0',label:'Initial mass m₀',unit:'kg',min:10,max:20000,step:10,v:1000,log:true},{k:'mf',label:'Final mass mf',unit:'kg',min:1,max:10000,step:10,v:400,log:true}], output:'Δv', unit:'km/s',
    calc:v=>({value:v.m0>v.mf?v.Isp*G0*Math.log(v.m0/v.mf)/1000:NaN,extra:v.m0<=v.mf?'Initial mass must exceed final mass':''}),
    example:'Isp=450 s, m₀=1000 kg, mf=400 kg → Δv≈4.04 km/s.',
    practice:()=>{const Isp=400,m0=[1000,2000][randInt(0,1)],mf=m0/2;return q({Isp,m0,mf},Isp*G0*Math.log(2)/1000,'Mass ratio is 2, so use Isp·g₀·ln(2).')}
  },
  {
    id:20, track:'Z-VLISM', core:false, title:'Solar sail lightness number', short:'Compare radiation-pressure acceleration with solar gravity.',
    tex:'\\beta=\\frac{a_{\\rm rad}}{a_{\\rm grav}}\\approx\\frac{2AS_0r_0^2}{c\\mu M}',
    eli5:'A good sail is not just large — it is large for its total mass. Lightness number asks how strongly sunlight can compete with solar gravity.',
    mental:'More area or less mass → larger β. The key engineering quantity is total areal density M/A.',
    why:'This is central to the solar-sail branch of the Z-VLISM propulsion trade space.',
    symbols:[['A','reflective sail area'],['M','total sailcraft mass'],['S₀','solar flux at 1 AU'],['β','radiation/gravity acceleration ratio']],
    inputs:[{k:'A',label:'Sail area A',unit:'m²',min:10,max:2e5,step:100,v:10000,log:true},{k:'M',label:'Total mass M',unit:'kg',min:1,max:5000,step:1,v:100,log:true}], output:'Lightness number β', unit:'',
    calc:v=>({value:(2*v.A*S0*AU*AU)/(C*MU_SUN*v.M),extra:`Areal density = ${fmt(v.M/v.A*1000)} g/m²`}),
    example:'A 10,000 m² ideal reflector carrying 100 kg has a total areal density of 10 g/m² and β≈0.153.',
    practice:()=>{const A=10000,M=[50,100,200][randInt(0,2)];return q({A,M},(2*A*S0*AU*AU)/(C*MU_SUN*M),'All constants are fixed; β scales directly with A/M.')}
  },
  {
    id:21, track:'Z-VLISM', core:false, title:'Light-time', short:'Turn distance into communication latency.',
    tex:'t=\\frac{d}{c}',
    eli5:'Information cannot travel faster than light. Every extra AU adds about 8.3 minutes of one-way delay.',
    mental:'100 AU is roughly 13.9 hours one way. 300 AU is roughly 41.6 hours.',
    why:'At Z-VLISM distances, real-time joystick control is impossible. Latency is one of the cleanest arguments for onboard autonomy.',
    symbols:[['d','distance'],['c','speed of light'],['t','one-way light time']],
    inputs:[{k:'d',label:'Distance d',unit:'AU',min:1,max:1000,step:1,v:300,log:true}], output:'One-way light time', unit:'hours',
    calc:v=>({value:v.d*AU/C/3600,extra:`Round trip ≈ ${fmt(2*v.d*AU/C/3600)} hours`}),
    example:'At 300 AU, one-way light time is ≈41.6 hours — more than 1.7 days.',
    practice:()=>{const d=[1,10,100,300][randInt(0,3)];return q({d},d*AU/C/3600,'Convert AU to metres, divide by c, then convert seconds to hours.')}
  },
  {
    id:22, track:'Z-VLISM', core:false, title:'Electron plasma frequency', short:'Infer electron density from a plasma-wave frequency.',
    tex:'\\omega_{pe}=\\sqrt{\\frac{n_e e^2}{\\epsilon_0m_e}} \\qquad f_{pe}=\\frac{\\omega_{pe}}{2\\pi}',
    eli5:'Electrons in a plasma have a natural collective “ringing” frequency. Measure the ringing and you can infer electron density.',
    mental:'Frequency rises with the square root of density.',
    why:'Voyager plasma-wave science turns measured frequencies into electron density. A future Z-VLISM probe would use the same physics.',
    symbols:[['ne','electron density'],['e','elementary charge'],['ε₀','vacuum permittivity'],['me','electron mass'],['fpe','plasma frequency']],
    inputs:[{k:'ne',label:'Electron density nₑ',unit:'cm⁻³',min:0.0001,max:100,step:0.001,v:0.1,log:true}], output:'Plasma frequency fpe', unit:'Hz',
    calc:v=>{const ne=v.ne*1e6,w=Math.sqrt(ne*E_CHARGE**2/(EPS0*M_E));return {value:w/(2*Math.PI)}},
    example:'For ne=0.1 cm⁻³, fpe≈2.84 kHz.',
    practice:()=>{const ne=[0.01,0.1,1][randInt(0,2)],nsi=ne*1e6,w=Math.sqrt(nsi*E_CHARGE**2/(EPS0*M_E));return q({ne},w/(2*Math.PI),'Convert cm⁻³ to m⁻³ by multiplying by 10⁶, then use the plasma-frequency formula.')}
  },
  {
    id:23, track:'Z-VLISM', core:false, title:'Debye length', short:'Find the scale over which plasma screens electric fields.',
    tex:'\\lambda_D=\\sqrt{\\frac{\\epsilon_0k_BT_e}{n_ee^2}}',
    eli5:'A plasma rearranges its charges to cancel electric fields. Debye length is roughly how far an electric disturbance remains noticeable.',
    mental:'Hotter plasma → longer shielding length. Denser plasma → shorter shielding length.',
    why:'Debye length matters for spacecraft charging, plasma probes, electric-field measurements and boom/instrument geometry.',
    symbols:[['Te','electron temperature'],['ne','electron density'],['λD','Debye length']],
    inputs:[{k:'Te',label:'Electron temperature Tₑ',unit:'K',min:100,max:1e7,step:100,v:7500,log:true},{k:'ne',label:'Electron density nₑ',unit:'cm⁻³',min:0.0001,max:100,step:0.001,v:0.1,log:true}], output:'Debye length', unit:'m',
    calc:v=>({value:Math.sqrt(EPS0*K_B*v.Te/(v.ne*1e6*E_CHARGE**2))}),
    example:'At Te=7,500 K and ne=0.1 cm⁻³, λD is about 18.9 m.',
    practice:()=>{const Te=10000,ne=[0.01,0.1,1][randInt(0,2)];return q({Te,ne},Math.sqrt(EPS0*K_B*Te/(ne*1e6*E_CHARGE**2)),'Convert nₑ to m⁻³, then substitute into the square root.')}
  },
  {
    id:24, track:'Z-VLISM', core:false, title:'Alfvén speed', short:'Find the wave speed set by magnetic tension.',
    tex:'v_A=\\frac{B}{\\sqrt{\\mu_0\\rho}}',
    eli5:'A magnetic field threading plasma behaves a little like a stretched string. Alfvén speed is how fast certain disturbances travel along that magnetized medium.',
    mental:'Stronger B → faster. More mass density → slower.',
    why:'Solar wind, heliosheath shocks, magnetic turbulence and VLISM interaction are all magnetized-plasma problems.',
    symbols:[['B','magnetic-field strength'],['ρ','mass density'],['μ₀','vacuum permeability'],['vA','Alfvén speed']],
    inputs:[{k:'B',label:'Magnetic field B',unit:'nT',min:0.001,max:100,step:0.01,v:0.5,log:true},{k:'rho',label:'Mass density ρ',unit:'10⁻²² kg/m³',min:0.01,max:1000,step:0.1,v:2,log:true}], output:'Alfvén speed', unit:'km/s',
    calc:v=>({value:(v.B*1e-9)/Math.sqrt(MU0*v.rho*1e-22)/1000}),
    example:'B=0.5 nT and ρ=2×10⁻²² kg/m³ gives vA≈31.5 km/s.',
    practice:()=>{const B=1,rho=[1,4,9][randInt(0,2)];return q({B,rho},(B*1e-9)/Math.sqrt(MU0*rho*1e-22)/1000,'Convert nT and scaled density, then divide B by √(μ₀ρ).')}
  },
  {
    id:25, track:'Z-VLISM', core:false, title:'Plasma beta', short:'Compare thermal pressure with magnetic pressure.',
    tex:'\\beta_{\\rm plasma}=\\frac{P_{\\rm thermal}}{B^2/(2\\mu_0)}',
    eli5:'Ask what dominates the plasma: ordinary particle pressure or magnetic-field pressure?',
    mental:'β ≫ 1: thermal pressure dominates. β ≪ 1: magnetic pressure dominates.',
    why:'One dimensionless number gives fast physical intuition about the regime a heliospheric or VLISM plasma is in.',
    symbols:[['Pthermal','thermal pressure'],['B²/(2μ₀)','magnetic pressure'],['β','pressure ratio']],
    inputs:[{k:'P',label:'Thermal pressure P',unit:'pPa',min:0.001,max:1000,step:0.01,v:0.2,log:true},{k:'B',label:'Magnetic field B',unit:'nT',min:0.001,max:100,step:0.01,v:0.5,log:true}], output:'Plasma beta β', unit:'',
    calc:v=>{const P=v.P*1e-12,B=v.B*1e-9,pmag=B*B/(2*MU0);return {value:P/pmag,extra:`Magnetic pressure = ${fmt(pmag/1e-12)} pPa`}},
    example:'P=0.2 pPa and B=0.5 nT gives β≈2.01: thermal pressure is somewhat larger.',
    practice:()=>{const P=[0.1,0.2,0.5][randInt(0,2)],B=[0.2,0.5,1][randInt(0,2)],pmag=(B*1e-9)**2/(2*MU0);return q({P,B},P*1e-12/pmag,'Compute magnetic pressure B²/(2μ₀), then divide thermal pressure by it.')}
  }
];




function fmt(n){
  if (!Number.isFinite(n)) return '-';
  const a=Math.abs(n);
  if ((a!==0 && a<0.001) || a>=1e6) return n.toExponential(3).replace('+','');
  if (a>=1000) return n.toLocaleString('en-US',{maximumFractionDigits:2});
  return Number(n.toPrecision(5)).toString();
}
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function q(values,answer,hint){return {values,answer,hint};}

// The source curriculum's "Core 12" contains 12 equations across 11 numbered labs,
// because Lab 01 contains both Hubble flow and peculiar velocity equations.
export const coreLabIds = new Set([1,3,4,5,7,8,9,13,14,17,19]);
export const coreEquationCount = 12;
formulas.forEach(f => { f.core = coreLabIds.has(f.id); });

// Strengthen a few pedagogical demos so the interface cannot silently present
// internally inconsistent probability or low-redshift assumptions.
const bayes = formulas.find(f => f.id === 5);
bayes.symbols = [['P(theta)','prior'],['P(D|theta)','likelihood under theta'],['P(D|not theta)','likelihood under the alternative'],['P(D)','evidence computed from both hypotheses'],['P(theta|D)','posterior']];
bayes.inputs = [
  {k:'like',label:'P(D|theta)',unit:'',min:0.01,max:0.99,step:0.01,v:0.8},
  {k:'altLike',label:'P(D|not theta)',unit:'',min:0.01,max:0.99,step:0.01,v:0.2},
  {k:'prior',label:'Prior P(theta)',unit:'',min:0.01,max:0.99,step:0.01,v:0.4}
];
bayes.calc = v => {
  const evidence = v.like*v.prior + v.altLike*(1-v.prior);
  return {value:(v.like*v.prior)/evidence, extra:`P(D) = ${fmt(evidence)} (normalized two-hypothesis demo)`};
};
bayes.example = 'With P(D|theta)=0.8, P(D|not theta)=0.2 and prior P(theta)=0.4, the evidence is 0.44 and the posterior is about 0.727.';
bayes.practice = () => {
  const like=[0.6,0.8,0.9][randInt(0,2)], altLike=[0.1,0.2,0.3][randInt(0,2)], prior=[0.25,0.5,0.75][randInt(0,2)];
  const evidence=like*prior+altLike*(1-prior);
  return q({like,altLike,prior},like*prior/evidence,'First compute P(D)=P(D|theta)P(theta)+P(D|not theta)P(not theta), then divide.');
};

const redshift = formulas.find(f => f.id === 11);
const redshiftCalc = redshift.calc;
redshift.calc = v => {
  const z=(v.obs-v.rest)/v.rest;
  return {value:z,extra:Math.abs(z)<=0.1?`Low-z v approx ${fmt(C_KMS*z)} km/s`:'cz is not shown: the simple v approx cz relation is only a low-redshift approximation.'};
};

const stateModel = formulas.find(f => f.id === 14);
stateModel.inputs = [
  {k:'x',label:'Current state x',unit:'',min:-20,max:20,step:0.1,v:5},
  {k:'F',label:'Transition F',unit:'',min:-2,max:2,step:0.05,v:1},
  {k:'B',label:'Control B',unit:'',min:-2,max:2,step:0.05,v:1},
  {k:'u',label:'Control u',unit:'',min:-10,max:10,step:0.1,v:2},
  {k:'w',label:'Process term w',unit:'',min:-5,max:5,step:0.1,v:0},
  {k:'H',label:'Measurement map H',unit:'',min:-2,max:2,step:0.05,v:1},
  {k:'v',label:'Measurement term v',unit:'',min:-5,max:5,step:0.1,v:0}
];
stateModel.calc = v => {
  const next=v.F*v.x+v.B*v.u+v.w;
  return {value:next,extra:`Expected measurement z = ${fmt(v.H*next+v.v)}`};
};
stateModel.practice = () => {
  const x=randInt(-5,10),F=1,B=1,u=randInt(-3,5),w=0,H=1,v=0;
  return q({x,F,B,u,w,H,v},F*x+B*u+w,'Compute Fx + Bu + w. The measurement equation is shown separately as z=Hx+v.');
};

const enrichment = {
1:{
  derive:['Start with the low-redshift decomposition: observed recession speed is approximately Hubble flow plus peculiar motion.','Use Hubble law v_H = H_0 d for the expansion contribution.','Rearrange v_obs approx v_H + v_pec to get v_pec approx cz - H_0 d.'],
  assumptions:['Low-redshift approximation for cz as a recession-speed proxy.','H_0 d is the background Hubble-flow term in this teaching model.','Real peculiar-velocity inference requires careful frame corrections and distance uncertainties.'],
  unitNote:'(km/s/Mpc) x Mpc = km/s, so the subtraction is dimensionally valid.'
},
2:{derive:['Flux falls with inverse square of distance, while magnitudes are logarithmic.','The magnitude difference becomes 5 log10(d/10 pc).','At d=10 pc, the distance modulus is exactly zero by definition.'],assumptions:['Uses the standard astronomical magnitude definition.','Distance d is in parsecs.','Extinction and K-corrections are not included in this standalone relation.'],unitNote:'The logarithm acts on the dimensionless ratio d/(10 pc).'},
3:{derive:['Define the reference density as the mean rho_bar.','Measure the excess or deficit: rho - rho_bar.','Normalize by rho_bar to make the contrast dimensionless.'],assumptions:['rho_bar is nonzero and is the intended comparison mean.'],unitNote:'Density divided by density leaves a dimensionless contrast.'},
4:{derive:['Linear theory links growing density perturbations to coherent peculiar-velocity flows.','The velocity divergence scales with a H f times the matter contrast.','The minus sign encodes convergence for positive overdensity in this convention.'],assumptions:['Linear-regime relation.','Peculiar velocity field is treated in the standard cosmological convention used by the curriculum.'],unitNote:'a, f and delta are dimensionless, leaving H units for the divergence.'},
5:{derive:['Bayes starts from P(theta|D)=P(D|theta)P(theta)/P(D).','For this two-hypothesis sandbox, compute P(D)=P(D|theta)P(theta)+P(D|not theta)P(not theta).','Divide the theta branch by the total evidence to obtain a normalized posterior between 0 and 1.'],assumptions:['The sandbox uses two mutually exclusive and exhaustive hypotheses for normalization.','Input probabilities must lie between 0 and 1.'],unitNote:'Probabilities are dimensionless.'},
6:{derive:['Form the residual d-m.','Normalize the residual by sigma so errors are measured in uncertainty units.','Square and sum normalized residuals to obtain chi-squared; for one datum this is one squared term.'],assumptions:['Gaussian measurement-error interpretation.','The displayed likelihood is proportional to exp(-chi^2/2); normalization constants are omitted.'],unitNote:'d, m and sigma must use the same units, making chi-squared dimensionless.'},
7:{derive:['Represent plausible signal structure with covariance S and measurement noise with N.','Map signal space into data space with response R.','The Wiener estimator weights the data by S R^T (R S R^T + N)^-1.'],assumptions:['The interactive sandbox is explicitly a scalar analogue of the matrix estimator.','The full method uses covariance matrices/operators and consistent coordinate conventions.'],unitNote:'In the scalar teaching case, R is treated as dimensionless and S,N share variance units.'},
8:{derive:['Along a ray, absorption removes alpha_nu I_nu per path length while emission adds j_nu.','For a pure foreground absorbing screen with no source term, integrate dI/I=-d tau.','The solution is I=I0 exp(-tau).'],assumptions:['The live sandbox uses the simple foreground-screen solution, not the full emission/scattering problem.','Optical depth is nonnegative in the slider model.'],unitNote:'Optical depth is dimensionless, so exp(-tau) is valid.'},
9:{derive:['For a pure absorbing screen, F_obs/F_int=exp(-tau).','Magnitudes define A=-2.5 log10(F_obs/F_int).','Substitute exp(-tau) to get A=(2.5/ln 10)tau approx 1.086 tau and equivalently F_obs=F_int 10^(-0.4A).'],assumptions:['Foreground-screen attenuation without scattering into the beam.'],unitNote:'A is measured in magnitudes; the flux ratio is dimensionless.'},
10:{derive:['Extinction differs by wavelength.','Define colour excess E(B-V)=A_B-A_V.','Define R_V=A_V/E(B-V) when E(B-V) is nonzero.'],assumptions:['The interpretation as ordinary reddening generally expects A_B>A_V.','R_V is undefined when E(B-V)=0.'],unitNote:'A_B, A_V and E(B-V) are all magnitudes; R_V is dimensionless.'},
11:{derive:['Measure a known spectral feature at lambda_rest and lambda_obs.','Take the fractional wavelength change relative to the rest wavelength.','At sufficiently low redshift only, v approx cz gives a simple velocity approximation.'],assumptions:['The v approx cz relation is not used by the sandbox when |z| exceeds 0.1.','Cosmological distance-redshift relations require a cosmological model at larger z.'],unitNote:'The wavelength ratio is dimensionless, so z is dimensionless.'},
12:{derive:['Cosmological redshift stretches wavelength by a factor 1+z.','Frequency is inversely proportional to wavelength.','Therefore nu_obs=nu_rest/(1+z), using the H I rest frequency near 1420.4058 MHz.'],assumptions:['Uses the standard cosmological redshift relation for frequency.'],unitNote:'The factor 1+z is dimensionless, so the frequency unit remains MHz.'},
13:{derive:['Integrated 21-cm line flux measures the received neutral-hydrogen signal.','Luminosity-like quantities scale with distance squared.','For nearby galaxies in the standard radio-astronomy units, combine constants into 2.356e5 D^2 integral(S dv) solar masses.'],assumptions:['This curriculum relation is the nearby-galaxy form.','D is in Mpc and integrated flux in Jy km/s.','Higher-redshift formulations can include additional redshift factors.'],unitNote:'The numerical coefficient encodes the unit conversions into solar masses.'},
14:{derive:['Propagate the current state through the dynamics: Fx_k.','Add commanded control Bu_k and process term w_k.','Map the resulting state into measurement space with H and add measurement term v_k.'],assumptions:['The live lab is a one-dimensional scalar analogue.','w and v are sample terms, while full filters model their statistics.'],unitNote:'All summed terms in each equation must share compatible state or measurement units.'},
15:{derive:['Start with predicted covariance P, measurement map H and measurement-noise covariance R.','Compute K=P H^T (H P H^T+R)^-1.','Compute innovation z-H x^- and add K times that innovation to the prediction.'],assumptions:['The live lab is a scalar analogue of the matrix Kalman update.','P and R are variances in compatible mapped units.'],unitNote:'In the scalar H=1 case, K is dimensionless when P and R share units.'},
16:{derive:['Newtonian gravity gives force magnitude GMm/r^2.','Divide by spacecraft mass m to obtain acceleration GM/r^2.','Define mu=GM and write the vector direction inward as -mu r_vec/r^3.'],assumptions:['Two-body Newtonian point-mass model.','Relativistic and multi-body perturbations are omitted.'],unitNote:'mu/r^2 gives (m^3/s^2)/m^2 = m/s^2.'},
17:{derive:['Specific orbital energy is epsilon=v^2/2-mu/r.','For a Keplerian orbit epsilon=-mu/(2a).','Set the two expressions equal and rearrange to v^2=mu(2/r-1/a).'],assumptions:['Two-body Keplerian dynamics.','The interactive a is positive; invalid r,a combinations are rejected when the square-root argument is nonpositive.'],unitNote:'mu times 1/r has units m^2/s^2, so its square root is speed.'},
18:{derive:['At escape, the two-body specific orbital energy is zero.','Set v^2/2-mu/r=0.','Solve for v to obtain sqrt(2mu/r).'],assumptions:['Two-body Newtonian model and zero speed at infinity.'],unitNote:'sqrt(mu/r) has units m/s.'},
19:{derive:['Momentum conservation for an ideal rocket yields the Tsiolkovsky relation.','Integrate incremental velocity change as mass decreases from m0 to mf.','The result is Delta v=v_e ln(m0/mf), with v_e=Isp g0.'],assumptions:['Ideal rocket equation; external forces and gravity/drag losses are not included.','m0 must exceed mf.'],unitNote:'Isp(s) x g0(m/s^2) gives m/s before the logarithmic mass ratio.'},
20:{derive:['Radiation pressure on an ideal perfectly reflecting sail at 1 AU produces force 2 S0 A/c.','Solar gravity produces acceleration mu/r0^2 for the sailcraft.','Divide radiation acceleration by gravitational acceleration to obtain beta=2 A S0 r0^2/(c mu M).'],assumptions:['Ideal reflective sail and the curriculum lightness-number model.','Total mass M includes the complete sailcraft, not just sail film.'],unitNote:'The units cancel, leaving dimensionless beta.'},
21:{derive:['Light travels at speed c.','Time equals distance divided by speed.','Convert AU to metres and seconds to hours for the display.'],assumptions:['Vacuum light speed and one-way geometric light time; operational delays are excluded.'],unitNote:'m divided by m/s gives seconds.'},
22:{derive:['Displace electrons slightly relative to ions in a cold plasma.','Electrostatic restoring force produces harmonic oscillation with omega_pe^2=n_e e^2/(epsilon0 m_e).','Convert angular frequency to cycles per second with f=omega/(2pi).'],assumptions:['Cold-plasma electron plasma-frequency relation.','The sandbox converts n_e from cm^-3 to m^-3.'],unitNote:'The SI substitution yields angular frequency in rad/s and f in Hz.'},
23:{derive:['Thermal motion spreads charge while electrostatic forces restore neutrality.','Balancing those effects gives lambda_D^2=epsilon0 k_B T_e/(n_e e^2).','Take the positive square root for the shielding length.'],assumptions:['Classical, quasi-neutral plasma definition using electron temperature.','The sandbox converts n_e from cm^-3 to m^-3.'],unitNote:'The SI expression reduces to metres squared under the square root.'},
24:{derive:['Magnetic tension supplies the restoring force for an Alfven disturbance.','In ideal MHD, balance magnetic tension with plasma inertia.','The characteristic speed is v_A=B/sqrt(mu0 rho).'],assumptions:['Ideal-MHD Alfven speed using total mass density rho.','The sandbox converts nT to T and scaled density to kg/m^3.'],unitNote:'SI substitution yields metres per second.'},
25:{derive:['Magnetic energy density/pressure is B^2/(2 mu0).','Compare thermal pressure with that magnetic pressure.','Their ratio defines plasma beta.'],assumptions:['Uses scalar thermal pressure and magnetic pressure magnitude.'],unitNote:'Pressure divided by pressure is dimensionless.'}
};

for (const f of formulas) Object.assign(f, enrichment[f.id] || {});

export const missions = [
  {id:'zoa',name:'Z-ZOA: Read the Hidden Flow',track:'Z-ZOA',labs:[1,2,3,4,5,6,7],goal:'Go from distance and redshift to uncertainty-aware hidden-density reconstruction.'},
  {id:'obscura',name:'Z-OBSCURA: See Through the Curtain',track:'Z-OBSCURA',labs:[8,9,10,11,12,13],goal:'Connect dust attenuation, spectral shifts and H I radio measurements to hidden structure.'},
  {id:'nav',name:'Z-NAV: Predict, Measure, Correct',track:'Z-NAV',labs:[14,15],goal:'Build the predict-measure-update intuition behind state estimation and sensor fusion.'},
  {id:'vlism',name:'Z-VLISM: Escape to Interstellar Space',track:'Z-VLISM',labs:[16,17,18,19,20,21,22,23,24,25],goal:'Connect trajectory energy, propulsion, latency and plasma physics into one deep-space picture.'}
];

export const unitDrills = [
  {id:'mpc-pc',from:'Mpc',to:'pc',factor:1e6,values:[0.1,1,10,50]},
  {id:'au-m',from:'AU',to:'m',factor:AU,values:[1,5,100,300]},
  {id:'kms-ms',from:'km/s',to:'m/s',factor:1000,values:[1,10,29.78,95]},
  {id:'cm3-m3',from:'cm^-3',to:'m^-3',factor:1e6,values:[0.01,0.1,1,10]},
  {id:'nt-t',from:'nT',to:'T',factor:1e-9,values:[0.1,0.5,1,5]},
  {id:'ppa-pa',from:'pPa',to:'Pa',factor:1e-12,values:[0.1,1,10,100]},
  {id:'hours-days',from:'hours',to:'days',factor:1/24,values:[8,24,41.6,72]},
  {id:'mhz-hz',from:'MHz',to:'Hz',factor:1e6,values:[1,100,1420.4058]},
  {id:'nm-m',from:'nm',to:'m',factor:1e-9,values:[500,656.3,700]}
];

export const chains = {
  zoa:{
    name:'Z-ZOA reconstruction chain',
    description:'Observed recession -> Hubble flow -> peculiar velocity -> linear density-contrast inference from a measured velocity divergence.',
    run:v=>{
      const hubble=v.H0*v.d;
      const peculiar=v.cz-hubble;
      const delta=-v.div/(v.a*v.H0*v.f);
      return {hubble,peculiar,delta,label:peculiar>0?'faster than background Hubble flow':peculiar<0?'slower than background Hubble flow':'matches background Hubble flow'};
    }
  },
  obscura:{
    name:'Z-OBSCURA chain',
    description:'Optical depth -> extinction -> transmission -> observed flux.',
    run:v=>{
      const A=(2.5/Math.log(10))*v.tau;
      const transmission=Math.exp(-v.tau);
      const flux=v.F*transmission;
      return {A,transmission,flux};
    }
  },
  vlism:{
    name:'Z-VLISM trajectory envelope',
    description:'Combine target distance, communication latency, solar escape-speed context and ideal rocket delta-v. This is an envelope exercise, not a propagated mission trajectory.',
    run:v=>{
      const lightHours=v.distance*AU/C/3600;
      const travelYears=v.distance/v.speedAUyr;
      const escape=Math.sqrt(2*MU_SUN/(v.r*AU))/1000;
      const deltaV=v.massRatio>1?v.Isp*G0*Math.log(v.massRatio)/1000:NaN;
      return {lightHours,travelYears,escape,deltaV};
    }
  }
};

export {formulas, C, C_KMS, AU, MU_SUN, EPS0, E_CHARGE, M_E, M_P, K_B, MU0, G0, S0, fmt, randInt};
