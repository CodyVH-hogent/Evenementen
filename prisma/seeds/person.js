const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const Role = require('../../src/core/roles');

module.exports = {
    seedPerson: async () => {
        try {
            await prisma.person.deleteMany();
            await prisma.person.createMany({
                data: [{
                    id: 1,
                    first_name: "John",
                    last_name: "Doe",
                    email: "john.doe@example.com",
                    // tickets: [1],
                    password_hash: "$argon2id$v=19$m=131072,t=6,p=4$HWi1h6Nmb7X8SpuVsaCBwg$Oqik+dYvaC4Eth4XjMEawHoWFmePlRNnSALeS3sHi5M",//pass1
                    roles: JSON.stringify([Role.ADMIN, Role.USER])
                }, {
                    id: 2,
                    first_name: "Alice",
                    last_name: "Smith",
                    email: "alice.smith@example.com",
                    // tickets: [2],
                    password_hash: "$argon2id$v=19$m=131072,t=6,p=4$HWi1h6Nmb7X8SpuVsaCBwg$Oqik+dYvaC4Eth4XjMEawHoWFmePlRNnSALeS3sHi5M",//pass1,
                    roles: JSON.stringify([Role.USER])
                }, {
                    id: 3,
                    first_name: "Ella",
                    last_name: "Johnson",
                    email: "ella.johnson@example.com",
                    // tickets: [3],
                    password_hash: "$argon2id$v=19$m=131072,t=6,p=4$HWi1h6Nmb7X8SpuVsaCBwg$Oqik+dYvaC4Eth4XjMEawHoWFmePlRNnSALeS3sHi5M",//pass1
                    roles: JSON.stringify([Role.USER])
                }]
            });
        } catch (error) {
            console.error("Error seeding database:", error);
        } finally {
            await prisma.$disconnect();
        }
    },
};
