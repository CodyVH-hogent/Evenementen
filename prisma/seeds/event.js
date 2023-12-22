const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const Role = require('../../src/core/roles');

module.exports = {
    seedEvent: async () => {
        try {
            await prisma.event.deleteMany();
            await prisma.event.createMany({
                data: [{
                    id: 1,
                    name: "Summer Festival",
                    description: "A lively celebration of summer vibes",
                    end: "2023-08-15T20:00:00Z",
                    start: "2023-08-15T12:00:00Z",
                    place_id: 1,
                    // tickets: [1]
                }, {
                    id: 2,
                    name: "Moonlight Ball",
                    description: "An elegant ball under the moonlight",
                    end: "2023-09-10T23:00:00Z",
                    start: "2023-09-10T19:30:00Z",
                    place_id: 2,
                    // tickets: [2]
                }, {
                    id: 3,
                    name: "Stardust Concert",
                    description: "A mesmerizing concert with star-studded performances",
                    end: "2023-07-25T22:30:00Z",
                    start: "2023-07-25T18:00:00Z",
                    place_id: 3,
                    // tickets: [3]
                }]
            });
        } catch (error) {
            console.error("Error seeding database:", error);
        } finally {
            await prisma.$disconnect();
        }
    },
};
