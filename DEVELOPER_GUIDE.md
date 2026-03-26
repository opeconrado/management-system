# Guia do Desenvolvedor

## 🚀 Configuração de Desenvolvimento

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- Git
- VSCode ou editor preferido

### Instalação Inicial

#### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env` com suas configurações de banco de dados:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=inventory_db
```

#### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
```

Edit `.env` se necessário:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Executar em Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

A aplicação estará disponível em http://localhost:3000

## 📝 Convenções de Código

### JavaScript/Node.js

#### Estrutura de Arquivo de Serviço
```javascript
// Nome: ProductService.js
const ProductRepository = require('../repositories/ProductRepository');
const AppError = require('../utils/errors');

class ProductService {
  async getAllProducts(page = 1, limit = 10, filters = {}) {
    // Lógica do serviço
  }

  async getProductById(id) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }
    return product;
  }

  async createProduct(nome, sku, estoque_inicial, categoria_id) {
    // Validações
    // Lógica de criação
    // Retorna resultado
  }
}

module.exports = new ProductService();
```

#### Estrutura de Controller
```javascript
// Nome: ProductController.js
const ProductService = require('../services/ProductService');
const { validateProductInput } = require('../utils/validators');
const AppError = require('../utils/errors');

class ProductController {
  async create(req, res, next) {
    try {
      const { nome, sku, estoque_inicial, categoria_id } = req.body;
      
      const errors = validateProductInput({ nome, sku, estoque_inicial, categoria_id });
      if (errors.length > 0) {
        throw new AppError('Validação falhou', 400, { errors });
      }

      const product = await ProductService.createProduct(
        nome,
        sku,
        parseInt(estoque_inicial),
        parseInt(categoria_id)
      );
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
```

### React Components

#### Estrutura de Página
```javascript
import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAll();
      setProducts(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="products">
      {/* componentes */}
    </div>
  );
};

export default Products;
```

## 🧪 Adicionando uma Nova Feature

### Passo 1: Criar Model/Repository

```javascript
// repositories/NewFeatureRepository.js
class NewFeatureRepository {
  async findAll() {
    const result = await pool.query('SELECT * FROM nova_feature');
    return result.rows;
  }

  async create(data) {
    const result = await pool.query(
      'INSERT INTO nova_feature (campo1, campo2) VALUES ($1, $2) RETURNING *',
      [data.campo1, data.campo2]
    );
    return result.rows[0];
  }
}

module.exports = new NewFeatureRepository();
```

### Passo 2: Criar Service

```javascript
// services/NewFeatureService.js
class NewFeatureService {
  async getAll() {
    return await NewFeatureRepository.findAll();
  }

  async create(data) {
    // Validações
    return await NewFeatureRepository.create(data);
  }
}

module.exports = new NewFeatureService();
```

### Passo 3: Criar Controller

```javascript
// controllers/NewFeatureController.js
class NewFeatureController {
  async getAll(req, res, next) {
    try {
      const data = await NewFeatureService.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await NewFeatureService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NewFeatureController();
```

### Passo 4: Criar Routes

```javascript
// routes/newfeature.js
const express = require('express');
const router = express.Router();
const NewFeatureController = require('../controllers/NewFeatureController');

router.get('/', NewFeatureController.getAll.bind(NewFeatureController));
router.post('/', NewFeatureController.create.bind(NewFeatureController));

module.exports = router;
```

### Passo 5: Registrar Routes em index.js

```javascript
app.use('/api/newfeature', require('./routes/newfeature'));
```

### Passo 6: Criar Página React

```javascript
// pages/NewFeature.js
import React, { useState, useEffect } from 'react';
import { newFeatureService } from '../services/api';
import './NewFeature.css';

const NewFeature = () => {
  // Componente React
};

export default NewFeature;
```

### Passo 7: Adicionar Rota em App.js

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewFeature from './pages/NewFeature';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/newfeature" element={<NewFeature />} />
      </Routes>
    </Router>
  );
}
```

## 🐛 Debugging

### Backend

#### Usando debugger do Node.js
```bash
node --inspect src/index.js
```

Abra `chrome://inspect` no Chrome.

#### Logs
```javascript
console.log('Debug info:', variable);
console.error('Error occurred:', error);
```

### Frontend

#### React DevTools
Instale a extensão React DevTools no Chrome.

#### Console do Navegador
```javascript
console.log('Debug:', data);
console.table(arrayOfObjects);
```

## 📊 Testando Endpoints

### Usando cURL

```bash
# GET
curl http://localhost:3001/api/products

# POST
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"nome":"Novo","sku":"NEW-001","estoque_inicial":50,"categoria_id":1}'

# PUT
curl -X PUT http://localhost:3001/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Atualizado"}'

# DELETE
curl -X DELETE http://localhost:3001/api/products/1
```

### Usando Postman

1. Abra Postman
2. Crie uma nova solicitação
3. Configure o método HTTP (GET, POST, etc)
4. Digite a URL: `http://localhost:3001/api/products`
5. Configure headers e body se necessário
6. Clique em Send

## 🔍 Lint e Formatação

### Frontend com ESLint

```bash
cd frontend
npm install --save-dev eslint eslint-plugin-react
npx eslint src/
```

## 🚀 Build e Deploy

### Frontend Production

```bash
cd frontend
npm run build
```

Isso cria uma pasta `build/` pronta para produção.

### Backend com PM2

```bash
npm install -g pm2
pm2 start src/index.js --name "inventory-backend"
pm2 save
pm2 startup
```

## 📦 Dependências Principais

### Backend
- `express` - Framework web
- `pg` - Driver PostgreSQL
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Variáveis de ambiente

### Frontend
- `react` - Biblioteca UI
- `react-router-dom` - Roteamento
- `axios` - Cliente HTTP

## 🆘 Troubleshooting Comum

### Erro: "Cannot find module 'pg'"
```bash
cd backend
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Mude a porta em frontend/.env
# ou mate o processo usando a porta
lsof -i :3000
kill -9 <PID>
```

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando
- Verifique credentials em `.env`
- Verifique se banco de dados existe

### Erro: "CORS error"
- Verifique origem em CORS config
- Verifique URL da API em frontend

## 📚 Recursos Úteis

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
2. Commit suas mudanças: `git commit -am 'Adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

---

**Dúvidas? Consulte a documentação de arquitetura ou abra uma issue.**
