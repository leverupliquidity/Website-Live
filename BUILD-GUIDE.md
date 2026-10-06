# Leverup Liquidity site — guide for page builders

Astro 7 static site. The shared foundation is done; you build pages on top of it.

## Where things are

| What | Path |
| --- | --- |
| Design screenshots (visual source of truth) | `/home/claude/pkg/screens/*.jpg` (desktop 1440 wide at 1x; mobile frames are 390 at ~1.4–1.5x) |
| Screens index (frame → sections in order) | `/home/claude/pkg/screens/index.json` |
| Exact copy (every text layer, per frame/section) | `/home/claude/pkg/figma/structure-and-copy.json` → `pages[].frames[].sections[].texts[] = [text, font, size, color, layerName]` and `visible` |
| Build brief | `/home/claude/pkg/README-BUILD-BRIEF.md` |
| Saved-for-later / layout-fit notes | `/home/claude/pkg/docs/leverup-saved-for-later.md`, `leverup-layout-fit-changes.md` |
| Color / type systems | `/home/claude/pkg/docs/color-system-v1.md`, `typography-system-v1.md` |
| Image usage map | `tools/images-index.json` — `src/assets/images/NN-*.jpg` is the package image whose filename starts with the same `NN` |

**Viewing screenshots:** they are tall. Crop them first: `python3 tools/crop.py <screenshot.jpg> /home/claude/crops/<name> 1100` then Read the crops.

## Hard rules

1. **Copy is final.** Use the exact text from structure-and-copy.json, including ` ` non-breaking spaces (write `&nbsp;` in markup or ` ` in strings). Don't invent or rewrite copy. When the mobile frame has different copy from desktop (e.g. Home hero), render both and toggle with `.mobile-block` / `.desktop-block` (or `.only-mobile` / `.only-desktop` for inline).
2. **Skip anything hidden.** Sections with `"visible": false` or named `[HIDDEN · not in launch] …` do not get built.
3. **No Terms link anywhere.** The Terms page is not launching (`SHOW_TERMS = false`). The Disclosures page and "Read our disclosures" links were removed from the design; don't add them.
4. **Phone:** always from `site.phone` in `src/data/site.ts` (`display`, `tel`, `sms`). Email `site.email`. "Book a call" / "Pick a time" → `site.bookingsUrl` with `target="_blank" rel="noopener"`.
5. **Dates:** "Updated [DATE]" / "Last updated [DATE]" → `site.updated.display` (Privacy uses `site.privacyUpdated.display`).
6. **FAQs:** questions and answers come from `src/data/faq.ts` (already filled in). Use `<FaqList id="..." items={faqs.loc} />`. Only `/faq` sets `schema={true}`.
7. **"Counsel-approved text only."** in forms → use `<ConsentFields kind="sms" />` (Apply, Contact) or `kind="email"` (Guides signup). Article disclaimer → `consent.articleDisclaimer` from `src/data/consent.ts`.
8. **Don't edit shared files**: `src/components/shared/*`, `src/styles/global.css`, `src/layouts/*`, `src/data/*`, `astro.config.mjs`. Other builders depend on them. Put page-specific styles in a scoped `<style>` in your page/component. If you truly need a shared change, describe it in your final report instead.
9. Put page-specific components in `src/components/<your-area>/`.

## Building blocks (src/components/shared)

- `BaseLayout` (`src/layouts/BaseLayout.astro`): props `header="default|apply"`, `footer="site|minimal"`, `actionBar`, `jsonLd=[...]`, `ogType`, `ogImage`. Title/description come from `src/data/meta.ts` automatically by path.
- `Img` — responsive AVIF/WebP/JPG. `<Img src={imported} alt="..." widths={[400,800,1200]} sizes="..." priority />`. Crop with CSS: wrap in a box with `aspect-ratio` and `overflow:hidden` and give the img `width:100%;height:100%;object-fit:cover` (`picture` is `display: contents`). Hero images: `priority`. Decorative images: `alt=""`.
- `Icon name="phone|message|calendar|check-circle|x-circle|…"` (names = files in `src/icons`).
- `Button` (or plain `<a class="btn btn--primary">`): variants `primary`, `secondary`, `primary-on-brand`, `secondary-on-brand`.
- `SectionHead title lede` + `slot="action"`.
- `ProductCard product="loc|equipment|term|mca"`.
- `KeyFigures rows={[['Amount','$5K–$1M'], ...]}`.
- `CostsTable rows={[{item, figure, when, broker?}]}`.
- `FaqList`, `Breadcrumb items={[{label:'Financing', href:'/financing'}, {label:'Lines of credit'}]}` (adds BreadcrumbList JSON-LD).
- `ClosingCTA title lede primary secondary` (Harbor band + Call/Text/Book channels) and `ContactChannels ground="brand|light"`.
- `ConsentFields kind="sms|email" idPrefix="..."` (includes the honeypot field).
- Form submit: `import { bindForm } from '../scripts/forms'` in a `<script>`; form gets `data-w3f data-subject="..." data-event="contact_submit" data-redirect="/apply/confirmation"` plus a `<div data-form-status hidden tabindex="-1" role="status"></div>`.
- Analytics: add `data-track="event_name"` to buttons/links; call `window.lvTrack('apply_step', {step: 2})` from scripts. tel:/sms:/mailto:/Bookings links are tracked automatically.
- Mobile action bar: mark the hero CTA group with `data-hero-cta` so the bar appears once it scrolls away.

## Global CSS classes (src/styles/global.css)

Layout: `.container`, `.section` + `.section--paper|white|raised|brand`, `.grid .grid--2|3|4`, `.swipe` (horizontal scroller on phones), `.faq-split` (+`__head`), `.form-grid .form-grid--2 .span-2`.
Type: `.h1` (60/64 desktop, 39/44 mobile), `.h1--48`, `.h2` (39/44 → 28/36), `.h3` (Plex 20/32), `.h3-serif`, `.h4`, `.lede` (Serif 21.78/32), `.quote`, `.body-15`, `.meta`, `.label`, `.eyebrow`, `.mono`, `.figure`, `.figure-lg`, `.figure-xl`.
Links/buttons: `.link` (+`--13|--17`), `.link-icon`, `.btn …`, `.btn-row` (+`--stack` for full-width on phones).
Components: `.card` (+`--pad`), `.spec`, `.key-figures`, `.costs-table`, `.check-list` (+`--x`), `.faq`, `.field`, `.input`, `.select`, `.textarea`, `.choice`, `.consent-box`, `.form-status`.
Breakpoints: phones < 768, tablet 768–1023, desktop ≥ 1024. Container content width 1280 at 1440 (80px gutters); 20px gutters on phones.

## Accessibility

One `<h1>` per page. Headings in order. Visible focus (already global). Accordions/menus use `aria-expanded`. Form fields have `<label for>`, errors tied with `aria-describedby`, `aria-invalid`. Tap targets ≥ 44px. Images need meaningful alt text (describe what's in the photo) or `alt=""` if decorative.

## Check your work

You work in your own copy of the project (see your task). From that folder:

```
npx astro build                       # must finish with no errors
node tools/shot.mjs /route --out tools/shots      # full-page PNGs at 1440 and 390
node tools/overflow.mjs /route        # must report "sw": 390 (no sideways scroll on phones)
```

Compare your screenshots against the design screenshots section by section (crop both with tools/crop.py) and fix differences in spacing, sizes, colors, order and copy. Match at 1440 and 390, and make sure 768 and 1024 hold up.
