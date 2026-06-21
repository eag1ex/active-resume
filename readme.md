# Active resume

Markdown → HTML → PDF publishing pipeline with live reload.

Designed for resumes, portfolios, and printable documents.

## Features

* Markdown documents
* SCSS styling
* Live browser reload
* Automatic PDF generation
* Multiple document support
* Shared SCSS partials
* Asset copying
* WeasyPrint-powered print output

---

## Installation

Install dependencies:

```bash
npm install
```

Install WeasyPrint:

```bash
sudo apt install weasyprint
```

Verify:

```bash
weasyprint --version
```

---

## Development

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Any change to:

```text
src/**/*.md
src/**/*.scss
src/assets/**
```

automatically:

```text
Build CSS
Build HTML
Build PDF
Reload Browser
```

---

## Project Structure

```text
src/
├── resume.md
├── opensource.md
│
├── assets/
│
└── styles/
    ├── base/
    │   ├── resume.scss
    │   └── opensource.scss
    │
    └── includes/
        ├── _variables.scss
        ├── _page.scss
        ├── _page-preview.scss
        ├── _typography.scss
        ├── _profile.scss
        ├── _lists.scss
        └── _resume-sections.scss

templates/
└── document.html

output/
```

---

## Markdown Frontmatter

Each document must define:

```yaml
---
fileName: resume
cssName: resume.scss
title: My Resume
---
```

### fileName

Controls generated output:

```text
output/resume.css
output/resume.html
output/resume.pdf
```

### cssName

SCSS entry file:

```text
src/styles/base/resume.scss
```

### title

HTML document title.

---

## SCSS

Entry file example:

```scss
@import "../includes/page-preview";
@import "../includes/page";
@import "../includes/typography";
@import "../includes/profile";
@import "../includes/resume-sections";
@import "../includes/lists";
```

Shared styles live in:

```text
src/styles/includes/
```

---

## Assets

Store images in:

```text
src/assets/
```

Example:

```md
![Profile](assets/profile.jpg)
```

Assets are copied automatically to:

```text
output/assets/
```

and work in both HTML and PDF output.

---

## Output

Generated files:

```text
output/
├── resume.css
├── resume.html
├── resume.pdf
│
├── opensource.css
├── opensource.html
└── opensource.pdf
```

Do not edit generated files manually.

---

## PDF Notes

PDF generation uses WeasyPrint and supports:

* `@page`
* Page numbering
* Headers / footers
* Print-specific CSS

Avoid using:

```css
::marker
```

with:

```css
list-style: none;
```

as this can cause issues in some WeasyPrint versions.
