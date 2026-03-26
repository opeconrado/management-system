import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/api';

const useFetchCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryService.getAll();
                setCategories(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};

export default useFetchCategories;
