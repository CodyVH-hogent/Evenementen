const Router = require('@koa/router');
const placeService = require('../service/place');
// const {EVENTS: Event} = require("../data/mock_data");

const getAllPlaces = async (ctx) => {
    ctx.body = await placeService.getAllEvents()
};

const createPlace = async (ctx) => {
    const newEvent = await placeService.createEvent({
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
    ctx.body = placeService.getEventById(Number(ctx.params.id));
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

    router.get('/', getAllPlaces);
    router.post('/', createPlace);
    router.get('/:id', getEventById);

    app.use(router.routes())
        .use(router.allowedMethods());
};