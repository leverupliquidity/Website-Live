# Hero photography — art direction brief

Two photos are needed. Until they are dropped in, both hero cards render a neutral
gradient placeholder and the layout holds at every breakpoint (the `<img>` hides
itself via `onerror`), so the site is safe to ship before the shoot.

| Slot | Path | Aspect | Suggested size |
|---|---|---|---|
| Desktop hero | `assets/brand/hero-desktop.jpg` | 4:5 portrait | ~1200 × 1500 |
| Mobile hero | `assets/brand/hero-mobile.jpg` | 3:4 portrait | ~900 × 1200 |

> `assets/brand/` already holds non-logo art (`og-image.png`), so it is not
> logo-reserved. If you'd rather separate them, move both files to `assets/` and
> update the two `<img src>` values in `index.html` and `index-mobile.html`.

## The brief

**Use a DIFFERENT model than the reference images.** Do not reuse the woman from
the supplied template screenshots.

- Woman in **three-quarter profile**, **phone to ear**.
- **High-key white studio or loft**, soft window daylight, airy and bright.
- **Desaturated** overall grade — the frame should read as near-white.
- She wears a **button-down shirt shaded in the brand purple `#7C5CD6`**
  (token `--purple` / `--brand-purple`).
- **Her gaze is directed DOWN-LEFT toward the chat bubbles** (the USER PROBLEM
  element), so her eyeline lands on the client-problem copy. This is the whole
  point of the composition — the eyeline is the visual link between the model and
  the customer's pain.
- Leave clean negative space in the lower-left of the frame so the bubbles overlay
  without covering her face or hands.

## Sourcing

No photography can be generated here. Options:

1. **Commission a shoot** — best control over the shirt colour and eyeline.
2. **Licensed stock** with the shirt recoloured in post to `#7C5CD6`.
   Search terms that match this composition: *"businesswoman phone call white
   studio three quarter profile"*, *"small business owner phone high key"*,
   *"woman on phone looking down minimal white background"*.
   Check Unsplash / Pexels (free, permissive) first; Stocksy / Getty for
   art-directed alternatives with a signed model release.
3. **Model release is required** — this is commercial financial-services
   marketing, so confirm the licence covers advertising use.

## Optional brand duotone

If the sourced photo is too warm or too saturated to sit in the high-key layout,
add `class="duotone"` to `.hero-card` (desktop) or `.m-card` (mobile). That
greyscales the image and lays a `mix-blend-mode: color` wash of `--brand-purple`
over it, forcing it into the palette. It is off by default.
