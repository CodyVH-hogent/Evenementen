const config = require('config');
const {initializeLogger} = require('../src/core/logging');
const {initializeData, getPrisma} = require('../prisma/index');
const Role = require('../src/core/roles');


module.exports = async () => {
    const data = [{
        id: 1,
        first_name: "admin",
        last_name: "joe",
        email: "admin@example.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$PvJomRJIy7YTUN4zMvt6Kg$r7ICw6fxd4QlSbXdnO+jVqTQwD2Fo8r0NiDy0xiOEmE",//pass1
        roles: JSON.stringify([Role.ADMIN, Role.USER])
    }, {
        id: 2,
        first_name: "user",
        last_name: "Smith",
        email: "user@example.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$PvJomRJIy7YTUN4zMvt6Kg$r7ICw6fxd4QlSbXdnO+jVqTQwD2Fo8r0NiDy0xiOEmE",//pass1,
        roles: JSON.stringify([Role.USER])
    }];

    initializeLogger({
        level: config.get('log.level'), disabled: config.get('log.disabled'),
    });

    let prisma;

    try {
        await initializeData();
        prisma = getPrisma();
        await prisma.person.createMany({data});
    } catch (error) {
        console.error('Error creating persons:', error);
    } finally {
        await prisma.$disconnect();
    }
};
