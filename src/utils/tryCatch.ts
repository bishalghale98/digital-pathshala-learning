import { errorResponse } from "./response";

export function tryCatch<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (err) {
      return errorResponse((err as Error).message, 500);
    }
  };
}
