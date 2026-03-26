# Quick Reference Guide

## 🚀 Começar em 3 Minutos

### 1. Inicie Docker
```bash
docker-compose up --build
```

### 2. Acesse
- Frontend: http://localhost:3000
- API: http://localhost:3001/api
- Health: http://localhost:3001/api/health

### 3. Uso Imediato
Os dados de exemplo já estão carregados!

---

## 📍 Rotas Principais

| Página | URL | Descrição |
|--------|-----|-----------|
| Dashboard | / | Indicadores e curva ABC |
| Produtos | /produtos | CRUD de produtos |
| Estoque | /estoque | Visualização de estoque |
| Categorias | /categorias | CRUD de categorias |
| Movimentações | /movimentacoes | Registro de entradas/saídas |

---

## 🔗 Endpoints Principais

```bash
# Listar Produtos
GET /api/products?page=1&limit=10

# Criar Produto
POST /api/products
{nome, sku, estoque_inicial, categoria_id}

# Registrar Movimentação
POST /api/movements
{produto_id, tipo, quantidade}

# Registrar por Código de Barras
POST /api/movements/barcode/register
{sku}

# Obter Estatísticas
GET /api/products/stats/overview

# Curva ABC
GET /api/movements/abc-curve
```

---

## 📂 Estrutura Chave

```
Backend:    Container (Node.js + Express)
Frontend:   Container (React)
Database:   Container (PostgreSQL)
```

---

## ⚙️ Operações Úteis

### Parar
```bash
docker-compose stop
```

### Reiniciar
```bash
docker-compose start
```

### Remover (com dados)
```bash
docker-compose down -v
```

### Logs
```bash
docker-compose logs -f backend
```

### Banco de Dados
```bash
docker-compose exec db psql -U inventory_user -d inventory_db
```

---

## 🎨 Dados de Exemplo

**5 Categorias:**
- Eletrônicos
- Alimentos  
- Vestuário
- Higiene e Limpeza
- Móveis

**10 Produtos com Estoque Variado**

**Histórico de Movimentações**

---

## 📖 Documentação

- **README.md** - Documentação geral
- **QUICKSTART.md** - Início rápido  
- **API_DOCUMENTATION.md** - Endpoints
- **ARCHITECTURE.md** - Design
- **DEVELOPER_GUIDE.md** - Desenvolvedor
- **POST_INSTALLATION.md** - Verificação

---

## 🆘 Problemas?

1. **Porta em uso:** Mude em `.env`
2. **Banco não conecta:** `docker-compose restart db`
3. **Dependências:** `docker-compose build --no-cache`

---

## ✨ Features

✅ Dashboard em tempo real
✅ CRUD Completo
✅ Curva ABC
✅ Código de barras
✅ Paginação
✅ Filtros avançados
✅ Validação completa
✅ Docker pronto
✅ Responsivo
✅ Documentado

---

## 🤝 Status

**Projeto Completo e Funcional ✓**

Pronto para ambiente de produção após:
- Configurar variáveis de produção
- Adicionar HTTPS
- Backup automático

---

**Para detalhes, consulte os arquivos .md correspondentes**
