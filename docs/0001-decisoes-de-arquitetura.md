# ADR 0001 — Decisões de arquitetura

Registro curto das principais decisões técnicas e seus porquês. A ideia é que a
próxima equipe entenda o "porquê" e não só o "o quê".

## Contexto

Formulário de cadastro de clientes com persistência em PostgreSQL. Requisitos
obrigatórios: TypeScript, React e Node.js, tudo em um único repositório, com
deploy via Docker. O cliente sinalizou que (a) a lista de cores pode mudar e
(b) o projeto seguirá com outra equipe.

## Decisões

### 1. Monorepo com `backend/` e `frontend/` separados

Um repositório, duas aplicações independentes, cada uma com seu `package.json` e
seu `Dockerfile`. Simples de navegar e de conteinerizar.

*Trade-off:* a regra de validação (CPF/schema) hoje está duplicada entre front e
back. O próximo passo natural é extrair um pacote compartilhado (workspaces).
Optei por não fazer isso agora para não acoplar os builds/deploys neste primeiro
momento — a validação do backend é a fonte de verdade.

### 2. Prisma como ORM

Type-safety de ponta a ponta com o TypeScript, migrations versionadas (importante
para outra equipe assumir) e um schema legível como documentação do modelo.

### 3. Cores em configuração + endpoint `/api/colors`

O enunciado diz que as cores podem mudar. Em vez de "hard-coded" no front,
mantenho as opções num único módulo no backend, expostas por uma rota que o front
consome. Adicionar uma cor é trivial e não há divergência entre as camadas.

*Alternativa considerada:* uma tabela `colors` no banco, editável em runtime. Ficou
como evolução futura — traz valor de verdade só com uma tela de administração, que
está fora do escopo atual.

### 4. Unicidade no banco, sem checagem prévia

CPF e e-mail têm constraint `UNIQUE`. O serviço tenta inserir e traduz a violação
(`P2002` do Prisma) para um erro de negócio. Evita o padrão "consulta e depois
insere", que tem condição de corrida. Ao detectar o conflito, consulta quais campos
já existem e retorna **todos** de uma vez (CPF e e-mail juntos, quando é o caso),
para o usuário corrigir tudo em uma única tentativa.

### 5. Validação nas duas pontas com Zod

O front valida para dar retorno imediato ao usuário; o backend valida de novo e é
a autoridade final. O mesmo Zod normaliza os dados (trim, lowercase no e-mail,
CPF só com dígitos), então o resto do código recebe dados já limpos.

### 6. Docker: multi-stage + Nginx servindo o front

Imagens enxutas (build separado do runtime). O Nginx serve os estáticos do React
e faz proxy de `/api` para o container da API — o navegador fala só com uma
origem, o que evita CORS em produção. As migrations rodam no entrypoint da API.

### 7. Tela de listagem de clientes (fora do escopo inicial)

O enunciado pede apenas o cadastro. Ainda assim, adicionei uma tela de **listagem
dos clientes** (`/clientes`) como um *plus*: ao usar o formulário, ficou evidente a
necessidade de conseguir **conferir o que já foi cadastrado** — sem isso, não há
como validar o próprio cadastro nem ter visão dos dados. A API já expunha
`GET /api/clients`, então o custo foi baixo e o valor, alto.

Isso motivou introduzir o **`react-router`** e organizar o front em páginas
(`CadastroPage`, `ClientesPage`) sob uma casca com navegação. Passamos de uma tela
para duas, com rotas de verdade (`/` e `/clientes`) — e o fallback de SPA no Nginx
(`try_files ... /index.html`) garante que acessar/recarregar `/clientes` direto
funcione.

*Trade-off:* a listagem hoje traz **todos** os registros de uma vez. Com volume,
o passo seguinte é paginação/busca — deixei fora agora para não adicionar
complexidade sem necessidade real.
