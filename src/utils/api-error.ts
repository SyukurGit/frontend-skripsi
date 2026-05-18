export function getErrorMessage(error: unknown, fallback: string) {
  const maybe = error as { response?: { data?: unknown }; message?: unknown };
  const data = maybe.response?.data;

  if (typeof data === "object" && data !== null && "message" in data) {
    return String((data as { message?: unknown }).message ?? fallback);
  }

  if (typeof maybe.message === "string" && maybe.message.trim() !== "") {
    return maybe.message;
  }

  return fallback;
}
