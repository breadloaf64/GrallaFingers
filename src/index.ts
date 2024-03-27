import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import PDFParser, { Output } from "pdf2json";
import fs from "fs";
import { line } from "./types";

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
  const inputFilePaths = inputFileNames.map((name) => IN_PATH + name);

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

function getParsedPdfObject(filepath: string): Promise<Output> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData));
    pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData));

    pdfParser.loadPDF(filepath);
  });
}

function logOnLine(text: string) {
  process.stdout.write(text);
}

const SOLFEGE_SCALE = ["sol", "la", "si", "do", "re", "mi", "fa", "sol'"];

async function main() {
  const PATH = "./fileIO/in/Toc de castells (1st Gralla) with solfege.pdf";

  const pdfObj = await getParsedPdfObject(PATH);
  const firstPage = pdfObj.Pages[0];
  const cleanedTexts = firstPage.Texts.map((text) => {
    const concatRun = text.R.map((run) => run.T).join("");
    return {
      x: text.x,
      y: text.y,
      value: concatRun,
    };
  });

  const solfegeLetters = SOLFEGE_SCALE.join("");
  const justLetters = cleanedTexts.filter((text) =>
    solfegeLetters.includes(text.value)
  );

  const lines: line[] = [];

  // populate lines
  justLetters.forEach((text) => {
    const lineExists = lines.some((line) => line.y === text.y);
    if (lineExists) {
      const line = lines.find((line) => line.y === text.y);
      line?.letters.push({ x: text.x, value: text.value });
    } else {
      lines.push({ y: text.y, letters: [{ x: text.x, value: text.value }] });
    }
  });

  const sortedLines = lines
    .map((line) => ({
      y: line.y,
      letters: line.letters.sort((a, b) => a.x - b.x),
    }))
    .sort((a, b) => a.y - b.y);

  // print lines
  lines.forEach((line) => {
    const letters = line.letters.map((letter) => letter.value).join("");
    console.log(letters);
  });
}

main();
