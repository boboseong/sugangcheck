import { createValidationWorker } from "./createValidationWorker";
import {
  runDefaultValidation,
  type ValidationRunInput
} from "../validation/validationEngine";
import type { ValidationEngineResult } from "../validation/types";
import type {
  ValidationWorkerRequest,
  ValidationWorkerResponse
} from "./validationWorker";

let nextRequestId = 0;

export function supportsValidationWorker(): boolean {
  return typeof Worker !== "undefined";
}

/**
 * Runs the default rule set off the main thread so a large cohort does not
 * freeze the UI. Falls back to running inline whenever a worker is
 * unavailable or fails to start, so validation still produces a result under
 * jsdom and in webviews that block module workers.
 */
export function runValidationInWorker(
  input: ValidationRunInput
): Promise<ValidationEngineResult> {
  if (!supportsValidationWorker()) {
    return Promise.resolve(runDefaultValidation(input));
  }

  let worker: Worker;

  try {
    worker = createValidationWorker();
  } catch {
    return Promise.resolve(runDefaultValidation(input));
  }

  return new Promise<ValidationEngineResult>((resolve, reject) => {
    const requestId = nextRequestId++;
    let settled = false;

    function finish(run: () => void) {
      if (settled) {
        return;
      }

      settled = true;
      worker.terminate();
      run();
    }

    worker.addEventListener("message", (event: MessageEvent<ValidationWorkerResponse>) => {
      const response = event.data;

      if (response.type === "pong" || response.requestId !== requestId) {
        return;
      }

      if (response.type === "validationResult") {
        finish(() => resolve(response.payload));
        return;
      }

      finish(() => reject(new Error(response.message)));
    });

    // A worker that cannot be constructed or parsed never replies, so treat a
    // startup failure as a reason to run inline rather than lose the run.
    worker.addEventListener("error", () => {
      finish(() => resolve(runDefaultValidation(input)));
    });

    const request: ValidationWorkerRequest = {
      type: "runValidation",
      requestId,
      payload: input
    };

    worker.postMessage(request);
  });
}
