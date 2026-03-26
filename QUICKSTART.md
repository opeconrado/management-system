# Guia Rápido de Inicialização

## ⚡ Início Rápido com Docker

### Pré-requisitos
- Docker e Docker Compose instalados
- Porta 3000, 3001 e 5432 disponíveis

### Passo 1: Clone o repositório

\`\`\`bash
git clone <url-do-repositorio>
cd management-system
\`\`\`

### Passo 2: Crie o arquivo .env

\`\`\`bash
cp .env.example .env
\`\`\`

Você pode editar o arquivo `.env` se desejar alterar as configurações padrão.

### Passo 3: Inicie os containers

\`\`\`bash
docker-compose up --build
\`\`\`

Na primeira execução, Docker:
1. Construirá as imagens do frontend e backend
2. Criará e iniciará os containers
3. Executará o script de inicialização do banco de dados
4. Populará o banco com dados de exemplo

### Passo 4: Acesse a aplicação

Abra seu navegador e acesse:

- **Dashboard:** http://localhost:3000
- **API Health Check:** http://localhost:3001/api/health

## 📊 Dados de Exemplo

Ao iniciar o banco de dados, os dados de exemplo incluem:

**Categorias:**
- Eletrônicos
- Alimentos
- Vestuário
- Higiene e Limpeza
- Móveis

**Produtos:**
- Mouse óptico USB (45 unidades)
- Teclado mecânico (3 unidades - ESTOQUE BAIXO)
- Monitor 24" (8 unidades)
- Café Premium (150 unidades)
- Açúcar cristal (0 unidades - ESTOQUE ZERADO)
- E mais...

## 🛑 Parar a Aplicação

\`\`\`bash
docker-compose down
\`\`\`

Para remover também os volumes de dados:

\`\`\`bash
docker-compose down -v
\`\`\`

## 🔍 Troubleshooting

### Porta já está em uso

Se receber erro que a porta está em uso, você pode:

1. Mudar a porta no arquivo `.env`
2. Ou fechar a aplicação que está usando a porta

### Banco de dados não conecta

Verifique se o container do banco de dados foi iniciado:

\`\`\`bash
docker-compose ps
\`\`\`

Se não estiver rodando, reinicie:

\`\`\`bash
docker-compose restart db
\`\`\`

### Problemas de permissão

Se receber erro de permissão ao usar docker-compose, adicione seu usuário ao grupo docker:

\`\`\`bash
sudo usermod -aG docker $USER
\`\`\`

## 📝 Variáveis de Ambiente

Você pode personalizar a seguinte configuração no arquivo `.env`:

```
NODE_ENV=development           # Ambiente de execução
DB_USER=inventory_user         # Usuário do banco
DB_PASSWORD=inventory_password # Senha do banco
DB_NAME=inventory_db          # Nome do banco
PORT=3001                     # Porta do backend
REACT_APP_API_URL=http://localhost:3001/api  # URL da API
```

## 🐛 Logs

Para ver os logs em tempo real:

\`\`\`bash
docker-compose logs -f
\`\`\`

Para ver logs de um serviço específico:

\`\`\`bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
\`\`\`

## 💾 Backup do Banco de Dados

Para fazer backup:

\`\`\`bash
docker-compose exec db pg_dump -U inventory_user inventory_db > backup.sql
\`\`\`

Para restaurar:

\`\`\`bash
docker-compose exec -T db psql -U inventory_user inventory_db < backup.sql
\`\`\`

## 🔄 Reinicializar o Banco

Para resetar o banco de dados e preencher com dados de exemplo novamente:

\`\`\`bash
docker-compose down -v
docker-compose up
\`\`\`

---

Para mais informações, consulte o README.md
