const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.status) {
        return res.status(err.status).json({
            error: err.message,
            details: err.details || null,
        });
    }

    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
};

module.exports = errorHandler;
