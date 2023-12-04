const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const getAll = async function () {
    const tickets = await prisma.ticket.findMany()
    return {
        tickets,
        count: tickets.length
    }
}
const getById = async function (id) {
    const ticket = await prisma.ticket.findFirst({
        where: {id: id}
    })
    return ticket
}
const create = async function ({purchase_date, purchase_time}) {
    let {date, time} = extractDateAndTimes(purchase_date, purchase_time)
    const newTicket = await prisma.ticket.create({
        data: {
            purchase_date: date,
            purchase_time: time
        },
    })
    return (newTicket)
}
const updateById = async function ({id, purchase_date, purchase_time}) {
    let {date, time} = extractDateAndTimes(purchase_date, purchase_time)
    const newTicket = await prisma.ticket.update({
        where: {
            id: id
        },
        data: {
            purchase_date: date,
            purchase_time: time
        },
    }).catch(error => {
        if (error.code === "P2025") {
            console.log("Id %d is not recognised", id)
            // console.log(error.meta)
            //todo: fox log
        } else {
            console.log(error)
        }
    })
    return (newTicket)
}
const deleteById = async function (id) {
    const deleteTicket = await prisma.ticket.delete({
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
    return (deleteTicket)
}
const deleteAll = async function () {
    const deleteTicket = await prisma.ticket.deleteMany({})
    return deleteTicket
}

function extractDateAndTimes(date, time) {
    let tmp_date = new Date(date)
    let [hours, minutes, seconds] = time.split(":");
    let tmp_time = new Date(0, 0, 0, Number(hours), Number(minutes), Number(seconds));
    return {tmp_date, tmp_time};
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    deleteAll,
}