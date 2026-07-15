import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { clientsRouter } from "./routes/clients.js";
import { colorsRouter } from "./routes/colors.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  // Usado pelo healthcheck do Docker.
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/colors", colorsRouter);
  app.use("/api/clients", clientsRouter);

  // Handler de erro final: qualquer coisa não tratada vira 500, sem vazar
  // detalhes internos para o cliente.
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  });

  return app;
}
