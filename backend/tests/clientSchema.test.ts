import { describe, it, expect } from "vitest";
import { createClientSchema } from "../src/validation/clientSchema.js";

const validInput = {
  fullName: "  John Doe  ",
  cpf: "529.982.247-25",
  email: "JOHN@Example.com ",
  favoriteColor: "azul",
  notes: "  cliente vip  ",
};

describe("createClientSchema", () => {
  it("normaliza os dados de entrada", () => {
    const parsed = createClientSchema.parse(validInput);
    expect(parsed.fullName).toBe("John Doe");
    expect(parsed.cpf).toBe("52998224725");
    expect(parsed.email).toBe("john@example.com");
    expect(parsed.notes).toBe("cliente vip");
  });

  it("trata observações vazias como ausentes", () => {
    const parsed = createClientSchema.parse({ ...validInput, notes: "" });
    expect(parsed.notes).toBeUndefined();
  });

  it("rejeita cor fora da lista permitida", () => {
    const result = createClientSchema.safeParse({
      ...validInput,
      favoriteColor: "rosa",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita CPF inválido", () => {
    const result = createClientSchema.safeParse({
      ...validInput,
      cpf: "111.111.111-11",
    });
    expect(result.success).toBe(false);
  });
});
