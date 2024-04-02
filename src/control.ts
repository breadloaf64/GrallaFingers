import { PDFDocument } from "pdf-lib";
import { getSolfegeForURL } from "./read";
import fs from "fs";
import { addWatermark } from "./modifyPDF";

async function AddDiagramsToAllPDFsInFolder() {
  const IN_PATH = "./fileIO/in/";
  const OUT_PATH = "./fileIO/out/";

  const inputFileNames = fs.readdirSync(IN_PATH);

  inputFileNames.forEach(async (name) => {
    const inputFilePath = IN_PATH + name;
    const outputFilePath = OUT_PATH + name;

    // get bytes
    const existingPdfBytes = fs.readFileSync(inputFilePath);
    const convertedPdfBytes = await modifyPdfBytes(
      existingPdfBytes,
      addWatermark
    );
    fs.writeFileSync(outputFilePath, convertedPdfBytes);
    console.log(`Wrote modified PDF to: ${outputFilePath}`);
  });
}

async function AddDiagramsToPDF(url: string) {
  const solfege = await getSolfegeForURL(url);

  const pdfBytes = fs.readFileSync(url);
  const pdfBytesModified = await modifyPdfBytes(pdfBytes, addWatermark);
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

export { AddDiagramsToPDF };
