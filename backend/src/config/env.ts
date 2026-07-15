/**
 * Leitura e validação das variáveis de ambiente na inicialização.
 * Falhar cedo (e com mensagem clara) é melhor do que quebrar em runtime.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: required("DATABASE_URL"),
  // Origem permitida pelo CORS. Em dev, o front do Vite roda em 5173.
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
