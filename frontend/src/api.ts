import type { ApiErrorResponse, ColorOption } from "./types";
import type { ClientFormValues } from "./validation";

/** Erro lançado quando a API responde com status de falha. */
export class ApiError extends Error {
  constructor(
    message: string,
    /** Erros por campo, quando a API os fornece (validação/conflito). */
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchColors(): Promise<ColorOption[]> {
  const res = await fetch("/api/colors");
  if (!res.ok) throw new ApiError("Não foi possível carregar as cores.");
  return res.json();
}

export async function createClient(values: ClientFormValues): Promise<void> {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (res.ok) return;

  const body = (await res.json().catch(() => null)) as ApiErrorResponse | null;
  throw new ApiError(
    body?.message ?? "Não foi possível concluir o cadastro.",
    body?.errors,
  );
}
