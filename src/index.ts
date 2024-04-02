import {
  createNewPDFWithDiagrams,
  createNewPDFWithModification,
} from "./control";
import { markCoordinates } from "./modifyPDF";

async function main() {
  createNewPDFWithDiagrams("./fileIO/in/1.pdf", "./fileIO/out/1.pdf");
}

main();
