# NLW Agents 2025 - Server

API backend desenvolvida durante o evento NLW (Next Level Week) 2025, focada em gerenciamento de salas com arquitetura moderna e tecnologias de ponta.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Fastify** - Framework web rápido e eficiente
- **Zod** - Validação de esquemas e tipos TypeScript

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional
- **pgvector** - Extensão PostgreSQL para operações com vetores
- **Drizzle ORM** - ORM moderno e type-safe
- **Drizzle Kit** - CLI para migrações e utilitários

### Desenvolvimento e Qualidade
- **Biome** - Linter e formatador de código
- **Ultracite** - Configuração compartilhada para Biome
- **Docker & Docker Compose** - Containerização

## 📋 Pré-requisitos

- **Node.js** v20 ou superior
- **Docker** e **Docker Compose**
- **pnpm**, **npm** ou **yarn**

## 🛠️ Configuração e Setup

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd nlw-agents-2025-server
```

### 2. Instale as dependências
```bash
npm install
# ou
pnpm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3333
DATABASE_URL=postgres://docker:docker@localhost:5433/agents
```

### 4. Inicie o banco de dados
```bash
docker-compose up -d
```

### 5. Execute as migrações do banco
```bash
npx drizzle-kit migrate
```

### 6. (Opcional) Execute o seed do banco
```bash
npm run seed
```

### 7. Inicie o servidor em modo de desenvolvimento
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`

## 📚 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento com hot reload
- `npm start` - Inicia o servidor em modo de produção
- `npm run seed` - Executa o seed do banco de dados

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL com a extensão pgvector, executando em container Docker na porta `5433`.

### Estrutura do Banco
- **rooms** - Tabela para gerenciamento de salas
  - `id` (UUID, Primary Key)
  - `name` (Text, Not Null)
  - `description` (Text, Nullable)
  - `created_at` (Timestamp, Default Now)

## 🛣️ Rotas da API

### Health Check
- `GET /health` - Verifica se a API está funcionando

### Salas
- `GET /rooms` - Lista todas as salas ordenadas por data de criação

## 🐳 Docker

O projeto inclui configuração Docker Compose para o banco PostgreSQL:
- **Imagem**: pgvector/pgvector:pg17
- **Porta**: 5433 (host) → 5432 (container)
- **Credenciais**:
  - Usuário: docker
  - Senha: docker
  - Database: agents

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
src/
├── db/                     # Configurações do banco de dados
│   ├── connections.ts      # Conexão com o banco
│   ├── seed.ts            # Script de seed
│   ├── migrations/        # Migrações do Drizzle
│   └── schema/            # Esquemas das tabelas
├── http/                  # Rotas HTTP
│   └── routes/           # Definição das rotas
├── env.ts                # Configuração de variáveis de ambiente
└── server.ts             # Configuração principal do servidor
```

### Recursos Utilizados
- **TypeScript nativo** com `--experimental-strip-types`
- **CORS** configurado para `http://localhost:5173`
- **Validação automática** com Zod e Fastify Type Provider
- **Hot reload** em desenvolvimento

## 📄 Licença

Este projeto foi desenvolvido durante o evento NLW 2025.
