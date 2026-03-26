import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    📦 Sistema de Estoque
                </Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">Dashboard</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/produtos" className="navbar-link">Produtos</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/estoque" className="navbar-link">Estoque</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/categorias" className="navbar-link">Categorias</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/movimentacoes" className="navbar-link">Movimentações</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
