let hydrationDepth = 0;

export function isProjectHydrating(): boolean {
  return hydrationDepth > 0;
}

export function runProjectHydration<T>(callback: () => T): T {
  hydrationDepth += 1;

  try {
    return callback();
  } finally {
    hydrationDepth -= 1;
  }
}
