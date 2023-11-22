const Router = require('@koa/router');
const eventService = require('../service/event');
// const {EVENTS: Event} = require("../data/mock_data");

const getAllEvents = async (ctx) => {
    ctx.body = await eventService.getAllEvents()
};

const createEvent = async (ctx) => {
    const newEvent = await eventService.createEvent({
        ...ctx.request.body,
        place: ctx.request.body.place,
        name: ctx.request.body.name,
        date: ctx.request.body.date,
        timeStart: ctx.request.body.timeStart,
        timeEnd: ctx.request.body.timeEnd,
        description: ctx.request.body.description
    });
    ctx.body = newEvent
};

const getEventById = async (ctx) => {
    ctx.body = await eventService.getEventById(Number(ctx.params.id));
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

    router.get('/', getAllEvents);
    router.post('/', createEvent);
    router.get('/:id', getEventById);

    app.use(router.routes())
        .use(router.allowedMethods());
};