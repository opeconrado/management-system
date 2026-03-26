import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Stock from './pages/Stock';
import Categories from './pages/Categories';
import Movements from './pages/Movements';
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/produtos" element={<Products />} />
                <Route path="/estoque" element={<Stock />} />
                <Route path="/categorias" element={<Categories />} />
                <Route path="/movimentacoes" element={<Movements />} />
            </Routes>
        </Router>
    );
}

export default App;
