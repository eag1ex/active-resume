const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function discover() {
  const files = fs
    .readdirSync("./src")
    .filter(f => f.endsWith(".md"));

  return files.map(file => {
    const fullPath = path.join("./src", file);

    const raw = fs.readFileSync(fullPath, "utf8");

    const parsed = matter(raw);

    return {
      source: fullPath,
      fileName: parsed.data.fileName,
      cssName: parsed.data.cssName,
      title:
        parsed.data.title ||
        parsed.data.fileName
    };
  });
}

module.exports = discover;