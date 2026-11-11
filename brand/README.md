# Pixel Ripples · Split Arc

The supplied `PixelRipplesMark.tsx` is preserved here for React reuse. The main gallery is native HTML/CSS/JavaScript; its navigation embeds the component's exact SVG paths and rectangles directly in `index.html`, without adding a React runtime.

Navigation color comes from `currentColor` and the existing `--mint` token (`#a7f1d5`). The mark is 36px on desktop and 32px on mobile. Black, white, mint and currentColor SVGs, plus dark-background favicons and PNG exports, live in `assets/brand/`. They are copied to the static website artifact. The TSX source and these maintenance notes are not copied by the CloudBase build.

The supplied dark-background mint favicon retains its original color, `#B7EFD7`. The homepage and Pandora page use the new explicit favicon path; old gallery-mark references have been removed. Header glass uses a uniform blur/tint and a 1px lower border, with no gradient mask.
