import { SOLFEGE_SCALE } from "./consts";
import { Solfege } from "./types";

const DIAGRAM_SUFFIX = ".png";

async function getDiagramData(): Promise<{ [key in Solfege]: Uint8Array }> {
  const diagramData = {} as { [key in Solfege]: Uint8Array };

  // Node environment: dynamically import fs/path/url to avoid bundling Node modules for browser
  if (typeof window === "undefined") {
    const fs = await import("fs");
    const path = await import("path");
    const url = await import("url");

    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const DIAGRAM_PATH = path.join(__dirname, "../diagrams/png");

    for (const solfege of SOLFEGE_SCALE) {
      const filePath = path.join(DIAGRAM_PATH, solfege + DIAGRAM_SUFFIX);
      const buf: Uint8Array = fs.readFileSync(filePath);
      diagramData[solfege] = buf instanceof Uint8Array ? buf : new Uint8Array(buf as any);
    }
  } else {
    // Browser: load diagram assets via fetch using import.meta.url
    for (const solfege of SOLFEGE_SCALE) {
      const assetUrl = new URL(`../diagrams/png/${solfege}${DIAGRAM_SUFFIX}`, import.meta.url).href;
      const res = await fetch(assetUrl);
      if (!res.ok) throw new Error(`Failed to fetch diagram ${solfege} at ${assetUrl}`);
      const ab = await res.arrayBuffer();
      diagramData[solfege] = new Uint8Array(ab);
    }
  }

  return diagramData;
}

export { getDiagramData };
