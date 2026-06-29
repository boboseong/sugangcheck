import {
  runValidationEngine
} from "../validation/validationEngine";
import type {
  ValidationEngineInput,
  ValidationEngineResult
} from "../validation/types";

export type ValidationWorkerRequest =
  | {
      type: "ping";
    }
  | {
      type: "runValidation";
      payload: ValidationEngineInput;
    };

export type ValidationWorkerResponse =
  | {
      type: "pong";
    }
  | {
      type: "validationResult";
      payload: ValidationEngineResult;
    }
  | {
      type: "validationError";
      message: string;
    };

self.addEventListener("message", (event: MessageEvent<ValidationWorkerRequest>) => {
  if (event.data.type === "ping") {
    const response: ValidationWorkerResponse = { type: "pong" };
    self.postMessage(response);
    return;
  }

  try {
    const response: ValidationWorkerResponse = {
      type: "validationResult",
      payload: runValidationEngine(event.data.payload)
    };
    self.postMessage(response);
  } catch (error) {
    const response: ValidationWorkerResponse = {
      type: "validationError",
      message: error instanceof Error ? error.message : "점검 실행 중 오류가 발생했습니다."
    };
    self.postMessage(response);
  }
});

export {};
