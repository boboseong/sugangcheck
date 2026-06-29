export function createValidationWorker() {
  return new Worker(new URL("./validationWorker.ts", import.meta.url), {
    type: "module"
  });
}
