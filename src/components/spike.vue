<template>
  <div
    class="spike"
    :style="{ 'grid-area': `${x} / ${y} / ${x2}/ ${y2}` }"
    v-if="visibleFaces.length > 0"
    :class="[
      !isHexColor(color) ? 'svg' : color.replace('#', ''),
      {
        add: $ctx.tool === 'add',
        fill: $ctx.tool === 'fill',
        sub: $ctx.tool === 'erase',
      },
    ]"
  >
    <div
      v-for="face in visibleFaces"
      :key="face"
      :class="['face', face]"
      :style="faceStyles(face)"
      @mouseup="$ctx.drag = false"
    ></div>
  </div>
</template>

<script>
export default {
  props: ["x", "y", "x2", "y2", "z", "color", "texture"],
  computed: {
    faceStyles() {
      return (face) => {
        const baseStyles = this.isHexColor(this.color)
          ? { backgroundColor: this.adjustColor(this.color, face) }
          : {
              backgroundSize: "cover",
              backgroundImage: `url(textures/${this.color.replace(
                "#",
                ""
              )}/${this.color.replace("#", "")}-${face}.svg)`,
            };

        return baseStyles; // Default for other faces
      };
    },

    visibleFaces() {
      return ["t", "b", "bl", "br", "fr", "fl"].filter((face) => {
        const [dx, dy, dz] = this.$ctx.offsets[face];

        // Determine the target layer and key for the neighboring voxel
        const neighborZ = this.z + dz;
        const neighborKey = `${this.x + dx}/${this.y + dy}/${this.x2 + dx}/${
          this.y2 + dy
        }`;

        return (
          // Ensure the layer exists and check if the neighbor voxel is present

          // Bottom face hidden at floor level
          !(face === "b" && this.z === 0)
          // Not hidden by rotation
        );
      });
    },
  },
  methods: {
    isHexColor(color) {
      return /^#[0-9A-F]{6}$/i.test(color);
    },
    adjustColor(color, face) {
      // Convert the color to RGB
      const rgb = color.match(/\w\w/g).map((x) => parseInt(x, 16));

      // Determine the adjustment factor for each face
      let adjustment = 0;
      if (face === "fr") adjustment = -15; // Darken slightly
      if (face === "fl") adjustment = -25; // Darken more
      if (face === "bl" || face === "br") adjustment = -35; // Darkest faces

      // Apply the adjustment
      const adjusted = rgb.map((channel) =>
        Math.min(255, Math.max(0, channel + adjustment))
      );

      // Convert back to hex
      return `rgb(${adjusted[0]}, ${adjusted[1]}, ${adjusted[2]})`;
    },
  },
};
</script>
<style lang="scss">
.spike {
  display: block;
  position: absolute;
  width: 50px;
  height: 50px;
  transform: translateZ(25px);
  &.svg .face {
    &:after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: 0;
    }
    &.t:after {
      background: rgba(0, 0, 0, 0);
    }

    &.fr:after {
      background: rgba(0, 0, 0, 0.05);
    }

    &.fl:after {
      background: rgba(0, 0, 0, 0.1);
    }

    &.bl:after {
      background: rgba(0, 0, 0, 0.15);
    }

    &.br:after {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .face {
    position: absolute;
    inset: 0;
    outline: 1px solid rgba(0, 0, 0, 0.05);

    &.t {
      transform: translateZ(25px);
      display: none;
    }
    &.b {
      transform: translateZ(-25px);
    }
    &.fr {
      transform: rotateY(60deg) translateZ(9px) translateX(9px);
      clip-path: polygon(100% 0%, 0% 50%, 100% 100%);
    }
    &.fl {
      transform: rotateX(120deg) translateZ(-9px) translateY(-9px);
      clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    }
    &.bl {
      transform: rotateY(120deg) translateZ(-9px) translateX(9px);
      clip-path: polygon(100% 0%, 0% 50%, 100% 100%);
    }
    &.br {
      transform: rotateX(60deg) translateY(-9px) translateZ(9px);
      clip-path: polygon(100% 0%, 0% 0%, 50% 100%);
    }
    &.svg {
      outline: 0;
    }
    &.c262b44,
    &.c3a4466,
    &.c3e2731,
    &.c193c3e,
    &.c68386c,
    &.c181425 {
      outline: 1px solid rgba(255, 255, 255, 0.05);
    }

    svg {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    }
  }

  &.selected .face,
  &.select:hover .face {
    outline: 1.5px solid red;
    outline-offset: -1.5px;
    cursor: pointer;
  }

  &.sub:hover .face {
    outline: 1.5px solid red;
    outline-offset: -1.5px;
    cursor: pointer;

    &:before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(255, 0, 0, 0.5);
      z-index: 9999;
    }
  }

  &.fill .face:hover,
  &.add .face:hover {
    outline: 1.5px solid red;
    outline-offset: -1.5px;
    cursor: pointer;
  }
}
</style> 