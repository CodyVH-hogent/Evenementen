const {shutdownData, getPrisma} = require('../prisma/index');

module.exports = async () => {
    const prisma = getPrisma();
    try {
        await prisma.person.deleteMany();
        await prisma.place.deleteMany();
        await prisma.event.deleteMany();
        await prisma.ticket.deleteMany();
    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        await prisma.$disconnect();
        await shutdownData();
    }
};
