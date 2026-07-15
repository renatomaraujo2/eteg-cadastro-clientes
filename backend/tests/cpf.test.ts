import { describe, it, expect } from "vitest";
import { isValidCpf, onlyDigits } from "../src/validation/cpf.js";

describe("onlyDigits", () => {
  it("remove máscara e caracteres não numéricos", () => {
    expect(onlyDigits("529.982.247-25")).toBe("52998224725");
  });
});

describe("isValidCpf", () => {
  it("aceita CPF válido com e sem máscara", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejeita CPF com dígito verificador errado", () => {
    expect(isValidCpf("529.982.247-24")).toBe(false);
  });

  it("rejeita sequências repetidas", () => {
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("00000000000")).toBe(false);
  });

  it("rejeita CPF com tamanho incorreto", () => {
    expect(isValidCpf("123")).toBe(false);
    expect(isValidCpf("5299822472500")).toBe(false);
  });
});
