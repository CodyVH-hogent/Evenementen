// let { EVENTS: Event } = require('../data/mock_data');
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()


const getAll = async function () {
    const places = await prisma.place.findMany()
    return {
        places,
        count: places.length
    }
}

const getById = async (id) => {
    const place = await prisma.place.findFirst({
        where: {
            id: id
        }
    }).catch(error => {
        if (error.code === "P2025") {
            console.log("Id %d is not recognised", id)
        } else {
            console.log(error.meta)
        }
    })
    return place
};

const create = async ({name, street, postalCode, province, country}) => {
    if (await prisma.place.findFirst({
        where: {"name": name}
    })) {
        console.log("place already exists!")
        //todo: fox log
        return {}
    }

    const newPlace = await prisma.place.create({
        data: {
            name,
            street,
            postalCode,
            province,
            country
        },
    })
    return (newPlace)
};

const updateById = async (id, {name, street, postal_code, province, country}) => {
    if (!await prisma.place.findFirst({
        where: {
            id: id
        }
    })) {
        console.log("This place does not exist")
        // todo: fix log
        return {}
    }

    const newPlace = await prisma.place.update({
        where: {
            id: id
        },
        data: {
            name,
            street,
            postal_code,
            province,
            country
        }
    })
    return (newPlace)
};

const deleteById = async (id) => {
    const deletePlace = await prisma.place.delete({
        where: {
            id: id
        },
    }).catch(error => {
            if (error.code === "P2025") {
                console.log("Id %d is not recognised", id)
                // console.log(error.meta)
                //todo: fox log
            } else {
                console.log(error)
            }
        }
    )
};

const deleteAll = async () => {
    const deletePlace = await prisma.place.deleteMany({})
    return deletePlace
};

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    deleteAll
};