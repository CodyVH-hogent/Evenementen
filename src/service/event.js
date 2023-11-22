// let { EVENTS: Event } = require('../data/mock_data');
const {PrismaClient} = require('@prisma/client')


const prisma = new PrismaClient()


const getAllEvents = async function () {
    const events = await prisma.event.findMany()
    return {
        events,
        count: events.length
    }
}

const getEventById = async (id) => {
    const event = await prisma.event.findFirst({
        where: {"id": id}
    })
    return event

    // throw new Error('Not implemented yet!');
};

const createEvent = async ({place, name, date, time_start, time_end, description}) => {
    if (!await prisma.place.findFirst({
        where: {"name": place}
    })) {
        console.log("place bestaat niet!")
        // return {}
    }


    const newEvent = await prisma.event.create({
        data: {
            place,
            name,
            // date,
            // time_start: timeStart,
            // time_end: timeEnd,
            description
        },//todo date and time, but HOW???
    })
    return (newEvent)
};

const updateById = (id, {amount, date, placeId, user}) => {
    //TODO
    throw new Error('Not implemented yet!');
};

const deleteById = (id) => {
    //TODO
    throw new Error('Not implemented yet!');
};


// getAll: getAllEvents
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateById,
    deleteById,
};