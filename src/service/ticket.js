const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const {getPrisma} = require("../../prisma");

const getAll = async () => {
    const prisma = getPrisma()
    const tickets = await prisma.ticket.findMany({});
    return {
        items: tickets,
        count: tickets.length,
    };
};

const getById = async (id) => {
    const prisma = getPrisma()
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: id,
        },
    });

    if (!ticket) {
        throw ServiceError.notFound(`No ticket with id ${id} exists`, { id });
    }

    return ticket;
};

const create = async ({ purchase_date,event_id }) => {
    const prisma = getPrisma()
    try {
        const ticket = await prisma.ticket.create({
            data: {
                purchase_date: purchase_date,
                event_id: event_id
            },
        });
        return ticket;
    } catch (error) {
        throw handleDBError(error);
    }
};

const updateById = async (id, { purchase_date, purchase_time }) => {
    const prisma = getPrisma()
    try {
        await prisma.ticket.update({
            where: {
                id: id,
            },
            data: {
                purchase_date: purchase_date,
                purchase_time: purchase_time,
            },
        });
        return getById(id);
    } catch (error) {
        throw handleDBError(error);
    }
};

const deleteById = async (id) => {
    const prisma = getPrisma()
    try {
        const deleted = await prisma.ticket.delete({
            where: {
                id: Number(id),
            },
        });

        if (!deleted) {
            throw ServiceError.notFound(`No ticket with id ${id} exists`, { id });
        }
    } catch (error) {
        throw handleDBError(error);
    }
};

const deleteAll = async () => {
    const prisma = getPrisma()
    try {
        await prisma.ticket.deleteMany({});
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
