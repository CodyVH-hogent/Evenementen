const Router = require('@koa/router');
const Joi = require('joi');
const eventService = require('../service/event');
const validate = require('../core/validation');
const {requireAuthentication, makeRequireRole} = require("../core/auth");
const Role = require("../core/roles");

const getAllEvents = async (ctx) => {
    ctx.body = await eventService.getAll();
};
getAllEvents.validationScheme = null;

const getEventById = async (ctx) => {
    const event = await eventService.getById(ctx.params.id);
    ctx.status = 200;
    ctx.body = event;
};
getEventById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

const createEvent = async (ctx) => {
    const event = await eventService.create({
        ...ctx.request.body,
        place_id: ctx.request.body.place_id,
        name: ctx.request.body.name,
        start: ctx.request.body.start,
        end: ctx.request.body.end,
        description: ctx.request.body.description
    })//todo: tickets moeten nog worden toegevoegd kunnen worden, rare zin, deal with it okay?
    ctx.status = 200;
    ctx.body = event;
};
createEvent.validationScheme = {
    body: {
        place_id: Joi.number().integer().positive(),
        name: Joi.string().max(255),
        // start: Joi.string().regex(/([0-9]{2})\:([0-9]{2}):([0-9]{2})/),//todo: werkt dit? Hoe is dit geformatteerd (en ook de datum hihi)
        start: Joi.any(),//todo: werkt dit? Hoe is dit geformatteerd (en ook de datum hihi)
        // end: Joi.string().regex(/([0-9]{2})\:([0-9]{2}):([0-9]{2})/),
        end: Joi.any(),
        description: Joi.string().max(255),
    },
};

const updateEventById = async (ctx) => {
    const event = await eventService.updateById({
        ...ctx.request.body,
        id: Number(ctx.params.id),
        place: ctx.request.body.place,
        name: ctx.request.body.name,
        start: ctx.request.body.time_start,
        end: ctx.request.body.time_end,
        description: ctx.request.body.description
    });
    ctx.status = 200;
    ctx.body = event;
};
updateEventById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
    body: {
        place: Joi.string().max(255),
        name: Joi.string().max(255),
        start: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),//todo: werkt dit? Hoe is dit geformatteerd (en ook de datum hihi)
        end: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
        description: Joi.string().max(255),
    },
};

const deleteEventById = async (ctx) => {
    const event = await eventService.deleteById(ctx.params.id);
    ctx.status = 200;
    ctx.body = event
};
deleteEventById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

const deleteAllEvents = async (ctx) => {
    ctx.body = await eventService.deleteAll();
};
deleteAllEvents.validationScheme = null;



module.exports = (app) => {
    const router = new Router({
        prefix: '/events',
    });

    const requireAdmin = makeRequireRole(Role.ADMIN);

    router.use(requireAuthentication)

    router.get('/',
        validate(getAllEvents.validationScheme),
        getAllEvents);

    router.get('/:id',
        validate(getEventById.validationScheme),
        getEventById);

    router.post('/',
        requireAdmin,
        validate(createEvent.validationScheme),
        createEvent);

    router.patch('/:id',
        requireAdmin,
        validate(updateEventById.validationScheme),
        updateEventById);

    router.delete('/:id',
        requireAdmin,
        validate(deleteEventById.validationScheme),
        deleteEventById);

    router.delete('/',
        requireAdmin,
        validate(deleteAllEvents.validationScheme),
        deleteAllEvents);

    app.use(router.routes()).use(router.allowedMethods());
};
