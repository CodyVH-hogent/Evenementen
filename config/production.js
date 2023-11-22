module.exports = {
    log:{
        level: 'info',
        disabled: false,
    },
    cors: { // 👈 1
        origins: ['http://localhost:5173'],
        maxAge: 3 * 60 * 60,
    },
};