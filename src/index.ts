import { getSolfegeForURL } from "./read";
import { MIN_SOLFEGE_PER_LINE } from "./consts";
import { printSolfegeDocument } from "./print";

async function main() {
  console.log("Parsing PDF...");
  console.log("min solfege per line: ", MIN_SOLFEGE_PER_LINE);
  const solfegeDocument = await getSolfegeForURL(
    "./fileIO/in/Toc de castells (1st Gralla) with solfege.pdf"
  );
  printSolfegeDocument(solfegeDocument);
}

main();
