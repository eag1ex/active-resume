const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");
const sass = require("sass");

const discover = require("./discover");
const buildPdf = require("./buildPdf");

const md = new MarkdownIt({
  html: true
});

function copyAssets() {

  const sourceAssets =
    path.join(
      "src",
      "assets"
    );

  const outputAssets =
    path.join(
      "output",
      "assets"
    );

  if (
    !fs.existsSync(
      sourceAssets
    )
  ) {
    return;
  }

  fs.cpSync(
    sourceAssets,
    outputAssets,
    {
      recursive: true
    }
  );

  console.log(
    "Assets copied"
  );

}

function buildCss(doc) {

  const entryFile = path.join(
    "src",
    "styles",
    "base",
    doc.cssName
  );

  const result = sass.compile(
    entryFile,
    {
      style: "expanded"
    }
  );

  const outputCssFile =
    `${doc.fileName}.css`;

  fs.writeFileSync(
    path.join(
      "output",
      outputCssFile
    ),
    result.css
  );

  return outputCssFile;
}

async function buildDocument(doc) {

  const markdown =
    fs.readFileSync(
      doc.source,
      "utf8"
    );

  const parsed =
    matter(markdown);

  const template =
    fs.readFileSync(
      "./templates/document.html",
      "utf8"
    );

  const cssFile =
    buildCss(doc);

  const content =
    md.render(
      parsed.content
    );

  const html =
    template
      .replace(
        "{{TITLE}}",
        doc.title
      )
      .replace(
        "{{CSS_FILE}}",
        cssFile
      )
      .replace(
        "{{CONTENT}}",
        content
      );

  const htmlFile =
    path.join(
      "output",
      `${doc.fileName}.html`
    );

  fs.writeFileSync(
    htmlFile,
    html
  );

  await buildPdf(
    path.resolve(htmlFile),
    path.resolve(
      "output",
      `${doc.fileName}.pdf`
    )
  );

  console.log(
    `Built ${doc.fileName}`
  );
}

async function buildAll() {

  fs.mkdirSync(
    "output",
    {
      recursive: true
    }
  );

  const docs =
    discover();

  for (const doc of docs) {
    await buildDocument(doc);
  }
  copyAssets();
}

module.exports = {
  buildAll,
  buildDocument
};

if (require.main === module) {
  buildAll();
}