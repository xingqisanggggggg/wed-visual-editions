# WED Visual Editions — revision 7

## Scope retained
- Four vertical editions; A3-ratio books with introductions beside them on desktop.
- Actual supplied posters as covers; complete contained images with low-opacity blurred duplicate backgrounds.
- Global visual rebuild: large editorial typography, translucent fixed navigation, project-dependent atmospheric colors.
- Three dimensional solid covers, backs, spines and page blocks; slow idle rotation and vertical drift; differing thickness, colors and roughness.
- Camera/object continuity on entering and returning; stable reading pose.
- Books for projects 1, 2 and 4; project 3 is a separate scrollable website presentation.
- Desktop spreads, mobile single pages; curved front/back page mesh; drag completion and rebound; forward/reverse wrap to cover.
- No invented end page. Odd final spread uses existing cover art.
- Index, publication information, full-image enlargement, keyboard controls, modal focus, reduced motion, offscreen scene skipping, loading state and fallback.
- English interface and slugs; independently versioned code/style imports.

## Verified 2026-09-16
- Node syntax checks: editions.js and software-renderer.js.
- verify-editions.cjs: 17 image paths exist, all three book image sets reachable, desktop/mobile page counts, forward cycle, reverse boundary, no END OF EDITION.
- Live browser: software-3D fallback renders; initial cover occlusion corrected.
- REBUILD: enter, double-page display, curved intermediate turn, last spread, return to cover and close.
- Yunnan: entry, complete spread, enlargement with two originals.
- Indigo: separate browser panel; three images load; navigation scrolls inside panel.
- Shape of Love: entry, spread, information sheet, mouse drag advances spread.
- Responsive iframe at 390x844: homepage and single-page reader inspected visually.

## Limits / remaining visual sign-off
- Test browser disables WebGL; hardware-accelerated lighting/shadows cannot be directly verified there. Compatibility rendering uses the same Three.js scene and deformed geometry but simpler lighting.
- Responsive browser check is not a physical iPhone/Safari performance test.
- The design is an interpretation of the two supplied references, not a claim of matching their production fidelity.
- Final software raster seam adjustment requires one post-deployment visual check.
- Minor cover bevels, softcover flex and translucent interleaves are not yet modeled; current distinctions are binding thickness, paper tone and material roughness.
