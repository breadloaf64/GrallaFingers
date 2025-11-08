import fs from "fs";
import { SOLFEGE_SCALE } from "./consts";
import { Solfege } from "./types";

const DIAGRAM_PATH = "./diagrams/png/";
const DIAGRAM_SUFFIX = ".png";

function getDiagramData() {
  const diagramData = {} as { [key: Solfege]: Buffer };
  SOLFEGE_SCALE.forEach((solfege) => {
    diagramData[solfege] = fs.readFileSync(
      DIAGRAM_PATH + solfege + DIAGRAM_SUFFIX
    );
  });
  return diagramData;
}

export { getDiagramData };
