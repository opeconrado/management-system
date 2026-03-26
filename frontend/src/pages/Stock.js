import React, { useState } from 'react';
import { productService } from '../services/api';
import './Stock.css';

const Stock = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('nome');

    const loadProducts = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (search) filters.search = search;
            if (statusFilter) filters.status = statusFilter;

            const res = await productService.getAll(page, 10, filters);
            let sortedProducts = res.data.data;

            if (sortBy === 'estoque-asc') {
                sortedProducts = sortedProducts.sort((a, b) => a.estoque_atual - b.estoque_atual);
            } else if (sortBy === 'estoque-desc') {
                sortedProducts = sortedProducts.sort((a, b) => b.estoque_atual - a.estoque_atual);
            }

            setProducts(sortedProducts);
            setTotalPages(res.data.pages);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar produtos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadProducts();
    }, [page, search, statusFilter, sortBy]);

    const getStatusClass = (product) => {
        if (product.estoque_atual === 0) return 'status-zerado';
        if (product.estoque_atual <= product.estoque_minimo) return 'status-baixo';
        return 'status-normal';
    };

    const getStatusText = (product) => {
        if (product.estoque_atual === 0) return 'Zerado';
        if (product.estoque_atual <= product.estoque_minimo) return 'Baixo';
        return 'Normal';
    };

    if (error && products.length === 0) return <div className="stock"><p className="error">{error}</p></div>;

    return (
        <div className="stock">
            <h1>Controle de Estoque</h1>

            <div className="controls">
                <input
                    type="text"
                    placeholder="Buscar por nome ou SKU..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="search-input"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="filter-select"
                >
                    <option value="">Todos os status</option>
                    <option value="normal">Normal</option>
                    <option value="baixo">Estoque Baixo</option>
                    <option value="zerado">Estoque Zerado</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                >
                    <option value="nome">Ordenar por Nome</option>
                    <option value="estoque-asc">Estoque (Menor)</option>
                    <option value="estoque-desc">Estoque (Maior)</option>
                </select>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <>
                    <div className="stock-grid">
                        {products.map((product) => (
                            <div key={product.id} className={`stock-card ${getStatusClass(product)}`}>
                                <div className="stock-card-header">
                                    <h3>{product.nome}</h3>
                                    <span className={`status-badge ${getStatusClass(product)}`}>
                                        {getStatusText(product)}
                                    </span>
                                </div>
                                <div className="stock-card-body">
                                    <div className="info-row">
                                        <span className="label">SKU:</span>
                                        <span className="value">{product.sku}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Categoria:</span>
                                        <span className="value">{product.categoria_nome}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Estoque Atual:</span>
                                        <span className="value highlight">{product.estoque_atual}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Estoque Mínimo:</span>
                                        <span className="value">{product.estoque_minimo}</span>
                                    </div>
                                    <div className="stock-bar">
                                        <div
                                            className="stock-progress"
                                            style={{
                                                width: `${Math.min(
                                                    (product.estoque_atual / product.estoque_minimo) * 100,
                                                    100
                                                )}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                </>
            )}
        </div>
    );
};

export default Stock;
