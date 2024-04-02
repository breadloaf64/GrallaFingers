import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { Dimensions, SolfegeDocument } from "./types";
import { remapNumber } from "./utility";
import { Y_SHIFT } from "./consts";

async function addWatermark(pdfDoc: PDFDocument) {
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

async function markCoordinates(pdfDoc: PDFDocument) {
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

async function markSolfege(
  pdfDoc: PDFDocument,
  solfege: SolfegeDocument,
  parsedPageDimensions: Dimensions[]
) {
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

export { addWatermark, markSolfege, markCoordinates };
