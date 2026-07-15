# Cadastro de clientes

Aplicação web para cadastro de clientes, construída a partir do case do John Doe:
um formulário simples onde ele registra os dados de cada cliente e os salva em um
banco PostgreSQL.

Cada cliente coleta: **nome completo, CPF, e-mail, cor preferida** (entre as cores
do arco-íris) e **observações**. O CPF e o e-mail são únicos, garantindo que cada
pessoa se cadastre uma única vez, e ao enviar o formulário o usuário recebe um
retorno claro de sucesso ou erro.

## Stack

| Camada    | Tecnologias                                             |
| --------- | ------------------------------------------------------- |
| Front-end | React + TypeScript, Vite, React Hook Form, Zod          |
| Back-end  | Node.js + TypeScript, Express, Prisma, Zod              |
| Banco     | PostgreSQL                                              |
| Infra     | Docker + Docker Compose (build multi-stage, Nginx)      |

## Estrutura do repositório

```
.
├── backend/          # API REST (Node + Express + Prisma)
│   ├── prisma/       # schema e migrations
│   ├── src/          # código-fonte
│   └── tests/        # testes (Vitest)
├── frontend/         # SPA React (Vite)
│   └── src/
├── docs/             # decisões de arquitetura (ADRs)
└── docker-compose.yml
```

## Como rodar

### Com Docker (recomendado)

Requer Docker e Docker Compose. Na raiz do projeto:

```bash
docker compose up --build
```

Isso sobe três serviços: banco, API e front. As migrations são aplicadas
automaticamente na subida da API. Ao final, o formulário fica disponível em:

```
http://localhost:8080
```

As variáveis têm valores padrão; para customizar, copie `.env.example` para `.env`.
O Postgres é publicado no host em `POSTGRES_PORT` (padrão `5432`), permitindo
inspecionar o banco por um cliente externo (Beekeeper, DBeaver, psql).

### Ambiente de desenvolvimento (sem Docker)

Requer Node 20+ e um PostgreSQL acessível.

**Backend**

```bash
cd backend
cp .env.example .env         # ajuste a DATABASE_URL se necessário
npm install
npm run migrate:dev          # cria as tabelas
npm run dev                  # API em http://localhost:3001
```

**Frontend** (em outro terminal)

```bash
cd frontend
npm install
npm run dev                  # front em http://localhost:5173
```

O Vite faz proxy de `/api` para a API, então basta abrir `http://localhost:5173`.

## API

| Método | Rota           | Descrição                                  |
| ------ | -------------- | ------------------------------------------ |
| GET    | `/api/health`  | Healthcheck                                |
| GET    | `/api/colors`  | Lista as cores disponíveis                 |
| POST   | `/api/clients` | Cadastra um cliente                        |
| GET    | `/api/clients` | Lista os clientes cadastrados              |

**Exemplo de cadastro**

```bash
curl -X POST http://localhost:8080/api/clients \
  -H 'Content-Type: application/json' \
  -d '{
    "fullName": "John Doe",
    "cpf": "529.982.247-25",
    "email": "john@example.com",
    "favoriteColor": "azul",
    "notes": "cliente vip"
  }'
```

Respostas:

- `201` — cadastro criado;
- `400` — dados inválidos (retorna os erros por campo);
- `409` — CPF ou e-mail já cadastrado.

## Testes

```bash
cd backend
npm test
```

Cobrem a validação de CPF, a normalização do schema de entrada e o comportamento
das rotas (status codes, validação e conflito), com a camada de acesso a dados
mockada — não é necessário um banco para rodá-los.

## Decisões de projeto

Alguns pontos foram pensados olhando o enunciado ("a lista de cores pode mudar",
"o projeto vai continuar com outra equipe"):

- **Cores centralizadas + endpoint `/api/colors`.** As opções ficam em um único
  arquivo de configuração no backend e são servidas para o front, então
  adicionar/remover uma cor é uma alteração de uma linha, sem duplicação.
- **Unicidade garantida no banco.** CPF e e-mail têm constraint única; o serviço
  traduz a violação em um erro de negócio com o campo afetado, sem `SELECT` prévio
  (que abriria brecha para condição de corrida).
- **Validação em duas pontas.** O front valida para dar feedback imediato; o
  backend valida de novo e é a fonte de verdade.

As decisões mais relevantes e os trade-offs estão registrados em [`docs/`](./docs).
