import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const res = await categoryService.getAll();
            setCategories(res.data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar categorias');
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
            await categoryService.create(formData);
            setFormData({
                nome: '',
                descricao: '',
            });
            setShowForm(false);
            loadCategories();
        } catch (err) {
            alert('Erro ao criar categoria: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
            try {
                await categoryService.delete(id);
                loadCategories();
            } catch (err) {
                alert('Erro ao deletar categoria: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    if (loading) return <div className="categories"><p>Carregando...</p></div>;

    return (
        <div className="categories">
            <h1>Gerenciar Categorias</h1>

            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                {showForm ? 'Cancelar' : '+ Nova Categoria'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="form">
                    <h2>Nova Categoria</h2>

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
                        <label>Descrição</label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleInputChange}
                            rows="4"
                        />
                    </div>

                    <button type="submit" className="btn btn-success">
                        Criar Categoria
                    </button>
                </form>
            )}

            <div className="categories-list">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.nome}</td>
                                <td>{category.descricao || '-'}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(category.id)}
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

            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Categories;
