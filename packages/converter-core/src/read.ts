import PDFParser, { Output } from "pdf2json";
import { getSolfegeLinesFromPage } from "./utility";
import { PDFData } from "./types";

async function getDataForFile(file: File) {
  const pdfObj = await getParsedPdfObjectFromBytes(file);
  const solfegeDocument = pdfObj.Pages.map((page) =>
    getSolfegeLinesFromPage(page)
  );
  const parsedPageDimensions = pdfObj.Pages.map((page) => ({
    width: page.Width,
    height: page.Height,
  }));

  return { solfegeDocument, parsedPageDimensions } as PDFData;
}

async function getParsedPdfObjectFromBytes(file: File): Promise<Output> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const pdfBuffer = Buffer.from(uint8Array);
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData));
    pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData));

    pdfParser.parseBuffer(pdfBuffer);
  });
}

async function getDataForFilepath(url: string) {
  const pdfObj = await parsePdfObjectFromFilepath(url);
  const solfegeDocument = pdfObj.Pages.map((page) =>
    getSolfegeLinesFromPage(page)
  );
  const parsedPageDimensions = pdfObj.Pages.map((page) => ({
    width: page.Width,
    height: page.Height,
  }));

  return { solfegeDocument, parsedPageDimensions } as PDFData;
}

function parsePdfObjectFromFilepath(filepath: string): Promise<Output> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData));
    pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData));

    pdfParser.loadPDF(filepath);
  });
}

export { getDataForFilepath, getDataForFile };
