/** Mapa de erros por campo (mesmo formato usado nas respostas 400/409). */
export type FieldErrors = Record<string, string[]>;

/**
 * Erro de negócio: um ou mais campos únicos já existem (CPF e/ou e-mail).
 * Carrega todos os campos em conflito de uma vez, para o front destacar todos
 * na mesma resposta.
 */
export class ConflictError extends Error {
  constructor(public readonly fieldErrors: FieldErrors) {
    super("Já existe um cadastro com esses dados.");
    this.name = "ConflictError";
  }
}
