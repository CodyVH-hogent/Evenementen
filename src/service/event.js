// let { EVENTS: Event } = require('../data/mock_data');
const {PrismaClient} = require('@prisma/client')


const prisma = new PrismaClient()


const getAll = async function () {
    const events = await prisma.event.findMany()
    return {
        events,
        count: events.length
    }
}

const getById = async (id) => {
    const event = await prisma.event.findFirst({
        where: {id: id}
    })
    return event
};

const createEvent = async ({place, name, date, time_start, time_end, description}) => {
    // if (!await prisma.place.findFirst({
    //         where: {
    //             "name": place
    //         }
    //     })
    //     // || await prisma.event.findFirst({
    //     //     where: {
    //     //         "name": name
    //     //     }
    //     // })
    // ) {
    //     console.log("place bestaat niet!")
    //todo fix log
    //     return {}
    // }
    //todo: check of ^ werkt, als de place niet bestaat kan het event niet worden aangemaakt.
    // (Als het event al bestaat mag het event niet worden aangemaakt??)

    let {tmp_date, tmp_time_start, tmp_time_end} = extractDateAndTimes(date, time_start, time_end);

    const newEvent = await prisma.event.create({
        data: {
            place,
            name,
            date: tmp_date,
            time_start: tmp_time_start,
            time_end: tmp_time_end,
            description
        },
    })
    return (newEvent)
};

const updateById = async ({id, place, name, date, time_start, time_end, description}) => {
    // if (!await prisma.place.findFirst({
    //     where: {
    //         name: place
    //     }
    // })) {
    //     console.log("This place does not exist")
    //     return {}
    //     //todo: fix log
    // }
    let {tmp_date, tmp_time_start, tmp_time_end} = extractDateAndTimes(date, time_start, time_end);

    const newEvent = await prisma.event.update({
        where: {
            id: id
        },
        data: {
            place,
            name,
            date: tmp_date,
            time_start: tmp_time_start,
            time_end: tmp_time_end,
            description
        },
    }).catch(error =>{
        if (error.code === "P2025"){
            console.log("Id %d is not recognised",id)
            // console.log(error.meta)
            //todo: fox log
        }
        else{
            console.log(error)
        }
    })
    return (newEvent)
};

const deleteById = async (id) => {
    // if (!await prisma.event.findFirst({
    //     where: {
    //         "id": Number(id)
    //     }
    // })) {
    //     console.log("Event does not exist")
    //     return {}
    //     //todo: fix log
    // }
    const deleteEvent = await prisma.event.delete({
        where: {
            id: id
        },
    }).catch(error =>{
        if (error.code === "P2025"){
            console.log("Id %d is not recognised",id)
            // console.log(error.meta)
            //todo: fox log
        }
        else{
            console.log(error)
        }
    }
    )
    return (deleteEvent)


};
const deleteAll = async () => {
    const deleteEvent = await prisma.event.deleteMany({})
    return deleteEvent
};

function extractDateAndTimes(date, time_start, time_end) {
    let tmp_date = new Date(date)
    let [startHours, startMinutes, startSeconds] = time_start.split(":");
    let tmp_time_start = new Date(0, 0, 0, Number(startHours), Number(startMinutes), Number(startSeconds));

    let [endHours, endMinutes, endSeconds] = time_end.split(":");
    let tmp_time_end = new Date(0, 0, 0, Number(endHours), Number(endMinutes), Number(endSeconds));
    return {tmp_date, tmp_time_start, tmp_time_end};
}

// getAll: getAllEvents
module.exports = {
    getAll,
    getById,
    createEvent,
    updateById,
    deleteById,
    deleteAll,
};