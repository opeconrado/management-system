const pool = require('../config/database');

class MovementRepository {
    async findAll(page = 1, limit = 10, filters = {}) {
        let query = `
      SELECT m.*, p.nome as produto_nome, p.sku, c.nome as categoria_nome
      FROM movimentacoes m
      JOIN produtos p ON m.produto_id = p.id
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `;
        const params = [];
        const conditions = [];

        if (filters.produto_id) {
            conditions.push('m.produto_id = $' + (params.length + 1));
            params.push(filters.produto_id);
        }

        if (filters.tipo) {
            conditions.push('m.tipo = $' + (params.length + 1));
            params.push(filters.tipo);
        }

        if (filters.data_inicio && filters.data_fim) {
            conditions.push('m.data >= $' + (params.length + 1) + ' AND m.data <= $' + (params.length + 2));
            params.push(filters.data_inicio, filters.data_fim);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const offset = (page - 1) * limit;
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM movimentacoes m' + (conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''),
            params
        );
        const totalCount = parseInt(countResult.rows[0].count);

        query += ' ORDER BY m.data DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);
        return {
            data: result.rows,
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit),
        };
    }

    async findById(id) {
        const result = await pool.query(
            `SELECT m.*, p.nome as produto_nome, p.sku, c.nome as categoria_nome
       FROM movimentacoes m
       JOIN produtos p ON m.produto_id = p.id
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE m.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async create(produto_id, tipo, quantidade) {
        const result = await pool.query(
            'INSERT INTO movimentacoes (produto_id, tipo, quantidade, data) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [produto_id, tipo, quantidade]
        );
        return result.rows[0];
    }

    async getMovementsByDateRange(dataInicio, dataFim) {
        const result = await pool.query(
            `SELECT tipo, COUNT(*) as count, SUM(quantidade) as total_quantidade
       FROM movimentacoes
       WHERE data >= $1 AND data <= $2
       GROUP BY tipo
       ORDER BY tipo`,
            [dataInicio, dataFim]
        );
        return result.rows;
    }

    async getProductMovementHistory(produtoId, days = 30) {
        const result = await pool.query(
            `SELECT * FROM movimentacoes
       WHERE produto_id = $1 AND data >= NOW() - INTERVAL '${days} days'
       ORDER BY data DESC`,
            [produtoId]
        );
        return result.rows;
    }

    async getABCCurveData() {
        const result = await pool.query(`
      SELECT
        p.id,
        p.nome,
        p.sku,
        SUM(m.quantidade) as total_movimentacoes,
        p.estoque_atual * (SELECT AVG(quantidade) FROM movimentacoes WHERE produto_id = p.id) as valor_estoque
      FROM produtos p
      LEFT JOIN movimentacoes m ON p.id = m.produto_id
      GROUP BY p.id, p.nome, p.sku, p.estoque_atual
      ORDER BY total_movimentacoes DESC
    `);
        return result.rows;
    }
}

module.exports = new MovementRepository();
