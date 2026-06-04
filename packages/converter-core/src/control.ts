import { PDFDocument } from "pdf-lib";
import { getDataForFile, getDataForFilepath } from "./read";
import fs from "fs";
import { addDiagramsAccordingToSolfege } from "./modifyPDF";
import { printSolfegeDocument } from "./print";
import { getDiagramData } from "./diagram";

async function processFolder(diagramData: { [key: string]: Buffer }) {
  const IN_PATH = "./fileIO/in/";
  const OUT_PATH = "./fileIO/out/";

  console.log("Processing folder: ", IN_PATH);

  const inputFileNames = fs.readdirSync(IN_PATH);

  inputFileNames.forEach(async (name) => {
    console.log("Processing file: ", name);
    const inputFilePath = IN_PATH + name;
    const outputFilePath = OUT_PATH + name;

    createNewPDFWithDiagrams(inputFilePath, outputFilePath, diagramData);
  });
}

async function createNewPDFWithDiagrams(
  inputUrl: string,
  outputUrl: string,
  diagramData: { [key: string]: Buffer }
) {
  const {
    solfegeDocument: solfege,
    parsedPageDimensions: parsedPageDimensions,
  } = await getDataForFilepath(inputUrl);

  console.log("Generated solfge:");
  printSolfegeDocument(solfege);
  createNewPDFWithModification(inputUrl, outputUrl, (pdfDoc: PDFDocument) =>
    addDiagramsAccordingToSolfege(
      pdfDoc,
      solfege,
      parsedPageDimensions,
      diagramData
    )
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

async function convertOneUploadedFile(file: File) {
  const {
    solfegeDocument: solfege,
    parsedPageDimensions: parsedPageDimensions,
  } = await getDataForFile(file);

  const diagramData = getDiagramData();

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const pdfBytesModified = await modifyPdfBytes(uint8Array, (pdfDoc: PDFDocument) =>
    addDiagramsAccordingToSolfege(
      pdfDoc,
      solfege,
      parsedPageDimensions,
      diagramData
    )
  );

  return pdfBytesModified;
}

export {
  createNewPDFWithDiagrams,
  createNewPDFWithModification,
  processFolder,
  convertOneUploadedFile
};
