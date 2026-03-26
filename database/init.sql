-- Criar tabelas
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  estoque_atual INTEGER NOT NULL DEFAULT 0,
  estoque_minimo INTEGER NOT NULL DEFAULT 10,
  categoria_id INTEGER NOT NULL,
  imagem_url TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS movimentacoes (
  id SERIAL PRIMARY KEY,
  produto_id INTEGER NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saída')),
  quantidade INTEGER NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

-- Criar índices
CREATE INDEX idx_produtos_categoria_id ON produtos(categoria_id);
CREATE INDEX idx_produtos_sku ON produtos(sku);
CREATE INDEX idx_movimentacoes_produto_id ON movimentacoes(produto_id);
CREATE INDEX idx_movimentacoes_data ON movimentacoes(data);
CREATE INDEX idx_movimentacoes_tipo ON movimentacoes(tipo);

-- Inserir categorias de exemplo
INSERT INTO categorias (nome, descricao) VALUES
('Eletrônicos', 'Produtos eletrônicos em geral'),
('Alimentos', 'Alimentos e bebidas'),
('Vestuário', 'Roupas e acessórios'),
('Higiene e Limpeza', 'Produtos de higiene pessoal e limpeza'),
('Móveis', 'Móveis e decoração')
ON CONFLICT DO NOTHING;

-- Inserir produtos de exemplo
INSERT INTO produtos (nome, sku, estoque_atual, estoque_minimo, categoria_id) VALUES
('Mouse óptico USB', 'MOUSE-001', 45, 10, 1),
('Teclado mecânico', 'TECLADO-001', 3, 10, 1),
('Monitor 24"', 'MONITOR-024', 8, 5, 1),
('Café Premium 500g', 'CAFE-500', 150, 50, 2),
('Açúcar cristal 1kg', 'ACUCAR-1K', 0, 20, 2),
('Camiseta básica', 'CAMISETA-001', 120, 20, 3),
('Calça jeans', 'CALCA-001', 45, 15, 3),
('Sabonete líquido 250ml', 'SABONETE-250', 200, 100, 4),
('Detergente neutro 500ml', 'DETERGENTE-500', 80, 30, 4),
('Cadeira de escritório', 'CADEIRA-ESC', 12, 5, 5)
ON CONFLICT DO NOTHING;

-- Inserir movimentações de exemplo
INSERT INTO movimentacoes (produto_id, tipo, quantidade) VALUES
(1, 'entrada', 45),
(2, 'entrada', 20),
(2, 'saída', 17),
(3, 'entrada', 15),
(3, 'saída', 7),
(4, 'entrada', 200),
(4, 'saída', 50),
(5, 'entrada', 30),
(5, 'saída', 30),
(6, 'entrada', 150),
(6, 'saída', 30),
(7, 'entrada', 60),
(7, 'saída', 15),
(8, 'entrada', 250),
(8, 'saída', 50),
(9, 'entrada', 100),
(9, 'saída', 20),
(10, 'entrada', 20),
(10, 'saída', 8)
ON CONFLICT DO NOTHING;
