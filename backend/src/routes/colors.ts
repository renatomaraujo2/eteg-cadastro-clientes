import { Router } from "express";
import { AVAILABLE_COLORS } from "../config/colors.js";

export const colorsRouter = Router();

// O front consome esta rota para montar as opções de cor, de modo que a
// lista de cores viva num único lugar (backend) e não precise ser duplicada.
colorsRouter.get("/", (_req, res) => {
  res.json(AVAILABLE_COLORS);
});
