import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

def draw_diamond(draw, cx, cy, r, fill, outline=None):
    pts = [(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)]
    draw.polygon(pts, fill=fill, outline=outline)

def draw_star_icon(draw, cx, cy, r, fill):
    # 4-pointed sparkle
    pts = [
        (cx, cy - r),
        (cx + r * 0.25, cy - r * 0.25),
        (cx + r, cy),
        (cx + r * 0.25, cy + r * 0.25),
        (cx, cy + r),
        (cx - r * 0.25, cy + r * 0.25),
        (cx - r, cy),
        (cx - r * 0.25, cy - r * 0.25)
    ]
    draw.polygon(pts, fill=fill)

def draw_orbit_icon(draw, cx, cy, rx, ry, fill_dot, stroke_ring):
    # Orbit ring
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], outline=stroke_ring, width=2)
    # Sun dot
    draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=fill_dot)
    # Planet dot
    draw.ellipse([cx + rx - 5, cy - 5, cx + rx + 5, cy + 5], fill=(56, 189, 248, 255))

def draw_rocket_icon(draw, cx, cy, size, fill):
    # Sleek rocket / arrow pointing up-right
    pts = [
        (cx + size, cy - size),
        (cx + size * 0.2, cy - size * 0.2),
        (cx - size * 0.7, cy + size * 0.3),
        (cx - size * 0.3, cy + size * 0.7),
        (cx - size * 0.2, cy + size * 0.2)
    ]
    draw.polygon(pts, fill=fill)
    x0 = min(cx - size * 0.7, cx - size * 0.3)
    x1 = max(cx - size * 0.7, cx - size * 0.3)
    y0 = min(cy + size * 0.3, cy + size * 0.7)
    y1 = max(cy + size * 0.3, cy + size * 0.7)
    draw.ellipse([x0, y0, x1, y1], fill=(245, 158, 11, 255))

def draw_wave_icon(draw, cx, cy, width, fill):
    # Sine wave
    pts = []
    for i in range(-width // 2, width // 2 + 1):
        x = cx + i
        y = cy + int(math.sin(i / 5.0) * 8)
        pts.append((x, y))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i+1]], fill=fill, width=3)

def create_banner():
    W, H = 2560, 1280
    banner = Image.new("RGBA", (W, H), (6, 9, 20, 255))
    draw = ImageDraw.Draw(banner)

    # 1. Background deep cosmic gradient
    for y in range(H):
        t = y / H
        r = int(5 + 10 * t + 3 * math.sin(t * math.pi))
        g = int(8 + 16 * t + 5 * math.sin(t * math.pi))
        b = int(18 + 38 * t + 10 * math.sin(t * math.pi))
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # 2. Glowing nebulae
    nebula_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    neb_draw = ImageDraw.Draw(nebula_layer)

    # Cyan nebula top-left / center
    neb_draw.ellipse([-100, -100, 1200, 1000], fill=(0, 210, 255, 42))
    # Deep violet nebula bottom-right
    neb_draw.ellipse([1300, 350, 2750, 1550], fill=(138, 43, 226, 50))
    # Electric royal blue center-right behind mockups
    neb_draw.ellipse([1150, 50, 2450, 1150], fill=(59, 130, 246, 40))
    # Emerald plasma accent top right
    neb_draw.ellipse([1950, -50, 2650, 650], fill=(16, 185, 129, 32))

    nebula_layer = nebula_layer.filter(ImageFilter.GaussianBlur(150))
    banner = Image.alpha_composite(banner, nebula_layer)
    draw = ImageDraw.Draw(banner)

    # 3. Starfield & Cosmic Dust
    random.seed(1337)
    for _ in range(400):
        sx = random.randint(0, W)
        sy = random.randint(0, H)
        s_size = random.choice([1, 1, 1, 2, 2, 3])
        brightness = random.randint(140, 255)
        alpha = random.randint(90, 240)
        draw.ellipse([sx, sy, sx + s_size, sy + s_size], fill=(brightness, brightness, 255, alpha))

    # Shimmering cross stars
    bright_stars = [(260, 160), (1020, 210), (1410, 90), (2420, 230), (1240, 840), (180, 1020), (2350, 1120)]
    for bx, by in bright_stars:
        draw.line([(bx - 14, by), (bx + 14, by)], fill=(210, 245, 255, 190), width=2)
        draw.line([(bx, by - 14), (bx, by + 14)], fill=(210, 245, 255, 190), width=2)
        draw.ellipse([bx - 3, by - 3, bx + 3, by + 3], fill=(255, 255, 255, 255))

    # 4. Perspective Space Grid
    grid_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grid_layer)
    for x in range(0, W, 80):
        g_draw.line([(x, 0), (x, H)], fill=(56, 189, 248, 14), width=1)
    for y in range(0, H, 80):
        g_draw.line([(0, y), (W, y)], fill=(56, 189, 248, 14), width=1)
    banner = Image.alpha_composite(banner, grid_layer)
    draw = ImageDraw.Draw(banner)

    # Fonts
    font_dir = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
    f_black = os.path.join(font_dir, 'seguibl.ttf')
    f_bold = os.path.join(font_dir, 'segoeuib.ttf')
    f_regular = os.path.join(font_dir, 'segoeui.ttf')

    font_badge = ImageFont.truetype(f_bold, 28)
    font_title_top = ImageFont.truetype(f_black, 88)
    font_title_main = ImageFont.truetype(f_black, 88)
    font_sub = ImageFont.truetype(f_regular, 36)
    font_pill = ImageFont.truetype(f_bold, 26)
    font_stat_val = ImageFont.truetype(f_black, 52)
    font_stat_lbl = ImageFont.truetype(f_regular, 24)
    font_btn = ImageFont.truetype(f_bold, 30)

    # 5. Left Column Content
    LX = 120

    # Top Brand Tag Pill
    badge_text = "INTERACTIVE 3D ASTROPHYSICS & SPACE MATH"
    bbox = font_badge.getbbox(badge_text)
    bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pill_w = bw + 80
    pill_h = bh + 28
    py = 130

    draw.rounded_rectangle([LX, py, LX + pill_w, py + pill_h], radius=24, fill=(15, 28, 56, 230), outline=(56, 189, 248, 180), width=2)
    draw_star_icon(draw, LX + 30, py + pill_h // 2, 10, fill=(56, 189, 248, 255))
    draw.text((LX + 54, py + 12), badge_text, font=font_badge, fill=(56, 189, 248, 255))

    # Main Title
    ty = 224
    draw.text((LX, ty), "COSMIC FORMULA", font=font_title_top, fill=(255, 255, 255, 255))
    ty += 96
    draw.text((LX, ty), "PLAYGROUND & SANDBOX", font=font_title_main, fill=(56, 189, 248, 255))

    # Subtitle
    sy = ty + 120
    draw.text((LX, sy), "Explore 25 verified physical laws through live parameter sliders,", font=font_sub, fill=(226, 232, 240, 245))
    draw.text((LX, sy + 50), "real-time vector simulations, and step-by-step mathematical solvers.", font=font_sub, fill=(148, 163, 184, 235))

    # Feature Pills Grid (2 rows x 3 columns)
    pills = [
        ("25 Verified Physics Labs", (30, 41, 59), "orbit"),
        ("Keplerian & N-Body Orbits", (30, 41, 59), "orbit"),
        ("Rocket Thrust & Delta-V", (30, 41, 59), "rocket"),
        ("Solar Sail Photon Pressure", (30, 41, 59), "spark"),
        ("Space Plasma & Alfven Waves", (30, 41, 59), "wave"),
        ("100% Free · PWA · No Signup", (16, 42, 66), "star")
    ]

    p_y0 = sy + 130
    for idx, (p_txt, bg_c, icon_type) in enumerate(pills):
        row = idx // 2
        col = idx % 2
        px = LX + col * 460
        py = p_y0 + row * 64
        p_bbox = font_pill.getbbox(p_txt)
        pw = p_bbox[2] - p_bbox[0] + 68
        draw.rounded_rectangle([px, py, px + pw, py + 48], radius=14, fill=(*bg_c, 215), outline=(71, 85, 105, 170), width=2)
        
        # Draw custom icon in pill
        icx = px + 22
        icy = py + 24
        if icon_type == "orbit":
            draw_orbit_icon(draw, icx, icy, 10, 6, (250, 204, 21, 255), (56, 189, 248, 255))
        elif icon_type == "rocket":
            draw_rocket_icon(draw, icx, icy, 8, (244, 63, 94, 255))
        elif icon_type == "spark":
            draw_star_icon(draw, icx, icy, 8, (250, 204, 21, 255))
        elif icon_type == "wave":
            draw_wave_icon(draw, icx, icy, 16, (56, 189, 248, 255))
        else:
            draw_diamond(draw, icx, icy, 6, (16, 185, 129, 255))

        draw.text((px + 44, py + 10), p_txt, font=font_pill, fill=(241, 245, 249, 255))

    # Stats Row
    stat_y = p_y0 + 220
    stats = [
        ("25", "Physics Labs"),
        ("120+", "Formulas"),
        ("3D", "Interactive Solids"),
        ("100%", "Zero Signup Free")
    ]
    for idx, (val, lbl) in enumerate(stats):
        sx = LX + idx * 230
        draw.text((sx, stat_y), val, font=font_stat_val, fill=(56, 189, 248, 255))
        draw.text((sx, stat_y + 60), lbl, font=font_stat_lbl, fill=(148, 163, 184, 225))

    # Bottom Launch & GitHub CTA
    cta_y = stat_y + 140
    btn_w = 430
    btn_h = 76
    draw.rounded_rectangle([LX, cta_y, LX + btn_w, cta_y + btn_h], radius=20, fill=(37, 99, 235, 255), outline=(96, 165, 250, 240), width=2)
    # Rocket icon on button
    draw_rocket_icon(draw, LX + 48, cta_y + btn_h // 2, 12, (255, 255, 255, 255))
    draw.text((LX + 76, cta_y + 18), "Launch Live Playground", font=font_btn, fill=(255, 255, 255, 255))

    # Repo link badge
    repo_x = LX + btn_w + 30
    repo_w = 510
    draw.rounded_rectangle([repo_x, cta_y, repo_x + repo_w, cta_y + btn_h], radius=20, fill=(15, 23, 42, 230), outline=(51, 65, 85, 210), width=2)
    draw_star_icon(draw, repo_x + 44, cta_y + btn_h // 2, 10, (250, 204, 21, 255))
    draw.text((repo_x + 72, cta_y + 20), "github.com/zrt219", font=font_btn, fill=(226, 232, 240, 255))

    # 6. Right Side - Layered 3D Visual Showcase
    sc_dir = "docs/assets/screenshots"
    ui_dir = "docs/assets/ui-concepts"

    def make_card(img_path, width, height, radius=24, border_color=(56, 189, 248, 200), border_width=3):
        if not os.path.exists(img_path):
            return None
        orig = Image.open(img_path).convert("RGBA")
        orig = ImageOps.fit(orig, (width, height), Image.Resampling.LANCZOS)
        
        mask = Image.new("L", (width, height), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, width, height], radius=radius, fill=255)
        
        card = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        card.paste(orig, (0, 0), mask)
        
        card_draw = ImageDraw.Draw(card)
        card_draw.rounded_rectangle([1, 1, width - 2, height - 2], radius=radius, outline=border_color, width=border_width)
        return card

    # Card 1: Main Centerpiece - Keplerian Orbit & Trading Height for Speed
    c1 = make_card(os.path.join(sc_dir, "lab-17-keplerian-orbit.png"), 1120, 700, radius=24, border_color=(56, 189, 248, 240), border_width=4)

    # Card 2: Top Floating Card - 3D Shapes & Hero UI Concept (featuring Learno)
    c2_path = os.path.join(ui_dir, "ui-concept-01-home-hero-3d-shapes.png")
    if not os.path.exists(c2_path):
        c2_path = os.path.join(sc_dir, "00-home-hero.png")
    c2 = make_card(c2_path, 800, 500, radius=22, border_color=(139, 92, 246, 220), border_width=3)

    # Card 3: Bottom Floating Card - Rocket Staging & Tsiolkovsky Equation
    c3 = make_card(os.path.join(sc_dir, "lab-19-rocket-thrust-delta-v.png"), 760, 480, radius=20, border_color=(236, 72, 153, 220), border_width=3)

    def paste_with_shadow(base, card, x, y, shadow_blur=40, shadow_alpha=140, offset=(0, 20)):
        cw, ch = card.size
        sw, sh = cw + shadow_blur * 2, ch + shadow_blur * 2
        shadow = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(shadow)
        s_draw.rounded_rectangle([shadow_blur + offset[0], shadow_blur + offset[1], 
                                 shadow_blur + offset[0] + cw, shadow_blur + offset[1] + ch], 
                                radius=24, fill=(0, 0, 0, shadow_alpha))
        shadow = shadow.filter(ImageFilter.GaussianBlur(shadow_blur // 2))
        base.paste(shadow, (x - shadow_blur, y - shadow_blur), shadow)
        base.paste(card, (x, y), card)

    # Paste layered cards
    if c2:
        paste_with_shadow(banner, c2, 1660, 100, shadow_blur=50, shadow_alpha=160, offset=(0, 24))
    if c3:
        paste_with_shadow(banner, c3, 1700, 670, shadow_blur=50, shadow_alpha=160, offset=(0, 24))
    if c1:
        paste_with_shadow(banner, c1, 1320, 280, shadow_blur=70, shadow_alpha=210, offset=(0, 30))

    # Sleek floating label on Main Card
    draw = ImageDraw.Draw(banner)
    tag_w, tag_h = 440, 56
    tx, ty = 1360, 310
    draw.rounded_rectangle([tx, ty, tx + tag_w, ty + tag_h], radius=16, fill=(15, 23, 42, 240), outline=(56, 189, 248, 230), width=2)
    font_card_tag = ImageFont.truetype(f_bold, 24)
    draw_orbit_icon(draw, tx + 28, ty + tag_h // 2, 10, 6, (250, 204, 21, 255), (56, 189, 248, 255))
    draw.text((tx + 54, ty + 12), "LIVE KEPLERIAN ORBITS LAB", font=font_card_tag, fill=(56, 189, 248, 255))

    # Outer border of banner
    draw.rectangle([0, 0, W - 1, H - 1], outline=(56, 189, 248, 90), width=3)

    # Save banners
    os.makedirs("docs/assets", exist_ok=True)
    out_master = "docs/assets/cosmic-formula-playground-banner-2x.png"
    out_banner = "docs/assets/cosmic-formula-playground-banner.png"
    out_cover = "docs/assets/banner-cover.png"
    
    banner.save(out_master, "PNG", optimize=True)
    print(f"Saved master banner: {out_master} ({W}x{H})")

    banner_std = banner.resize((1280, 640), Image.Resampling.LANCZOS)
    banner_std.save(out_banner, "PNG", optimize=True)
    banner_std.save(out_cover, "PNG", optimize=True)
    print(f"Saved standard banner: {out_banner} (1280x640)")
    print(f"Saved banner cover: {out_cover} (1280x640)")

if __name__ == "__main__":
    create_banner()
