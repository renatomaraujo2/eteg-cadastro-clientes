export interface ColorOption {
  value: string;
  label: string;
  hex: string;
}

/** Formato de erro retornado pela API (400/409). */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
