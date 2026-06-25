<template>
  <div style="display: contents">
    <div
      class="z"
      v-for="(layer, i) in $ctx.voxels"
      :key="`layer-${i}`"
      :style="{
        gridTemplateColumns: `repeat(${$ctx.cols}, 50px)`,
        gridTemplateRows: `repeat(${$ctx.rows}, 50px)`,
        transform: `translateZ(${i * 50}px)`,
      }"
    >
      <!-- Voxels -->
      <component
        v-for="v in layer"
        :is="v.shape"
        :key="`${v.x}-${v.y}-${v.x2}-${v.y2}-${v.z}`"
        :x="+v.x"
        :x2="+v.x2"
        :y="+v.y"
        :y2="+v.y2"
        :z="+v.z"
        :color="v.color"
        :texture="v.texture"
        @mousedown="($ctx.drag = true), act($event)"
        @mouseover="act($event)"
        @mouseup="$ctx.drag = false"
      />

      <!-- Grid cells -->
      <template v-if="i === 0">
        <i
          v-for="i in $ctx.cols * $ctx.rows"
          :key="`cell-${i}`"
          :test="i % $ctx.cols || $ctx.cols"
          v-bind="{
            'data-y': i % $ctx.cols || $ctx.cols,
            'data-y2': (i % $ctx.cols) + 1 || $ctx.cols + 1,
            'data-x': Math.ceil(i / $ctx.cols),
            'data-x2': Math.ceil(i / $ctx.cols) + 1,
            'data-z': 0,
          }"
          @click="$ctx.drag = true"
          @mousedown="($ctx.drag = true), act($event)"
          @mouseover="act($event)"
          @mouseleave="$ctx.hoveredArea = '◆'"
          @mouseup="($ctx.drag = false), updateOutputs()"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "layers",
  watch: {
    "$ctx.drag"(v) {
      this.$ctx.cache = v
        ? new Set(
            this.$ctx.voxels.flatMap((l, z) =>
              Object.keys(l).map((k) => `${z}/${k}`)
            )
          )
        : null;
    },
  },

  methods: {
    updateOutputs() {
      this.$ctx.hoveredArea = "";
    },
    isValid(x, y, x2, y2, z) {
      return (
        y >= 1 &&
        y <= this.$ctx.cols &&
        x >= 1 &&
        x <= this.$ctx.rows &&
        !this.$ctx.voxels[z][`${x}/${y}/${x2}/${y2}`]
      );
    },
    act(e) {
      const { x, y, x2, y2, z = 0 } = e.target?.dataset ?? e;
      this.$ctx.hoveredArea = `[${x}, ${y}, ${z}]`;

      this.$nextTick(() => {
        if (!this.$ctx.drag) return;
        const rangeKey = `${z}/${x}/${y}/${x2}/${y2}`;
        if (e.target?.dataset || this.$ctx.cache.has(rangeKey)) {
          this[this.$ctx.tool](+x, +y, +x2, +y2, +z, e.face || "f");
        }
      });
    },
    fill(x, y, x2, y2, z, face) {
      const processed = new Set();
      const offsets = this.$ctx.offsets;

      const directions =
        face === "f"
          ? ["fr", "fl", "bl", "br"].map((key) => offsets[key])
          : Object.values(offsets);

      const [dx, dy, dz] = offsets[face];

      const dfs = (cx, cy, cz) => {
        const [nx, ny, nx2, ny2, nz] = [
            cx + dx,
            cy + dy,
            cx + dx + 1,
            cy + dy + 1,
            cz + dz,
          ],
          nextCoords = [nz, nx, ny, nx2, ny2].join("/"),
          currCoords = [cz, cx, cy, cx + 1, cy + 1].join("/"),
          targetVoxel =
            this.$ctx.voxels[cz]?.[`${cx}/${cy}/${cx + 1}/${cy + 1}`],
          nextVoxel = this.$ctx.voxels[nz]?.[`${nx}/${ny}/${nx2}/${ny2}`];
        if (
          processed.has(currCoords) ||
          (face !== "f" && (!targetVoxel || nextVoxel)) ||
          !this.isValid(nx, ny, nx2, ny2, nz)
        )
          return;
        this.add(nx, ny, nx2, ny2, nz, face, true),
          processed.add(nextCoords, currCoords);
        for (const [ddx, ddy, ddz] of directions)
          dfs(cx + ddx, cy + ddy, cz + ddz);
      };

      dfs(x, y, z);
    },
    add(x, y, x2, y2, z, face, fill) {
      if (!fill) {
        [x, y, z] = [x, y, z].map(
          (v, i) => v + (this.$ctx.offsets[face]?.[i] || 0)
        );
        x2 = x + 1;
        y2 = y + 1;
      }

      if (this.isValid(x, y, x2, y2, z)) {
        this.$set(this.$ctx.voxels[z], `${x}/${y}/${x2}/${y2}`, {
          x,
          y,
          x2,
          y2,
          z,
          color: this.$ctx.activeColor,
          shape: this.$ctx.activeShape,
        });
      }
    },
    erase(x, y, x2, y2, z) {
      if (this._erasing) return;
      this.$delete(this.$ctx.voxels[z], `${x}/${y}/${x2}/${y2}`);
      this._erasing = setTimeout(() => (this._erasing = false), 25);
    },
    paint(x, y, x2, y2, z) {
      this.$set(this.$ctx.voxels[z], `${x}/${y}/${x2}/${y2}`, {
        ...this.$ctx.voxels[z][`${x}/${y}/${x2}/${y2}`],
        color: this.$ctx.activeColor,
      });
    },
  },
};
</script>

<style lang="scss">
.z-container {
  margin: 0 auto;
  position: relative;
  display: flex;
  flex: 1;
}

.z {
  display: grid;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  > * {
    pointer-events: all;
  }

  &:first-of-type {
    pointer-events: all;
  }

  &:first-of-type:after {
    content: "";
    position: absolute;
    z-index: 9999;
    inset: 0;
    z-index: 999;
    background: radial-gradient(transparent 60%, rgba(0, 0, 0, 0.2));
    pointer-events: none;
  }

  > i {
    pointer-events: all;
    cursor: cell;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    color: #ff073a;
    color: transparent;
    background: transparent;
    pointer-events: all;
    width: 100%;
    height: 100%;
    outline: 1px solid rgba(0, 0, 0, 0.1);
    &:hover {
      outline: 2px solid #ff073a;
    }
    svg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
  }
}
</style>
