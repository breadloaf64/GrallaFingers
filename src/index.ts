import { PDFDocument } from "pdf-lib";
import {
  createNewPDFWithDiagrams,
  createNewPDFWithModification,
} from "./control";
import { getDiagramData } from "./diagram";
import { addDiagramTest, markCoordinates } from "./modifyPDF";

async function main() {
  // createNewPDFWithDiagrams("./fileIO/in/1.pdf", "./fileIO/out/1.pdf");
  const diagramData = getDiagramData();

  createNewPDFWithDiagrams(
    "./fileIO/in/1.pdf",
    "./fileIO/out/1.pdf",
    diagramData
  );
}

main();
