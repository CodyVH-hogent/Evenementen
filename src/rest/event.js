const Router = require('@koa/router');
const eventService = require('../service/event');
const Joi = require("joi");
const validate = require("../core/validation")

const getAllEvents = async (ctx) => {
    ctx.body = await eventService.getAllEvents()
};

const getEventById = async (ctx) => {
    ctx.body = await eventService.getById(Number(ctx.params.id));
};

const createEvent = async (ctx) => {
    const newEvent = await eventService.createEvent({
        ...ctx.request.body,
        place: ctx.request.body.place,
        name: ctx.request.body.name,
        date: ctx.request.body.date,
        time_start: ctx.request.body.time_start,
        time_end: ctx.request.body.time_end,
        description: ctx.request.body.description
    });
    ctx.body = newEvent
}

//todo validation
createEvent.validationScheme = {
    body: {
        name: Joi.number(),
        place: Joi.string().length(20),
        description: Joi.string().length(200)
    },
};


const updateEventById = async (ctx) => {
    const newEvent = await eventService.updateById({
        ...ctx.request.body,
        id: Number(ctx.params.id),
        place: ctx.request.body.place,
        name: ctx.request.body.name,
        date: ctx.request.body.date,
        time_start: ctx.request.body.time_start,
        time_end: ctx.request.body.time_end,
        description: ctx.request.body.description
    });
    ctx.body = newEvent
}

//todo validation ^^
// createEvent.validationScheme = {
//     body: {
//         name: Joi.number(),
//         place: Joi.string().length(20),
//         description: Joi.string().length(200)
//     },
// };


const deleteEventById = async (ctx) => {
    ctx.body = await eventService.deleteById(Number(ctx.params.id));
};
const deleteAllEvents = async (ctx) => {
    ctx.body = await eventService.deleteAll();
};


/**
 * Install event routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
        prefix: '/events',
    });

    //todo: VALIDATION
    router.get('/', getAllEvents);
    router.post('/', createEvent); // validate(createEvent.validationScheme),
    router.get('/:id', validate(getEventById.validationScheme), getEventById),
        router.patch('/:id', updateEventById),
        router.delete('/:id', deleteEventById),
        router.delete('/', deleteAllEvents);

    app.use(router.routes())
        .use(router.allowedMethods());
};