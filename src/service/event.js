const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const {getPrisma} = require("../../prisma");

/**
 * Get all events.
 */
const getAll = async () => {
    const prisma = getPrisma()
    const items = await prisma.event.findMany({});
    return {
        items,
        count: items.length
    }
}


const getById = async (id) => {
    const prisma = getPrisma()
    const event = await prisma.event.findFirst({
        where: {
            id: id,
        },
    });

    if (!event) {//todo werkt dit??
        throw ServiceError.notFound(`No event with id ${id} exists`, {id});
    }
    return event;
};

/**
 * Create an event.
 *
 * @param {object} event - event to save.
 * @param {string} [event.name] - Name of the event.
 */
const create = async ({place_id, start,name, end, description}) => {
    const prisma = getPrisma()
    // todo: wanneer eerst checken of een place bestaat, anders geen event aanmaken

    // todo: checken of deze fucntie de tijd en datum correct extracten
    // let {tmp_date, tmp_time_start, tmp_time_end} = extractDateAndTimes(date, time_start, time_end);

    try {
        const event = await prisma.event.create({
            data: {
                place_id: place_id,
                name: name,
                start: start,
                end: end,
                description: description
            },
        });
        return event
    } catch (error) {//todo: wordt deze correct afgehandeld
        throw handleDBError(error);
    }
};

/**
 * Update an existing event.
 *
 * @param {number} id - Id of the event to update.
 * @param {object} event - event to save.
 * @param {string} [event.name] - Name of the event.
 */
const updateById = async ({id, place_id, name,start,end, description}) => {
    const prisma = getPrisma()

    // let {tmp_date, tmp_time_start, tmp_time_end} = extractDateAndTimes(date, time_start, time_end);

    try {
        const event = await prisma.event.update({
            where: {
                id: id
            },
            data: {
                place: place_id,
                name: name,
                start: start,
                end: end,
                description: description
            },
        });
        return event;
    } catch (error) {
        throw handleDBError(error);
    }
};

/**
 * Delete an existing event.
 *
 * @param {number} id - Id of the event to delete.
 */
const deleteById = async (id) => {
    const prisma = getPrisma()
    try {
        const event = await prisma.event.delete({
            where: {
                id: Number(id),
            },
        });

        if (!event) {//todo: werkt dit?
            throw ServiceError.notFound(`No event with id ${id} exists`, {id});
        }
    } catch (error) {
        throw handleDBError(error);
    }
};

const deleteAll = async () => {
    const prisma = getPrisma()
    try {
        await prisma.event.deleteMany({});
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