const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const {hashPassword, verifyPassword} = require("../core/password");
const {generateJWT, verifyJWT} = require("../core/jwt");
const {getLogger} = require('../core/logging');
const {getPrisma} = require("../../prisma/index")


const getAll = async () => {
    const prisma = getPrisma()
    const items = await prisma.person.findMany({});
    return {
        items,
        count: items.length,
    };
};

const getById = async (id) => {
    const prisma = getPrisma()
    const person = await prisma.person.findFirst({
        where: {
            id: id,
        },
    });

    if (!person) {
        throw ServiceError.notFound(`No person with id ${id} exists`, {id});
    }

    return person;
};

const login = async ({email, password}) => {
    const prisma = getPrisma()
    const person = await prisma.person.findFirst({
        where: {
            email: email,
        },
    });
    if (!person) {
        throw ServiceError.unauthorized(
            'The given email and password do not match'
        );
    }
    const passwordValid = await verifyPassword(password, person.password_hash);
    if (!passwordValid) {
        throw ServiceError.unauthorized(
            'The given email and password do not match'
        );
    }
    return await makeLoginData(person);
}

const makeLoginData = async (person) => {
    const token = await generateJWT(person);
    return {
        ...person,
        token,
    };
};

const create = async ({first_name, last_name, email, tickets, password}) => {
    const prisma = getPrisma()
    // todo checken of er al een person bestaat met dezelfde email
    const person = await prisma.person.findFirst({
        where: {
            email: email
        }
    })

    if (person) {
        throw ServiceError.existsAlready(`A person with email: ${email} already exists`);
    }

    const hashed_password = await hashPassword(password)

    const data = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password_hash: hashed_password,
        roles: ['user']
    };

    if (tickets) {
        data.tickets = {
            connect: Array.from(tickets).map(id => ({id}))
        };
    }

    try {
        const person = await prisma.person.create({
            data
        });
        return person;
    } catch (error) {
        throw handleDBError(error);
    }
};

const updateById = async ({id, first_name, last_name, email, password, tickets}) => {
    // console.log(Array.from(tickets).map(id => ({ id })))
    const prisma = getPrisma()
    const person = await prisma.person.findFirst({
        where: {
            id: id
        }
    })
    if (!person) {
        // DO NOT expose we don't know the user
        throw ServiceError.unauthorized(
            'The given id and password do not match'
        );
    }
    // const passwordValid = await verifyPassword(password, person.password_hash);
    // if (!passwordValid) {
    //     DO NOT expose we know the user but an invalid password was given
    // throw ServiceError.unauthorized(
    //     'The given email and password do not match'
    // );
    // }

    const hashed_password = await hashPassword(password)
    // console.log("hashed password:", hashed_password)
    const data = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password_hash: hashed_password,
        roles: ['user']
    };

    if (tickets) {
        data.tickets = {
            connect: Array.from(tickets).map(id => ({id}))
        };
    }
    try {
        await prisma.person.update({
            where: {
                id: id
            },
            data
        });
        return getById(id);
    } catch (error) {
        throw handleDBError(error);
    }
};

const deleteById = async (id) => {
    const prisma = getPrisma()
    // todo checken of er een person bestaat met die id, evt via de DB-error
    try {
        const deleted = await prisma.person.delete({
            where: {
                id: id,
            },
        })
        return deleted
    } catch (error) {
        throw handleDBError(error);
    }
};

const deleteAll = async () => {
    const prisma = getPrisma()
    await prisma.person.deleteMany()

};

const checkAndParseSession = async (authHeader) => {
    if (!authHeader) {
        throw ServiceError.unauthorized('No authentication token provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
        throw ServiceError.unauthorized('Invalid authentication token provided');
    }

    const authToken = authHeader.substring(7);
    try {
        const {roles, person_id} = await verifyJWT(authToken);

        return {
            person_id,
            roles,
            authToken,
        };
    } catch (error) {
        getLogger().error(error.message, {error});
        throw new Error(error.message);
    }
};
const checkRole = (role, roles) => {
    const hasPermission = roles.includes(role);
    if (!hasPermission) {
        throw ServiceError.forbidden(
            'You are not allowed to acces this part of the application'
        );
    }
};

module.exports = {
    getAll,
    getById,
    login,
    create,
    updateById,
    deleteById,
    deleteAll,
    checkAndParseSession,
    checkRole
};
