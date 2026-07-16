# Changelog

Mudanças relevantes deste projeto. O formato segue, de forma leve, o
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [1.0.0] - 2026-07-16

### Adicionado

- Formulário de cadastro de clientes (nome completo, CPF, e-mail, cor preferida e
  observações) com validação e feedback claro de sucesso/erro.
- API REST em Node/Express com Prisma e PostgreSQL.
- Unicidade de CPF e e-mail garantida por constraint no banco; conflitos de CPF e
  e-mail retornados **juntos** em uma única resposta `409`.
- Validação de CPF com dígitos verificadores e máscara no campo — o banco armazena
  apenas os dígitos.
- Cores do formulário servidas por `GET /api/colors`, centralizadas em configuração
  e facilmente extensíveis.
- Tela de listagem de clientes (`/clientes`) com navegação entre telas via React
  Router.
- Deploy com Docker Compose (banco + API + front via Nginx); migrations aplicadas
  automaticamente na subida da API.
- Portas configuráveis por variável de ambiente (`WEB_PORT`, `API_PORT`,
  `POSTGRES_PORT`).
- Testes automatizados do backend (validação de CPF, schema de entrada e rotas),
  que rodam sem necessidade de banco.

### Documentação

- `README.md` com instruções de uso e execução.
- `docs/0001-decisoes-de-arquitetura.md` (ADR) com as decisões e trade-offs.
