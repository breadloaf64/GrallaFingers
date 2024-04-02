import { createNewPDFWithDiagrams } from "./Control";

async function main() {
  createNewPDFWithDiagrams("./fileIO/in/1.pdf", "./fileIO/out/1.pdf");
}

main();
