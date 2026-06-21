const express = require("express");
const chokidar = require("chokidar");
const WebSocket = require("ws");

const discover = require("./discover");
const { buildAll } = require("./build");

const app = express();

const wss = new WebSocket.Server({
  port: 3001
});

function reloadClients() {

  wss.clients.forEach(client => {

    if (
      client.readyState === WebSocket.OPEN
    ) {
      client.send("reload");
    }

  });

}

(async () => {

  await buildAll();

  app.use(
    express.static("./output")
  );

  app.get("/", (req, res) => {

    const docs = discover();

    const links = docs
      .map(doc => `
        <li>
          <a href="/${doc.fileName}.html">
            ${doc.fileName}
          </a>
        </li>
      `)
      .join("");

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Documents</title>
      </head>
      <body>
        <h1>Documents</h1>
        <ul>
          ${links}
        </ul>
      </body>
      </html>
    `);

  });

  app.listen(3000, () => {

    console.log(
      "http://localhost:3000"
    );

  });

  const watcher = chokidar.watch(
    "src",
    {
      persistent: true,
      ignoreInitial: true
    }
  );

  watcher.on(
    "all",
    async (event, file) => {

      console.log(
        `[${event}] ${file}`
      );

      try {

        await buildAll();

        reloadClients();

      }
      catch (error) {

        console.error(
          "Build failed:"
        );

        console.error(error);

      }

    }
  );

})();