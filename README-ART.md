# Hero photography

Both hero slots are filled by the **previous** shoot. A replacement pair has been
supplied but not yet committed — see *PENDING: hero photo replacement* below. The
CSS placeholder + `onerror` fallback are retained so the layout still holds if an
asset is ever removed.

| Slot | File | Output | Subject |
|---|---|---|---|
| Desktop hero | `assets/brand/hero-desktop.jpg` | 1200 × 1500 (4:5) | Woman on phone, brand-purple shirt |
| Mobile hero | `assets/brand/hero-mobile.jpg` | 900 × 1200 (3:4) | Woman reading phone, cut out on white |

## Processing applied

Both were derived from client-supplied sources. Originals are **not** committed;
re-derive from the originals if you need to change the treatment.

**Desktop —**
1. **Cropped** to remove two artifacts in the supplied file: a stray glyph in the
   leftmost 7px, and a baked-in rounded white corner in the top-right 124px.
   Crop box `x:10 y:58 w:423 h:529`, scaled to 1200 × 1500.
2. **Shirt shaded to the brand purple.** Worked in HSL so fabric folds survive:
   pixels in the violet-blue band were rotated to **hue 258°** (the hue of
   `--purple #7C5CD6`) with a light saturation lift, and **lightness left
   untouched**.
   - Before: `#8C8EA7` → HSL(236°, 13%, 60%)
   - After: HSL(**258°**, 22%, …) — same hue as the brand token, still soft.
   - Gate: hue 200–270 + saturation > 5% + mid lightness. This is why **skin
     (hue 20°), hair (hue 25°), the grey trousers (1% saturation) and the white
     backdrop (0% saturation) are untouched** — verified by sampling after the fact.
   - Tuning knobs live in the processing script: `TARGET_H`, `TARGET_S`,
     `STRENGTH`. A first pass at `TARGET_S 0.38 / STRENGTH 0.62` read as a full
     recolour; the shipped values are `0.26 / 0.55`.

**Mobile —** tightened to the subject's bounding box with 10% padding (the source
had heavy dead space top and bottom), centred horizontally on the subject, and
cropped to 3:4 on a white ground. No colour change: the navy blazer already sits
close to `--ink-navy`.

## Layout notes

- The mobile subject is a **cut-out on white**, so `.m-card` has no card chrome —
  she floats on the page (matching the supplied reference). The desktop subject
  has a studio background, so it keeps the 36px rounded card and soft shadow.
- **Eyelines.** Mobile: her gaze runs down-left onto the two chat bubbles —
  exactly the intended reading order. Desktop: she looks right/forward, so the
  bubble sits lower-left beside her phone hand and reads as the call itself
  rather than as something she is looking at. Move `.hero-bubble` if you prefer.

## PENDING: hero photo replacement (desktop + mobile)

New actor photography was supplied for both heroes, but **the image files were
not committed** — they arrived as chat attachments, not as files, so the two
`.jpg` assets below are still the previous shoot. Everything else on the landing
page (copy, bubbles, spacing) has been updated for the new direction.

To finish the swap, drop the two supplied source files in and run the recipe
below. No markup change is needed: both `<img>` tags keep their current `src`,
dimensions, `object-fit`, positioning, and z-index.

### The background hex is `#FFFFFF` — sampled, not eyeballed

Both heroes sit on the site's white ground, so the subject must be composited
onto **exactly `#FFFFFF`**:

| Surface | Rule | Value |
|---|---|---|
| Desktop hero | `.hero{background:var(--white)}` on `index.html` | `#FFFFFF` |
| Desktop card | `.hero-card` gradient placeholder, fully covered by the photo | n/a |
| Mobile hero | `body{background:var(--white)}` on `index-mobile.html` | `#FFFFFF` |
| Mobile card | `.m-card{background:#FFFFFF}` | `#FFFFFF` |

`--white` is `#FFFFFF` in the `:root` block of both files. Nothing tints the
hero area — no overlay, no `--haze`, no duotone (the `.duotone` utility is off).

### Recipe

```bash
# 1. Cut the subject out of the supplied source. Keep a real alpha channel —
#    do NOT flatten to white here, or hair edges pick up a grey fringe.
#    Any matting tool works; feather 0, then a 1px inward contract on the mask.

# 2. Composite onto the exact site background, un-premultiplied, so the
#    anti-aliased edge pixels blend against #FFFFFF instead of black.
magick subject-rgba.png -background '#FFFFFF' -alpha remove -alpha off out.png

# 3. Resize to the slot's native box (the <img> width/height attributes):
#      desktop  1200x1500  (4:5)
#      mobile    900x1200  (3:4)

# 4. Export WebP. The repo uses plain <img> with no <picture>/srcset fallback
#    pattern anywhere, so a single .webp per slot is the correct output —
#    do not introduce a <picture> element for these two images alone.
cwebp -q 82 -sharp_yuv out.png -o assets/brand/hero-desktop.webp
```

Current file sizes to stay under: `hero-desktop.jpg` 123,002 bytes,
`hero-mobile.jpg` 80,576 bytes. Then point the two `src` attributes at the
`.webp` files and delete the `.jpg`s.

### Verification checklist

- Sample the four corners of the exported file: every one must read `#FFFFFF`,
  not `#FEFEFE`. A one-step-off white is the seam people see.
- Zoom the hair and shoulder line to 400%: no grey halo, no hard jaggies.
- Check on the **rendered page**, not the file — load `/` and
  `/index-mobile.html` at 1x and 2x (`deviceScaleFactor: 2`) and confirm no
  rectangle edge is visible where the photo meets the page.
- Desktop only: the photo sits inside `.hero-card`, which has
  `border-radius:36px` and `box-shadow:var(--shadow-float)`. That soft shadow is
  intentional card chrome, not a halo — leave it.
- Keep the alt text accurate to the new subject. Current values:
  - `index.html` — `alt="Business owner reviewing funding options on her phone"`
  - `index-mobile.html` — `alt="Business owner on her phone arranging funding"`

## Licensing

**Confirmed licensed by the site owner (Aug 2026)** for commercial
financial-services advertising, covering both hero images. No further clearance
is needed to ship these.

## Brief for replacement art

If either hero is ever re-shot or swapped, match this so the layout and the
eyeline logic still work:

> Woman in three-quarter profile, phone to ear, high-key white studio/loft, soft
> window daylight, desaturated. Button-down shirt in brand purple `#7C5CD6`.
> Gaze directed down-left so her eyeline lands on the chat bubbles. Leave clean
> negative space in the lower-left for the bubble overlay.

Deliver desktop at 4:5 and mobile at 3:4. A mobile subject cut out on white
keeps `.m-card` chrome-free; a subject with a real background needs the card
styling restored (see Layout notes).

## Optional brand duotone

Add `class="duotone"` to `.hero-card` (desktop) to greyscale the photo and lay a
`mix-blend-mode: color` wash of `--brand-purple` over it. Off by default.
