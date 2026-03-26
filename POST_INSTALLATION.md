# Guia Pós-Instalação

## ✅ Verificação de Instalação

Após iniciar o Docker, verifique se tudo está funcionando:

### 1. Verificar Containers

```bash
docker-compose ps
```

Você deve ver 3 containers rodando:
- `inventory_db` - Database (PostgreSQL)
- `inventory_backend` - Backend (Node.js)
- `inventory_frontend` - Frontend (React)

### 2. Verificar Logs

```bash
# Todos os logs
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas banco de dados
docker-compose logs -f db
```

### 3. Testar Conectividade

#### Health Check do Backend
```bash
curl http://localhost:3001/api/health
```

Esperado:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### Listar Categorias
```bash
curl http://localhost:3001/api/categories
```

Você deve receber um JSON com as categorias de exemplo.

### 4. Acessar Interfaces

- **Frontend:** http://localhost:3000
- **API Base:** http://localhost:3001/api

### 5. Testar Funcionalidades

#### Dashboard
1. Acesse http://localhost:3000
2. Você deve ver indicadores com dados

#### Produtos
1. Clique em "Produtos" na navbar
2. Você deve ver a tabela com 10 produtos de exemplo
3. Teste criar um novo produto

#### Estoque
1. Clique em "Estoque" na navbar  
2. Você deve ver os produtos em cards

#### Categorias
1. Clique em "Categorias"
2. Você deve ver as 5 categorias de exemplo

#### Movimentações
1. Clique em "Movimentações"
2. Você deve ver o histórico de movimentações

---

## 🔧 Operações Úteis

### Resetar o Banco de Dados

Para apagar todos os dados e repopular com dados de exemplo:

```bash
docker-compose down -v
docker-compose up
```

### Fazer Backup do Banco

```bash
docker-compose exec db pg_dump -U inventory_user inventory_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar do Backup

```bash
docker-compose exec -T db psql -U inventory_user inventory_db < seu_backup.sql
```

### Acessar o Banco Diretamente

```bash
docker-compose exec db psql -U inventory_user -d inventory_db
```

Comandos úteis:
```sql
\dt                              -- Listar tabelas
SELECT * FROM categorias;        -- Ver categorias
SELECT * FROM produtos;          -- Ver produtos
SELECT * FROM movimentacoes;     -- Ver movimentações
\q                               -- Sair
```

### Parar Aplicação Mantendo Dados

```bash
docker-compose stop
```

### Reiniciar Aplicação

```bash
docker-compose start
```

### Remover Tudo (incluindo dados)

```bash
docker-compose down -v
```

---

## 📊 Dados de Exemplo

O sistema vem pré-carregado com:

### Categorias (5)
- Eletrônicos
- Alimentos
- Vestuário
- Higiene e Limpeza
- Móveis

### Produtos (10)
Cada produto tem uma quantidade diferente, alguns com estoque baixo e alguns zerados:

| Produto | SKU | Estoque | Status |
|---------|-----|---------|--------|
| Mouse óptico USB | MOUSE-001 | 45 | Normal |
| Teclado mecânico | TECLADO-001 | 3 | Baixo |
| Monitor 24" | MONITOR-024 | 8 | Normal |
| Café Premium 500g | CAFE-500 | 150 | Normal |
| Açúcar cristal 1kg | ACUCAR-1K | 0 | Zerado |
| Camiseta básica | CAMISETA-001 | 120 | Normal |
| Calça jeans | CALCA-001 | 45 | Normal |
| Sabonete líquido 250ml | SABONETE-250 | 200 | Normal |
| Detergente neutro 500ml | DETERGENTE-500 | 80 | Normal |
| Cadeira de escritório | CADEIRA-ESC | 12 | Normal |

### Movimentações
Cada produto tem um histórico de movimentações de entrada e saída.

---

## 🆘 Problemas Comuns

### Frontend não carrega

**Solução:**
1. Verifique se o container frontend está rodando
2. Verifique logs: `docker-compose logs frontend`
3. Verifique se a porta 3000 está livre
4. Tente refreshar a página

### Backend retorna erro 500

**Solução:**
1. Verifique logs: `docker-compose logs backend`
2. Verifique se o banco de dados está acessível
3. Tente reiniciar: `docker-compose restart backend`

### Banco de dados não inicia

**Solução:**
1. Tente remover volumes: `docker-compose down -v`
2. Inicie novamente: `docker-compose up`
3. Verifique porta 5432 se está livre

### Erro "Cannot find module"

**Solução:**
1. Remova containers: `docker-compose down`
2. Rebuild: `docker-compose build --no-cache`
3. Inicie: `docker-compose up`

### Alterações não aparecem

**Solução (desenvolvimento):**
1. O código está mapeado com volumes
2. Tente refresh da página (Ctrl+F5)
3. Reinicie o container: `docker-compose restart backend`

---

## 📈 Próximos Passos

1. **Familiarize-se com a interface**
   - Crie alguns produtos
   - Registre movimentações
   - Observe a curva ABC

2. **Teste a API**
   - Use Postman ou cURL
   - Consulte [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

3. **Customize o sistema**
   - Veja [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
   - Modifique cores, layouts, etc.

4. **Implante em produção**
   - Configure variáveis de ambiente
   - Use HTTPS
   - Configure backup automático

---

## 📚 Recursos Adicionais

- [README.md](README.md) - Visão geral do projeto
- [QUICKSTART.md](QUICKSTART.md) - Inicialização rápida
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentação de API
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura do sistema
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Guia para desenvolvedores

---

**Tudo pronto! Seu sistema de gerenciamento de estoque está rodando. 🎉**
