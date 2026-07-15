/**
 * Cores disponíveis para o campo "cor preferida".
 *
 * O cliente pediu as cores do arco-íris, mas deixou claro que a lista pode
 * mudar no futuro. Por isso mantemos as opções centralizadas aqui: adicionar,
 * remover ou renomear uma cor é uma alteração de uma linha, e tanto a API
 * (validação) quanto o front-end (via GET /api/colors) passam a refletir a
 * mudança sem tocar em mais nada.
 */
export interface ColorOption {
  /** Identificador estável, salvo no banco. */
  value: string;
  /** Rótulo exibido ao usuário. */
  label: string;
  /** Cor em hexadecimal, útil para o front mostrar uma amostra. */
  hex: string;
}

export const AVAILABLE_COLORS: ColorOption[] = [
  { value: "vermelho", label: "Vermelho", hex: "#e53935" },
  { value: "laranja", label: "Laranja", hex: "#fb8c00" },
  { value: "amarelo", label: "Amarelo", hex: "#fdd835" },
  { value: "verde", label: "Verde", hex: "#43a047" },
  { value: "azul", label: "Azul", hex: "#1e88e5" },
  { value: "anil", label: "Anil", hex: "#3949ab" },
  { value: "violeta", label: "Violeta", hex: "#8e24aa" },
];

export const COLOR_VALUES = AVAILABLE_COLORS.map((c) => c.value);
