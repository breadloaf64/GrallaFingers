import { Page } from "pdf2json";
import { CleanedText, Line } from "./types";
import { SOLFEGE_SCALE } from "./consts";

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

function makeLinesFromTexts(texts: CleanedText[]) {
  const lines: Line[] = [];

  texts.forEach((text) => {
    const lineExists = lines.some((line) => line.y === text.y);
    if (lineExists) {
      const line = lines.find((line) => line.y === text.y);
      line?.letters.push({ x: text.x, value: text.value });
    } else {
      lines.push({ y: text.y, letters: [{ x: text.x, value: text.value }] });
    }
  });

  return lines;
}

function filterTextBySolfegeLetters(texts: CleanedText[]) {
  const solfegeLetters = SOLFEGE_SCALE.join("");
  return texts.filter((text) => solfegeLetters.includes(text.value));
}

function sortLines(lines: Line[]) {
  return lines
    .map((line) => ({
      y: line.y,
      letters: line.letters.sort((a, b) => a.x - b.x),
    }))
    .sort((a, b) => a.y - b.y);
}

export {
  getCleanPageText,
  makeLinesFromTexts,
  filterTextBySolfegeLetters,
  sortLines,
};
