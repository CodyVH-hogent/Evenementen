const prisma = require("./prisma_init")
const roles = require("../src/core/roles")

module.exports = {
    zaad: async () => {
        try {
            await prisma.place.deleteMany();
            await prisma.$queryRaw`ALTER TABLE place
                AUTO_INCREMENT = 1`
            await prisma.place.createMany({
                data: [
                    {
                        name: 'name1',
                        street: 'street1',
                        postal_code: 1111,
                        province: 'province1',
                        country: 'country1',
                    },
                    {
                        name: 'name2',
                        street: 'street2',
                        postal_code: 2222,
                        province: 'province2',
                        country: 'country2',
                    },
                    {
                        name: 'name3',
                        street: 'street3',
                        postal_code: 3333,
                        province: 'province3',
                        country: 'country3',
                    }
                ]
            });
            await prisma.event.deleteMany();
            await prisma.$queryRaw`ALTER TABLE event
                AUTO_INCREMENT = 1`
            await prisma.event.createMany({
                data: [
                    {
                        name: 'name1',
                        description: 'description1',
                        start: '2022-12-01T10:30:00Z',
                        end: '2022-12-01T10:30:00Z',
                        placeId: 1
                    },
                ]
            });
            await prisma.person.deleteMany();
            await prisma.$queryRaw`ALTER TABLE person
                AUTO_INCREMENT = 1`
            await prisma.person.createMany({
                data: [
                    {
                        first_name: 'first_name1',
                        last_name: 'last_name1',
                        email: 'email1',
                        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$bKY00fDGpq/pmgj07J8OUg$a2ZDJhl6BuFrhih52D6buhYtKPdzVLPVQprjrIQG46Y",//pass1
                        roles: JSON.stringify([roles.ADMIN])
                    },
                    {
                        first_name: 'first_name2',
                        last_name: 'last_name2',
                        email: 'email2',
                        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$6D/xjjGGAOVIV8QYCXIk1w$uPVA4wDE/ZawYLF6+bfAEjiONy0fbzOiidyXx3A8IHM",//pass2
                        roles: JSON.stringify([roles.USER])
                    },
                    {
                        first_name: 'first_name3',
                        last_name: 'last_name3',
                        email: 'email3',
                        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$YWMs6WESCoziJ7LbDN07ug$Cdueh/wHbB1PjH245qkfrHd4GvnLNvmKDt2m/HFTcLs",//pass3
                        roles: JSON.stringify([roles.ADMIN, roles.USER])
                    },
                ]
            });
            await prisma.ticket.deleteMany();
            await prisma.$queryRaw`ALTER TABLE ticket
                AUTO_INCREMENT = 1`
            await prisma.ticket.createMany({
                data: [
                    {
                        purchase_date: '2022-12-01T10:30:00Z',
                        event_id: 1
                    },
                    {
                        purchase_date: '2022-12-01T10:30:00Z',
                        event_id: 1
                    },
                    {
                        purchase_date: '2022-12-01T10:30:00Z',
                        event_id: 1
                    },
                ]
            });

            console.log('Seeding completed successfully.');
        } catch (error) {
            console.error('Error seeding data:', error);
        } finally {
            await prisma.$disconnect();
        }
    },
};
