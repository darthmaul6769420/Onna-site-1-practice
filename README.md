# ONNA — practice site

Plain HTML, CSS and JavaScript. No build step, no dependencies, no ecommerce.

```
onna-site/
  index.html        all content and markup
  css/styles.css    tokens at the top (colours, fonts, spacing), then one block per section
  js/main.js        hero lens, About reveal, plate drift
  assets/favicon.svg
```

## Preview locally
Open `index.html` in a browser, or run `npx serve .` inside this folder.

## Deploy to Vercel
1. Put this folder in a Git repo (or use the Vercel CLI).
2. Import it on vercel.com, framework preset **Other**, no build command, no output directory.
3. Deploy. Every file is static.

## Common edits
- **Colours / fonts / side margins:** the `:root` block at the top of `css/styles.css`. Fonts are Caveat (headings) and Klee One (reading text), loaded from Google Fonts in `index.html`. `--gutter` sets the empty space at the sides.
- **Copy:** everything is in `index.html`. The contact email is `alekbargman@gmail.com`; replace it in the header and footer.
- **Photography:** each placeholder is a `.plate` block in the About section. Replace the whole `.plate` div with `<img src="assets/your-photo.jpg" alt="...">`.
- **Logo:** four brush-drawn letters (`#g-o`, `#g-n1`, `#g-n2`, `#g-a`) at the top of `index.html`. The nav, hero, tees and footer all use those same shapes, so it only exists once. The `#m-...` masks make the hero logo write itself.
- **Tee illustrations:** the shape lives in `#tee-body`; the two colorways are set by the `--tee-*` variables on `.panel--on-butter` and `.panel--on-black`.
