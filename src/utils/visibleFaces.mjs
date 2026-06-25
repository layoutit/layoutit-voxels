export const VOXEL_FACES = ["t", "b", "bl", "br", "fr", "fl"];

export function getVisibleFaces({
  faces = VOXEL_FACES,
  offsets,
  voxels,
  walls = {},
  x,
  y,
  x2,
  y2,
  z,
  hideBottomAtGround = true,
}) {
  return faces.filter((face) => {
    const offset = offsets[face];
    if (!offset) return false;

    if (hideBottomAtGround && face === "b" && z === 0) return false;
    if (walls[face]) return false;

    const [dx, dy, dz] = offset;
    const neighborZ = z + dz;
    if (neighborZ < 0 || neighborZ >= voxels.length) return true;

    const neighborKey = `${x + dx}/${y + dy}/${x2 + dx}/${y2 + dy}`;
    return !voxels[neighborZ]?.[neighborKey];
  });
}
