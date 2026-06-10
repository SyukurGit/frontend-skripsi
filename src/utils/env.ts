const defaultApiBaseUrl = "http://localhost:8080";

function normalizeUrl(value?: string | null) {
  return value?.replace(/\/$/, "") || defaultApiBaseUrl;
}

function readRuntimeApiBaseUrl() {
  if (typeof window !== "undefined") {
    return normalizeUrl(window.__APP_CONFIG__?.apiBaseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL);
  }

  return normalizeUrl(process.env.APP_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL);
}

export function getApiBaseUrl() {
  return readRuntimeApiBaseUrl();
}

export const env = {
  get apiBaseUrl() {
    return getApiBaseUrl();
  },
};
