import { z } from "zod";

/**
 * Validação de CPF no cliente — espelha a regra do backend.
 *
 * Observação de arquitetura: o ideal, num passo seguinte, é extrair essa regra
 * (e o schema) para um pacote compartilhado no monorepo, evitando a duplicação
 * entre front e back. Mantido duplicado aqui para não acoplar os deploys neste
 * primeiro momento. A validação do backend continua sendo a fonte de verdade.
 */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Aplica a máscara de CPF (000.000.000-00) conforme o usuário digita.
 * A formatação é só visual — o backend recebe e armazena apenas os dígitos.
 */
export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length > 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  if (digits.length > 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  return digits;
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);
  const checkDigit = (length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += digits[i] * (length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return checkDigit(9) === digits[9] && checkDigit(10) === digits[10];
}

export function buildClientSchema(allowedColors: string[]) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(3, "Informe o nome completo."),
    cpf: z
      .string()
      .min(1, "CPF é obrigatório.")
      .refine(isValidCpf, "CPF inválido."),
    email: z.string().trim().min(1, "E-mail é obrigatório.").email("E-mail inválido."),
    favoriteColor: z
      .string()
      .refine((v) => allowedColors.includes(v), "Selecione uma cor."),
    notes: z.string().max(500, "Máximo de 500 caracteres.").optional(),
  });
}

export type ClientFormValues = z.infer<ReturnType<typeof buildClientSchema>>;
