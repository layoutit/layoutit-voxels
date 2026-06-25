export function cloneVoxelLayers(voxels) {
  return JSON.parse(JSON.stringify(voxels));
}

export function createEmptyVoxelLayers(depth = 12) {
  return Array.from({ length: depth }, () => ({}));
}

export function recordVoxelHistory(history, voxels, maxLength = 20) {
  history.push(cloneVoxelLayers(voxels));
  if (history.length > maxLength) {
    history.shift();
  }
}

export function getUndoVoxelState({ voxels, history, redoStack, emptyDepth }) {
  if (history.length !== 0) {
    redoStack.push(cloneVoxelLayers(voxels));

    const lastIndex = history.length - 1;
    const previousState = history[lastIndex];
    if (JSON.stringify(previousState) === JSON.stringify(voxels)) {
      history.pop();
    }

    const stateToRestore = history.pop();
    return cloneVoxelLayers(stateToRestore);
  }

  return createEmptyVoxelLayers(emptyDepth);
}

export function getRedoVoxelState({ voxels, history, redoStack }) {
  if (redoStack.length === 0) {
    return null;
  }

  history.push(cloneVoxelLayers(voxels));
  const nextState = redoStack.pop();
  return cloneVoxelLayers(nextState);
}
