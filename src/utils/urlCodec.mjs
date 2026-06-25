const LETTER_TO_SHAPE = {
  c: "cube",
  w: "wedge",
  s: "slab",
  p: "spike",
};

const SHAPE_TO_LETTER = {
  cube: "c",
  wedge: "w",
  slab: "s",
  spike: "p",
};

export function getHashPayload(hash) {
  return String(hash || "")
    .replace(/^#/, "")
    .split("&")[0];
}

export function decodeVoxelUrl(url, logger = console) {
  const [dataPart, metaPart] = url.split("@");
  if (!dataPart || !metaPart) {
    throw new Error("Malformed: missing data or metadata");
  }

  const dims = metaPart.match(/x(\d+)y(\d+)z(\d+)rX(\d+)rY(\d+)/);
  if (!dims) {
    throw new Error("Malformed: can't extract dimensions and rotation data");
  }

  const cols = +dims[1];
  const rows = +dims[2];
  const depth = +dims[3];
  const rotX = +dims[4];
  const rotY = +dims[5];
  const voxelData = Array.from({ length: depth }, () => ({}));

  dataPart.split("|").forEach((layer) => {
    const [zStr, layerString] = layer.split("-");
    const z = parseInt(zStr, 10) - 1;
    if (isNaN(z) || z < 0 || z >= depth) {
      logger.warn(`Invalid layer: ${layer}`);
      return;
    }

    layerString.split(";").forEach((colorGroup) => {
      const indexOfColon = colorGroup.indexOf(":");
      if (indexOfColon < 0) {
        logger.warn(`Skipping invalid colorGroup: ${colorGroup}`);
        return;
      }

      const colorAndShape = colorGroup.slice(0, indexOfColon).trim();
      const xGroupsString = colorGroup.slice(indexOfColon + 1).trim();
      const [colorStr, shapeChar] = colorAndShape.split(",");
      if (!colorStr || !shapeChar) {
        logger.warn(`Skipping invalid color,shape: ${colorAndShape}`);
        return;
      }

      const color = `#${colorStr}`;
      const shape = LETTER_TO_SHAPE[shapeChar];
      if (!shape) {
        logger.warn(`Skipping unknown shape letter: ${shapeChar}`);
        return;
      }

      xGroupsString.split(",").forEach((xGroup) => {
        const [xStr, yyList] = xGroup.split(":");
        const x = parseInt(xStr, 10);
        if (isNaN(x) || !yyList) {
          logger.warn(`Skipping invalid x group: ${xGroup}`);
          return;
        }

        for (const yy of yyList) {
          const y = parseInt(yy, 36);
          if (isNaN(y)) {
            logger.warn(`Skipping invalid y value: ${yy}`);
            continue;
          }

          const key = `${x}/${y}/${x + 1}/${y + 1}`;
          voxelData[z][key] = {
            x,
            y,
            x2: x + 1,
            y2: y + 1,
            z,
            color,
            shape,
          };
        }
      });
    });
  });

  return { cols, rows, depth, voxelData, rotX, rotY };
}

export function encodeVoxelUrl(voxels, { cols, rows, depth, rotX, rotY }) {
  const compressed = voxels
    .map((layer, index) => {
      const z = String(index + 1).padStart(2, "0");
      const colorGroups = {};

      Object.keys(layer).forEach((key) => {
        const { x, y, color, shape } = layer[key];
        const yy = y.toString(36);
        const shapeLetter = SHAPE_TO_LETTER[shape] || "c";
        const colorStr = color.replace("#", "");

        if (!colorGroups[colorStr]) {
          colorGroups[colorStr] = {};
        }
        if (!colorGroups[colorStr][shapeLetter]) {
          colorGroups[colorStr][shapeLetter] = {};
        }
        if (!colorGroups[colorStr][shapeLetter][x]) {
          colorGroups[colorStr][shapeLetter][x] = [];
        }
        colorGroups[colorStr][shapeLetter][x].push(yy);
      });

      if (Object.keys(colorGroups).length === 0) return null;

      const layerString = Object.entries(colorGroups)
        .sort(([colorA], [colorB]) => colorA.localeCompare(colorB))
        .map(([color, shapeMap]) => {
          return Object.entries(shapeMap)
            .sort(([shA], [shB]) => shA.localeCompare(shB))
            .map(([shapeLetter, xGroups]) => {
              const xGroupString = Object.entries(xGroups)
                .sort(([xA], [xB]) => Number(xA) - Number(xB))
                .map(([xx, yyList]) => {
                  const xxStr = String(xx).padStart(2, "0");
                  const sortedYY = yyList.sort().join("");
                  return `${xxStr}:${sortedYY}`;
                })
                .join(",");
              return `${color},${shapeLetter}:${xGroupString}`;
            })
            .join(";");
        })
        .join(";");

      return `${z}-${layerString}`;
    })
    .filter(Boolean)
    .join("|");

  return (
    `${compressed}@x${String(cols).padStart(2, "0")}` +
    `y${String(rows).padStart(2, "0")}` +
    `z${String(depth).padStart(2, "0")}` +
    `rX${String(Math.round(rotX)).padStart(2, "0")}` +
    `rY${String(Math.round(rotY)).padStart(2, "0")}`
  );
}
