/** Erro de negócio: recurso já existe (ex.: CPF ou e-mail já cadastrado). */
export class ConflictError extends Error {
  constructor(
    message: string,
    /** Campo que causou o conflito, para o front destacar. */
    public readonly field: "cpf" | "email",
  ) {
    super(message);
    this.name = "ConflictError";
  }
}
