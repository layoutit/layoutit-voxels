export function measureVoxelBounds(voxels) {
  const maxFor = (key) =>
    Math.max(
      ...voxels.flatMap((layer) =>
        Object.values(layer).map((voxel) => voxel[key])
      )
    );

  return {
    maxX: maxFor("x"),
    maxY: maxFor("y"),
    maxZ: maxFor("z"),
  };
}
