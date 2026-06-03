import { SOLFEGE_SCALE } from "./consts";

type PDFData = {
  solfegeDocument: SolfegeDocument;
  parsedPageDimensions: Dimensions[];
};

type Dimensions = {
  width: number;
  height: number;
};

type Line = {
  y: number;
  letters: {
    x: number;
    value: string;
  }[];
};

type CleanedText = {
  x: number;
  y: number;
  value: string;
};

type Solfege = (typeof SOLFEGE_SCALE)[number];

type SolfegeLine = {
  y: number;
  solfeges: {
    x: number;
    value: Solfege;
  }[];
};

type SolfegePage = SolfegeLine[];

type SolfegeDocument = SolfegePage[];

export type {
  Line,
  CleanedText,
  Solfege,
  SolfegeLine,
  SolfegePage,
  SolfegeDocument,
  PDFData,
  Dimensions,
};
