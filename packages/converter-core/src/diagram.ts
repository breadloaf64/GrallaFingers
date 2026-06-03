import fs from "fs";
import path from "path";
import { SOLFEGE_SCALE } from "./consts";
import { Solfege } from "./types";

const DIAGRAM_PATH = path.join(__dirname, "../diagrams/png");
const DIAGRAM_SUFFIX = ".png";

function getDiagramData() {
  const diagramData = {} as { [key: Solfege]: Buffer };
  SOLFEGE_SCALE.forEach((solfege) => {
    diagramData[solfege] = fs.readFileSync(
      path.join(DIAGRAM_PATH, solfege + DIAGRAM_SUFFIX)
    );
  });
  return diagramData;
}

export { getDiagramData };
