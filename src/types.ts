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

export type { Line, CleanedText };
