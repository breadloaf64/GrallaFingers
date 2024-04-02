import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import PDFParser, { Output } from "pdf2json";
import fs from "fs";
import { getSolfegeLinesFromPage, printSolfegeLines } from "./utility";
import { getSolfegeForURL } from "./read";
import { MIN_SOLFEGE_PER_LINE } from "./consts";

async function addWatermark(pdfDoc: PDFDocument) {
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
}

async function modifyPdf(
  existingPdfBytes: Uint8Array,
  modification: (pdfDoc: PDFDocument) => Promise<void>
) {
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  await modification(pdfDoc);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

async function performConversion() {
  const IN_PATH = "./fileIO/in/";
  const OUT_PATH = "./fileIO/out/";

  const inputFileNames = fs.readdirSync(IN_PATH);

  inputFileNames.forEach(async (name) => {
    const inputFilePath = IN_PATH + name;
    const outputFilePath = OUT_PATH + name;

    // get bytes
    const existingPdfBytes = fs.readFileSync(inputFilePath);
    const convertedPdfBytes = await modifyPdf(existingPdfBytes, addWatermark);
    fs.writeFileSync(outputFilePath, convertedPdfBytes);
    console.log(`Wrote modified PDF to: ${outputFilePath}`);
  });
}

async function main() {
  console.log("Parsing PDF...");
  console.log("min solfege per line: ", MIN_SOLFEGE_PER_LINE);
  const solfege = await getSolfegeForURL(
    "./fileIO/in/Toc de castells (1st Gralla) with solfege.pdf"
  );
  console.log("=====================================");
  printSolfegeLines(solfege);
  console.log("=====================================");
}

main();
