# Evan Rahman – Portfolio Site

Static site (HTML + Tailwind via CDN + `styles.css` + `main.js`). No build step.
Live at https://quantumevanster.github.io (GitHub Pages, branch `main`, root).

## About Evan
- ITI (Information Technology Infrastructure) student, University of Minnesota Twin Cities, grad 2029
- Student Tech Support at UMN CSE-IT; aiming for IT support now, cybersecurity / pen testing long term
- Email evanrahmanmn@gmail.com · GitHub QuantumEvanster · LinkedIn /in/evan-r-437279340
- Resume: `Evan_Rahman_Resume.pdf` (source of truth for experience, skills, projects)

## Files
- `index.html` home (ID card hero, live log, clock, right-side 3-node panel)
- `about.html` bio, experience, skills hex grid, certifications
- `projects.html` project cards (Pi-hole, Linux home server, security labs)
- `contact.html` email / GitHub / LinkedIn
- `main.js` boot sequence, live terminal feed, clock, GitHub contribution graph

## Origin
Design is based on Sai Guru Inukurthi's portfolio, used with his permission.
All of his personal content has been replaced.

## Open to-dos
- Replace Evangelion-derived names before further promotion: "MAGI SYSTEM", "NERV HQ",
  "AT FIELD", "PILOT", MELCHIOR / BALTHASAR / CASPER nav labels, Japanese warning words
  (非常事態, 暴走, 覚醒, 使徒, 質問, 解決). Use original names Evan picks.
- Working one page at a time, starting with `index.html`.
- Possible additions: Tijusce and Dynamic_Data_Dashboard project cards (both on GitHub),
  homelab page, interactive terminal, mobile check, link preview image.

## Workflow
- Preview locally: `python -m http.server 8000`, then open http://localhost:8000
- Publish: `git add .` → `git commit -m "..."` → `git push`
- Evan prefers concise, step-by-step guidance and plain language.
