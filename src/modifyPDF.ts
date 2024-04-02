import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { SolfegeDocument } from "./types";

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

async function markSolfege(pdfDoc: PDFDocument, solfege: SolfegeDocument) {
  if (pdfDoc.getPages().length !== solfege.length) {
    throw new Error(
      "The number of pages in the PDF does not match the number of solfege pages."
    );
  }

  const solfegeContainsNaN = solfege.some((solfegePage) => {
    solfegePage.some((solfegeLine) => {
      Number.isNaN(solfegeLine.y) ||
        solfegeLine.solfeges.some((solfege) => {
          Number.isNaN(solfege.x);
        });
    });
  });

  if (solfegeContainsNaN) {
    throw new Error("Some solfege coordinate values are NaN.");
  }

  let num = 0;
  pdfDoc.getPages().forEach((page, pageIndex) => {
    const solfegePage = solfege[pageIndex];
    solfegePage.forEach((solfegeLine, lineIndex) => {
      const yPos = solfegeLine.y;
      solfegeLine.solfeges.forEach((solfege, solfegeIndex) => {
        const xPos = solfege.x;
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

export { addWatermark, markSolfege };
