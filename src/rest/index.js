const Router = require('@koa/router');
const installPersonRouter = require('./person');
const installHealthRouter = require('./health');
const installPlaceRouter = require('./place');
const installEventRouter = require('./event');
const installTicketRouter = require('./ticket');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
    const router = new Router({
        prefix: '/api',
    });

    installPersonRouter(router);
    installHealthRouter(router);
    installPlaceRouter(router);
    installEventRouter(router);
    installTicketRouter(router);

    app.use(router.routes())
        .use(router.allowedMethods());
};
