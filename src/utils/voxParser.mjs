export const DEFAULT_VOX_PALETTE = [
  "#000000",
  "#ffffff",
  "#ffccaa",
  "#dca27d",
  "#c78564",
  "#a86955",
  "#825d4d",
  "#66473b",
  "#f77c7c",
  "#ea5545",
  "#c42d36",
  "#8a1926",
  "#741a1a",
  "#561b1b",
  "#ef8e58",
  "#dc5828",
  "#c23727",
  "#9a3324",
  "#7a2727",
  "#5a1e1e",
  "#ffec80",
  "#fcd828",
  "#f7b32c",
  "#e08e00",
  "#b57400",
  "#845600",
  "#d6f566",
  "#9ce62a",
  "#70d72c",
  "#41a937",
  "#258034",
  "#1a5a2b",
  "#68fc99",
  "#31df77",
  "#20b46a",
  "#148149",
  "#125230",
  "#0b3222",
  "#68fce8",
  "#33d9c3",
  "#28a28d",
  "#1e7464",
  "#175449",
  "#123832",
  "#50b2f6",
  "#3165cb",
  "#1f439e",
  "#202866",
  "#1a1747",
  "#0e1029",
  "#8478f6",
  "#4f49b7",
  "#3b2c96",
  "#261e76",
  "#1b1253",
  "#120e35",
  "#b47af1",
  "#8742d8",
  "#662eb4",
  "#4c248f",
  "#351b6b",
  "#26134a",
  "#ec72ec",
  "#d531b8",
  "#a52c91",
  "#7a246f",
  "#5b1c53",
  "#40143a",
  "#ff7398",
  "#fa2871",
  "#c2265f",
  "#8e1e47",
  "#6a1c3a",
  "#451427",
  "#a7a7a7",
  "#8c8c8c",
  "#767676",
  "#636363",
  "#4c4c4c",
  "#383838",
  "#d5d5d5",
  "#bbbbbb",
  "#a2a2a2",
  "#8b8b8b",
  "#757575",
  "#616161",
  "#ffffff",
  "#dedede",
  "#b3b3b3",
  "#8e8e8e",
  "#6e6e6e",
  "#555555",
  "#2d2d2d",
  "#222222",
  "#181818",
  "#101010",
  "#000000",
  "#ff4444",
  "#ff6200",
  "#ff9c00",
  "#ffd500",
  "#ffff00",
  "#b4e000",
  "#72bc00",
  "#389b00",
  "#008b00",
  "#007200",
  "#005500",
  "#003f00",
  "#00b712",
  "#00d456",
  "#00d488",
  "#00d4b0",
  "#00d4d4",
  "#00b0d4",
  "#0088d4",
  "#005ed4",
  "#003ad4",
  "#5e00d4",
  "#9600d4",
  "#b000d4",
  "#d400d4",
  "#d400b0",
  "#d40088",
  "#d4005e",
  "#d40039",
  "#d40012",
  "#d40000",
  "#ae1919",
  "#8c1e1e",
  "#6e1e1e",
  "#582020",
  "#441f1f",
  "#381717",
  "#2c1515",
  "#250e0e",
  "#200808",
  "#190404",
  "#ffccaa",
  "#dca27d",
  "#c78564",
  "#a86955",
  "#825d4d",
  "#66473b",
  "#f77c7c",
  "#ea5545",
  "#c42d36",
  "#8a1926",
  "#741a1a",
  "#561b1b",
  "#ef8e58",
  "#dc5828",
  "#c23727",
  "#9a3324",
  "#7a2727",
  "#5a1e1e",
  "#ffec80",
  "#fcd828",
  "#f7b32c",
  "#e08e00",
  "#b57400",
  "#845600",
  "#d6f566",
  "#9ce62a",
  "#70d72c",
  "#41a937",
  "#258034",
  "#1a5a2b",
  "#68fc99",
  "#31df77",
  "#20b46a",
  "#148149",
  "#125230",
  "#0b3222",
  "#68fce8",
  "#33d9c3",
  "#28a28d",
  "#1e7464",
  "#175449",
  "#123832",
  "#50b2f6",
  "#3165cb",
  "#1f439e",
  "#202866",
  "#1a1747",
  "#0e1029",
  "#8478f6",
  "#4f49b7",
  "#3b2c96",
  "#261e76",
  "#1b1253",
  "#120e35",
  "#b47af1",
  "#8742d8",
  "#662eb4",
  "#4c248f",
  "#351b6b",
  "#26134a",
  "#ec72ec",
  "#d531b8",
  "#a52c91",
  "#7a246f",
  "#5b1c53",
  "#40143a",
  "#ff7398",
  "#fa2871",
  "#c2265f",
  "#8e1e47",
  "#6a1c3a",
  "#451427",
  "#a7a7a7",
  "#8c8c8c",
  "#767676",
  "#636363",
  "#4c4c4c",
  "#383838",
  "#d5d5d5",
  "#bbbbbb",
  "#a2a2a2",
  "#8b8b8b",
  "#757575",
  "#616161",
  "#ffffff",
  "#dedede",
  "#b3b3b3",
  "#8e8e8e",
  "#6e6e6e",
  "#555555",
  "#2d2d2d",
  "#222222",
  "#181818",
  "#101010",
];

function toHex(value) {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

export function parseVoxFile(arrayBuffer, { useDefaultPalette = false } = {}) {
  const view = new DataView(arrayBuffer);
  let offset = 0;

  const readString = (length) => {
    const chars = [];
    for (let i = 0; i < length; i++) {
      chars.push(String.fromCharCode(view.getUint8(offset++)));
    }
    return chars.join("");
  };

  const readInt = () => {
    const value = view.getInt32(offset, true);
    offset += 4;
    return value;
  };

  const signature = readString(4);
  if (signature !== "VOX ") {
    throw new Error("Invalid VOX file");
  }

  readInt();

  const layers = [];
  const deferredVoxels = [];
  let colors = Array(256).fill("#000000");

  while (offset < view.byteLength) {
    const chunkId = readString(4);
    const chunkSize = readInt();
    readInt();

    if (chunkId === "RGBA") {
      for (let i = 0; i < 256; i++) {
        const r = view.getUint8(offset++);
        const g = view.getUint8(offset++);
        const b = view.getUint8(offset++);
        offset++;
        colors[i] = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    } else if (chunkId === "XYZI") {
      const numVoxels = readInt();
      for (let i = 0; i < numVoxels; i++) {
        const x = view.getUint8(offset++);
        const y = view.getUint8(offset++);
        const z = view.getUint8(offset++);
        const colorIndex = view.getUint8(offset++);
        deferredVoxels.push({ x, y, z, colorIndex });
      }
    } else {
      offset += chunkSize;
    }
  }

  if (useDefaultPalette && colors.every((color) => color === "#000000")) {
    colors = DEFAULT_VOX_PALETTE;
  }

  deferredVoxels.forEach(({ x, y, z, colorIndex }) => {
    const color = colors[colorIndex - 1] || "#000000";
    x = x + 2;
    y = y + 2;

    const x2 = x + 1;
    const y2 = y + 1;
    const key = `${x}/${y}/${x2}/${y2}`;
    if (!layers[z]) {
      layers[z] = {};
    }
    layers[z][key] = { x, x2, y, y2, z, color, colorIndex, shape: "cube" };
  });

  return layers;
}
