import axios, { AxiosError } from "axios";
import { getApiBaseUrl } from "@/utils/env";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const tok = useAuthStore.getState().token;
  if (tok) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${tok}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<unknown>) => {
    const status = err.response?.status;
    const data = err.response?.data;
    const token = useAuthStore.getState().token;
    const url = err.config?.url ?? "";
    const msg =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: unknown }).message ?? err.message)
        : err.message;

    if (status === 401 && token && !url.includes("/auth/login")) {
      useToastStore
        .getState()
        .push({ kind: "error", title: "Sesi berakhir", detail: "Silakan masuk kembali untuk melanjutkan." });
      useAuthStore.getState().clear();
    }

    // Global toast for network/server errors; per-page can still show inline.
    if (!status || status >= 500) {
      useToastStore
        .getState()
        .push({ kind: "error", title: "Layanan tidak tersedia", detail: String(msg) });
    }

    return Promise.reject(err);
  },
);
