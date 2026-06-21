const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

const discover = require("./discover");
const buildPdf = require("./buildPdf");

const md = new MarkdownIt({
  html: true
});

async function buildDocument(doc) {

  const source = fs.readFileSync(
    doc.source,
    "utf8"
  );

  const parsed = matter(source);

  const template = fs.readFileSync(
    "./templates/document.html",
    "utf8"
  );

 function loadCss(filePath) {

  let css = fs.readFileSync(
    filePath,
    "utf8"
  );

  css = css.replace(
    /@import\s+url\(["'](.+?)["']\);?/g,
    (_, importPath) => {

      const resolvedPath = path.resolve(
        path.dirname(filePath),
        importPath
      );

      console.log(
        `Including: ${resolvedPath}`
      );

      return loadCss(
        resolvedPath
      );

    }
  );

  return css;
}

const css = loadCss(
  path.join(
    "src",
    "styles",
    doc.cssName
  )
);
  const content = md.render(
    parsed.content
  );

  const html = template
    .replaceAll(
      "{{TITLE}}",
      doc.title || doc.fileName
    )
    .replaceAll(
      "{{CSS}}",
      css
    )
    .replaceAll(
      "{{CONTENT}}",
      content
    );

  fs.mkdirSync(
    "./output",
    {
      recursive: true
    }
  );

  const htmlFile = path.join(
    "output",
    `${doc.fileName}.html`
  );

  const pdfFile = path.join(
    "output",
    `${doc.fileName}.pdf`
  );

  fs.writeFileSync(
    htmlFile,
    html,
    "utf8"
  );

  console.log(
    `HTML: ${htmlFile}`
  );

  await buildPdf(
    path.resolve(htmlFile),
    path.resolve(pdfFile)
  );

  console.log(
    `PDF: ${pdfFile}`
  );
}

async function buildAll() {

  const docs = discover();

  for (const doc of docs) {
    await buildDocument(doc);
  }

}

module.exports = {
  buildAll,
  buildDocument
};

if (require.main === module) {

  buildAll()
    .then(() => {
      console.log(
        "\nBuild complete"
      );
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });

}