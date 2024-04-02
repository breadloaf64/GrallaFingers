import PDFParser, { Output } from "pdf2json";
import { getSolfegeLinesFromPage } from "./utility";
import { SolfegeDocument } from "./types";

async function getSolfegeForURL(url: string) {
  const IN_PATH = "./fileIO/in/Toc de castells (1st Gralla) with solfege.pdf";

  const pdfObj = await getParsedPdfObject(IN_PATH);
  return pdfObj.Pages.map((page) =>
    getSolfegeLinesFromPage(page)
  ) as SolfegeDocument;
}

function getParsedPdfObject(filepath: string): Promise<Output> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData));
    pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData));

    pdfParser.loadPDF(filepath);
  });
}

export { getSolfegeForURL };