# Sistema de Gerenciamento de Estoque

Um sistema completo de gerenciamento de estoque desenvolvido com tecnologias modernas, seguindo boas práticas de arquitetura e proporcionando uma experiência de usuário intuitiva.

## 🚀 Funcionalidades

### Dashboard
- Indicadores de estoque (total de produtos, total em estoque, produtos com estoque baixo, produtos zerados)
- Curva ABC baseada em movimentações
- Listagem de produtos com estoque baixo
- Listagem de produtos com estoque zerado

### Gerenciamento de Produtos
- CRUD completo de produtos
- Código SKU único por produto
- Categoria de produtos
- Estoque inicial, atual e mínimo
- Upload de imagem (estrutura pronta)

### Controle de Estoque
- Visualização em tempo real
- Filtros por categoria e status
- Ordenação por quantidade
- Indicadores visuais de status

### Movimentações
- Registro de entrada e saída de produtos
- Histórico completo de movimentações
- Leitura de código de barras
- Filtros por tipo e período

### Gerenciamento de Categorias
- CRUD completo
- Validação para impedir deleção de categorias com produtos

## 🛠️ Tecnologias Utilizadas

**Backend:**
- Node.js com Express
- PostgreSQL
- Arquitetura em camadas (Controllers, Services, Repositories)

**Frontend:**
- React 18
- React Router
- Axios
- CSS3

**Infraestrutura:**
- Docker
- Docker Compose
- PostgreSQL 15

## 📋 Requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Git

## 🚀 Como Começar

### 1. Clone o repositório

\`\`\`bash
git clone <url-do-repositorio>
cd management-system
\`\`\`

### 2. Configure as variáveis de ambiente

\`\`\`bash
cp .env.example .env
\`\`\`

Edit o arquivo `.env` com suas configurações (se necessário).

### 3. Inicie com Docker

\`\`\`bash
docker-compose up --build
\`\`\`

A aplicação estará disponível em:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Banco de Dados:** localhost:5432

### 4. Verificar a saúde da aplicação

\`\`\`bash
curl http://localhost:3001/api/health
\`\`\`

## 📂 Estrutura do Projeto

\`\`\`
management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações de banco de dados
│   │   ├── controllers/     # Controllers da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── repositories/    # Acesso a dados
│   │   ├── middlewares/     # Middlewares Express
│   │   ├── routes/          # Rotas da API
│   │   ├── utils/           # Funções utilitárias e validadores
│   │   └── index.js         # Entry point
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # Context API (estrutura pronta)
│   │   ├── utils/           # Funções utilitárias
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── database/
│   ├── init.sql             # Script de inicialização do banco
│   └── wait-for-it.sh       # Script para aguardar banco
│
├── docker-compose.yml       # Orquestração de containers
└── README.md
\`\`\`

## 🔌 API Endpoints

### Categorias
- \`GET /api/categories\` - Listar todas
- \`GET /api/categories/:id\` - Obter por ID
- \`POST /api/categories\` - Criar
- \`PUT /api/categories/:id\` - Atualizar
- \`DELETE /api/categories/:id\` - Deletar

### Produtos
- \`GET /api/products\` - Listar (com paginação e filtros)
- \`GET /api/products/:id\` - Obter por ID
- \`GET /api/products/stats/overview\` - Estatísticas de estoque
- \`GET /api/products/low-stock\` - Produtos com estoque baixo
- \`GET /api/products/zero-stock\` - Produtos com estoque zerado
- \`POST /api/products\` - Criar
- \`PUT /api/products/:id\` - Atualizar
- \`DELETE /api/products/:id\` - Deletar

### Movimentações
- \`GET /api/movements\` - Listar (com paginação e filtros)
- \`GET /api/movements/:id\` - Obter por ID
- \`GET /api/movements/abc-curve\` - Dados da Curva ABC
- \`GET /api/movements/by-date-range\` - Movimentações por período
- \`GET /api/movements/product/:produto_id/history\` - Histórico de produto
- \`POST /api/movements\` - Criar movimentação
- \`POST /api/movements/barcode/register\` - Registrar por código de barras

## 🗄️ Modelo de Dados

### categorias
- \`id\` (SERIAL PRIMARY KEY)
- \`nome\` (VARCHAR UNIQUE)
- \`descricao\` (TEXT)
- \`data_criacao\` (TIMESTAMP)
- \`data_atualizacao\` (TIMESTAMP)

### produtos
- \`id\` (SERIAL PRIMARY KEY)
- \`nome\` (VARCHAR)
- \`sku\` (VARCHAR UNIQUE)
- \`estoque_atual\` (INTEGER)
- \`estoque_minimo\` (INTEGER)
- \`categoria_id\` (INTEGER FK)
- \`imagem_url\` (TEXT)
- \`data_criacao\` (TIMESTAMP)
- \`data_atualizacao\` (TIMESTAMP)

### movimentacoes
- \`id\` (SERIAL PRIMARY KEY)
- \`produto_id\` (INTEGER FK)
- \`tipo\` (VARCHAR: 'entrada' | 'saída')
- \`quantidade\` (INTEGER)
- \`data\` (TIMESTAMP)

## 🔒 Validações

### Produtos
- SKU deve ser único
- Estoque inicial ≥ 0
- Categoria obrigatória
- Nome obrigatório

### Movimentações
- Não permitir saída maior que estoque atual
- Tipo deve ser 'entrada' ou 'saída'
- Quantidade deve ser > 0
- Produto deve existir

### Categorias
- Nome obrigatório e único
- Não permitir deleção de categorias com produtos

## 🧪 Desenvolvimento Local (sem Docker)

### Backend

\`\`\`bash
cd backend
cp .env.example .env
npm install
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

## 📝 Notas de Desenvolvimento

- O código segue princípios de Clean Code e SOLID
- Validação em frontend e backend
- Tratamento de erros centralizado
- Arquitetura em camadas para escalabilidade
- Índices de banco de dados otimizados

## 🎯 Melhorias Futuras

- Autenticação de usuários com JWT
- Controle de acesso por perfil
- Exportação de relatórios em PDF/Excel
- Tema claro/escuro
- Paginação server-side aprimorada
- Cache com Redis
- Testes automatizados
- CI/CD pipeline

## 📄 Licença

Projeto desenvolvido como exercício de engenharia de software.

## 👨‍💻 Autor

Desenvolvido como um exemplo de sistema completo de gerenciamento de estoque.

---

**Para dúvidas ou sugestões, abra uma issue no repositório.**
