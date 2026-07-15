import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { ConflictError } from "../errors.js";
import type { CreateClientInput } from "../validation/clientSchema.js";

/**
 * Cria um cliente.
 *
 * A unicidade de CPF e e-mail é garantida no banco (constraints únicas).
 * Em vez de fazer um SELECT antes do INSERT (que abre brecha para corrida),
 * confiamos na constraint e traduzimos a violação (P2002) para um erro de
 * negócio com o campo correto.
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
      const target = (error.meta?.target as string[] | undefined) ?? [];
      if (target.includes("email")) {
        throw new ConflictError("Este e-mail já foi cadastrado.", "email");
      }
      throw new ConflictError("Este CPF já foi cadastrado.", "cpf");
    }
    throw error;
  }
}

/** Lista os clientes cadastrados (mais recentes primeiro). */
export function listClients() {
  return prisma.client.findMany({ orderBy: { createdAt: "desc" } });
}
