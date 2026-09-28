import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const PORT = 8092;
const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  let filePath = path.join(process.cwd(), reqPath);
  if (!fs.existsSync(filePath) && !path.extname(reqPath)) {
    filePath = path.join(process.cwd(), reqPath + '.html');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'index.html');
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mime[ext] || 'text/html' });
  fs.createReadStream(filePath).pipe(res);
});

async function main() {
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Server ready at http://localhost:${PORT}`);

  const screenshotsDir = path.resolve('docs/assets/screenshots');
  const gifsDir = path.resolve('docs/assets/gifs');
  const framesDir = path.resolve('docs/assets/frames');
  fs.mkdirSync(screenshotsDir, { recursive: true });
  fs.mkdirSync(gifsDir, { recursive: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const targets = [
    { file: '00-home-hero.png', url: `http://localhost:${PORT}/` },
    { file: '00-syllabus.png', url: `http://localhost:${PORT}/syllabus` },
    { file: '00-formula-library.png', url: `http://localhost:${PORT}/library` },
    { file: '00-practice-engine.png', url: `http://localhost:${PORT}/practice` },
    { file: '00-formula-sandbox.png', url: `http://localhost:${PORT}/sandbox` },
    { file: 'lab-01-hubble-flow.png', url: `http://localhost:${PORT}/playground?lab=1` },
    { file: 'lab-02-distance-ladder.png', url: `http://localhost:${PORT}/playground?lab=2` },
    { file: 'lab-03-density-contrast.png', url: `http://localhost:${PORT}/playground?lab=3` },
    { file: 'lab-04-velocity-divergence.png', url: `http://localhost:${PORT}/playground?lab=4` },
    { file: 'lab-05-bayes-inference.png', url: `http://localhost:${PORT}/playground?lab=5` },
    { file: 'lab-06-measurement-uncertainty.png', url: `http://localhost:${PORT}/playground?lab=6` },
    { file: 'lab-07-wiener-filtering.png', url: `http://localhost:${PORT}/playground?lab=7` },
    { file: 'lab-08-dust-attenuation.png', url: `http://localhost:${PORT}/playground?lab=8` },
    { file: 'lab-09-optical-depth.png', url: `http://localhost:${PORT}/playground?lab=9` },
    { file: 'lab-10-color-excess.png', url: `http://localhost:${PORT}/playground?lab=10` },
    { file: 'lab-11-cosmological-redshift.png', url: `http://localhost:${PORT}/playground?lab=11` },
    { file: 'lab-12-radio-21cm-brightness.png', url: `http://localhost:${PORT}/playground?lab=12` },
    { file: 'lab-13-neutral-hydrogen-mass.png', url: `http://localhost:${PORT}/playground?lab=13` },
    { file: 'lab-14-state-predictor.png', url: `http://localhost:${PORT}/playground?lab=14` },
    { file: 'lab-15-kalman-filter-gain.png', url: `http://localhost:${PORT}/playground?lab=15` },
    { file: 'lab-16-gravitational-force.png', url: `http://localhost:${PORT}/playground?lab=16` },
    { file: 'lab-17-keplerian-orbit.png', url: `http://localhost:${PORT}/playground?lab=17` },
    { file: 'lab-18-escape-velocity.png', url: `http://localhost:${PORT}/playground?lab=18` },
    { file: 'lab-19-rocket-thrust-delta-v.png', url: `http://localhost:${PORT}/playground?lab=19` },
    { file: 'lab-20-solar-sail-photon-pressure.png', url: `http://localhost:${PORT}/playground?lab=20` },
    { file: 'lab-21-light-time-latency.png', url: `http://localhost:${PORT}/playground?lab=21` },
    { file: 'lab-22-electron-plasma-frequency.png', url: `http://localhost:${PORT}/playground?lab=22` },
    { file: 'lab-23-debye-shielding-sphere.png', url: `http://localhost:${PORT}/playground?lab=23` },
    { file: 'lab-24-alfven-wave-velocity.png', url: `http://localhost:${PORT}/playground?lab=24` },
    { file: 'lab-25-plasma-beta-pressure.png', url: `http://localhost:${PORT}/playground?lab=25` }
  ];

  console.log(`Capturing ${targets.length} high-resolution screenshots...`);
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    const outPath = path.join(screenshotsDir, t.file);
    const cmd = `"${chromePath}" --headless --disable-gpu --window-size=1280,820 --hide-scrollbars --virtual-time-budget=2500 --screenshot="${outPath}" "${t.url}"`;
    try {
      execSync(cmd, { stdio: 'ignore' });
      console.log(`[${i + 1}/${targets.length}] Captured ${t.file} (${fs.statSync(outPath).size} bytes)`);
    } catch (e) {
      console.error(`Failed to capture ${t.file}:`, e.message);
    }
  }

  // Generate GIF sequences
  console.log('Generating 5 animated GIFs...');
  const ffmpeg = 'C:\\Users\\Zhane\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1-full_build\\bin\\ffmpeg.exe';

  // GIF 1: Home 3D Geometry Showcase
  const gif1Frames = ['00-home-hero.png', 'lab-02-distance-ladder.png', '00-formula-library.png', '00-home-hero.png'];
  makeGifFromScreenshots(gif1Frames, screenshotsDir, path.join(gifsDir, '01-home-3d-showcase.gif'), ffmpeg);

  // GIF 2: Parameter Sandbox Workbench
  const gif2Frames = ['00-formula-sandbox.png', 'lab-17-keplerian-orbit.png', '00-formula-sandbox.png'];
  makeGifFromScreenshots(gif2Frames, screenshotsDir, path.join(gifsDir, '02-parameter-sandbox-workbench.gif'), ffmpeg);

  // GIF 3: Orbital Mechanics & Gravity
  const gif3Frames = ['lab-16-gravitational-force.png', 'lab-17-keplerian-orbit.png', 'lab-18-escape-velocity.png'];
  makeGifFromScreenshots(gif3Frames, screenshotsDir, path.join(gifsDir, '03-orbital-mechanics-escape.gif'), ffmpeg);

  // GIF 4: Rocket Propulsion & Solar Sail
  const gif4Frames = ['lab-19-rocket-thrust-delta-v.png', 'lab-20-solar-sail-photon-pressure.png', 'lab-21-light-time-latency.png'];
  makeGifFromScreenshots(gif4Frames, screenshotsDir, path.join(gifsDir, '04-rocket-propulsion-solar-sail.gif'), ffmpeg);

  // GIF 5: Space Plasma Physics & Waves
  const gif5Frames = ['lab-22-electron-plasma-frequency.png', 'lab-23-debye-shielding-sphere.png', 'lab-24-alfven-wave-velocity.png', 'lab-25-plasma-beta-pressure.png'];
  makeGifFromScreenshots(gif5Frames, screenshotsDir, path.join(gifsDir, '05-plasma-physics-alfven-waves.gif'), ffmpeg);

  server.close();
  console.log('All screenshots and GIFs captured and generated successfully!');
}

function makeGifFromScreenshots(fileList, srcDir, outGif, ffmpegPath) {
  try {
    const listFile = path.join(srcDir, 'temp_concat.txt');
    const content = fileList.map(f => `file '${path.join(srcDir, f).replace(/\\/g, '/')}'\nduration 1.8`).join('\n') + `\nfile '${path.join(srcDir, fileList[0]).replace(/\\/g, '/')}'`;
    fs.writeFileSync(listFile, content);

    const cmd = `"${ffmpegPath}" -y -f concat -safe 0 -i "${listFile}" -vf "fps=10,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" "${outGif}"`;
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
    console.log(`Generated GIF: ${path.basename(outGif)} (${fs.statSync(outGif).size} bytes)`);
  } catch (e) {
    console.error(`Failed to create GIF ${outGif}:`, e.message);
  }
}

main();
