import { Router } from "express";
import { ZodError } from "zod";
import { createClientSchema } from "../validation/clientSchema.js";
import { createClient, listClients } from "../services/clientService.js";
import { ConflictError } from "../errors.js";

export const clientsRouter = Router();

clientsRouter.post("/", async (req, res, next) => {
  try {
    const input = createClientSchema.parse(req.body);
    const client = await createClient(input);
    res.status(201).json(client);
  } catch (error) {
    // Erro de validação -> 400 com os erros por campo, para o front destacar.
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Dados inválidos.",
        errors: error.flatten().fieldErrors,
      });
      return;
    }
    // CPF/e-mail duplicado -> 409.
    if (error instanceof ConflictError) {
      res.status(409).json({
        message: error.message,
        errors: { [error.field]: [error.message] },
      });
      return;
    }
    next(error);
  }
});

clientsRouter.get("/", async (_req, res, next) => {
  try {
    res.json(await listClients());
  } catch (error) {
    next(error);
  }
});
