import { useToastStore } from "@/store/toast";

export function useApiErrorToast() {
  const push = useToastStore((s) => s.push);
  return (title: string, err: unknown) => {
    const detail = err instanceof Error ? err.message : String(err);
    push({ kind: "error", title, detail });
  };
}
