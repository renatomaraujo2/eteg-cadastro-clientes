/**
 * Validação de CPF.
 *
 * Além de conferir o formato, validamos os dígitos verificadores — assim
 * evitamos gravar CPFs sintaticamente válidos mas impossíveis (ex.: 111.111.111-11).
 */

/** Remove tudo que não for dígito. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Retorna true se o CPF (com ou sem máscara) for válido. */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;

  // Rejeita sequências repetidas (000..., 111..., etc.), que passam no cálculo
  // dos dígitos mas não são CPFs reais.
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
