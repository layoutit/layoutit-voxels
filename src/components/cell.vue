<template>
  <i

    :class="{
      lastrow: x === $ctx.rows,
      lastcol: y === $ctx.cols,
    }"
    @mousedown="start({ y, x})"
    @mouseover="move({  y, x })"
    @mouseup="stop"
  >
  </i>
</template>

<script>
export default {
  props: {
    x: Number,
    y: Number,
  },
  methods: {
    start(e) {
      this.$emit("start", e);
    },
    move(e) {
      this.$emit("move", e);
    },
    stop() {
      this.$emit("stop");
    },
  },
};
</script>

<style scoped>
i {
  pointer-events: all;
  cursor: crosshair;
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
}
i:hover {
  outline: 2px solid #ff073a;
}
</style>
