import { SolfegeDocument, SolfegeLine } from "./types";

function printSolfegeDocument(solfegeDocument: SolfegeDocument) {
  console.log("=====================================");
  solfegeDocument.forEach((solfegePage, index) => {
    console.log("Page: ", index + 1);
    printSolfegePage(solfegePage);
  });
  console.log("=====================================");
}

function printSolfegePage(solfegeLines: SolfegeLine[]) {
  solfegeLines.forEach((line) => {
    console.log(line.solfeges.map((s) => s.value).join(" "));
  });
}

export { printSolfegeDocument };
