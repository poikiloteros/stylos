# Revision 16 — the refactored build, 2026-09-23

Built from `../refactored/`, the comment-free production split of `stylos_15.html`,
which is untouched and sits beside this folder. The production files stay free of
comments, as the refactor's QA contract requires; everything that would have gone into
a comment — why a number is what it is, what the old one got wrong, the one knob to
reach for — is here instead.

Six things were asked for directly and are built. Two more were found on the way and
are built because each was a defect rather than a taste. Nothing else moved: no copy,
no colour, no typeface, no room, no keyframe except the one the About fix has to move.

---

## 1 · The favicon

**Was:** two outlined rectangles and a diagonal hairline on the *blue* ground — a
pictogram of the tablet at 1.4 units of stroke, which is 0.7px at 16px. It printed as a
grey smudge in a tab, and it was in the one palette the site does not open in.

**Now:** the **Archivo "S"** — the wordmark's own face, extracted from the font at the
gigaword's instance (`wdth 122, wght 700`), not drawn to resemble it — in bone on the
green ground, with a **warm square as its full stop**. The square is the reaction ink
(`--warm`), which is the only colour the site allows to answer the reader; here it is
the point of the stylus meeting the wax, and in a row of forty tabs it is the one spark
of colour. The ground carries the canvas's own vignette (`bgHi` → `bgLo`, centred 34%
down, as `buildBG` does), which is invisible at 16px and gives the 180px icon depth.

Two numbers are solved rather than chosen:

- **The square is 4 × 4 units at x 24, y 22** — even units, so it lands on whole pixels
  at both 16px (2 × 2) and 32px (4 × 4). At its first, unsnapped size it was a blurred
  3.7-unit smear at 16px.
- **The S is 19.5 units tall** — the largest that leaves the group (S, gap, square)
  optically centred with at least 3.4 units of ground on either side.

Four candidates were rendered at 16/32/64/120px on light and dark tab bars before this
one was chosen. The tesserae S (a pixel S with grout) read as 8-bit at 16px; the S with
an incised underline read as the underline button in a text editor; the stylus
pictogram read as a spatula or an "edit" icon. The plain S was legible and anonymous.

The set, because an SVG alone is not a favicon in 2026. Safari has read SVG favicons
only in its most recent versions, and a 2017 iMac stops at macOS Ventura, which cannot
run them — so on that machine Safari had no icon it could use (tabs, favourites,
history):

| file | for |
|---|---|
| `assets/icons/favicon.svg` | Chrome, Edge, Firefox — every size, one file (1.2 KB) |
| `favicon.ico` (root) | Safari and anything older: 16, 32 and 48 inside; at the root because browsers ask for `/favicon.ico` whether or not it is linked |
| `assets/icons/apple-touch-icon.png` | iOS home screen, 180 px, **full bleed** — iOS cuts its own corners |
| `assets/icons/icon-192.png`, `icon-512.png` + `site.webmanifest` | Android home screen. `display: browser`, so nothing offers to install the site |

The `.ico` is linked with `sizes="32x32"` and *before* the SVG. That is not a
preference for the ico: it is the one ordering that stops Chrome choosing the ico over
the SVG.

---

## 2 · Android: the codex sat to the right — and so did every fixed layer

**The cause** is one pseudo-element. `.studio-media::before` — the glow behind the
portrait in the About room — is 152% of the plate's width and centred on it. On a phone
the plate is the full column, so the glow hangs **64px past the right edge of a 360px
screen** (73px on a 412px one).

`html { overflow-x: clip }` stops that from making a scrollbar, and on desktop and on
iOS that is the end of it. **Chrome on Android does something else**: it widens its
*layout viewport* to hold the overflow while keeping the page at scale 1. Measured in
the emulator at a 360px phone:

| | before | after |
|---|---|---|
| `visualViewport.width` (what the screen shows) | 360 | 360 |
| `innerWidth` (the layout viewport) | **424** | 360 |
| `#tab` canvas width | **424** | 360 |
| burger's right edge | **415** — 55px of it off-screen | 351 |

Everything `position: fixed` is sized to the layout viewport — the canvas, the loader
and its photograph, the nav and its burger, the menu sheet, the case-study dialog and
its close button. The canvas centres the codex at 212 of 424, which is **32px right**
of the centre of what the reader can see. That is the report. It is every Android
phone, and every Android web view — including Facebook's in-app browser, which is where
most of the launch traffic will open it.

**The fix** is `.screen { overflow-x: clip }`: no room can export horizontal overflow
any more, whatever decoration is added to it later. `clip` rather than `hidden`
because `hidden` would turn every room into a scroll container, and the settle, the
tall rooms and the reveals all assume the document is the only scroller. The glow is
unchanged; it is cut at the edge of the room instead of at the edge of the viewport,
which is the same edge.

Re-measured after, at 320, 360, 375, 390 and 412 wide: layout viewport equals the
screen at every width, and the codex's box centre is within ±12px of the screen's
centre in all seven rooms where it appears on a phone. The ±12 is the object's own
asymmetry — the stylus is on one side of it.

> **This invalidates some earlier phone measurements.** Revision 13 records
> "`innerHeight` 956 against `100svh` 812" at a 375 × 812 emulation and reads it as the
> iOS toolbar; OPEN-ITEMS D1 records a re-measure "at 13, 441 × 956". Both are this bug:
> 441/375 = 956/812 = 1.176. The phone numbers from revisions 13–15 were taken in a
> 441px layout viewport.

---

## 3 · About on the 2017 iMac: the bio as a 74px column

**The cause.** The About room's grid was `text | lane | plate` with the lane at `25.5vw`
and the plate at `31vw` — but `.inner`, the box they live in, stops growing at
`--maxw` (1520px). Past a window of about **1656px** the two vw columns go on growing
and take the difference out of the text. Measured before:

| window | text column | lines of bio |
|---|---|---|
| 1920 (21.5″ iMac, 1080p) | 435px | 15 |
| 2048 (21.5″ iMac 4K, default) | 363px | 18 |
| **2560 (27″ iMac 5K, default)** | **74px** | **85** — and the room ran 1,292px off the screen |

**The fix, CSS half:** `minmax(150px, min(25.5vw, 422px))` and
`minmax(260px, min(31vw, 513px))`. **422 and 513 are 25.5vw and 31vw evaluated at
1656px**, the width at which `.inner` reaches 1520 (`1656 − 2 × 68 = 1520`, 68 being
the gutter's ceiling). Below it the `min()` never binds and nothing changes; above it
the columns stop when the container stops. If `--maxw` or the gutter's clamp ever
changes, these two numbers move with it.

**The fix, JS half — `syncStudioLane()`.** The drawing in this room is positioned in
vw (`KEY[10].fill`, `.px`) because the lane was in vw. With the lane capped, a vw
drawing walks out of it: at 2560 it stood 393px right of the lane's centre and 185px
behind the portrait. So the tuned values are now read as what they always were — a
solution for *a lane 25.5vw wide centred at 51.85vw* (`LANE_REF`, the figures
ARCHITECTURE.md gives for this lane) — and rescaled to the lane that is actually
measured:

- `fill` scales with the lane's width;
- `px` keeps the drawing's anchor at the same fraction of the lane off its centre.

At every uncapped width the measured lane *is* the reference, so the function returns
**exactly** 0.205 and 0.010 — verified at 1440, where the tuned layout is untouched to
the pixel. It runs at initialise and on every full resize. On a phone it restores the
tuned values and stands down (`figM` is 0 there anyway).

Measured after:

| window | text | lane | drawing | clearance L / R |
|---|---|---|---|---|
| 1440 × 900 | 488px (63–552) | 563–930, mid 747 | mid 746 | as before |
| 2048 × 1060 | 488px | 849–1271, mid 1060 | mid 1061 | 45 / 43 |
| 2560 × 1440 | 488px | 1105–1527, mid 1316 | 1155–1487 | 50 / 40 |

488px is the `52ch` measure the room was always meant to have. Every room fits its
viewport at all three widths.

---

## 4 · The settle — more decisive, not a slideshow

Asked for: *"a slightly more driven/enforced fixing of movement."* Judged worth doing,
and done as a firmer settle rather than as one-gesture-one-room. A paged deck swallows
trackpad momentum, fights the rooms that are taller than the screen, and takes the
scroll away from keyboard and assistive users; "slightly" was the right word.

Three changes, and the touch path, the tall-room stand-down and the "the browser is not
following, stand down" check are unchanged:

1. **It engages sooner.** `IDLE_WHEEL` **460 → 160ms**, and instead of settling blind
   when the timer fires it hands over to the same still-frame watcher the touch path
   uses (three frames without movement). So it can no longer start while Chrome is
   still animating the last wheel notch, which is what a 160ms timer alone would risk.
   From the last wheel event to the glide beginning: **233ms, was ≥ 460**.
2. **It moves like the rest of the site.** The fixed 780ms ease-out-cubic is replaced by
   **`--ease-i` (`.45, .05, .16, 1`)** — the curve the headings already rise on — over a
   time scaled to the distance: `360 + 0.45 × px`, capped at **760ms**. A short
   correction no longer takes as long as a whole room. The old curve jumped: 58% of the
   distance in the first quarter of the time, which is what read as "gravitating" —
   the page stopped, then lurched. This one leaves gently and lands softly. Measured on
   one 120px wheel notch from room 1: lands on room 2 at **900ms, was ~1,240**.
3. **The keyboard pages.** ↓ / ↑ / PageDown / PageUp / Space / Shift-Space move exactly
   one room, on the same glide. Before, a single ↓ scrolled 40px and the settle pulled
   the page back to where it was, so one key press did nothing at all. Inside a room
   taller than the screen the keys scroll natively until its edge; paging up into a
   tall room lands at its *foot*, not its top. Held keys do not queue a run of rooms
   (repeats are ignored while a glide runs). Keys are left alone in inputs, the ink menu
   and radio groups, and Space is left alone on buttons. Nothing pages while the menu,
   a case study, the console or the introduction is open, and under reduced motion
   nothing pages at all.

`CARRY` (0.085) is unchanged: 8.5% of a room in a direction still commits to the next
one.

The knobs: `IDLE_WHEEL`, `GLIDE_MIN / GLIDE_MAX / GLIDE_PX`, and the curve in
`bezier(...)`, all at the head of `SETTLE` in `js/app.js`.

---

## 5 · Phone typography and spacing

Walked room by room at 390 × 844 with every reveal forced to its end state.

- **Landing — "Scroll" and "Straight to the studio" slid off-centre as they appeared.**
  Both were centred with `left: 50%; transform: translateX(-50%)`, and both carry `.rv`,
  whose revealed state is `transform: none`. So the reveal removed the centring: the
  cue ended 27px right of the name (on desktop too), and on a phone the pass link ended
  at 180–358 of 360, 89px off the axis and 2px from the edge. It also meant neither
  had its intended reveal: they slid sideways instead of rising. Both are now centred
  with `left: 0; right: 0; margin-inline: auto; width: max-content`, which a transform
  cannot undo. Measured after: centre offset 0 at 320, 360 and 1440.
- **Room headings on a phone were three different sizes and measures.** Desktop rules
  for three rooms (`.practice-2 .h2`, `.reg-title .h2`, `.works-head .h2`, specificity
  0,2,0) outranked the phone's `.h2` (0,1,0). Result: "Agility and precision…" in
  **five** lines at 15ch; "Three kinds of commission." at 23px, the same size as the
  card heading under it, so the hierarchy went flat; "Websites, databases,
  portfolios" in three lines. All room headings on a phone are now one size (27.2px at
  390) and one measure (20ch), with `text-wrap: balance`. After: 3, 2 and 2 lines.
  Desktop is untouched.
- **The credentials grid in About** — in the left column the value floated down away
  from its label, because the inner grid's rows stretched to the height of the taller
  cell beside it. `align-content: start`; every label–value gap is now 2px.
- **Contact: the footer ran into the availability line** — about 10px apart, because
  on a phone the room has no height to separate them. `margin-top:
  clamp(40px, 7vh, 64px)` wherever rooms lose their full height; 59px at 390 × 844.

---

## 6 · Found on the way

**The room's scrim was painted over the Projects room and the footer.** Every scrim
is `::before` at `position: absolute; z-index: 0`. Copy wrapped in `.inner` sits at
`z-index: 2` and is safe — but the Projects room has no `.inner` and neither does the
footer, so both were *under* their scrim, and a scrim over type darkens the type
instead of the field behind it. On desktop the card captions, the prev/next discs and
the counter sat under up to 90% of the ground colour ("University of Oxford · UKRI" was
all but invisible), and the footer's address and copyright were dimmed by a left-to-
right ramp — which quietly undid 12.1's decision to put the footer at full ink.
`.works > div, .foot { position: relative; z-index: 2 }`. Compared in screenshots
before and after at 1440 × 900; the inactive cards keep their intended half-opacity.

**A resize could leave the page built for the old width.** The resize handler has a
cheap branch for height-only changes (the phone's toolbar) and a full branch for width
changes — and the cheap branch *cancelled* a pending full rebuild. Any width change
followed within 200ms by a same-width event — a phone rotated and then its URL bar
settling, or macOS's full-screen animation — left the canvas, the landing registration
and the About lane at the previous width: a stretched, off-centre drawing until the
next width change. `rzFull` now keeps a queued full rebuild from being downgraded.
Reproduced and verified with exactly that sequence.

---

## Verified

In the browser pane, driven by a probe on a synthetic clock (rebuild it from the recipe
in CLAUDE.md; note that this build's CSP blocks inline scripts, so the probe has to be an
external file in `js/`, and that a synchronous pump starves the loader's promise chain —
pump in several separate calls until `#loader` is gone).

- **1440 × 900:** all thirteen rooms walked, room index following, `dist` finite, no room
  overflowing, no horizontal overflow, no console errors.
- **375 × 812:** the same, with only the documented tall rooms over (practice +27,
  practice2 +75, works +1315, studio +281, method +189, contact +363). Compared with the
  untouched build at the same size: practice2 is 56px *shorter* (five heading lines to
  three), works 15px shorter, contact +58px by design; studio and method are the live
  copy's length and identical in both builds.
- **320, 360, 390, 412 wide:** layout viewport equals the screen; landing labels centred.
- **1920, 2048, 2560 wide:** the About room as tabled in §3.
- **The settle:** keyboard paging, the wheel settle and the resize sequence as described.

**Not verified:** real hardware (Android above all — this was the emulator's viewport
logic, which is Chrome's own, but it is still an emulator), Safari, Firefox, and reduced
motion running.
