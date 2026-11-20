# Once Upon a Tap v44 — Landscape and readable text

100 residents, 13 realms and 2,700 tasks. Quick 30s–5m, Medium 6m–2h, Long 2h 30m–24h.

Turn your phone sideways for the landscape layout: left navigation, compact status bar, side journals and bottom town controls. Fit shows the whole town; + and − return to closer views. Portrait remains available. Browser orientation follows the device; this release does not force an OS orientation lock.

Open More > Text size and choose Standard (100%), Large (120%) or Extra large (140%). The preference saves with your town and is used by the animation studio. Larger text increases scrolling in journals.

Before upgrading, use More > Backup save > Copy and keep that code and your v43 ZIP. Replace files at the same site address to keep the browser save. See SAVE-GUIDE.md.

Deploy the extracted contents with index.html at the GitHub Pages root. No backend or runtime generation is needed. Alternatively serve locally with python -m http.server 8080.

128 grouped mocked checks pass. Actual desktop Chromium browser checks covered 844×390 landscape, 390×844 portrait and 1280×800 laptop viewports. These are not physical iPhone/Safari, touch, performance or full visual acceptance tests.

V44 polish: wrapping duration filters, filter-result navigation, journal scroll reset, focus/disclosure preservation, stronger text contrast and compact landscape headers. See the development delivery for the open acceptance gates.
