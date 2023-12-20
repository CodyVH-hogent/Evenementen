const Router = require('@koa/router');
const Joi = require('joi')
    .extend(require('@joi/date'));
const ticketService = require('../service/ticket');
const validate = require('../core/validation');
const {requireAuthentication, makeRequireRole} = require("../core/auth");
const Role = require("../core/roles");

const getAllTickets = async (ctx) => {
    ctx.body = await ticketService.getAll();
};
getAllTickets.validationScheme = null;

const getTicketById = async (ctx) => {
    const ticket = await ticketService.getById(ctx.params.id);
    ctx.body = ticket;
};
getTicketById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

const createTicket = async (ctx) => {
    const ticket = await ticketService.create({
        ...ctx.request.body,
        purchase_date: ctx.request.body["purchase_date"],
        event_id: ctx.request.body["event_id"]
    })
    ctx.status = 201;// created
    ctx.body = ticket;
};
createTicket.validationScheme = {
    body: {
        purchase_date: Joi.date().format('YYYY-MM-DD HH:mm:ss'),
        event_id: Joi.number().integer().positive(),
    },
};

const updateTicketById = async (ctx) => {
    const ticket = await ticketService.updateById(ctx.params.id, {
        ...ctx.request.body,
        purchase_date: ctx.body["purchase_date"],
        events: ctx.body["events"]
    });
    ctx.status = 201;// created
    ctx.body = ticket;
};
updateTicketById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
    body: {
        purchase_date: Joi.date().format("YYYY-MM-DD HH:mm:ss"),
    },
};

const deleteTicketById = async (ctx) => {
    const ticket = await ticketService.deleteById(ctx.params.id);
    ctx.status = 200;// ok
    ctx.body = ticket
};
deleteTicketById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

const deleteAllTickets = async (ctx) => {
    ctx.body = await ticketService.deleteAll();
    ctx.status = 204;// no content
};
deleteAllTickets.validationScheme = null;


module.exports = (app) => {
    const router = new Router({
        prefix: '/tickets',
    });

    router.use(requireAuthentication)
    const requireAdmin = makeRequireRole(Role.ADMIN);

    router.get('/',
        requireAdmin,
        validate(getAllTickets.validationScheme),
        getAllTickets);

    router.get('/:id',//todo: een user zou wel zijn eigen ticket moeten kunnen zien door het id mee te geven?
        requireAdmin,
        validate(getTicketById.validationScheme),
        getTicketById);

    router.post('/',
        requireAdmin,
        validate(createTicket.validationScheme),
        createTicket);

    router.patch('/:id',
        requireAdmin,
        validate(updateTicketById.validationScheme),
        updateTicketById);

    router.delete('/:id',
        requireAdmin,
        validate(deleteTicketById.validationScheme),
        deleteTicketById);

    router.delete('/',
        requireAdmin,
        validate(deleteAllTickets.validationScheme),
        deleteAllTickets);

    app.use(router.routes()).use(router.allowedMethods());
};
