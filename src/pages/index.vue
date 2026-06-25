<template>
  <div class="blocks-container">
    <ribbonTools />
    <div class="scene-container">
      <toolbarSidebar />

      <div
        class="scene"
        ref="sceneRef"
        id="sceneRef"
        @pointerdown.self="
          $ctx.dragMap = true;
          mX = $event.clientX;
          mY = $event.clientY;
        "
        @pointermove="rotate($event)"
        @pointerup="$ctx.dragMap = false"
        @mouseleave="$ctx.drag = false"
        :style="{
          cursor: $ctx.dragMap ? 'grabbing' : 'grab',
          pointerEvents: $ctx.dragFile ? 'none' : 'auto',
        }"
        :class="{ transparent: $ctx.hideGrid }"
      >
        <div
          class="box"
          v-if="!$ctx.loading"
          @mouseleave="$ctx.drag = false"
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
          <sceneWalls />
        </div>
        <div v-if="$ctx.loading" class="spinner"></div>
      </div>

      <codeSidebar />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mX: 0,
      mY: 0,
    };
  },
  methods: {
    rotate({ clientX: x, clientY: y }) {
      const { $ctx } = this;
      if (!$ctx.dragMap) return;

      const [dX, dY] = [x - this.mX, y - this.mY].map(
        (d) => (d * $ctx.invert) / 5
      );

      $ctx.rotY = ($ctx.rotY - dX + 360) % 360;
      $ctx.rotX = Math.max(0, Math.min(100, $ctx.rotX - dY));

      const r = $ctx.rotY % 360;
      $ctx.walls = {
        t: Math.round($ctx.rotX) >= 90,
        b: Math.round($ctx.rotX) < 90,
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

.scene-container {
  display: flex;
  gap: 6px;
  padding-bottom: 12px;
  max-height: calc(100vh - 50px);
  min-height: calc(100vh - 50px);
  > * {
    flex: 1;
  }
}
.newcodesidebar.toolbar-sidebar.mobile-gallery,
.remenu {
  display: none !important;
}
@media screen and (max-width: 992px) {
  .scene * {
    pointer-events: none !important;
  }
  .brand-logo {
    background: #010101 !important;
  }
  .scene-container {
    flex-direction: column !important;
  }
  .newcodesidebar.toolbar-sidebar.mobile-gallery,
  .remenu {
    display: flex !important;
  }
  .newcodesidebar.toolbar-sidebar.desktop-gallery,
  .ribbon-tools > div button,
  .ribbon-tools > div + div,
  .gallery-container .examples-container > div.random,
  .stats,
  .toolbar-sidebar {
    display: none !important;
  }

  .newcodesidebar.toolbar-sidebar {
    display: flex !important;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    min-width: 100% !important;
    max-width: 100% !important;
    top: 60px;
    background: #101010;

    .gallery-container {
      flex-direction: column;
      min-width: 100%;
      max-width: 100%;
    }
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
</style>
