// Valor fictício só para satisfazer a validação de env em app.ts.
// Os testes de rota mockam a camada de service, então nenhum acesso real
// ao banco acontece aqui.
process.env.DATABASE_URL ??= "postgresql://user:pass@localhost:5432/test";
