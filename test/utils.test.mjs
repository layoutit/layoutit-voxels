import assert from "node:assert/strict";
import test from "node:test";

import {
  decodeVoxelUrl,
  encodeVoxelUrl,
  getHashPayload,
} from "../src/utils/urlCodec.mjs";
import { measureVoxelBounds } from "../src/utils/voxelBounds.mjs";
import { parseVoxFile } from "../src/utils/voxParser.mjs";
import { getVisibleFaces } from "../src/utils/visibleFaces.mjs";
import {
  createEmptyVoxelLayers,
  getRedoVoxelState,
  getUndoVoxelState,
  recordVoxelHistory,
} from "../src/utils/voxelHistory.mjs";

const emptyVoxels = () => Array.from({ length: 12 }, () => ({}));

function createVoxBuffer({ includeRgba = true, colorIndex = 2 } = {}) {
  const headerSize = 8;
  const mainChunkHeaderSize = 12;
  const xyziHeaderSize = 12;
  const xyziContentSize = 8;
  const rgbaHeaderSize = includeRgba ? 12 : 0;
  const rgbaContentSize = includeRgba ? 1024 : 0;
  const totalSize =
    headerSize +
    mainChunkHeaderSize +
    xyziHeaderSize +
    xyziContentSize +
    rgbaHeaderSize +
    rgbaContentSize;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  let offset = 0;

  const writeString = (value) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset++, value.charCodeAt(i));
    }
  };
  const writeInt = (value) => {
    view.setInt32(offset, value, true);
    offset += 4;
  };

  writeString("VOX ");
  writeInt(150);
  writeString("MAIN");
  writeInt(0);
  writeInt(xyziHeaderSize + xyziContentSize + rgbaHeaderSize + rgbaContentSize);
  writeString("XYZI");
  writeInt(xyziContentSize);
  writeInt(0);
  writeInt(1);
  view.setUint8(offset++, 1);
  view.setUint8(offset++, 2);
  view.setUint8(offset++, 3);
  view.setUint8(offset++, colorIndex);

  if (includeRgba) {
    writeString("RGBA");
    writeInt(rgbaContentSize);
    writeInt(0);
    for (let i = 0; i < 256; i++) {
      view.setUint8(offset++, i === colorIndex - 1 ? 10 : 0);
      view.setUint8(offset++, i === colorIndex - 1 ? 20 : 0);
      view.setUint8(offset++, i === colorIndex - 1 ? 30 : 0);
      view.setUint8(offset++, 255);
    }
  }

  return buffer;
}

test("encodes the public voxel hash payload deterministically", () => {
  const voxels = emptyVoxels();
  voxels[0]["4/4/5/5"] = {
    x: 4,
    y: 4,
    x2: 5,
    y2: 5,
    z: 0,
    color: "#ff0044",
    shape: "cube",
  };
  voxels[0]["4/5/5/6"] = {
    x: 4,
    y: 5,
    x2: 5,
    y2: 6,
    z: 0,
    color: "#ff0044",
    shape: "cube",
  };

  const encoded = encodeVoxelUrl(voxels, {
    cols: 16,
    rows: 16,
    depth: voxels.length,
    rotX: 65,
    rotY: 45,
  });

  assert.equal(encoded, "01-ff0044,c:04:45@x16y16z12rX65rY45");
  assert.deepEqual(decodeVoxelUrl(encoded, { warn() {} }), {
    cols: 16,
    rows: 16,
    depth: 12,
    rotX: 65,
    rotY: 45,
    voxelData: voxels,
  });
});

test("strips embed hash options before inflate/decode", () => {
  assert.equal(getHashPayload("#payload&format=CSS"), "payload");
  assert.equal(getHashPayload("payload&format=VOX"), "payload");
});

test("parses MagicaVoxel XYZI/RGBA data with existing grid offset", () => {
  const voxels = parseVoxFile(createVoxBuffer({ includeRgba: true }));
  assert.deepEqual(voxels[3]["3/4/4/5"], {
    x: 3,
    x2: 4,
    y: 4,
    y2: 5,
    z: 3,
    color: "#0A141E",
    colorIndex: 2,
    shape: "cube",
  });
});

test("preserves both legacy no-RGBA palette modes", () => {
  const blackPalette = parseVoxFile(
    createVoxBuffer({ includeRgba: false, colorIndex: 2 })
  );
  const defaultPalette = parseVoxFile(
    createVoxBuffer({ includeRgba: false, colorIndex: 2 }),
    { useDefaultPalette: true }
  );

  assert.equal(blackPalette[3]["3/4/4/5"].color, "#000000");
  assert.equal(defaultPalette[3]["3/4/4/5"].color, "#ffffff");
});

test("measures imported voxel bounds", () => {
  const voxels = emptyVoxels();
  voxels[0]["4/4/5/5"] = { x: 4, y: 4, z: 0 };
  voxels[3]["2/9/3/10"] = { x: 2, y: 9, z: 3 };

  assert.deepEqual(measureVoxelBounds(voxels), {
    maxX: 4,
    maxY: 9,
    maxZ: 3,
  });
});

test("computes visible faces with neighbors, floor, and active walls", () => {
  const voxels = emptyVoxels();
  voxels[0]["4/4/5/5"] = { x: 4, y: 4, x2: 5, y2: 5, z: 0 };
  voxels[0]["5/4/6/5"] = { x: 5, y: 4, x2: 6, y2: 5, z: 0 };

  assert.deepEqual(
    getVisibleFaces({
      offsets: {
        t: [0, 0, 1],
        b: [0, 0, -1],
        bl: [1, 0, 0],
        br: [0, 1, 0],
        fr: [-1, 0, 0],
        fl: [0, -1, 0],
      },
      voxels,
      walls: { fr: true },
      x: 4,
      y: 4,
      x2: 5,
      y2: 5,
      z: 0,
    }),
    ["t", "br", "fl"]
  );
});

test("keeps undo/redo stack behavior stable", () => {
  const history = [];
  const redoStack = [];
  const empty = createEmptyVoxelLayers(12);
  const oneVoxel = createEmptyVoxelLayers(12);
  const twoVoxels = createEmptyVoxelLayers(12);
  oneVoxel[0]["4/4/5/5"] = { x: 4, y: 4, x2: 5, y2: 5, z: 0 };
  twoVoxels[0]["4/4/5/5"] = { x: 4, y: 4, x2: 5, y2: 5, z: 0 };
  twoVoxels[0]["4/5/5/6"] = { x: 4, y: 5, x2: 5, y2: 6, z: 0 };

  recordVoxelHistory(history, oneVoxel);
  recordVoxelHistory(history, twoVoxels);

  const undoState = getUndoVoxelState({
    voxels: twoVoxels,
    history,
    redoStack,
    emptyDepth: 12,
  });
  assert.deepEqual(undoState, oneVoxel);
  assert.deepEqual(redoStack, [twoVoxels]);

  const redoState = getRedoVoxelState({
    voxels: undoState,
    history,
    redoStack,
  });
  assert.deepEqual(redoState, twoVoxels);

  assert.deepEqual(
    getUndoVoxelState({
      voxels: empty,
      history: [],
      redoStack: [],
      emptyDepth: 12,
    }),
    empty
  );
});
