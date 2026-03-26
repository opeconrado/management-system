const validateProductInput = (data) => {
    const errors = [];

    if (!data.nome || data.nome.trim().length === 0) {
        errors.push('Nome do produto é obrigatório');
    }

    if (!data.sku || data.sku.trim().length === 0) {
        errors.push('SKU é obrigatório');
    }

    if (data.estoque_inicial === undefined || data.estoque_inicial === null || isNaN(data.estoque_inicial)) {
        errors.push('Estoque inicial deve ser um número');
    } else if (data.estoque_inicial < 0) {
        errors.push('Estoque inicial não pode ser negativo');
    }

    if (!data.categoria_id || isNaN(data.categoria_id)) {
        errors.push('Categoria é obrigatória');
    }

    if (data.estoque_minimo !== undefined && data.estoque_minimo !== null) {
        if (isNaN(data.estoque_minimo) || data.estoque_minimo < 0) {
            errors.push('Estoque mínimo inválido');
        }
    }

    return errors;
};

const validateCategoryInput = (data) => {
    const errors = [];

    if (!data.nome || data.nome.trim().length === 0) {
        errors.push('Nome da categoria é obrigatório');
    }

    return errors;
};

const validateMovementInput = (data) => {
    const errors = [];

    if (!data.produto_id || isNaN(data.produto_id)) {
        errors.push('Produto é obrigatório');
    }

    if (!data.tipo || !['entrada', 'saída'].includes(data.tipo.toLowerCase())) {
        errors.push('Tipo de movimentação deve ser "entrada" ou "saída"');
    }

    if (data.quantidade === undefined || data.quantidade === null || isNaN(data.quantidade)) {
        errors.push('Quantidade é obrigatória e deve ser um número');
    } else if (data.quantidade <= 0) {
        errors.push('Quantidade deve ser maior que zero');
    }

    return errors;
};

module.exports = {
    validateProductInput,
    validateCategoryInput,
    validateMovementInput,
};
