import PDFParser, { Output } from "pdf2json";
import { getSolfegeLinesFromPage } from "./utility";
import { PDFData, SolfegeDocument } from "./types";

async function getDataForURL(url: string) {
  const pdfObj = await getParsedPdfObject(url);
  const solfegeDocument = pdfObj.Pages.map((page) =>
    getSolfegeLinesFromPage(page)
  );
  const parsedPageDimensions = pdfObj.Pages.map((page) => ({
    width: page.Width,
    height: page.Height,
  }));

  return { solfegeDocument, parsedPageDimensions } as PDFData;
}

function getParsedPdfObject(filepath: string): Promise<Output> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData));
    pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData));

    pdfParser.loadPDF(filepath);
  });
}

export { getDataForURL };
