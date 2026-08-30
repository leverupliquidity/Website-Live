# Hero photography

Both hero slots carry the current shoot, cut out and composited onto the exact
page background so the figure floats with no card edge. The `onerror` fallback is
retained so the layout still holds if an asset is ever removed.

| Slot | File | Output | Subject |
|---|---|---|---|
| Desktop hero | `assets/brand/hero-desktop.webp` | 1200 × 1500 (4:5) | Man on phone, white tee, cut out on `#FFFFFF` |
| Mobile hero | `assets/brand/hero-mobile.webp` | 900 × 1200 (3:4) | Man reading phone, cut out on `#FFFFFF` |

## Processing applied

Both were derived from client-supplied sources. Originals are **not** committed;
re-derive from the originals if you need to change the treatment. The full
recipe — matting model, compositing, framing rules and the edge checks — is in
*Background matching* below.

Neither image was colour-graded. The desktop subject's tee is a pale blue that
already separates from the `#FFFFFF` ground; the mobile subject's sweater is warm
beige. The `--purple` shirt recolour applied to the previous shoot was dropped
with it.

## Layout notes

- **Both** subjects are cut-outs on white, so neither frame carries card chrome:
  `.m-card` never had any, and `.hero-card` had its radius, shadow and gradient
  placeholder removed (see *Card chrome was removed on desktop*). The figures
  float directly on the page.
- **Eyelines.** Mobile: his gaze runs down onto his phone, and the two chat
  bubbles sit at lower-left directly under that eyeline. Desktop: he looks
  up-right, away from the bubbles, which sit over his chest and read as the call
  he is on rather than as something he is looking at. Move `.hero-bubbles` if you
  prefer a different reading order.

## Background matching — how the current pair was made

### The background hex is `#FFFFFF` — sampled, not eyeballed

| Surface | Rule | Value |
|---|---|---|
| Desktop hero | `.hero{background:var(--white)}` + `.hero-card{background:var(--white)}` | `#FFFFFF` |
| Mobile hero | `body{background:var(--white)}` + `.m-card{background:#FFFFFF}` | `#FFFFFF` |

`--white` is `#FFFFFF` in the `:root` block of both pages. Nothing tints the hero
area — no overlay, no `--haze`, no duotone (the `.duotone` utility is off).

### Pipeline

1. **Matte.** `rembg` with the **`birefnet-portrait`** model, `post_process_mask=False`
   so the alpha stays soft. Model choice mattered: `u2net_human_seg` erased the
   phone from the desktop subject's hand, and `isnet-general-use` left a speck by
   the mobile subject's ear. `birefnet-portrait` kept both subjects intact with
   the cleanest hair edge.
2. **Composite.** `alpha_composite` onto an opaque `#FFFFFF` canvas — un-premultiplied,
   so anti-aliased edge pixels blend against white rather than black (blending
   against black is what produces the classic grey fringe).
3. **Supersample.** Built at 2× the output size, then downsampled with LANCZOS,
   so the silhouette edge is anti-aliased rather than resampled twice.
4. **Frame.** Subject bottom-anchored (body bleeds off the bottom edge, which reads
   as a normal waist crop) and kept clear of the top/left/right edges — a limb
   touching a side edge would read as a slice, since the frame itself is invisible.
   Both subjects are near-square in silhouette inside a taller frame, so ~20–23%
   headroom above the head is inherent to the geometry, not a framing slip.
5. **Encode.** WebP, method 6. The repo uses plain `<img>` with no `<picture>` or
   `srcset` anywhere, so a single `.webp` per slot is the right output — no
   `<picture>` element was introduced for these two images.

### Verified

- Top, left and right edges of both encoded files are **byte-exact `#FFFFFF`**
  (`min()` over each edge = 255), not `#FEFEFE`. The bottom edge carries subject
  by design.
- On the **rendered pages** at both 1× and 2×, a 40px band straddling the image
  boundary on the left, top and right contains **zero non-white pixels** — the
  boundary is undetectable, which is the actual requirement.
- Hair and shoulder lines inspected at 3× zoom off the 2× render: no halo, no
  fringe, no jaggies.
- Desktop encoding quality is capped by the border, not by taste: at a 10px
  subject margin, WebP q82 bled a 2/255 deviation into the left edge. Widening
  the margin to ~19px restores a byte-exact border. **If you re-frame the desktop
  image, re-run the edge check** — a tight margin plus lossy compression is what
  reintroduces a seam.
- Sizes: desktop 115,990 B (was 123,002, −6%), mobile 52,674 B (was 80,576, −35%).

### Card chrome was removed on desktop

`.hero-card` previously had `border-radius:36px`, `box-shadow:var(--shadow-float)`
and a grey gradient placeholder. Against a white-on-white cut-out those draw a
visible rounded rectangle around the subject, so they were dropped; the frame now
matches `.m-card` on the mobile page ("no card chrome, the subject floats on the
page"). `aspect-ratio:4/5` still reserves the box, so the layout holds if the
asset 404s. To restore the card look, put those three declarations back — but the
photo would then need a non-white studio background again.

## Licensing

> **Unconfirmed for the current pair.** The previous shoot was confirmed licensed
> by the site owner (Aug 2026) for commercial financial-services advertising, but
> that clearance covered *those* files. The images now in `assets/brand/` are a
> different, later-supplied pair and are **not** covered by it. Confirm rights for
> commercial use before this goes live.

Also note, on the desktop image: the subject wears a crossbody strap with a
legible third-party wordmark. It survives the cut-out because it is on the
subject, not in the background. On a commercial finance page a readable luxury
brand mark can imply an association that does not exist — worth a look before
launch. Removing it means retouching the strap in the source and re-running the
pipeline.

## Brief for replacement art

If either hero is ever re-shot or swapped, match this so the layout and the
eyeline logic still work:

> Business owner with a phone — to the ear or in hand. Any background is fine:
> the subject gets cut out and composited onto `#FFFFFF`, so what matters is a
> clean separable silhouette, even lighting, and no motion blur at the hair line.
> Avoid pure-white clothing, which loses its edge against the ground. Leave the
> lower-left of the frame uncluttered for the bubble overlay.

Deliver a source at any aspect — the pipeline reframes to 4:5 (desktop) and 3:4
(mobile). Both frames are chrome-free, so the subject must not touch the top or
side edges of the output; only the bottom edge may carry the subject.

## Optional brand duotone

Add `class="duotone"` to `.hero-card` (desktop) or `.m-card` (mobile) to greyscale
the photo and lay a `mix-blend-mode: color` wash of `--brand-purple` over it. Off
by default — and note it would tint the composited `#FFFFFF` ground too, which
would reintroduce a visible rectangle. Leave it off while the heroes are cut-outs.
