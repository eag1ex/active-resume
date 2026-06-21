
## resume markdown


## installation

run 
npx playwright install chromium
sudo apt install weasyprint

## structure
project.markdown/
│
├── src/
│   │
│   ├── resume.md
│   ├── opensource.md
│   │
│   ├── assets/
│   │   ├── michael.jpg
│   │   └── ...
│   │
│   └── styles/
│       │
│       ├── base/
│       │   ├── resume.scss
│       │   └── opensource.scss
│       │
│       └── includes/
│           ├── _variables.scss
│           ├── _mixins.scss
│           ├── _page-preview.scss
│           ├── _resume-layout.scss
│           └── _opensource-layout.scss
│
├── templates/
│   └── document.html
│
├── output/
│   ├── resume.html
│   ├── resume.css
│   ├── resume.pdf
│   │
│   ├── opensource.html
│   ├── opensource.css
│   └── opensource.pdf
│
└── scripts/
    ├── discover.js
    ├── build.js
    ├── buildPdf.js
    └── server.js