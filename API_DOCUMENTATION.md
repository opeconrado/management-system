# API Documentation

## Base URL
Development: `http://localhost:3001/api`

## Response Format

All responses are in JSON format.

### Success Response
```json
{
  "data": {},
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": {},
  "status": 400
}
```

## Endpoints

### Health Check
#### GET /health
Verifica se o servidor está funcionando.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## Categorias

### GET /categories
Lista todas as categorias.

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos em geral",
    "data_criacao": "2024-01-01T12:00:00.000Z",
    "data_atualizacao": "2024-01-01T12:00:00.000Z"
  }
]
```

### GET /categories/:id
Obtém uma categoria específica pelo ID.

**Parameters:**
- `id` (integer, required): ID da categoria

**Response:** (Single category object)

### POST /categories
Cria uma nova categoria.

**Request Body:**
```json
{
  "nome": "Nova Categoria",
  "descricao": "Descrição opcional"
}
```

**Response:** (Created category object with ID)

### PUT /categories/:id
Atualiza uma categoria existente.

**Parameters:**
- `id` (integer, required): ID da categoria

**Request Body:**
```json
{
  "nome": "Nome atualizado",
  "descricao": "Descrição atualizada"
}
```

**Response:** (Updated category object)

### DELETE /categories/:id
Deleta uma categoria.

**Parameters:**
- `id` (integer, required): ID da categoria

**Response:** Status 204 No Content

---

## Produtos

### GET /products
Lista produtos com paginação e filtros.

**Query Parameters:**
- `page` (integer, default: 1): Número da página
- `limit` (integer, default: 10): Itens por página
- `search` (string, optional): Busca por nome ou SKU
- `categoria_id` (integer, optional): Filtrar por categoria
- `status` (string, optional): 'normal', 'baixo', 'zerado'

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "Mouse óptico",
      "sku": "MOUSE-001",
      "estoque_atual": 45,
      "estoque_minimo": 10,
      "categoria_id": 1,
      "categoria_nome": "Eletrônicos",
      "imagem_url": null,
      "data_criacao": "2024-01-01T12:00:00.000Z",
      "data_atualizacao": "2024-01-01T12:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10
}
```

### GET /products/stats/overview
Obtém estatísticas de estoque.

**Response:**
```json
{
  "total_produtos": 10,
  "total_estoque": 500,
  "produtos_baixo": 2,
  "produtos_zerados": 1
}
```

### GET /products/low-stock
Lista produtos com estoque baixo.

**Response:** (Array of products)

### GET /products/zero-stock
Lista produtos com estoque zerado.

**Response:** (Array of products)

### GET /products/:id
Obtém um produto específico.

**Parameters:**
- `id` (integer, required): ID do produto

**Response:** (Single product object)

### POST /products
Cria um novo produto.

**Request Body:**
```json
{
  "nome": "Novo Produto",
  "sku": "PROD-001",
  "estoque_inicial": 50,
  "categoria_id": 1,
  "estoque_minimo": 10,
  "imagem_url": null
}
```

**Response:** (Created product object with ID)

### PUT /products/:id
Atualiza um produto.

**Parameters:**
- `id` (integer, required): ID do produto

**Request Body:** (Same as POST)

**Response:** (Updated product object)

### DELETE /products/:id
Deleta um produto.

**Parameters:**
- `id` (integer, required): ID do produto

**Response:** Status 204 No Content

---

## Movimentações

### GET /movements
Lista movimentações com paginação e filtros.

**Query Parameters:**
- `page` (integer, default: 1): Número da página
- `limit` (integer, default: 10): Itens por página
- `produto_id` (integer, optional): Filtrar por produto
- `tipo` (string, optional): 'entrada' ou 'saída'
- `data_inicio` (string, optional): Data inicial (ISO format)
- `data_fim` (string, optional): Data final (ISO format)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "produto_id": 1,
      "produto_nome": "Mouse óptico",
      "sku": "MOUSE-001",
      "categoria_nome": "Eletrônicos",
      "tipo": "entrada",
      "quantidade": 50,
      "data": "2024-01-01T12:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

### GET /movements/abc-curve
Obtém dados da Curva ABC.

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Produto A",
    "sku": "PROD-A",
    "total_movimentacoes": 100,
    "categoria": "A",
    "percentual": 45.50,
    "acumulado": 45.50
  }
]
```

### GET /movements/by-date-range
Lista movimentações por período.

**Query Parameters:**
- `data_inicio` (string, required): Data inicial (ISO format)
- `data_fim` (string, required): Data final (ISO format)

**Response:**
```json
[
  {
    "tipo": "entrada",
    "count": 50,
    "total_quantidade": 500
  },
  {
    "tipo": "saída",
    "count": 30,
    "total_quantidade": 300
  }
]
```

### GET /movements/product/:produto_id/history
Obtém histórico de movimentações de um produto.

**Parameters:**
- `produto_id` (integer, required): ID do produto

**Query Parameters:**
- `days` (integer, default: 30): Número de dias para retornar

**Response:** (Array of movements)

### GET /movements/:id
Obtém uma movimentação específica.

**Parameters:**
- `id` (integer, required): ID da movimentação

**Response:** (Single movement object)

### POST /movements
Cria uma movimentação.

**Request Body:**
```json
{
  "produto_id": 1,
  "tipo": "entrada",
  "quantidade": 50
}
```

**Response:** (Created movement object with ID)

**Errors:**
- 400: Estoque insuficiente para saída
- 404: Produto não encontrado
- 400: Tipo inválido

### POST /movements/barcode/register
Registra uma entrada de 1 unidade pelo código de barras.

**Request Body:**
```json
{
  "sku": "MOUSE-001"
}
```

**Response:** (Created movement object)

**Errors:**
- 404: Produto com SKU não encontrado

---

## Códigos de Erro

| Código | Significado |
|--------|-------------|
| 400 | Bad Request - Erro de validação |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno do servidor |

---

## Exemplos de Uso

### Criar um novo produto
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Produto",
    "sku": "NEW-001",
    "estoque_inicial": 100,
    "categoria_id": 1,
    "estoque_minimo": 20
  }'
```

### Listar produtos da categoria 1
```bash
curl "http://localhost:3001/api/products?categoria_id=1&page=1&limit=10"
```

### Registrar entrada de produto por código de barras
```bash
curl -X POST http://localhost:3001/api/movements/barcode/register \
  -H "Content-Type: application/json" \
  -d '{"sku": "MOUSE-001"}'
```

### Obter estatísticas de estoque
```bash
curl http://localhost:3001/api/products/stats/overview
```

---

**Última atualização:** Janeiro 2024
