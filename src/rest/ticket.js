const Router = require('@koa/router');
const ticketService = require('../service/ticket');
const Joi = require("joi");
const validate = require("../core/validation")


const getAllTickets = async (ctx) => {
    ctx.body = await ticketService.getAll()
}
const getTicketById = async (ctx) => {
    ctx.body = await ticketService.getById(Number(ctx.params.id));
}

const createTicket = async (ctx) => {
    const newTicket = await ticketService.create({
        ...ctx.request.body,
        purchase_date: ctx.request.body.purchase_date,
        purchase_time: ctx.request.body.purchase_time
    });
    ctx.body = newTicket
}//todo: validation

const updateTicketById = async (ctx) => {
    const newTicket = await ticketService.updateById({
        ...ctx.request.body,
        id: Number(ctx.params.id),
        purchase_date: ctx.request.body.purchase_date,
        purchase_time: ctx.request.body.purchase_time
    });
    ctx.body = newTicket
}//todo: validation

const deleteTicketById = async (ctx) => {
    ctx.body = await ticketService.deleteById(Number(ctx.params.id));
};
const deleteAllTickets = async (ctx) => {
    ctx.body = await ticketService.deleteAll();
};


/**
 * Install ticket routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
        prefix: '/tickets',
    });

    //todo: VALIDATION
    router.get('/', getAllTickets());
    router.post('/', createTicket()); // validate(createTicket.validationScheme),
    router.get('/:id', getTicketById()), //validate(getTicketById().validationScheme),
        router.patch('/:id', updateTicketById()),
        router.delete('/:id', deleteTicketById()),
        router.delete('/', deleteAllTickets());

    app.use(router.routes())
        .use(router.allowedMethods());
};