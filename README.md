# LINDJANAR

Portfolio site for Janar Lind — automotive photographer and videographer based in Estonia.

Live: https://renerichardkrause-ops.github.io/lindjanar/

## File layout

```
lindjanar/
├── index.html              Landing page
├── photography.html        Photography sub-page (gallery grid)
├── contact.html            Contact page
├── styles.css              All styles
├── script.js               Footer year + retouching compare slider
├── galleries/              36 individual gallery pages
│   ├── project-01.html
│   ├── project-02.html
│   └── …project-36.html
└── assets/                 Where to drop photos and videos
    ├── hero/               Landing hero photo
    ├── photography/        Feature photo + photography page hero video
    ├── videography/        Background video + 3 video slots
    ├── retouching/         Before/after pair for the slider
    ├── kit/                Kit photo
    ├── about/              "A Passion For Cars" photo (later video)
    ├── contact/            Contact page hero photo
    └── galleries/
        ├── project-01/     Photos for gallery 01
        ├── project-02/
        └── …project-36/
```

## Where to edit copy

Every chunk of copy in the HTML files is marked with a comment like
`<!-- [EDIT COPY] ... -->` right above it. Open the file, find the
comment, and edit the text below it.

| Section                       | File                          |
| ----------------------------- | ----------------------------- |
| Landing intro / name          | `index.html`                  |
| Featured Work captions        | `index.html`                  |
| Automotive Photography copy   | `index.html`                  |
| Videography copy              | `index.html`                  |
| Retouching copy               | `index.html`                  |
| Photography Kit copy          | `index.html`                  |
| A Passion For Cars copy       | `index.html`                  |
| Photography page intro        | `photography.html`            |
| Gallery thumbnail titles      | `photography.html` (one `<h3>` per thumbnail) |
| Inside an individual gallery  | `galleries/project-NN.html`   |
| Contact page copy             | `contact.html`                |

## How to add photos

1. **Hero photo (landing)** — drop a wide landscape image at
   `assets/hero/hero.jpg`, then in `index.html` find the comment
   `[EDIT ASSET] Hero image` and uncomment the `<img>` tag below the
   placeholder.

2. **Photography feature photo (split section)** — `assets/photography/feature.jpg`.

3. **Videography background video** — `assets/videography/bg.mp4`.
   It is already wired up; just drop the file. Keep it short (5–15s)
   and ideally under ~5 MB for fast loading.

4. **Three videography videos** — `assets/videography/01.mp4`, `02.mp4`,
   `03.mp4`. In `index.html` replace each `placeholder-video-21-9`
   div with a `<video>` tag or a YouTube/Vimeo iframe.

5. **Retouching before/after** — `assets/retouching/before.jpg`
   (untouched) and `assets/retouching/after.jpg` (edited). Replace the
   two placeholders inside the `compare-slider` block in `index.html`.

6. **Kit photo** — `assets/kit/kit.jpg`.

7. **About photo** — `assets/about/about.jpg` (Janar shooting a car).
   Later this can be swapped for a video by replacing the placeholder
   with a `<video>` tag.

8. **Contact hero** — `assets/contact/hero.jpg`.

9. **Gallery covers (photography page)** — for each gallery, drop a
   cover image at `assets/galleries/project-NN/cover.jpg`. In
   `photography.html` find the matching `<a class="gallery-thumb">`
   and replace its placeholder div with `<img src="…/cover.jpg" alt="" />`.

10. **Photos inside a gallery** — drop any number of images into
    `assets/galleries/project-NN/`, then open `galleries/project-NN.html`
    and add `<img src="../assets/galleries/project-NN/your-file.jpg" alt="" />`
    tags inside `<div class="gallery-photos">`. Photos stack at their
    natural aspect ratio, one per row. Add as many as you like.

## Photography page gallery list

The 36 gallery thumbnails alternate between 3:2 and 3:4 aspect ratios
for visual variety. To change a gallery title, edit the matching `<h3>`
inside `photography.html`. To remove an unused gallery entirely, delete
its `<a class="gallery-thumb">` block in `photography.html` and the
matching `galleries/project-NN.html` file.

## Local preview

Just open `index.html` in a browser (double-click) — no build step.

For a proper local server (recommended so relative paths work cleanly):

```
cd lindjanar
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

The site auto-deploys via GitHub Pages from the `main` branch.
Push to `main` and the changes go live within ~1 minute at:
https://renerichardkrause-ops.github.io/lindjanar/
