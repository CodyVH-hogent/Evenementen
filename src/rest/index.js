const Router = require('@koa/router');
const installEventRouter = require('./event');
// const installTicketRouter = require('./Ticket');
// const installPersonRouter = require('./Person');
const installPlaceRouter = require('./Place');
const installHealthRouter = require('./Health');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
    const router = new Router({
        prefix: '/api',
    });
    installEventRouter(router);
    // installTicketRouter(router);
    // installPersonRouter(router);
    installPlaceRouter(router);
    installHealthRouter(router);

    app.use(router.routes())
        .use(router.allowedMethods());
};