import {
  runDefaultValidation,
  type ValidationRunInput
} from "../validation/validationEngine";
import type { ValidationEngineResult } from "../validation/types";

export type ValidationWorkerRequest =
  | {
      type: "ping";
    }
  | {
      type: "runValidation";
      requestId: number;
      payload: ValidationRunInput;
    };

export type ValidationWorkerResponse =
  | {
      type: "pong";
    }
  | {
      type: "validationResult";
      requestId: number;
      payload: ValidationEngineResult;
    }
  | {
      type: "validationError";
      requestId: number;
      message: string;
    };

self.addEventListener("message", (event: MessageEvent<ValidationWorkerRequest>) => {
  if (event.data.type === "ping") {
    const response: ValidationWorkerResponse = { type: "pong" };
    self.postMessage(response);
    return;
  }

  const { requestId, payload } = event.data;

  try {
    // Rule functions close over the operating subjects and rule lists, so they
    // cannot be posted in. The map is rebuilt here from the serialized input.
    const response: ValidationWorkerResponse = {
      type: "validationResult",
      requestId,
      payload: runDefaultValidation(payload)
    };
    self.postMessage(response);
  } catch (error) {
    const response: ValidationWorkerResponse = {
      type: "validationError",
      requestId,
      message:
        error instanceof Error ? error.message : "점검 실행 중 오류가 발생했습니다."
    };
    self.postMessage(response);
  }
});

export {};
