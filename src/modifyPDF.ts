import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { Dimensions, SolfegeDocument } from "./types";
import { remapNumber } from "./utility";
import { Y_SHIFT } from "./consts";
import fs from "fs";

async function addWatermark(pdfDoc: PDFDocument): Promise<void> {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawText("This text was added with JavaScript!", {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  });
}

async function markCoordinates(pdfDoc: PDFDocument): Promise<void> {
  const increment = 50;
  const max = 2000;
  for (let x = 0; x < max; x += increment) {
    for (let y = 0; y < max; y += increment) {
      const page = pdfDoc.getPages()[0];
      page.drawText(`(${x}, ${y})`, {
        x: x,
        y: y,
        size: 10,
      });
    }
  }
}

async function numberSolfege(
  pdfDoc: PDFDocument,
  solfege: SolfegeDocument,
  parsedPageDimensions: Dimensions[]
): Promise<void> {
  if (pdfDoc.getPages().length !== solfege.length) {
    throw new Error(
      "The number of pages in the PDF does not match the number of solfege pages."
    );
  }

  let num = 0;
  pdfDoc.getPages().forEach((page, pageIndex) => {
    const solfegePage = solfege[pageIndex];

    //get dimensions
    const { width: inPageWidth, height: inPageHeight } =
      parsedPageDimensions[pageIndex];
    const outPageWidth = page.getWidth();
    const outPageHeight = page.getHeight();

    solfegePage.forEach((solfegeLine) => {
      const yPos =
        remapNumber(solfegeLine.y, 0, inPageHeight, outPageHeight, 0) + Y_SHIFT;
      solfegeLine.solfeges.forEach((solfege) => {
        const xPos = remapNumber(solfege.x, 0, inPageWidth, 0, outPageWidth);
        const value = solfege.value;

        if (isNaN(xPos) || isNaN(yPos)) {
          throw new Error("Some solfege coordinate values are NaN.");
        }

        page.drawText(num.toString(), {
          x: xPos,
          y: yPos,
          size: 10,
        });
        num++;
      });
    });
  });
}

async function addDiagramTest(
  pdfDoc: PDFDocument,
  diagramData: { [key: string]: Buffer }
): Promise<void> {
  const page = pdfDoc.getPages()[0];

  const pngImage = await pdfDoc.embedPng(diagramData["mi"]);
  const pngDims = pngImage.scale(0.5);

  page.drawImage(pngImage, {
    x: 100,
    y: 100,
    width: pngDims.width,
    height: pngDims.height,
  });
}

async function addDiagramsAccordingToSolfege(
  pdfDoc: PDFDocument,
  solfege: SolfegeDocument,
  parsedPageDimensions: Dimensions[],
  diagramData: { [key: string]: Buffer }
): Promise<void> {
  if (pdfDoc.getPages().length !== solfege.length) {
    throw new Error(
      "The number of pages in the PDF does not match the number of solfege pages."
    );
  }

  pdfDoc.getPages().forEach((page, pageIndex) => {
    const solfegePage = solfege[pageIndex];

    //get dimensions
    const { width: inPageWidth, height: inPageHeight } =
      parsedPageDimensions[pageIndex];
    const outPageWidth = page.getWidth();
    const outPageHeight = page.getHeight();

    solfegePage.forEach((solfegeLine) => {
      const yPos =
        remapNumber(solfegeLine.y, 0, inPageHeight, outPageHeight, 0) + Y_SHIFT;
      solfegeLine.solfeges.forEach(async (solfege) => {
        const xPos = remapNumber(solfege.x, 0, inPageWidth, 0, outPageWidth);
        const value = solfege.value;

        const pngImage = await pdfDoc.embedPng(diagramData[value]);
        const pngDims = pngImage.scale(0.06);

        page.drawImage(pngImage, {
          x: xPos,
          y: yPos,
          width: pngDims.width,
          height: pngDims.height,
        });
      });
    });
  });
}

export {
  addWatermark,
  numberSolfege,
  markCoordinates,
  addDiagramTest,
  addDiagramsAccordingToSolfege,
};
