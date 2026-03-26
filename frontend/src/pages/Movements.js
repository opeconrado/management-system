import React, { useState, useEffect } from 'react';
import { productService, movementService } from '../services/api';
import './Movements.css';

const Movements = () => {
    const [movements, setMovements] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        produto_id: '',
        tipo: 'entrada',
        quantidade: 1,
    });

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        loadMovements();
    }, [page, filter]);

    const loadProducts = async () => {
        try {
            const res = await productService.getAll(1, 1000);
            setProducts(res.data.data);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
        }
    };

    const loadMovements = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (filter) filters.tipo = filter;

            const res = await movementService.getAll(page, 10, filters);
            setMovements(res.data.data);
            setTotalPages(res.data.pages);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar movimentações');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await movementService.create({
                ...formData,
                produto_id: parseInt(formData.produto_id),
                quantidade: parseInt(formData.quantidade),
            });
            setFormData({
                produto_id: '',
                tipo: 'entrada',
                quantidade: 1,
            });
            setShowForm(false);
            setPage(1);
            loadMovements();
        } catch (err) {
            alert('Erro ao criar movimentação: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleBarcodeRegister = async () => {
        const sku = prompt('Leia o código de barras do produto:');
        if (sku) {
            try {
                await movementService.registerBarcode(sku);
                alert('Movimentação registrada com sucesso!');
                setPage(1);
                loadMovements();
            } catch (err) {
                alert('Erro: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    if (loading && movements.length === 0) return <div className="movements"><p>Carregando...</p></div>;

    return (
        <div className="movements">
            <h1>Movimentações de Estoque</h1>

            <div className="controls">
                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                    className="filter-select"
                >
                    <option value="">Todos os tipos</option>
                    <option value="entrada">Entrada</option>
                    <option value="saída">Saída</option>
                </select>

                <button onClick={handleBarcodeRegister} className="btn btn-info">
                    📱 Registrar por Código de Barras
                </button>

                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancelar' : '+ Nova Movimentação'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="form">
                    <h2>Nova Movimentação</h2>

                    <div className="form-group">
                        <label>Produto *</label>
                        <select
                            name="produto_id"
                            value={formData.produto_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione um produto</option>
                            {products.map((prod) => (
                                <option key={prod.id} value={prod.id}>
                                    {prod.nome} ({prod.sku}) - Estoque: {prod.estoque_atual}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tipo *</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saída">Saída</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantidade *</label>
                        <input
                            type="number"
                            name="quantidade"
                            value={formData.quantidade}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success">
                        Registrar Movimentação
                    </button>
                </form>
            )}

            <div className="movements-list">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Produto</th>
                            <th>SKU</th>
                            <th>Tipo</th>
                            <th>Quantidade</th>
                            <th>Categoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.map((movement) => (
                            <tr key={movement.id} className={`type-${movement.tipo}`}>
                                <td>{new Date(movement.data).toLocaleDateString('pt-BR')} {new Date(movement.data).toLocaleTimeString('pt-BR')}</td>
                                <td>{movement.produto_nome}</td>
                                <td>{movement.sku}</td>
                                <td>
                                    <span className={`badge-${movement.tipo}`}>
                                        {movement.tipo}
                                    </span>
                                </td>
                                <td>{movement.quantidade}</td>
                                <td>{movement.categoria_nome || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="btn btn-secondary"
                    >
                        Anterior
                    </button>
                    <span>{page} de {totalPages}</span>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="btn btn-secondary"
                    >
                        Próximo
                    </button>
                </div>
            )}

            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Movements;
