const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const Role = require('../../src/core/roles');

module.exports = {
    seedTicket: async () => {
        try {
            await prisma.ticket.deleteMany();
            await prisma.ticket.createMany({
                data: [{
                    id: 1, purchase_date: "2023-01-01T12:00:00Z", event_id: 1, person_id: 1
                }, {
                    id: 2, purchase_date: "2023-01-02T15:30:00Z", event_id: 2, person_id: 2,
                }, {
                    id: 3, purchase_date: "2023-01-03T08:45:00Z", event_id: 3, person_id: 3,
                }]
            });
        } catch (error) {
            console.error("Error seeding database:", error);
        } finally {
            await prisma.$disconnect();
        }
    },
};
