const { execFile } = require("child_process");

function buildPdf(
  htmlFile,
  pdfFile
) {
  return new Promise(
    (resolve, reject) => {

            // requires installing
    // sudo apt install weasyprint
      execFile(
        "weasyprint",
        [
          htmlFile,
          pdfFile
        ],
        error => {

          if (error) {
            reject(error);
            return;
          }

          resolve();
        }
      );

    }
  );
}

module.exports = buildPdf;