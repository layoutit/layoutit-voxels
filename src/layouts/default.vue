<template>
  <div
    class="drag-container"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="showOverlay"
    @dragleave.prevent="hideOverlay"
    @drop.prevent="handleDrop"
  >
    <div v-if="$ctx.dragFile" class="drag-overlay">
      <div class="dragoutline">
        <icons-cloud />
        <p>Drop VOX file</p>
      </div>
    </div>
    <template>
      <div :style="{ pointerEvents: $ctx.dragFile ? 'none' : 'auto' }">
        <nuxt />
      </div>
    </template>
  </div>
</template>

<script>
import {
  decodeVoxelUrl,
  encodeVoxelUrl,
  getHashPayload,
} from "~/utils/urlCodec.mjs";
import { measureVoxelBounds } from "~/utils/voxelBounds.mjs";
import { parseVoxFile } from "~/utils/voxParser.mjs";
import { recordVoxelHistory } from "~/utils/voxelHistory.mjs";

export default {
  watch: {
    "$ctx.dragMap": async function (v) {
      await this.$nextTick();
      const url = this.encodeURL(this.$ctx.voxels);
      if (url.length > 20) {
        history.replaceState(
          {},
          "",
          location.pathname + "#" + (await this.deflate(url))
        );
      }
    },
    "$ctx.drag": async function (v) {
      if (v) {
        await this.$nextTick();
        const url = this.encodeURL(this.$ctx.voxels);

        if (url.length > 20) {
          history.replaceState(
            {},
            "",
            location.pathname + "#" + (await this.deflate(url))
          );
        }

        recordVoxelHistory(this.$ctx.history, this.$ctx.voxels);
        this.redoStack = [];
      } else {
        this.$nextTick(() => {
          this.$set(this.$ctx, "facets", this.countFaces());
          this.$set(
            this.$ctx,
            "size",
            (
              ((this.$ctx.cssOutput || "").length +
                (this.$ctx.htmlOutput || "").length) /
              1024
            ).toFixed(1)
          );

          this.$set(
            this.$ctx,
            "voxelLength",
            Object.values(this.$ctx.voxels).flatMap(Object.keys).length
          );
        });
      }
    },
  },
  async mounted() {
    const modelHash = getHashPayload(location.hash);
    if (modelHash) {
      const { cols, rows, depth, voxelData, rotX, rotY } = this.decodeURL(
        await this.inflate(modelHash)
      );
      this.$set(this.$ctx, "cols", cols);
      this.$set(this.$ctx, "rows", rows);
      this.$set(
        this.$ctx,
        "zoom",
        0.65 * Math.pow(16 / Math.max(cols, rows, depth), 0.75)
      );
      this.$set(this.$ctx, "voxels", voxelData);
      // Set the rotation values
      this.$set(this.$ctx, "rotX", rotX);
      this.$set(this.$ctx, "rotY", rotY);
      const r = this.$ctx.rotY % 360;
      this.$ctx.walls = {
        t: this.$ctx.rotX >= 90,
        b: this.$ctx.rotX < 90,
        bl: r <= 180,
        fr: r > 180,
        br: r < 90 || r >= 270,
        fl: r >= 90 && r < 270,
      };
      this.$set(this.$ctx, "loading", false);

      this.$nextTick(() => {
        this.$set(this.$ctx, "facets", this.countFaces());
        this.$set(
          this.$ctx,
          "size",
          (
            ((this.$ctx.cssOutput || "").length +
              (this.$ctx.htmlOutput || "").length) /
            1024
          ).toFixed(1)
        );
        this.$set(
          this.$ctx,
          "voxelLength",
          Object.values(this.$ctx.voxels).flatMap(Object.keys).length
        );
      });
    } else {
      this.$set(this.$ctx, "loading", false);
    }
  },
  methods: {
    async deflate(string) {
      const stream = new CompressionStream("deflate");
      const writer = stream.writable.getWriter();
      writer.write(new TextEncoder().encode(string));
      writer.close();

      const reader = stream.readable.getReader();
      const chunks = [];
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        chunks.push(...value);
      }

      return btoa(String.fromCharCode(...new Uint8Array(chunks)))
        .replace(/\+/g, "-")
        .replace(/\//g, "!")
        .replace(/=+$/, "");
    },
    async inflate(string) {
      const deflatedData = Uint8Array.from(
        atob(string.replace(/-/g, "+").replace(/!/g, "/")),
        (c) => c.charCodeAt(0)
      );

      const stream = new DecompressionStream("deflate");
      const writer = stream.writable.getWriter();
      writer.write(deflatedData);
      writer.close();

      const reader = stream.readable.getReader();
      const chunks = [];
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        chunks.push(...value);
      }

      return new TextDecoder().decode(new Uint8Array(chunks.flat()));
    },
    decodeURL(url) {
      return decodeVoxelUrl(url);
    },
    encodeURL(voxels) {
      return encodeVoxelUrl(voxels, {
        cols: this.$ctx.cols,
        rows: this.$ctx.rows,
        depth: this.$ctx.voxels.length,
        rotX: this.$ctx.rotX,
        rotY: this.$ctx.rotY,
      });
    },
    countFaces() {
      if (typeof window === "undefined") return 0;
      return document.querySelectorAll(".face").length;
    },

    handleDragOver(event) {
      event.dataTransfer.dropEffect = "copy";
    },
    showOverlay(event) {
      if (!this.$ctx.dragFile) {
        this.$ctx.dragFile = true;
      }
    },
    hideOverlay(event) {
      if (event.currentTarget === event.target) {
        this.$ctx.dragFile = false;
      }
    },
    async handleDrop(event) {
      this.$ctx.dragFile = false; // Hide the overlay when the file is dropped
      const file = event.dataTransfer.files[0]; // Get the first file
      if (!file) {
        console.error("No file dropped.");
        return;
      }

      try {
        this.$set(this.$ctx, "loading", true);

        const arrayBuffer = await file.arrayBuffer();
        const voxelData = this.parseVoxFile(arrayBuffer);
        const { maxX, maxY, maxZ } = measureVoxelBounds(voxelData);

        this.$set(this.$ctx, "cols", maxY + 1);
        this.$set(this.$ctx, "rows", maxX + 1);
        this.$set(
          this.$ctx,
          "zoom",
          0.65 * Math.pow(16 / Math.max(maxZ, maxX, maxY), 0.75)
        );
        this.$set(this.$ctx, "voxels", voxelData);
        this.$set(this.$ctx, "loading", false);
        await this.$nextTick();

        const url = this.encodeURL(this.$ctx.voxels);

        if (url.length > 15) {
          history.replaceState(
            {},
            "",
            location.pathname + "#" + (await this.deflate(url))
          );
        }

        recordVoxelHistory(this.$ctx.history, this.$ctx.voxels);
        // Clear the redo stack since a new action occurred
        this.redoStack = [];
        //this.$set(this.$ctx, "voxels", parsedData);
      } catch (error) {
        console.error("Error handling dropped file:", error);
      }
    },
    parseVoxFile(arrayBuffer) {
      return parseVoxFile(arrayBuffer, { useDefaultPalette: true });
    },
  },
};
</script>

<style lang="scss">
html {
  box-sizing: border-box;
  font-family: arial, helvetica, sans-serif;
  color: #222;
  background: #010101;
  user-select: none;
  touch-action: none;
}
body {
  min-height: calc(100vh - 12px);
  max-height: calc(100vh - 12px);
  overflow: hidden;
  margin: 0;
  padding: 6px;
  touch-action: none;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

button,
input {
  font-size: 13px;
}
input[type="text"] {
  max-width: 30px;
  border: 0;
  padding: 0;
}

.drag-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999999999;
  svg {
    width: 100px;
    height: auto;
    fill: #ccc;
  }
  .dragoutline {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    font-size: 24px;
  }
}

p,
ul,
h1,
h2 {
  margin: 0;
}

h1 {
  font-family: "VT323", monospace;
  font-size: 36px;
  font-weight: normal;
  min-width: max-content;
  color: #fff;
}

hr {
  border: 0;
  border-top: 1px solid #444;
  width: 100%;
}

button a {
  text-decoration: none;
  color: #eee;
}
</style>
