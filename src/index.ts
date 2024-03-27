import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import fs from "fs";

async function modifyPdf(existingPdfBytes: Uint8Array) {
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawText("This text was added with JavaScript!", {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

async function main() {
  const IN_PATH = "./fileIO/in/";
  const OUT_PATH = "./fileIO/out/";

  const inputFileNames = fs.readdirSync(IN_PATH);
  const inputFilePaths = inputFileNames.map((name) => IN_PATH + name);

  inputFileNames.forEach(async (name) => {
    const inputFilePath = IN_PATH + name;
    const outputFilePath = OUT_PATH + name;

    // get bytes
    const existingPdfBytes = fs.readFileSync(inputFilePath);
    const convertedPdfBytes = await modifyPdf(existingPdfBytes);
    fs.writeFileSync(outputFilePath, convertedPdfBytes);
    console.log(`Wrote modified PDF to: ${outputFilePath}`);
  });
}

main();
