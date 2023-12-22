const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const Role = require('../../src/core/roles');

module.exports = {
    seedPlace: async () => {
        try {
            await prisma.place.deleteMany();
            await prisma.place.createMany({
                data: [{
                    id: 1,
                    name: "Sunset Haven",
                    street: "Maple Street",
                    postal_code: 1111,
                    province: "Sunnydale",
                    country: "Sunland",
                }, {
                    id: 2,
                    name: "Moonlight Plaza",
                    street: "Oak Avenue",
                    postal_code: 2222,
                    province: "Moonville",
                    country: "Starland",
                }, {
                    id: 3,
                    name: "Stardust Hall",
                    street: "Pine Street",
                    postal_code: 3333,
                    province: "Cosmopolis",
                    country: "Galaxia",
                }]
            });
        } catch (error) {
            console.error("Error seeding database:", error);
        } finally {
            await prisma.$disconnect();
        }
    },
};
