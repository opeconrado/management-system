import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        sku: '',
        estoque_inicial: 0,
        categoria_id: '',
        estoque_minimo: 10,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [page, search, categoryFilter]);

    const loadCategories = async () => {
        try {
            const res = await categoryService.getAll();
            setCategories(res.data);
        } catch (err) {
            console.error('Erro ao carregar categorias:', err);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (search) filters.search = search;
            if (categoryFilter) filters.categoria_id = categoryFilter;

            const res = await productService.getAll(page, 10, filters);
            setProducts(res.data.data);
            setTotalPages(res.data.pages);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar produtos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'categoria_id' ? value : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await productService.create(formData);
            setFormData({
                nome: '',
                sku: '',
                estoque_inicial: 0,
                categoria_id: '',
                estoque_minimo: 10,
            });
            setShowForm(false);
            setPage(1);
            loadProducts();
        } catch (err) {
            alert('Erro ao criar produto: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            try {
                await productService.delete(id);
                loadProducts();
            } catch (err) {
                alert('Erro ao deletar produto');
            }
        }
    };

    if (loading && products.length === 0) return <div className="products"><p>Carregando...</p></div>;

    return (
        <div className="products">
            <h1>Gerenciar Produtos</h1>

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
                    value={categoryFilter}
                    onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setPage(1);
                    }}
                    className="filter-select"
                >
                    <option value="">Todas as categorias</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nome}
                        </option>
                    ))}
                </select>

                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancelar' : '+ Novo Produto'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="form">
                    <h2>Novo Produto</h2>

                    <div className="form-group">
                        <label>Nome *</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>SKU *</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Estoque Inicial *</label>
                            <input
                                type="number"
                                name="estoque_inicial"
                                value={formData.estoque_inicial}
                                onChange={handleInputChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Estoque Mínimo</label>
                            <input
                                type="number"
                                name="estoque_minimo"
                                value={formData.estoque_minimo}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoria *</label>
                        <select
                            name="categoria_id"
                            value={formData.categoria_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success">
                        Criar Produto
                    </button>
                </form>
            )}

            <div className="products-list">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>SKU</th>
                            <th>Categoria</th>
                            <th>Estoque</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.nome}</td>
                                <td>{product.sku}</td>
                                <td>{product.categoria_nome}</td>
                                <td>{product.estoque_atual}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="btn btn-danger btn-small"
                                    >
                                        Deletar
                                    </button>
                                </td>
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

export default Products;
