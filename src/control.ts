import { PDFDocument } from "pdf-lib";
import { getDataForURL } from "./read";
import fs from "fs";
import { addWatermark, numberSolfege } from "./modifyPDF";
import { printSolfegeDocument } from "./print";

async function ProcessFolder() {
  const IN_PATH = "./fileIO/in/";
  const OUT_PATH = "./fileIO/out/";

  console.log("Processing folder: ", IN_PATH);

  const inputFileNames = fs.readdirSync(IN_PATH);

  inputFileNames.forEach(async (name) => {
    console.log("Processing file: ", name);
    const inputFilePath = IN_PATH + name;
    const outputFilePath = OUT_PATH + name;

    createNewPDFWithDiagrams(inputFilePath, outputFilePath);
  });
}

async function createNewPDFWithDiagrams(inputUrl: string, outputUrl: string) {
  const {
    solfegeDocument: solfege,
    parsedPageDimensions: parsedPageDimensions,
  } = await getDataForURL(inputUrl);

  console.log("Generated solfge:");
  printSolfegeDocument(solfege);
  createNewPDFWithModification(inputUrl, outputUrl, (pdfDoc: PDFDocument) =>
    numberSolfege(pdfDoc, solfege, parsedPageDimensions)
  );
}

async function createNewPDFWithModification(
  inputUrl: string,
  outputUrl: string,
  modification: (pdfDoc: PDFDocument) => Promise<void>
) {
  const pdfBytes = fs.readFileSync(inputUrl);
  const pdfBytesModified = await modifyPdfBytes(pdfBytes, modification);
  fs.writeFileSync(outputUrl, pdfBytesModified);
}

async function modifyPdfBytes(
  existingPdfBytes: Uint8Array,
  modification: (pdfDoc: PDFDocument) => Promise<void>
) {
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  await modification(pdfDoc);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export { createNewPDFWithDiagrams, createNewPDFWithModification };
