const express = require("express");
const chokidar = require("chokidar");
const WebSocket = require("ws");

const discover = require("./discover");
const {
  buildAll,
  buildDocument
} = require("./build");

const app = express();

const wss = new WebSocket.Server({
  port: 3001
});

function reloadClients() {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send("reload");
    }
  });
}

(async () => {

  await buildAll();

  app.use(
    "/styles",
    express.static("./src/styles")
  );

//   app.use(
//     "/output",
//     express.static("./output")
//   );
  app.use(express.static("./output"));

  app.get("/", (req, res) => {

    const docs = discover();

    const links = docs
      .map(
        d =>
          `<li>
            <a href="/output/${d.fileName}.html">
              ${d.fileName}
            </a>
          </li>`
      )
      .join("");

    res.send(`
      <h1>Documents</h1>
      <ul>${links}</ul>
    `);
  });

  app.listen(3000, () => {
    console.log(
      "http://localhost:3000"
    );
  });

  chokidar
  .watch("src", {
    persistent: true,
    ignoreInitial: true
  })
    .on("all", async(event, file) => {

      console.log(
        "changed:",
        file
      );

      const docs = discover();

      if (
        file.endsWith(".md")
      ) {

        const doc =
          docs.find(
            d =>
              d.source.endsWith(
                file.split("/").pop()
              )
          );

        if (doc) {
          await buildDocument(doc);
        }
      }

      if (
        file.endsWith(".css")
      ) {

        const css =
          file.split("/").pop();

        const affected =
          docs.filter(
            d =>
              d.cssName === css
          );

        for (const doc of affected) {
          await buildDocument(doc);
        }
      }

      reloadClients();
    });

})();