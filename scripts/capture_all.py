import os
import sys
import time
import subprocess

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from playwright.sync_api import sync_playwright

BASE_URL = "https://z-space-formula-playground-v30-verc.vercel.app"
SCREENSHOTS_DIR = os.path.abspath("docs/assets/screenshots")
GIFS_DIR = os.path.abspath("docs/assets/gifs")
FRAMES_DIR = os.path.abspath("docs/assets/frames")

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(GIFS_DIR, exist_ok=True)
os.makedirs(FRAMES_DIR, exist_ok=True)

FFMPEG = r"C:\Users\Zhane\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe"

LABS = [
    (1, "lab-01-hubble-flow.png", "Hubble Flow & Peculiar Velocity"),
    (2, "lab-02-distance-ladder.png", "Cosmic Distance Ladder"),
    (3, "lab-03-density-contrast.png", "Density Contrast & Voids"),
    (4, "lab-04-velocity-divergence.png", "Velocity Divergence"),
    (5, "lab-05-bayes-inference.png", "Bayesian Inference"),
    (6, "lab-06-measurement-uncertainty.png", "Measurement Uncertainty"),
    (7, "lab-07-wiener-filtering.png", "Wiener Signal Filter"),
    (8, "lab-08-dust-attenuation.png", "Dust Attenuation Beam"),
    (9, "lab-09-optical-depth.png", "Optical Depth & Extinction"),
    (10, "lab-10-color-excess.png", "Color Excess & Reddening"),
    (11, "lab-11-cosmological-redshift.png", "Cosmological Redshift"),
    (12, "lab-12-radio-21cm-brightness.png", "21-cm Radio Brightness"),
    (13, "lab-13-neutral-hydrogen-mass.png", "Neutral Hydrogen Mass"),
    (14, "lab-14-state-predictor.png", "Spacecraft State Predictor"),
    (15, "lab-15-kalman-filter-gain.png", "Kalman Filter Gain"),
    (16, "lab-16-gravitational-force.png", "Gravitational Force"),
    (17, "lab-17-keplerian-orbit.png", "Keplerian Orbit"),
    (18, "lab-18-escape-velocity.png", "Escape Velocity Trajectory"),
    (19, "lab-19-rocket-thrust-delta-v.png", "Rocket Thrust & Delta-V"),
    (20, "lab-20-solar-sail-photon-pressure.png", "Solar Sail Photon Pressure"),
    (21, "lab-21-light-time-latency.png", "Deep Space Light Latency"),
    (22, "lab-22-electron-plasma-frequency.png", "Electron Plasma Frequency"),
    (23, "lab-23-debye-shielding-sphere.png", "Debye Shielding Sphere"),
    (24, "lab-24-alfven-wave-velocity.png", "Alfvén Wave Velocity"),
    (25, "lab-25-plasma-beta-pressure.png", "Plasma Beta Pressure Balance")
]

def make_gif_from_frames(frame_pattern, out_gif_path, fps=6, scale=900):
    try:
        cmd = f'"{FFMPEG}" -y -framerate {fps} -i "{frame_pattern}" -vf "scale={scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" "{out_gif_path}"'
        subprocess.run(cmd, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        size = os.path.getsize(out_gif_path)
        print(f"  ✓ Generated GIF: {os.path.basename(out_gif_path)} ({size:,} bytes)")
    except Exception as e:
        print(f"  ✗ Error generating GIF {out_gif_path}: {e}")

def main():
    print("🚀 Starting Automated Visual Assets Capture...")
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 820})

        # 1. Primary Views
        views = [
            ("00-home-hero.png", f"{BASE_URL}/", 1.5),
            ("00-syllabus.png", f"{BASE_URL}/syllabus", 1.2),
            ("00-formula-library.png", f"{BASE_URL}/library", 1.2),
            ("00-practice-engine.png", f"{BASE_URL}/practice", 1.5),
            ("00-formula-sandbox.png", f"{BASE_URL}/sandbox", 1.5),
        ]

        print("\n📸 [1/3] Capturing Primary Navigation Views...")
        for file_name, url, wait_sec in views:
            out_file = os.path.join(SCREENSHOTS_DIR, file_name)
            page.goto(url)
            page.wait_for_timeout(int(wait_sec * 1000))
            page.screenshot(path=out_file)
            print(f"  ✓ Captured {file_name}")

        # 2. All 25 Labs
        print("\n📸 [2/3] Capturing All 25 Visual Labs...")
        for lab_id, file_name, title in LABS:
            out_file = os.path.join(SCREENSHOTS_DIR, file_name)
            page.goto(f"{BASE_URL}/playground?lab={lab_id}")
            page.wait_for_timeout(1200)
            page.screenshot(path=out_file)
            print(f"  ✓ Lab {lab_id:02d}: {file_name} ({title})")

        # 3. Dynamic Animated Sequences for GIFs
        print("\n🎬 [3/3] Recording Animated GIF Sequences...")

        # GIF 1: Home 3D Shape Exploration (Rotating carousel & slider)
        print("  Recording GIF 1: 3D Geometry Showcase...")
        g1_dir = os.path.join(FRAMES_DIR, "g1")
        os.makedirs(g1_dir, exist_ok=True)
        page.goto(f"{BASE_URL}/")
        page.wait_for_timeout(1000)
        for i in range(12):
            if i % 3 == 0:
                page.evaluate("() => { const btn = document.getElementById('homeCarouselNextBtn'); if(btn) btn.click(); }")
            page.wait_for_timeout(350)
            page.screenshot(path=os.path.join(g1_dir, f"frame_{i:03d}.png"))
        make_gif_from_frames(os.path.join(g1_dir, "frame_%03d.png"), os.path.join(GIFS_DIR, "01-home-3d-showcase.gif"), fps=4)

        # GIF 2: Parameter Sandbox Workbench (Selecting formulas & sliders)
        print("  Recording GIF 2: Parameter Sandbox Workbench...")
        g2_dir = os.path.join(FRAMES_DIR, "g2")
        os.makedirs(g2_dir, exist_ok=True)
        page.goto(f"{BASE_URL}/sandbox")
        page.wait_for_timeout(1000)
        formulas = ["sb-sphere", "sb-cube", "sb-cylinder", "sb-escape", "sb-relativity", "sb-kepler"]
        for i, fid in enumerate(formulas):
            page.evaluate(f"() => {{ const card = document.querySelector('[data-eqid=\"{fid}\"]'); if(card) card.click(); }}")
            page.wait_for_timeout(600)
            page.screenshot(path=os.path.join(g2_dir, f"frame_{i:03d}.png"))
        make_gif_from_frames(os.path.join(g2_dir, "frame_%03d.png"), os.path.join(GIFS_DIR, "02-parameter-sandbox-workbench.gif"), fps=2)

        # GIF 3: Orbital Mechanics & Escape (Labs 16, 17, 18 animation)
        print("  Recording GIF 3: Orbital Mechanics & Escape...")
        g3_dir = os.path.join(FRAMES_DIR, "g3")
        os.makedirs(g3_dir, exist_ok=True)
        for i, lab_id in enumerate([16, 17, 18, 17, 16]):
            page.goto(f"{BASE_URL}/playground?lab={lab_id}")
            page.wait_for_timeout(800)
            page.screenshot(path=os.path.join(g3_dir, f"frame_{i:03d}.png"))
        make_gif_from_frames(os.path.join(g3_dir, "frame_%03d.png"), os.path.join(GIFS_DIR, "03-orbital-mechanics-escape.gif"), fps=2)

        # GIF 4: Rocket Propulsion & Solar Sailing (Labs 19, 20, 21)
        print("  Recording GIF 4: Rocket Propulsion & Solar Sail...")
        g4_dir = os.path.join(FRAMES_DIR, "g4")
        os.makedirs(g4_dir, exist_ok=True)
        for i, lab_id in enumerate([19, 20, 21, 20, 19]):
            page.goto(f"{BASE_URL}/playground?lab={lab_id}")
            page.wait_for_timeout(800)
            page.screenshot(path=os.path.join(g4_dir, f"frame_{i:03d}.png"))
        make_gif_from_frames(os.path.join(g4_dir, "frame_%03d.png"), os.path.join(GIFS_DIR, "04-rocket-propulsion-solar-sail.gif"), fps=2)

        # GIF 5: Space Plasma Physics (Labs 22, 23, 24, 25)
        print("  Recording GIF 5: Space Plasma Physics...")
        g5_dir = os.path.join(FRAMES_DIR, "g5")
        os.makedirs(g5_dir, exist_ok=True)
        for i, lab_id in enumerate([22, 23, 24, 25, 22]):
            page.goto(f"{BASE_URL}/playground?lab={lab_id}")
            page.wait_for_timeout(800)
            page.screenshot(path=os.path.join(g5_dir, f"frame_{i:03d}.png"))
        make_gif_from_frames(os.path.join(g5_dir, "frame_%03d.png"), os.path.join(GIFS_DIR, "05-plasma-physics-alfven-waves.gif"), fps=2)

        browser.close()
    print("\n✨ All 30 screenshots and 5 animated GIFs captured and generated successfully!")

if __name__ == "__main__":
    main()
