import os
import sys
import subprocess
from PIL import Image, ImageDraw, ImageFont

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.abspath("docs/marketing/linkedin-campaign")
CREATIVES_DIR = os.path.join(BASE_DIR, "creatives")
os.makedirs(CREATIVES_DIR, exist_ok=True)

SCREENSHOTS_DIR = os.path.abspath("docs/assets/screenshots")
GIFS_DIR = os.path.abspath("docs/assets/gifs")
FFMPEG = r"C:\Users\Zhane\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe"

# Font helpers
FONT_BOLD_PATH = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REG_PATH = r"C:\Windows\Fonts\segoeui.ttf"
FONT_SEMIBOLD_PATH = r"C:\Windows\Fonts\seguisb.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def create_square_ad(filename, badge_text, headline_text, subhead_text, screenshot_name, feature_bullets, cta_text="Launch Free in Browser →"):
    w, h = 1200, 1200
    img = Image.new("RGBA", (w, h), "#f8fafc")
    draw = ImageDraw.Draw(img)

    # Top gradient wash
    for y in range(350):
        alpha = int(35 * (1 - y / 350))
        draw.line([(0, y), (w, y)], fill=(37, 99, 235, alpha))

    # Top Bar: Badge & Brand
    badge_font = get_font(FONT_BOLD_PATH, 20)
    brand_font = get_font(FONT_BOLD_PATH, 22)
    
    # Badge pill
    badge_w = int(draw.textlength(badge_text, font=badge_font)) + 36
    draw_rounded_rect(draw, [60, 50, 60 + badge_w, 92], radius=21, fill="#eff6ff", outline="#bfdbfe", width=2)
    draw.text((78, 59), badge_text, fill="#1d4ed8", font=badge_font)

    # Brand right
    brand_text = "🌌 COSMIC FORMULA"
    draw.text((w - 320, 60), brand_text, fill="#0f172a", font=brand_font)

    # Headline
    head_font = get_font(FONT_BOLD_PATH, 46)
    draw.text((60, 120), headline_text, fill="#0f172a", font=head_font)

    # Subtitle
    sub_font = get_font(FONT_REG_PATH, 24)
    draw.text((60, 185), subhead_text, fill="#475569", font=sub_font)

    # Screenshot Frame
    shot_path = os.path.join(SCREENSHOTS_DIR, screenshot_name)
    if os.path.exists(shot_path):
        shot = Image.open(shot_path).convert("RGBA")
        # Target area: 1080w x 680h
        shot_w, shot_h = 1080, 680
        shot_resized = shot.resize((shot_w, shot_h), Image.Resampling.LANCZOS)
        
        # Rounded frame mask
        mask = Image.new("L", (shot_w, shot_h), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, shot_w, shot_h], radius=24, fill=255)
        
        # Shadow / outer card
        draw_rounded_rect(draw, [56, 246, 56 + shot_w + 8, 246 + shot_h + 8], radius=28, fill="#e2e8f0")
        img.paste(shot_resized, (60, 250), mask)
        # Border
        draw.rounded_rectangle([60, 250, 60 + shot_w, 250 + shot_h], radius=24, outline="#94a3b8", width=2)

    # Bottom Feature Highlights & CTA
    feat_font = get_font(FONT_BOLD_PATH, 20)
    feat_x = 60
    for bullet in feature_bullets:
        draw.text((feat_x, 990), f"✓ {bullet}", fill="#059669", font=feat_font)
        feat_x += int(draw.textlength(f"✓ {bullet}", font=feat_font)) + 30

    # Big CTA Button
    cta_w = 460
    cta_h = 76
    cta_box = [60, 1040, 60 + cta_w, 1040 + cta_h]
    draw_rounded_rect(draw, cta_box, radius=18, fill="#2563eb")
    cta_font = get_font(FONT_BOLD_PATH, 26)
    cta_text_w = draw.textlength(cta_text, font=cta_font)
    draw.text((60 + (cta_w - cta_text_w) / 2, 1060), cta_text, fill="#ffffff", font=cta_font)

    # Right Teacher Benefit Callout
    callout_font = get_font(FONT_BOLD_PATH, 20)
    draw.text((w - 560, 1055), "Classroom Ready · Zero Setup", fill="#1e293b", font=callout_font)
    callout_sub = get_font(FONT_REG_PATH, 17)
    draw.text((w - 560, 1085), "Works smoothly on all student Chromebooks, iPads, & PCs", fill="#64748b", font=callout_sub)

    out_file = os.path.join(CREATIVES_DIR, filename)
    img.convert("RGB").save(out_file, quality=95)
    print(f"  ✓ Single Image Ad: {filename}")

def create_carousel_card(filename, carousel_name, card_num, total_cards, headline, desc_text, screenshot_name, formula_tex):
    w, h = 1080, 1080
    img = Image.new("RGBA", (w, h), "#f8fafc")
    draw = ImageDraw.Draw(img)

    # Header Strip
    draw_rounded_rect(draw, [50, 45, 50 + 260, 85], radius=20, fill="#eff6ff", outline="#bfdbfe", width=2)
    step_font = get_font(FONT_BOLD_PATH, 18)
    draw.text((70, 53), f"{carousel_name.upper()} · {card_num}/{total_cards}", fill="#1d4ed8", font=step_font)

    brand_font = get_font(FONT_BOLD_PATH, 20)
    draw.text((w - 270, 53), "COSMIC FORMULA", fill="#64748b", font=brand_font)

    # Card Title
    head_font = get_font(FONT_BOLD_PATH, 40)
    draw.text((50, 110), headline, fill="#0f172a", font=head_font)

    # Description
    desc_font = get_font(FONT_REG_PATH, 22)
    draw.text((50, 168), desc_text, fill="#475569", font=desc_font)

    # Screenshot
    shot_path = os.path.join(SCREENSHOTS_DIR, screenshot_name)
    if os.path.exists(shot_path):
        shot = Image.open(shot_path).convert("RGBA")
        shot_w, shot_h = 980, 620
        shot_resized = shot.resize((shot_w, shot_h), Image.Resampling.LANCZOS)
        
        mask = Image.new("L", (shot_w, shot_h), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, shot_w, shot_h], radius=20, fill=255)
        
        draw_rounded_rect(draw, [47, 227, 47 + shot_w + 6, 227 + shot_h + 6], radius=24, fill="#e2e8f0")
        img.paste(shot_resized, (50, 230), mask)
        draw.rounded_rectangle([50, 230, 50 + shot_w, 230 + shot_h], radius=20, outline="#94a3b8", width=2)

    # Bottom Formula Card & Swipe Prompt
    draw_rounded_rect(draw, [50, 890, 50 + 580, 890 + 130], radius=18, fill="#ffffff", outline="#e2e8f0", width=2)
    law_label_font = get_font(FONT_BOLD_PATH, 16)
    draw.text((75, 908), "FORMAL PHYSICAL LAW", fill="#64748b", font=law_label_font)
    law_font = get_font(FONT_BOLD_PATH, 28)
    draw.text((75, 942), formula_tex, fill="#2563eb", font=law_font)

    # Swipe CTA
    swipe_box = [w - 380, 920, w - 50, 920 + 74]
    draw_rounded_rect(draw, swipe_box, radius=16, fill="#0f172a")
    swipe_font = get_font(FONT_BOLD_PATH, 22)
    swipe_text = "Swipe Next →" if card_num < total_cards else "Try Free Now 🚀"
    draw.text((w - 350, 942), swipe_text, fill="#ffffff", font=swipe_font)

    out_file = os.path.join(CREATIVES_DIR, filename)
    img.convert("RGB").save(out_file, quality=95)
    print(f"  ✓ Carousel Card: {filename}")

def create_landscape_banner(filename, badge_text, headline_text, subhead_text, screenshot_name, bullets, cta_text="Try Free in Browser →"):
    w, h = 1200, 627
    img = Image.new("RGBA", (w, h), "#f8fafc")
    draw = ImageDraw.Draw(img)

    # Left content area: 600w
    badge_font = get_font(FONT_BOLD_PATH, 16)
    badge_w = int(draw.textlength(badge_text, font=badge_font)) + 28
    draw_rounded_rect(draw, [50, 40, 50 + badge_w, 74], radius=17, fill="#eff6ff", outline="#bfdbfe", width=2)
    draw.text((64, 47), badge_text, fill="#1d4ed8", font=badge_font)

    head_font = get_font(FONT_BOLD_PATH, 34)
    draw.text((50, 95), headline_text, fill="#0f172a", font=head_font)

    sub_font = get_font(FONT_REG_PATH, 18)
    draw.text((50, 180), subhead_text, fill="#475569", font=sub_font)

    feat_font = get_font(FONT_BOLD_PATH, 16)
    bullet_y = 250
    for b in bullets:
        draw.text((50, bullet_y), f"✓ {b}", fill="#059669", font=feat_font)
        bullet_y += 32

    # CTA
    cta_w = 340
    cta_h = 60
    cta_box = [50, 390, 50 + cta_w, 390 + cta_h]
    draw_rounded_rect(draw, cta_box, radius=14, fill="#2563eb")
    cta_font = get_font(FONT_BOLD_PATH, 20)
    cta_text_w = draw.textlength(cta_text, font=cta_font)
    draw.text((50 + (cta_w - cta_text_w) / 2, 408), cta_text, fill="#ffffff", font=cta_font)

    # Small footnote
    note_font = get_font(FONT_REG_PATH, 14)
    draw.text((50, 470), "No downloads · No registration · 100% Free Web App", fill="#94a3b8", font=note_font)

    # Right Screenshot: 520w x 500h
    shot_path = os.path.join(SCREENSHOTS_DIR, screenshot_name)
    if os.path.exists(shot_path):
        shot = Image.open(shot_path).convert("RGBA")
        shot_w, shot_h = 540, 520
        shot_resized = shot.resize((shot_w, shot_h), Image.Resampling.LANCZOS)

        mask = Image.new("L", (shot_w, shot_h), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, shot_w, shot_h], radius=20, fill=255)

        draw_rounded_rect(draw, [616, 50, 616 + shot_w + 6, 50 + shot_h + 6], radius=24, fill="#e2e8f0")
        img.paste(shot_resized, (620, 54), mask)
        draw.rounded_rectangle([620, 54, 620 + shot_w, 54 + shot_h], radius=20, outline="#94a3b8", width=2)

    out_file = os.path.join(CREATIVES_DIR, filename)
    img.convert("RGB").save(out_file, quality=95)
    print(f"  ✓ Landscape Banner: {filename}")

def overlay_animated_gif(in_gif_path, out_gif_path, title_text, badge_text, cta_text):
    # Using ffmpeg drawtext filter to produce crisp animated GIFs with marketing framing
    try:
        vf = (
            f"fps=10,scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=#f8fafc,"
            f"drawbox=y=0:h=120:color=#ffffff@1:t=fill,"
            f"drawbox=y=960:h=120:color=#ffffff@1:t=fill,"
            f"drawtext=fontfile='C\\:/Windows/Fonts/segoeuib.ttf':text='{badge_text}':fontcolor=#1d4ed8:fontsize=22:x=60:y=30,"
            f"drawtext=fontfile='C\\:/Windows/Fonts/segoeuib.ttf':text='{title_text}':fontcolor=#0f172a:fontsize=32:x=60:y=65,"
            f"drawtext=fontfile='C\\:/Windows/Fonts/segoeuib.ttf':text='{cta_text}':fontcolor=#ffffff:fontsize=24:box=1:boxcolor=#2563eb@1:boxborderw=18:x=60:y=990,"
            f"drawtext=fontfile='C\\:/Windows/Fonts/seguisb.ttf':text='100% Free · No Sign-up':fontcolor=#64748b:fontsize=20:x=800:y=1010,"
            f"split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer"
        )
        cmd = f'"{FFMPEG}" -y -i "{in_gif_path}" -vf "{vf}" "{out_gif_path}"'
        subprocess.run(cmd, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"  ✓ Animated Motion Creative: {os.path.basename(out_gif_path)} ({os.path.getsize(out_gif_path):,} bytes)")
    except Exception as e:
        print(f"  ✗ Error overlaying GIF {out_gif_path}: {e}")

def main():
    print("🎨 Generating Mega 36-Asset LinkedIn Creative Library...\n")

    # -------------------------------------------------------------------------
    # SET A: 12 Single Image Feed Ads (1200x1200px Square)
    # -------------------------------------------------------------------------
    print("📐 [1/4] Generating 12 Single Image Feed Ads (1200x1200)...")

    create_square_ad(
        "ad01-educator-hero-hook.png",
        "🎓 FOR STEM & PHYSICS EDUCATORS",
        "Make Physics Click For Every Student.",
        "Turn dry mathematical equations into interactive 3D visual sandboxes.",
        "00-home-hero.png",
        ["25 Verified Physical Laws", "Zero Setup Required", "Chromebook & iPad Ready"],
        "Launch Free Playground →"
    )

    create_square_ad(
        "ad02-orbital-mechanics.png",
        "🚀 CELESTIAL MECHANICS DEMO",
        "Teaching Kepler's Laws? Let Students Tweak Orbits.",
        "Adjust semi-major axis and central mass live to watch period & velocity respond.",
        "lab-17-keplerian-orbit.png",
        ["Real-time Orbit Simulation", "Instant Math Recalculation", "Step-by-Step Derivation"],
        "Try Orbital Lab Free →"
    )

    create_square_ad(
        "ad03-rocket-staging.png",
        "⚡ SPACE PROPULSION PHYSICS",
        "Tsiolkovsky Rocket Staging, Visualized Live.",
        "Students drag fuel ratios and exhaust velocities to reach orbital velocity.",
        "lab-19-rocket-thrust-delta-v.png",
        ["Interactive Exhaust Thrust", "Delta-V Budget Calculator", "Ideal Staging Presets"],
        "Explore Rocket Lab →"
    )

    create_square_ad(
        "ad04-escape-velocity.png",
        "🌌 GRAVITY WELL SIMULATION",
        "Break Free From Gravity: Escape Trajectories.",
        "Demonstrate escape velocity across Earth, Moon, Jupiter, and Sun in real time.",
        "lab-18-escape-velocity.png",
        ["One-Click Planetary Presets", "Velocity Vector Arrows", "Dimensional Unit Checks"],
        "Demonstrate in Class →"
    )

    create_square_ad(
        "ad05-cosmic-expansion.png",
        "🔭 ASTRONOMY & COSMOLOGY",
        "Hubble Expansion & Peculiar Motions Unfolded.",
        "Help students visualize universal expansion vs. local gravitational tugs.",
        "lab-01-hubble-flow.png",
        ["Cosmic Grid Stretching", "Dual Velocity Vectors", "Low-z Redshift Linking"],
        "Open Cosmic Flow Lab →"
    )

    create_square_ad(
        "ad06-dust-attenuation.png",
        "✨ OBSERVATIONAL ASTROPHYSICS",
        "Why Do Distant Stars Look Redder? Dust in Action.",
        "Interactive Beer-Lambert attenuation beam and color-excess prism demonstrations.",
        "lab-08-dust-attenuation.png",
        ["Optical Depth Sliders", "Selective Wavelength Extinction", "21-cm Radio Contrast"],
        "Explore Dust Physics →"
    )

    create_square_ad(
        "ad07-space-plasma.png",
        "⚡ SPACE PLASMA & FIELDS",
        "Demystify Complex Plasma Rhythms & Waves.",
        "Inject charge perturbations to watch electron plasma oscillations restore neutrality.",
        "lab-22-electron-plasma-frequency.png",
        ["Collective Plasma Oscillations", "Debye Shielding Bubbles", "Alfvén Wave Speeds"],
        "Simulate Plasma Free →"
    )

    create_square_ad(
        "ad08-parameter-workbench.png",
        "⚙️ FORMULA SANDBOX WORKBENCH",
        "The Tactile Workbench Students Will Actually Explore.",
        "Pick any foundational law. Tweak sliders and watch math calculate live.",
        "00-formula-sandbox.png",
        ["Instant Real-Time Math", "Earth/Moon/Satellite Presets", "Full Algebraic Expansion"],
        "Open Sandbox Workbench →"
    )

    create_square_ad(
        "ad09-3d-geometry-space.png",
        "🧊 3D GEOMETRY TO SPACE PHYSICS",
        "Connect Geometric Solids to Spacecraft Volumes.",
        "Touch, rotate, and scale 3D cubes, spheres, and cylinders with live formulas.",
        "lab-02-distance-ladder.png",
        ["Interactive 3D Isometric View", "Dynamic Volume Formulas", "Classroom Geometric Bridge"],
        "Explore 3D Geometry →"
    )

    create_square_ad(
        "ad10-bayesian-belief.png",
        "🎯 PROBABILITY & DATA INFERENCE",
        "Teach Bayesian Belief & Sensor Noise Visually.",
        "Show how prior confidence combines with telescope evidence to update belief.",
        "lab-05-bayes-inference.png",
        ["Interactive Belief Scale", "Measurement Uncertainty Bars", "Wiener & Kalman Filters"],
        "Demonstrate Bayesian Lab →"
    )

    create_square_ad(
        "ad11-zero-signup-free.png",
        "💻 ZERO FRICTION EDTECH",
        "100% Free · No Sign-Up · Zero Student Data Tracked.",
        "No passwords to manage. Works immediately in any modern web browser.",
        "00-syllabus.png",
        ["COPPA & FERPA Compliant", "Works on School WiFi", "Offline PWA Support"],
        "Launch Free In Browser →"
    )

    create_square_ad(
        "ad12-student-engagement.png",
        "🧠 PROVEN LEARNING LOOP",
        "SEE → TOUCH → CHANGE → WATCH → UNDERSTAND.",
        "The physics learning game that turns passive listeners into active experimenters.",
        "00-practice-engine.png",
        ["250+ Adaptive Challenges", "Multi-Step Hint Progression", "XP & Timed Missions"],
        "Try Cosmic Formula →"
    )

    # -------------------------------------------------------------------------
    # SET B: 12 Carousel Ad Cards (1080x1080px Square across 2 Carousels)
    # -------------------------------------------------------------------------
    print("\n🎡 [2/4] Generating 12 Carousel Ad Cards (1080x1080)...")

    # Carousel 1: The 5-Stage Physics Roadmap
    c1 = "The 5-Stage Physics Roadmap"
    create_carousel_card("carousel1-card1-intro.png", c1, 1, 6, "5 Stages of Space Physics Students Can Touch", "A complete interactive visual curriculum across 25 verified physical laws.", "00-syllabus.png", "CURRICULUM ROADMAP")
    create_carousel_card("carousel1-card2-stage1.png", c1, 2, 6, "Stage 1: Measuring the Universe", "Distance ladders, universal expansion, and light wave stretching.", "lab-01-hubble-flow.png", "v = H_0 d + v_{pec}")
    create_carousel_card("carousel1-card3-stage2.png", c1, 3, 6, "Stage 2: Finding Hidden Structure", "Density contrast, cosmic voids, and Bayesian inference from telescope data.", "lab-03-density-contrast.png", "\\delta = (\\rho - \\bar{\\rho}) / \\bar{\\rho}")
    create_carousel_card("carousel1-card4-stage3.png", c1, 4, 6, "Stage 3: Seeing Through Dust", "Interstellar dust attenuation, color reddening, and 21-cm radio emissions.", "lab-08-dust-attenuation.png", "I = I_0 e^{-\\tau}")
    create_carousel_card("carousel1-card5-stage4.png", c1, 5, 6, "Stage 4: Predicting Motion", "Spacecraft state propagation, sensor noise modeling, and Kalman filter gain.", "lab-14-state-predictor.png", "K = P / (P + R)")
    create_carousel_card("carousel1-card6-stage5.png", c1, 6, 6, "Stage 5: Orbital Mechanics & Escape", "Keplerian orbits, gravity wells, rocket staging, and solar sailing.", "lab-17-keplerian-orbit.png", "T^2 = \\frac{4\\pi^2}{GM} a^3")

    # Carousel 2: 6 Physics Laws Students Master in 5 Minutes
    c2 = "6 Laws Mastered in 5 Minutes"
    create_carousel_card("carousel2-card1-intro.png", c2, 1, 6, "6 Hard Physics Laws Solved With Sliders", "Replace dry lectures with intuitive real-time parameter tweaking.", "00-formula-sandbox.png", "TACTILE PHYSICS WORKBENCH")
    create_carousel_card("carousel2-card2-kepler.png", c2, 2, 6, "Kepler's Third Law of Orbits", "Tweak orbit radius and central mass to watch period calculate instantly.", "lab-17-keplerian-orbit.png", "T^2 \\propto a^3")
    create_carousel_card("carousel2-card3-escape.png", c2, 3, 6, "Escape Velocity & Gravity Wells", "Compare escape speeds between Earth, Moon, Jupiter, and Sun with 1 click.", "lab-18-escape-velocity.png", "v_e = \\sqrt{2GM / R}")
    create_carousel_card("carousel2-card4-rocket.png", c2, 4, 6, "Tsiolkovsky Rocket Staging", "Manipulate propellant mass fractions and exhaust velocity to hit orbit.", "lab-19-rocket-thrust-delta-v.png", "\\Delta v = I_{sp} g_0 \\ln(m_0 / m_f)")
    create_carousel_card("carousel2-card5-dust.png", c2, 5, 6, "Interstellar Dust Attenuation", "Simulate starlight extinction through interstellar dust clouds.", "lab-09-optical-depth.png", "A_\\lambda = 1.086 \\, \\tau_\\lambda")
    create_carousel_card("carousel2-card6-plasma.png", c2, 6, 6, "Electron Plasma Oscillations", "Observe how collective electron rhythms restore neutral equilibrium.", "lab-22-electron-plasma-frequency.png", "\\omega_{pe} = \\sqrt{n_e e^2 / \\varepsilon_0 m_e}")

    # -------------------------------------------------------------------------
    # SET C: 6 Landscape Banners (1200x627px)
    # -------------------------------------------------------------------------
    print("\n🖼️ [3/4] Generating 6 Landscape Banner Ads (1200x627)...")

    create_landscape_banner(
        "banner01-classroom-demos.png",
        "CLASSROOM PHYSICS SANDBOX",
        "Make Physics Click For Every Student.",
        "Interactive 3D visuals & tactile parameter sliders for teachers.",
        "lab-17-keplerian-orbit.png",
        ["25 Verified Physical Laws", "Zero Setup · 100% Free", "Runs on All Chromebooks"],
        "Launch Free In Browser →"
    )

    create_landscape_banner(
        "banner02-orbital-mechanics.png",
        "CELESTIAL MECHANICS DEMO",
        "Simulate Gravity, Orbits & Rockets Live.",
        "Tweak variables and watch orbits, trajectories, and exhaust plumes respond.",
        "lab-18-escape-velocity.png",
        ["Keplerian Orbit Periods", "Gravity Well Escape Speeds", "Rocket Stage Delta-V Budgets"],
        "Explore Orbital Mechanics →"
    )

    create_landscape_banner(
        "banner03-tactile-workbench.png",
        "TACTILE PARAMETER WORKBENCH",
        "Drag Variables. Watch Math Calculate Live.",
        "Dimensional derivations, unit checks, and step-by-step expansion.",
        "00-formula-sandbox.png",
        ["Instant Real-Time Recalculations", "Real Planetary Presets", "KaTeX Math Step-by-Step"],
        "Open Parameter Sandbox →"
    )

    create_landscape_banner(
        "banner04-plasma-physics.png",
        "PLASMA PHYSICS & WAVES",
        "Demystify Complex Space Plasma Fields.",
        "Simulate electron oscillations, Debye shielding bubbles, and Alfvén waves.",
        "lab-24-alfven-wave-velocity.png",
        ["Interactive Perturbations", "Magnetic Pressure Balance", "Plasma Frequency Equations"],
        "Simulate Plasma Physics →"
    )

    create_landscape_banner(
        "banner05-complete-curriculum.png",
        "COMPLETE STEM CURRICULUM",
        "From 3D Geometry to Deep Astrophysics.",
        "A structured 6-stage roadmap for high school and university physics.",
        "00-syllabus.png",
        ["Distance & Redshift", "Bayesian Data Inference", "Autonomous Spaceflight"],
        "View Full Curriculum →"
    )

    create_landscape_banner(
        "banner06-zero-friction-free.png",
        "100% FREE EDTECH RESOURCE",
        "Zero Logins · Zero Installs · Zero Cost.",
        "No passwords to manage. Works immediately on student screens.",
        "00-home-hero.png",
        ["Chromebook, iPad, & PC Ready", "No Student Accounts Required", "Offline PWA Enabled"],
        "Try Free In Class →"
    )

    # -------------------------------------------------------------------------
    # SET D: 6 Animated Motion GIFs (1080x1080 Square Loops)
    # -------------------------------------------------------------------------
    print("\n🎬 [4/4] Generating 6 Animated Motion GIFs for LinkedIn...")

    gif_mappings = [
        ("anim-01-orbital-gravity-loop.gif", "03-orbital-mechanics-escape.gif", "Keplerian Orbits & Escape Velocity", "🎓 PHYSICS CLASSROOM DEMO", "Try Orbital Lab Free →"),
        ("anim-02-parameter-slider-live.gif", "02-parameter-sandbox-workbench.gif", "Live Parameter Recalculation", "⚙️ TACTILE FORMULA WORKBENCH", "Open Sandbox Free →"),
        ("anim-03-rocket-exhaust-staging.gif", "04-rocket-propulsion-solar-sail.gif", "Rocket Staging & Solar Sailing", "🚀 SPACE PROPULSION DEMO", "Explore Rocket Physics →"),
        ("anim-04-plasma-waves-loop.gif", "05-plasma-physics-alfven-waves.gif", "Space Plasma & Alfvén Waves", "⚡ ELECTROMAGNETIC PHYSICS", "Simulate Plasma Free →"),
        ("anim-05-3d-shapes-carousel.gif", "01-home-3d-showcase.gif", "Interactive 3D Geometry Exploration", "🧊 3D GEOMETRY TO ASTRONOMY", "Start Exploring Free →"),
        ("anim-06-redshift-wave-stretch.gif", "03-orbital-mechanics-escape.gif", "Cosmic Velocity & Gravity Trajectories", "🌌 ASTROPHYSICS SIMULATION", "Launch Playground →")
    ]

    for out_name, src_name, title, badge, cta in gif_mappings:
        src_path = os.path.join(GIFS_DIR, src_name)
        out_path = os.path.join(CREATIVES_DIR, out_name)
        if os.path.exists(src_path):
            overlay_animated_gif(src_path, out_path, title, badge, cta)

    print("\n✨ All 36 LinkedIn Campaign Assets Generated Successfully!")

if __name__ == "__main__":
    main()
