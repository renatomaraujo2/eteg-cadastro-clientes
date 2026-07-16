export interface ColorOption {
  value: string;
  label: string;
  hex: string;
}

/** Cliente retornado pela API. */
export interface Client {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  favoriteColor: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Formato de erro retornado pela API (400/409). */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
