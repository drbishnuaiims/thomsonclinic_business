# Thomson Clinic | Mental Health & Neuroscience eClinic

A fast, responsive, framework-free website built with HTML, CSS, JavaScript, and JSON. It is designed for static hosting, including GitHub Pages.

## Structure

- `index.html` — home page
- `pages/` — secondary pages
- `components/` — reusable header and footer loaded by `assets/js/layout.js`
- `assets/css/global.css` — all design, responsive, and theme styles
- `assets/js/layout.js` — global UI controller
- `data/search-index.json` — searchable page metadata

## Run locally

Use a local web server (component and JSON loading require one). For example, from the project folder run `python3 -m http.server 8000`, then open `http://localhost:8000`. VS Code Live Server works too.

## Deploy to GitHub Pages

Push this repository, then in GitHub open **Settings → Pages** and select the branch and `/ (root)` folder. The links are relative and work for a project-site URL such as `username.github.io/repository-name/`.

## Customize

The current brand is Thomson Clinic. Update the shared header, footer, page titles, and search index together if the clinic identity changes. Add a page in `pages/`, add its navigation link where appropriate, then add a matching object to `data/search-index.json` using `title`, `description`, `url`, `category`, and `keywords`.

## Appearance

The header appearance control saves `light`, `dark`, or `system` to localStorage under `website-theme`. System mode responds live to the device preference. The site also honors reduced-motion preferences.

## Contact form

The contact form validates in the browser and shows a local confirmation; it does not send data until you connect it to an appropriate, privacy-reviewed backend or form service. Do not collect personal or health information through it before that review.
