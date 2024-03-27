import { Page } from "pdf2json";
import { CleanedText } from "./types";

function getCleanPageText(page: Page) {
  return page.Texts.map((text) => {
    const concatRun = text.R.map((run) => run.T).join("");
    return {
      x: text.x,
      y: text.y,
      value: concatRun,
    };
  }) as CleanedText[];
}

export { getCleanPageText };
