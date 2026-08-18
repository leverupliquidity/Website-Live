# Hero photography

Both hero images are **in place**. The CSS placeholder + `onerror` fallback are
retained so the layout still holds if an asset is ever removed.

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
