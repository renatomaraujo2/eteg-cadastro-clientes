import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mockamos a camada de service para testar rota + validação sem tocar no banco.
vi.mock("../src/services/clientService.js", () => ({
  createClient: vi.fn(),
  listClients: vi.fn(),
}));

import { createApp } from "../src/app.js";
import { createClient } from "../src/services/clientService.js";
import { ConflictError } from "../src/errors.js";

const app = createApp();

const validPayload = {
  fullName: "John Doe",
  cpf: "529.982.247-25",
  email: "john@example.com",
  favoriteColor: "azul",
  notes: "cliente vip",
};

describe("POST /api/clients", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
  });

  it("cria o cliente e responde 201", async () => {
    vi.mocked(createClient).mockResolvedValue({ id: "abc", ...validPayload } as never);

    const res = await request(app).post("/api/clients").send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBe("abc");
    // O service recebe o CPF já normalizado (só dígitos).
    expect(vi.mocked(createClient).mock.calls[0][0].cpf).toBe("52998224725");
  });

  it("responde 400 quando os dados são inválidos", async () => {
    const res = await request(app)
      .post("/api/clients")
      .send({ ...validPayload, cpf: "111.111.111-11" });

    expect(res.status).toBe(400);
    expect(res.body.errors.cpf).toBeDefined();
    expect(createClient).not.toHaveBeenCalled();
  });

  it("responde 409 quando o CPF já existe", async () => {
    vi.mocked(createClient).mockRejectedValue(
      new ConflictError("Este CPF já foi cadastrado.", "cpf"),
    );

    const res = await request(app).post("/api/clients").send(validPayload);

    expect(res.status).toBe(409);
    expect(res.body.errors.cpf).toBeDefined();
  });
});

describe("GET /api/colors", () => {
  it("retorna a lista de cores disponíveis", async () => {
    const res = await request(app).get("/api/colors");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("value");
  });
});
