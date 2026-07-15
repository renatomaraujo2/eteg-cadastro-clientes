import { z } from "zod";
import { COLOR_VALUES } from "../config/colors.js";
import { isValidCpf, onlyDigits } from "./cpf.js";

/**
 * Schema de entrada do cadastro de cliente.
 *
 * Faz o parse + normalização em um só lugar: o CPF sai daqui já apenas com
 * dígitos e os textos já vêm com trim, então o restante da aplicação não
 * precisa se preocupar com formatação.
 */
export const createClientSchema = z.object({
  fullName: z
    .string({ required_error: "Nome completo é obrigatório." })
    .trim()
    .min(3, "Informe o nome completo.")
    .max(120, "Nome muito longo."),

  cpf: z
    .string({ required_error: "CPF é obrigatório." })
    .refine(isValidCpf, "CPF inválido.")
    .transform(onlyDigits),

  email: z
    .string({ required_error: "E-mail é obrigatório." })
    .trim()
    .toLowerCase()
    .email("E-mail inválido."),

  favoriteColor: z.enum(COLOR_VALUES as [string, ...string[]], {
    errorMap: () => ({ message: "Selecione uma cor válida." }),
  }),

  notes: z
    .string()
    .trim()
    .max(500, "Observações muito longas (máx. 500 caracteres).")
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
