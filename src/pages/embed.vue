<template>
  <div class="blocks-container">
    <div class="scene-container embed">
      <div
        class="scene"
        @pointerdown.self="
          $ctx.dragMap = true;
          mX = $event.clientX;
          mY = $event.clientY;
        "
        @pointermove="rotate($event)"
        @pointerup="($ctx.dragMap = false, animateRotation())"
        :style="{
          cursor: $ctx.dragMap ? 'grabbing' : 'grab',
          pointerEvents: $ctx.dragFile ? 'none' : 'auto',
        }"
        :class="{ transparent: $ctx.hideGrid }"
      >
        <div
          class="box"
          v-if="!$ctx.loading"
          :style="{
            transform: `scale(${this.$ctx.zoom}) translateY(${
              $ctx.voxels.length * 20
            }px) translateY(${$ctx.tilt}px) translateX(${
              $ctx.pan
            }px) rotateX(${$ctx.rotX.toFixed()}deg) rotate(${$ctx.rotY.toFixed()}deg)`,
            width: `${$ctx.cols * 50}px`,
            height: `${$ctx.rows * 50}px`,
          }"
        >
          <div class="floor" ref="sceneFloor">
            <layers />
          </div>
        </div>
        <div v-if="$ctx.loading" class="spinner"></div>
        <a href="#" class="powered">Powered by Layoutit!</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mX: 0,
      mY: 0,
      rotationFrame: null,
      userInteracted: false, // Flag to track manual interaction
    };
  },
  mounted() {
    this.animateRotation(); // Start rotating on load
  },
  beforeDestroy() {
    cancelAnimationFrame(this.rotationFrame);
  },
  methods: {
    animateRotation() {
      if (this.rotationFrame || this.userInteracted) return; // Stop if user interacted

      const loop = () => {
        if (!this.rotationFrame) return; // Stop if canceled
        this.$ctx.rotY = (this.$ctx.rotY + 0.7) % 360; // Adjust speed here

        // Update walls
        const r = this.$ctx.rotY % 360;
        this.$ctx.walls = {
          bl: r <= 180,
          fr: r > 180,
          br: r < 90 || r >= 270,
          fl: r >= 90 && r < 270,
        };

        this.rotationFrame = requestAnimationFrame(loop);
      };

      this.rotationFrame = requestAnimationFrame(loop);
    },
    stopRotation() {
      cancelAnimationFrame(this.rotationFrame);
      this.rotationFrame = null;
    },
    rotate({ clientX: x, clientY: y }) {
      const { $ctx } = this;
      if (!$ctx.dragMap) return;

      this.userInteracted = true; // Mark that user has moved it
      this.stopRotation(); // Stop animation on manual interaction

      const [dX, dY] = [x - this.mX, y - this.mY].map(
        (d) => (d * $ctx.invert) / 5
      );

      $ctx.rotY = ($ctx.rotY - dX + 360) % 360;
      $ctx.rotX = Math.max(0, Math.min(100, $ctx.rotX - dY));

      const r = $ctx.rotY % 360;
      $ctx.walls = {
        bl: r <= 180,
        fr: r > 180,
        br: r < 90 || r >= 270,
        fl: r >= 90 && r < 270,
      };

      [this.mX, this.mY] = [x, y];
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=VT323&display=swap");

.blocks-container {
  padding: 0px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  > * {
    flex: 1;
  }
}

.scene {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 8000px;

  overflow: hidden;
  * {
    transform-style: preserve-3d;
    position: absolute;
  }
}

.floor {
  background: #c2c2f3;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

button {
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0;
}

code {
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  font-size: 13px;
}

pre {
  margin: 0;
}

.scene.transparent {
  .regrilla div,
  .z > i {
    outline: 1px solid #555 !important;
  }
  .floor:after {
    display: none;
  }
  .floor,
  .wall-backLeft,
  .wall-backRight,
  .wall-frontLeft,
  .wall-frontRight {
    background: transparent !important;
  }
}

.floor:after {
  content: "";
  display: block;
  top: 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateZ(-12px);
  border: 1px solid #888;
}

.scene-container.embed {
  display: flex;
  gap: 6px;
  padding-bottom: 0;
  max-height: calc(100vh - 0px);
  min-height: calc(100vh - 0px);
  > * {
    flex: 1;
  }
}

button[disabled] {
  pointer-events: none;
  opacity: 0.5;
}

.spinner {
  /* Spinner size and color */
  width: 1.5rem;
  height: 1.5rem;
  border-top-color: #666;
  border-left-color: #666;

  /* Additional spinner styles */
  animation: spinner 600ms linear infinite;
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-style: solid;
  border-width: 2px;
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  width: 5rem;
  height: 5rem;
  border-width: 6px;
}

/* Animation styles */
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.powered {
  position: fixed;
  bottom: 5px;
  left: 2px;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  color: #888;
}
</style>
