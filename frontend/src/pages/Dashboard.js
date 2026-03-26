import React, { useState, useEffect } from 'react';
import { productService, movementService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [zeroStockProducts, setZeroStockProducts] = useState([]);
    const [abcData, setAbcData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsRes, lowStockRes, zeroStockRes, abcRes] = await Promise.all([
                    productService.getStats(),
                    productService.getLowStock(),
                    productService.getZeroStock(),
                    movementService.getABCCurve(),
                ]);

                setStats(statsRes.data);
                setLowStockProducts(lowStockRes.data);
                setZeroStockProducts(zeroStockRes.data);
                setAbcData(abcRes.data.slice(0, 10));
            } catch (err) {
                setError('Erro ao carregar dados do dashboard');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="dashboard"><p>Carregando...</p></div>;
    if (error) return <div className="dashboard"><p className="error">{error}</p></div>;

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            {/* Indicadores */}
            <section className="indicators">
                <div className="indicator-card">
                    <h3>Total de Produtos</h3>
                    <p className="indicator-value">{stats?.total_produtos || 0}</p>
                </div>
                <div className="indicator-card">
                    <h3>Total em Estoque</h3>
                    <p className="indicator-value">{stats?.total_estoque || 0}</p>
                </div>
                <div className="indicator-card warning">
                    <h3>Estoque Baixo</h3>
                    <p className="indicator-value">{stats?.produtos_baixo || 0}</p>
                </div>
                <div className="indicator-card danger">
                    <h3>Estoque Zerado</h3>
                    <p className="indicator-value">{stats?.produtos_zerados || 0}</p>
                </div>
            </section>

            {/* Curva ABC */}
            <section className="section">
                <h2>Curva ABC (Top 10 Produtos)</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>SKU</th>
                            <th>Movimentações</th>
                            <th>Categoria</th>
                            <th>%</th>
                            <th>Acumulado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {abcData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.nome}</td>
                                <td>{item.sku}</td>
                                <td>{item.total_movimentacoes || 0}</td>
                                <td>{item.categoria}</td>
                                <td>
                                    <span className={`badge-${item.categoria}`}>
                                        {item.categoria}
                                    </span>
                                </td>
                                <td>{item.acumulado}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Produtos com Estoque Baixo */}
            <section className="section">
                <h2>Produtos com Estoque Baixo</h2>
                {lowStockProducts.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>SKU</th>
                                <th>Quantidade</th>
                                <th>Mínimo</th>
                                <th>Categoria</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.slice(0, 5).map((product) => (
                                <tr key={product.id}>
                                    <td>{product.nome}</td>
                                    <td>{product.sku}</td>
                                    <td className="highlight">{product.estoque_atual}</td>
                                    <td>{product.estoque_minimo}</td>
                                    <td>{product.categoria_nome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum produto com estoque baixo</p>
                )}
            </section>

            {/* Produtos Zerados */}
            <section className="section">
                <h2>Produtos com Estoque Zerado</h2>
                {zeroStockProducts.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>SKU</th>
                                <th>Categoria</th>
                            </tr>
                        </thead>
                        <tbody>
                            {zeroStockProducts.slice(0, 5).map((product) => (
                                <tr key={product.id}>
                                    <td>{product.nome}</td>
                                    <td>{product.sku}</td>
                                    <td>{product.categoria_nome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum produto com estoque zerado</p>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
