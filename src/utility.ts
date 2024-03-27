import { Page } from "pdf2json";
import { CleanedText, Line, SolfegeLine } from "./types";
import { SOLFEGE_SCALE } from "./consts";

// extracts text from page object and keeps only the position and string value
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

// groups texts into lines based on y position
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

// filters out text that is not a solfege letter
function filterTextBySolfegeLetters(texts: CleanedText[]) {
  const solfegeLetters = SOLFEGE_SCALE.join("");
  return texts.filter((text) => solfegeLetters.includes(text.value));
}

// sorts text within line by x position, then sorts lines by y position
function sortLines(lines: Line[]): Line[] {
  return lines
    .map((line) => ({
      y: line.y,
      letters: line.letters.sort((a, b) => a.x - b.x),
    }))
    .sort((a, b) => a.y - b.y);
}

// assumes texts in line are sorted by x position
function makeSolfegeLine(line: Line) {
  const solfegeLine = {
    y: line.y,
    solfeges: [],
  } as SolfegeLine;
  let index = 0;
  while (index < line.letters.length) {
    const nextFourLetters = line.letters
      .slice(index, index + 4)
      .map((letter) => letter.value)
      .reduce((acc, letter) => acc + letter, "");
    const nextThreeLetters = nextFourLetters.slice(0, 3);
    const nextTwoLetters = nextFourLetters.slice(0, 2);

    if (SOLFEGE_SCALE.includes(nextFourLetters)) {
      solfegeLine.solfeges.push({
        x:
          (line.letters[index]?.x +
            line.letters[index + 1]?.x +
            line.letters[index + 2]?.x +
            line.letters[index + 3]?.x) /
          4,
        value: nextFourLetters,
      });
      index += 4;
    } else if (SOLFEGE_SCALE.includes(nextThreeLetters)) {
      solfegeLine.solfeges.push({
        x:
          (line.letters[index]?.x +
            line.letters[index + 1]?.x +
            line.letters[index + 2]?.x) /
          3,
        value: nextThreeLetters,
      });
      index += 3;
    } else if (SOLFEGE_SCALE.includes(nextTwoLetters)) {
      solfegeLine.solfeges.push({
        x: (line.letters[index]?.x + line.letters[index + 1]?.x) / 2,
        value: nextTwoLetters,
      });
      index += 2;
    } else {
      index++;
    }
  }
  return solfegeLine;
}

export {
  getCleanPageText,
  makeLinesFromTexts,
  filterTextBySolfegeLetters,
  sortLines,
  makeSolfegeLine,
};