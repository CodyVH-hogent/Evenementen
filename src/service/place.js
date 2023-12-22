
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const {getPrisma} = require("../../prisma");

const getAll = async () => {
    prisma = getPrisma()
    const places = await prisma.place.findMany({});
    return {
        items: places,
        count: places.length,
    };
};

const getById = async (id) => {
    prisma = getPrisma()
    const place = await prisma.place.findFirst({
        where: {
            id: id,
        },
    });

    // todo: error afhandeling, wat als er geen place is met die id?

    return place;
};

const create = async ({name, street, postal_code, province, country}) => {
    prisma = getPrisma()
    try {
        const place = await prisma.place.create({
            data: {
                name: name,
                street: street,
                postal_code: postal_code,
                province: province,
                country: country
            },
        });
        return place;
    } catch (error) {
        throw handleDBError(error);
    }
};

const updateById = async (id, name, street, postal_code, province, country) => {
    prisma = getPrisma()
    try {
        await prisma.place.update({
            where: {
                id: id
            },
            data: {
                name: name,
                street: street,
                postal_code: postal_code,
                province: province,
                country: country
            }
        })
        return getById(id);
    } catch (error) {
        throw handleDBError(error);
    }
};

const deleteById = async (id) => {
    prisma = getPrisma()
    try {
        const deleted = await prisma.place.delete({
            where: {
                id: Number(id),
            },
        });

        if (!deleted) {
            throw ServiceError.notFound(`No place with id ${id} exists`, {id});
        }
    } catch (error) {
        throw handleDBError(error);
    }
};

const deleteAll = async () => {
    prisma = getPrisma()
    try {
        await prisma.place.deleteMany({});
    } catch (error) {
        throw handleDBError(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    deleteAll
};
