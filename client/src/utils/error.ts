import type { AxiosError } from "axios";

export function getErrorMessage(err: unknown): string {
  const error = err as AxiosError<{ message?: string }>;
  return error.response?.data?.message || error.message || "Something went wrong";
}
