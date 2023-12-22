const config = require('config');
const {PrismaClient} = require('@prisma/client');
const {getLogger} = require('../src/core/logging');
const {execSync} = require('child_process');
const {seedEvent} = require("./seeds/event");
const {seedPlace} = require("./seeds/place");
const {seedPerson} = require("./seeds/person");
const {seedTicket} = require("./seeds/ticket");

let prisma;

const databaseName = config.get('database.name');
const rawUrl = config.get('database.url');
const dbUrl = `${rawUrl}${databaseName}`;

async function createDatabase() {
    const logger = getLogger();
    try {
        const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName};`;
        const rawPrisma = new PrismaClient({
            datasources: {
                db: {
                    url: rawUrl,
                },
            },
        });

        await rawPrisma.$executeRawUnsafe(createDatabaseQuery);
        await rawPrisma.$disconnect();
        logger.info('Database created successfully');
    } catch (error) {
        logger.error('Error creating database', {error});
        throw new Error('Could not create the database');
    }
}

async function initializeData() {
    const logger = getLogger();
    logger.info('Setting up database if needed');

    await createDatabase();

    logger.info('Initializing connection to the database');

    process.env.DATABASE_URL = dbUrl;
    prisma = new PrismaClient();

    await prisma.$connect();

    try {
        await prisma.$disconnect();
        await prisma.$connect();
    } catch (error) {
        logger.error(error.message, {error});
        throw new Error('Could not initialize the data layer');
    }

    try {
        execSync('yarn prisma db push', {stdio: 'inherit'});
    } catch (error) {
        logger.error('Could not push the db', {error});
        throw new Error('Migrations failed, check the logs');
    }

    if (config.get('env') === 'development') {
        try {
            await seedPlace();
            await seedEvent();
            await seedPerson();
            await seedTicket()
            logger.info('Database seeded');
        } catch (error) {
            logger.error(error.message, {error});
            throw new Error('Could not seed the database');
        }
    }

    return prisma;
}

function getPrisma() {
    if (!prisma)
        throw new Error('Please initialize the data layer before getting the Prisma instance');
    return prisma;
}

async function shutdownData() {
    const logger = getLogger();

    logger.info('Shutting down database connection');

    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }

    logger.info('Database connection severed');
}

module.exports = {
    initializeData, shutdownData, getPrisma,
};
