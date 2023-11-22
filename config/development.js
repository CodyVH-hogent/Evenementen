
module.exports = {
    log:{
        level: 'error',
        disabled: false,
    },
    cors: {
        origins: ['http://localhost:5173'],
        maxAge: 3 * 60 * 60,
    },
    database: {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'events',
        username: 'root',
        password: 'root',
    },
};