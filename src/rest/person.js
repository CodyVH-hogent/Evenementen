const Router = require('@koa/router');
const personService = require('../service/person');
const Joi = require("joi");
const validate = require("../core/validation")


const getAllPersons = async (ctx) => {
    ctx.body = await personService.getAll()
}
const getPersonById = async (ctx) => {
    ctx.body = await personService.getById(Number(ctx.params.id));
}

const createPerson = async (ctx) => {
    const newPerson = await personService.create({
        ...ctx.request.body,
        purchase_date: ctx.request.body.purchase_date,
        purchase_time: ctx.request.body.purchase_time
    });
    ctx.body = newPerson
}//todo: validation

const updatePersonById = async (ctx) => {
    const newPerson = await personService.updateById({
        ...ctx.request.body,
        id: Number(ctx.params.id),
        purchase_date: ctx.request.body.purchase_date,
        purchase_time: ctx.request.body.purchase_time
    });
    ctx.body = newPerson
}//todo: validation

const deletePersonById = async (ctx) => {
    ctx.body = await personService.deleteById(Number(ctx.params.id));
};
const deleteAllPersons = async (ctx) => {
    ctx.body = await personService.deleteAll();
};


/**
 * Install person routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
        prefix: '/persons',
    });

    //todo: VALIDATION
    router.get('/', getAllPersons());
    router.post('/', createPerson()); // validate(createPerson.validationScheme),
    router.get('/:id', getPersonById()), //validate(getPersonById().validationScheme),
        router.patch('/:id', updatePersonById()),
        router.delete('/:id', deletePersonById()),
        router.delete('/', deleteAllPersons());

    app.use(router.routes())
        .use(router.allowedMethods());
};