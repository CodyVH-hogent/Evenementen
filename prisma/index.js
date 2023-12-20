const {getLogger} = require('../src/core/logging');
const {zaad} = require("../prisma/seed")
const prisma = require("../prisma/prisma_init")

async function initializeData() {
    const logger = getLogger();
    logger.info('Initializing connection to the database');
    try {
        await prisma.$connect();
        await zaad()
    } catch (error) {
        logger.error(error.message, {error});
        throw new Error('Could not initialize the data layer');
    }
    logger.info('Successfully initialized connection to the database');
    return prisma;
}

async function shutdownData() {
    const logger = getLogger();

    logger.info('Shutting down database connection');

    if (prisma) {
        await prisma.$disconnect();
    }

    logger.info('Database connection closed');
}

module.exports = {
    initializeData, shutdownData,
};
