const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const getAll = async function () {
    const persons = await prisma.person.findMany()
    return {
        persons,
        count: persons.length
    }
}
const getById = async function (id) {
    const person = await prisma.person.findFirst({
        where: {id: id}
    })
    return person
}
const create = async function ({first_name, last_name}) {
    const newPerson = await prisma.person.create({
        data: {
            first_name,
            last_name
        },
    })
    return (newPerson)
}
const updateById = async function ({id, first_name, last_name}) {
    const newPerson = await prisma.person.update({
        where: {
            id: id
        },
        data: {
            first_name,
            last_name
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
    return (newPerson)
}
const deleteById = async function (id) {
    const deletePerson = await prisma.person.delete({
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
    return (deletePerson)
}
const deleteAll = async function () {
    const deletePerson = await prisma.person.deleteMany({})
    return deletePerson
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    deleteAll,
}