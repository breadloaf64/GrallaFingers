import { createNewPDFWithDiagrams } from "./control";
import { getSolfegeForURL } from "./read";

async function main() {
  createNewPDFWithDiagrams("./fileIO/in/1.pdf", "./fileIO/out/1.pdf");
}

main();
