// let { EVENTS: Event } = require('../data/mock_data');
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()


const getAllPlaces = async function () {
    const places = await prisma.place.findMany()
    return places
}

const getPlaceById = async (id) => {
    //TODO
    throw new Error('Not implemented yet!');
};

const createPlace = async ({name, street, postalCode,province, country}) => {
    if (await prisma.place.findFirst({
        where: {"name": name}
    })) {
        console.log("place bestaat al!")
        return {}
    }

    const newEvent = await prisma.event.create({
        data: {
            name,
            street,
            postalCode,
            province,
            country
        },
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
    getAllEvents: getAllPlaces,
    getEventById: getPlaceById,
    createEvent: createPlace,
    updateById,
    deleteById,
};