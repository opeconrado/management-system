# Guia de Arquitetura

## 🏗️ Visão Geral da Arquitetura

O sistema de gerenciamento de estoque foi construído usando uma arquitetura modular em 3 camadas, com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────┐
│             Frontend (React 18)                 │
│  ├── Components (reutilizáveis)                │
│  ├── Pages (telas da aplicação)                │
│  ├── Services (chamadas à API)                 │
│  └── Hooks (lógica customizada)                │
└─────────────────────────────────────────────────┘
                        ↓
                  HTTP/REST API
                        ↓
┌─────────────────────────────────────────────────┐
│           Backend (Node.js + Express)          │
│  ├── Controllers (requisições HTTP)            │
│  ├── Services (lógica de negócio)             │
│  ├── Repositories (acesso a dados)           │
│  └── Middlewares (processamento)              │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│          Database (PostgreSQL)                 │
│  ├── categorias                                │
│  ├── produtos                                  │
│  └── movimentacoes                             │
└─────────────────────────────────────────────────┘
```

## 🎯 Padrões de Design Utilizados

### 1. **Model-View-Controller (MVC)**
- Controllers lidam com rotas HTTP
- Services lidam com lógica de negócio
- Repositories lidam com acesso a dados

### 2. **Repository Pattern**
Cada entidade tem um repositório que encapsula a lógica de acesso aos dados:
- CategoryRepository
- ProductRepository
- MovementRepository

### 3. **Service Layer Pattern**
Cada repositório tem um serviço correspondente que encapsula a lógica de negócio:
- CategoryService
- ProductService
- MovementService

### 4. **Middleware Pattern**
Middlewares Express para:
- Tratamento de erros
- Validação de dados
- CORS

## 📂 Estrutura de Diretórios Detalhada

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do pool PostgreSQL
│   │
│   ├── controllers/
│   │   ├── ProductController.js
│   │   ├── CategoryController.js
│   │   └── MovementController.js
│   │
│   ├── services/
│   │   ├── ProductService.js
│   │   ├── CategoryService.js
│   │   └── MovementService.js
│   │
│   ├── repositories/
│   │   ├── ProductRepository.js
│   │   ├── CategoryRepository.js
│   │   └── MovementRepository.js
│   │
│   ├── routes/
│   │   ├── products.js
│   │   ├── categories.js
│   │   └── movements.js
│   │
│   ├── middlewares/
│   │   └── errorHandler.js      # Tratamento centralizado de erros
│   │
│   ├── utils/
│   │   ├── validators.js        # Validadores de entrada
│   │   └── errors.js            # Classes de erro customizadas
│   │
│   └── index.js                 # Entry point
│
├── package.json
├── Dockerfile
└── .env.example
```

### Frontend Structure

```
frontend/
├── public/
│   └── index.html               # HTML base
│
├── src/
│   ├── components/
│   │   ├── Navbar.js            # Barra de navegação
│   │   └── Navbar.css
│   │
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── Products.js
│   │   ├── Products.css
│   │   ├── Stock.js
│   │   ├── Stock.css
│   │   ├── Categories.js
│   │   ├── Categories.css
│   │   ├── Movements.js
│   │   └── Movements.css
│   │
│   ├── services/
│   │   └── api.js               # Cliente HTTP (Axios)
│   │
│   ├── hooks/
│   │   └── useFetchCategories.js # Custom hook exemplo
│   │
│   ├── context/                 # Context API (estrutura)
│   ├── utils/                   # Funções utilitárias
│   │
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
│
├── package.json
├── Dockerfile
└── .env.example
```

## 🔄 Fluxo de Dados

### Exemplo: Criar um Produto

```
Frontend                          Backend                          Database
    │                              │                                  │
    │─────────POST /api/products───→│                                │
    │   {nome, sku, estoque, ...}    │                                │
    │                              │                                  │
    │                      ProductController.create()              │
    │                              │                                │
    │                      ProductService.createProduct()         │
    │                              │                                  │
    │                      Validações                              │
    │                              │                                  │
    │                      CategoryRepository.findById()           │
    │                              │───────SELECT category───→───│
    │                              │←──────┘                     │
    │                              │                                  │
    │                      ProductRepository.create()             │
    │                              │───────INSERT product────→───│
    │                              │←──────id                    │
    │                              │                                  │
    │                      MovementRepository.create()            │
    │                              │───────INSERT movement────→──│
    │                              │←──────┘                     │
    │                              │                                  │
    │←────── {product} 201 ────────│
    │
```

## 🗄️ Modelo de Dados

### Relacionamentos

```
┌─────────────┐
│  categorias │
│─────────────│
│ id (PK)     │
│ nome        │
│ descricao   │
└─────────────┘
       ↑ (1)
       │
       │ (N)
       │
┌─────────────────────┐
│     produtos        │
│─────────────────────│
│ id (PK)             │
│ nome                │
│ sku (UNIQUE)        │
│ estoque_atual       │
│ estoque_minimo      │
│ categoria_id (FK)   │
│ imagem_url          │
└─────────────────────┘
       ↑ (1)
       │
       │ (N)
       │
┌──────────────────────┐
│  movimentacoes       │
│──────────────────────│
│ id (PK)              │
│ produto_id (FK)      │
│ tipo (entrada/saída) │
│ quantidade           │
│ data                 │
└──────────────────────┘
```

## 🔐 Fluxo de Validação

### Validações em Frontend
- Campos obrigatórios
- Formatação de entrada
- Feedback visual imediato

### Validações em Backend
- Duplicidade de SKU
- Referência de categoria válida
- Estoque insuficiente para saída
- Tipo de movimentação válido

```javascript
// Exemplo: Fluxo de validação de produto
1. Frontend valida local
   ✓ Nome preenchido
   ✓ SKU preenchido
   ✓ Estoque inicial >= 0
   
2. Envia requisição

3. Backend valida entrada
   ✓ SKU não existe
   ✓ Categoria existe
   ✓ Estoque inicial >= 0
   
4. Retorna erro ou sucesso
```

## 🔀 Fluxo de Tratamento de Erros

```
Requisição HTTP
     ↓
Route Handler
     ↓
Controller (try-catch)
     ↓
Service (validações)
     ↓
Repository (operações BD)
     ↓
✗ Erro? Throw AppError
     ↓
Controller catch → next(error)
     ↓
errorHandler Middleware
     ↓
Resposta JSON de erro
```

## 📡 Comunicação Entre Componentes

### Frontend → Backend

```javascript
// api.js (serviço centralizado)
export const productService = {
  getAll: (page, limit, filters) => {
    return api.get('/products', { params: { page, limit, ...filters } })
  }
}

// Uso em componente
const response = await productService.getAll(1, 10, {search: 'mouse'})
```

## 🌐 Configuração de CORS

```javascript
// Backend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : '*',
  credentials: true,
}));
```

## 🐳 Orquestração Docker

```yaml
Serviços:
├── db (PostgreSQL)
│   └── postgres_data (volume persistente)
│
├── backend (Node.js)
│   ├── Depende de: db
│   └── Monta: ./backend/src (hot reload)
│
└── frontend (React)
    └── Depende de: backend

Rede: inventory_network (ponte)
```

## ⚡ Performance

### Índices de Banco de Dados
```sql
CREATE INDEX idx_produtos_categoria_id ON produtos(categoria_id);
CREATE INDEX idx_produtos_sku ON produtos(sku);
CREATE INDEX idx_movimentacoes_produto_id ON movimentacoes(produto_id);
CREATE INDEX idx_movimentacoes_data ON movimentacoes(data);
CREATE INDEX idx_movimentacoes_tipo ON movimentacoes(tipo);
```

### Paginação
- Implementada no backend
- Limite de 10 itens por página por padrão
- Query otimizada com COUNT de total

## 🔮 Escalabilidade Futura

### Melhorias Sugeridas
1. **Cache com Redis**
   - Cache de categorias
   - Cache de produtos por categoria

2. **Autenticação JWT**
   - Middleware de autenticação
   - Refresh tokens

3. **Autorização por Roles**
   - Admin
   - Gerente de Estoque
   - Operador

4. **Auditoria**
   - Log de todas as movimentações
   - Histórico de alterações

5. **Testes**
   - Testes unitários (Jest)
   - Testes de integração
   - Testes E2E (Cypress)

6. **CI/CD**
   - GitHub Actions
   - Testes automatizados
   - Deploy automático

## 📚 Padrões de Código

### Nomeação
- Variáveis: camelCase
- Classes/Componentes: PascalCase
- Constantes: UPPER_SNAKE_CASE
- Funções: camelCase

### Funções de Serviço
- Sempre retornam Promise (async)
- Lançam error via throw
- Nomeadas verbalmente (get, create, update, delete)

### Componentes React
- Functional components
- Hooks (useState, useEffect)
- Props bem tipificadas
- Lógica separada em custom hooks

---

**Esta arquitetura foi projetada para ser escalável, testável e fácil de manter.**
