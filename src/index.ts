import { PDFDocument } from "pdf-lib";
import {
  createNewPDFWithDiagrams,
  createNewPDFWithModification,
} from "./control";
import { getDiagramData } from "./diagram";
import { addDiagram, markCoordinates } from "./modifyPDF";

async function main() {
  // createNewPDFWithDiagrams("./fileIO/in/1.pdf", "./fileIO/out/1.pdf");
  const diagramData = getDiagramData();

  createNewPDFWithModification(
    "./fileIO/in/1.pdf",
    "./fileIO/out/1.pdf",
    async (pdfDoc: PDFDocument) => {
      await addDiagram(pdfDoc, diagramData);
    }
  );
}

main();
