import { processFolder } from "gralla-fingers-converter-core/src/control";
import { getDiagramData } from "gralla-fingers-converter-core/src/diagram";


async function main() {
  // createNewPDFWithDiagrams("./fileIO/in/1.pdf", "./fileIO/out/1.pdf");
  const diagramData = getDiagramData();

  // === just one file:
  // createNewPDFWithDiagrams(
  //   "./fileIO/in/1.pdf",
  //   "./fileIO/out/1.pdf",
  //   diagramData
  // );

  // === whole folder
  processFolder(diagramData);
}

main();