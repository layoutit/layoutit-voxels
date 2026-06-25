<template>
  <div class="toolbar-sidebar" v-if="$ctx.leftPanel">
    <div>
      <div class="reribbon-tools remagic tool-selector">
        <button
          v-for="tool in retools"
          :key="tool"
          :class="{ active: $ctx.tool === tool }"
          :style="{ display: 'flex', flexDirection: 'column' }"
          @click="$ctx.tool = tool"
        >
          <component :is="`icons-${tool}`" />
          <span>{{ tool }}</span>
        </button>
      </div>

      <div class="activepanel">
        <template>
          <div style="padding: 10px">
            <div>
              <div class="shapeshifter">
                <div>shape:</div>
                <div
                  v-for="shape in cubeShapes"
                  @click="$ctx.activeShape = shape"
                  :class="{ active: shape === $ctx.activeShape }"
                  :key="`hk${shape}`"
                >
                  {{ shape }}
                </div>
              </div>
            </div>
            <hr />
            <div style="display: flex; justify-content: space-between">
              palette:
              <select
                name="palettes"
                id=""
                style="opacity: 0.6; pointer-events: none"
              >
                <option value="endesga" selected>Endesga 32</option>
                <option value="debe">DB32</option>
                <option value="pico8">Pico8</option>
              </select>
            </div>
            <div class="color-selector">
              <div
                v-for="(color, i) in $ctx.colors"
                :key="color"
                :data-color="color.replace('#', '')"
                :style="{ backgroundColor: color }"
                class="color-box"
                :class="{ active: $ctx.activeColor === color }"
                @click="handleColor(color, i)"
              ></div>
            </div>

            <hr />
            <div>
              <div style="display: flex; justify-content: space-between">
                texture:
                <select
                  name="palettes"
                  id=""
                  style="opacity: 0.6; pointer-events: none"
                >
                  <option value="kenney" selected>Kenney</option>
                  <option value="astro">Astropoodle</option>
                </select>
              </div>
            </div>
            <div class="color-selector">
              <div
                class="color-box"
                :class="{ active: $ctx.activeColor === texture }"
                @click="handleTexture(texture, i)"
                v-for="(texture, i) in $ctx.textures"
                :key="texture"
                :style="{
                  backgroundImage: `url(textures/${texture}/${texture}-fl.svg)`,
                }"
              ></div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div style="min-height: 200px">
      <div class="remagic tool-selector reribbon-tools">
        <button
          v-for="tool in bottomtools"
          :key="tool"
          :class="{ active: $ctx.activeConfig === tool }"
          :style="{ display: 'flex', flexDirection: 'column' }"
          @click="$ctx.activeConfig = tool"
        >
          <component :is="`icons-${tool}`" />
          <span>{{ tool }}</span>
        </button>
      </div>
      <div class="code-sidebar">
        <template>
          <div class="magic-controller" v-if="$ctx.activeConfig === 'grid'">
            <div>
              <label for="">rows</label>
              <input type="range" v-model="$ctx.cols" min="4" max="32" />
              <input type="text" v-model="$ctx.cols" />
            </div>
            <div>
              <label for="">cols</label>
              <input type="range" v-model="$ctx.rows" min="4" max="32" />
              <input type="text" v-model="$ctx.rows" />
            </div>
            <div>
              <label for="">depth</label>
              <input
                type="range"
                :value="$ctx.voxels.length"
                @input="updateVoxelLayers($event.target.value)"
                min="4"
                max="16"
              />
              <input
                type="text"
                :value="$ctx.voxels.length"
                @input="updateVoxelLayers($event.target.value)"
              />
            </div>

            <button style="cursor: pointer" @click="handleDefaults()">
              reset to defaults
            </button>
          </div>
          <div class="magic-controller" v-if="$ctx.activeConfig === 'camera'">
            <div>
              <label for="">zoom</label>
              <input
                type="range"
                id="zoomRange"
                min="0.1"
                max="1.55"
                step="0.05"
                v-model="$ctx.zoom"
              />
            </div>
            <div>
              <label for="">rotate</label>
              <input
                type="range"
                id="rotateRange"
                min="0"
                max="360"
                step="5"
                v-model.number="$ctx.rotY"
              />
            </div>
            <div>
              <label for="">pan</label>
              <div style="display: flex" class="halfrange">
                <input
                  type="range"
                  id="panRange"
                  min="-500"
                  max="500"
                  step="10"
                  v-model="$ctx.pan"
                />
                <input
                  type="range"
                  id="tiltRange"
                  min="-500"
                  max="500"
                  step="10"
                  v-model="$ctx.tilt"
                />
              </div>
            </div>

            <button style="cursor: pointer" @click="handleDefaults()">
              reset to defaults
            </button>
          </div>
          <div class="magic-controller" v-if="$ctx.activeConfig === 'config'">
            <div class="checkboxers">
              <div>
                <label
                  ><input type="checkbox" v-model="$ctx.hideGrid" /> transparent
                  grid</label
                >
              </div>

              <div>
                <label
                  ><input type="checkbox" v-model="$ctx.showWalls" /> show
                  walls</label
                >
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    v-model="$ctx.invert"
                    :true-value="-1"
                    :false-value="1"
                  />
                  invert controls</label
                >
              </div>
              <div>
                <label
                  title="Coming soon!"
                  style="
                    pointer-events: none;
                    opacity: 0.4;
                    cursor: not-allowed !important;
                  "
                  ><input type="checkbox" /> merge cells</label
                >
              </div>
            </div>
          </div>
          <div
            class="magic-controller"
            v-if="$ctx.activeConfig === 'about'"
          ></div>
          <div class="magic-controller" v-if="$ctx.activeConfig === 'about'">
            <p style="padding-bottom: 10px">
              Layoutit Voxel editor leverages Vue.js, HTML and CSS 3D transforms
              as a rendering engine.
            </p>

            <p>
              website:
              <a href="https://layoutit.com">layoutit.com</a>
            </p>
            <p>
              code:
              <a href="https://github.com/LayoutitStudio/layoutit-voxels"
                >github.com/LayoutitStudio/layoutit-voxels</a
              >
            </p>
          </div>
        </template>
      </div>
    </div>
    <div class="codead" style="min-height: 240px; flex: 1; display: none">
      <div ref="carbonAds"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      retools: ["add", "fill", "paint", "erase"],
      exporttools: ["web", "csv", "json", "export"],
      bottomtools: ["grid", "camera", "config", "about"],
      cubeShapes: ["cube", "slab", "wedge", "spike"],
      adScriptLoaded: false,
    };
  },
  mounted() {
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined"
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.type = "text/javascript";
      script.src =
        "//cdn.carbonads.com/carbon.js?serve=CW7IT5QY&placement=layoutitcom&format=responsive";
      script.id = "_carbonads_js";

      script.onload = () => {
        this.adScriptLoaded = true;
      };

      this.$refs.carbonAds.appendChild(script);
    }
  },

  methods: {
    updateVoxelLayers(newDepth) {
      newDepth = parseInt(newDepth, 10);
      const currentDepth = this.$ctx.voxels.length;

      if (newDepth > currentDepth) {
        for (let i = currentDepth; i < newDepth; i++) {
          this.$ctx.voxels.push({});
        }
      } else if (newDepth < currentDepth) {
        this.$ctx.voxels.splice(newDepth);
      }
    },
    handleRefresh() {
      this.$set(this.$ctx, "voxels", {});
      this.scale = 0.8;
      this.$ctx.walls.bl = true;
      this.$ctx.walls.br = true;
      this.$ctx.walls.fl = false;
      this.$ctx.walls.fr = false;
      this.$ctx.rotX = 65;
      this.$ctx.rotY = 45;
      window.history.replaceState(null, "", "/");
    },
    handleColor(color, i) {
      this.$ctx.activeColor = color;
    },
    handleTexture(texture, i) {
      this.$ctx.activeColor = texture;
    },
  },
};
</script>
<style lang="scss">
.toolbar-sidebar {
  max-width: 300px;
  min-width: 300px;
  flex: 1;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
  position: relative;
  > * {
    //flex: 1;
    display: flex;
    flex-direction: column;
    background: #222222;
    border-radius: 6px;
  }
}

.activepanel {
  color: #ccc;
  background: #222;
  border-radius: 6px;
  display: flex;
  gap: 6px;
  flex-direction: column;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  font-size: 13px;
  z-index: 9999;
  padding-bottom: 5px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;

  > div {
    display: flex;
    gap: 6px;
    flex-direction: column;
  }

  input[type="number"] {
    background: transparent;
    border: 1px solid #888;
    max-width: 40px;
    color: #ddd;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    font-size: 13px;
  }
}

.shapeshifter {
  margin-top: 3px;
  display: flex;
  gap: 6px;
  div {
    flex: 1;

    padding: 4px 6px;
    border-radius: 4px;
    color: #aaa;
    cursor: pointer;
    text-align: center;
    &:first-child {
      margin: 0;
      color: #ccc;
      padding: 4px 0;
      margin-right: 4px;
      &:hover {
        background: transparent;
        color: #ccc;
      }
    }
    &:hover {
      background: #333;
      color: #eee;
    }
    &.active {
      background: #01579b;
      color: #eee;
    }
  }
}

.reribbon-tools {
  display: flex;

  background: #2a2a2a;
  border-radius: 6px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0;
  align-items: center;
  height: 60px;
  button {
    min-width: 75px;
  }
  &.remagic {
    flex-direction: row;
    top: 55px;
    width: auto;
    button {
      min-width: 75px;
    }
  }
  &.newribbontools {
    background: #222;
    border-radius: 6px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    display: flex;
    button {
      min-width: 80px;
    }
  }
  div {
    color: #666;
  }

  button {
    color: #aaa;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    position: relative;
    font-size: 12px;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    gap: 2px;
    flex-direction: column;
    svg,
    span {
      z-index: 9;
    }
    &:hover,
    &.active {
      color: #fff;
    }
    &:hover svg,
    &.active svg {
      fill: #fff;
    }
    &:hover:before {
      content: "";
      background: #222;
      position: absolute;
      inset: 5px;
      left: 3px;
      right: 3px;

      border-radius: 6px;
    }

    &.active:before {
      content: "";
      background: #01579b;
      position: absolute;
      inset: 5px;
      left: 3px;
      right: 3px;

      border-radius: 6px;
    }

    &.deleterefresh:hover:before {
      content: "";
      background: #c2185b;
      position: absolute;
      inset: 5px;

      border-radius: 6px;
    }
  }

  svg {
    width: 18px;
    fill: #aaa;
  }
}

.color-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-height: 135px;
  overflow: auto;
  .color-box {
    position: relative;
    background-size: cover;
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
    }
  }
  img,
  svg,
  div {
    width: 30px;
    height: 30px;
    border: 1px solid #555;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.8;
    &.active,
    &:hover {
      border: 1px solid #555;
      opacity: 1;
    }

    &.active:after {
      content: "✓";
      font-size: 20px;
      text-shadow: 0px 0px 1px #000;
      color: #fff;
      outline: 2px solid #212121;
      outline-offset: -2px;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
    }
    &[data-color="c0cbdc"].active:after,
    &[data-color="ead4aa"].active:after,
    &[data-color="fee761"].active:after,
    &[data-color="ffffff"].active:after {
      color: #222;
    }
  }
  img,
  svg {
    border: 0;
  }
}

select {
  background-color: transparent;
  color: #aaa;
  cursor: pointer;
  font-size: 13px;
  text-shadow: none;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  border: 1px solid #555;
}

.code-sidebar {
  z-index: 99;
  padding: 10px;
  padding-top: 8px;
  color: #ddd;
  background: #222;
  border-radius: 6px;

  overflow: auto;
}

.magic-controller {
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  margin-top: 2px;
  a {
    color: #888;
    &:hover {
      color: #eee;
    }
  }
  button {
    color: #aaa;
    text-decoration: underline;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    font-size: 13px;
    text-align: left;
    margin: 10px 0 10px;
  }
  hr {
    margin: 12px 0;
  }
  > p {
    color: #888;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    font-size: 13px;
    margin: 0;
    line-height: 19px;
    padding-right: 10px;
  }
  > div {
    display: flex;
    color: #888;
    height: 28px;
    align-items: center;
    gap: 6px;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
    font-size: 13px;
    input {
      background: transparent;
      //max-width: 120px;
      color: #888;
      font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
      font-size: 13px;
      &[type="range"] {
        min-width: 190px;
      }
      &[type="text"] {
        max-width: 30px;
        border: 0;
        padding: 0;
        &:focus {
          outline: none;
        }
      }
    }
  }
  label[for=""] {
    display: inline-block;
    width: 50px;
  }
}

label {
  color: #888;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  font-size: 13px;
}

.magic-controller > div.checkboxers {
  flex-direction: column;
  height: auto;
  align-items: initial;
  padding-top: 5px;
  label {
    display: flex;
    cursor: pointer;
    gap: 6px;
    align-items: center;
  }
}

#carbon-responsive {
  gap: 0 !important;
}
#carbon-responsive .carbon-responsive-wrap {
  background: none !important;
  border: 0 !important;
  gap: 6px !important;
  padding: 10px 12px 0 8px !important;
  a {
    color: #bbb !important;
    font-size: 12px !important;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace !important;
    position: relative !important;
    overflow: auto !important;
    max-height: 120px !important;
    display: block !important;
  }
  .carbon-text {
    line-height: 18px !important;
    text-overflow: ellipsis !important;
    padding-top: 4px !important;
  }
  .carbon-img {
    max-width: 110px !important;
    height: auto !important;
    border-radius: 6px !important;
  }

  img {
    border-radius: 6px !important;
    max-width: 105px !important;
    width: 100% !important;
    height: auto !important;
    padding-left: 1px !important;
    padding-right: 1px !important;
    flex: 0 !important;
  }
}
a.carbon-poweredby {
  color: #ddd !important;
  text-align: left !important;
  padding-left: 12px !important;
  position: absolute !important;
  bottom: 5px;
}

.halfrange {
  input[type="range"] {
    min-width: auto !important;
    max-width: 92px !important;
  }
}
</style>
