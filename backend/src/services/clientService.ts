import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { ConflictError } from "../errors.js";
import type { CreateClientInput } from "../validation/clientSchema.js";

/**
 * Cria um cliente.
 *
 * A unicidade de CPF e e-mail é garantida no banco (constraints únicas).
 * Em vez de fazer um SELECT antes do INSERT (que abre brecha para corrida),
 * confiamos na constraint. Quando ela é violada (P2002), aí sim consultamos
 * quais campos já existem para devolver TODOS os conflitos de uma vez — assim
 * o usuário corrige CPF e e-mail na mesma tentativa, sem envios repetidos.
 */
export async function createClient(data: CreateClientInput) {
  try {
    return await prisma.client.create({
      data: {
        fullName: data.fullName,
        cpf: data.cpf,
        email: data.email,
        favoriteColor: data.favoriteColor,
        notes: data.notes,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw await buildConflictError(data);
    }
    throw error;
  }
}

/** Descobre todos os campos únicos já cadastrados e monta o erro de conflito. */
async function buildConflictError(
  data: CreateClientInput,
): Promise<ConflictError> {
  const existing = await prisma.client.findMany({
    where: { OR: [{ cpf: data.cpf }, { email: data.email }] },
    select: { cpf: true, email: true },
  });

  const fieldErrors: Record<string, string[]> = {};
  if (existing.some((client) => client.cpf === data.cpf)) {
    fieldErrors.cpf = ["Este CPF já foi cadastrado."];
  }
  if (existing.some((client) => client.email === data.email)) {
    fieldErrors.email = ["Este e-mail já foi cadastrado."];
  }

  // Salvaguarda: se a consulta não encontrar o conflito (corrida rara em que o
  // registro sumiu no meio), ainda respondemos como conflito.
  if (Object.keys(fieldErrors).length === 0) {
    fieldErrors.cpf = ["Este CPF já foi cadastrado."];
  }

  return new ConflictError(fieldErrors);
}

/** Lista os clientes cadastrados (mais recentes primeiro). */
export function listClients() {
  return prisma.client.findMany({ orderBy: { createdAt: "desc" } });
}
