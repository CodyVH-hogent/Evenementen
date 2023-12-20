const Router = require('@koa/router');
const Joi = require('joi');
const validate = require('../core/validation');
const personService = require('../service/person');
const {requireAuthentication, makeRequireRole} = require('../core/auth');
const Role = require('../core/roles');


const getAllPersons = async (ctx) => {
    ctx.body = await personService.getAll();
};
getAllPersons.validationScheme = null;

const getPersonById = async (ctx) => {
    ctx.body = await personService.getById(Number(ctx.params.id));
};
getPersonById.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive(),
    }),
};

const login = async (ctx) => {
    const person = await personService.login({
        ...ctx.request.body,
        email: ctx.request.body.email,
        password: ctx.request.body.password,
    })
    ctx.status = 200;
    ctx.body = person
}
login.validationScheme = {
    body: Joi.object({
        email: Joi.string().max(255),
        password: Joi.string().max(255),
    }),
};

const registerPerson = async (ctx) => {
    const person = await personService.create({
        ...ctx.request.body,
        first_name: ctx.request.body.first_name,
        last_name: ctx.request.body.last_name,
        email: ctx.request.body.email,
        tickets: ctx.request.body.tickets,
        password: ctx.request.body.password,
        roles: ctx.request.body.roles
    });
    ctx.status = 201;
    ctx.body = person;
};
registerPerson.validationScheme = {
    body: {
        first_name: Joi.string().max(255),
        last_name: Joi.string().max(255),
        email: Joi.string().max(255),
        tickets: Joi.array().items(Joi.number().integer().positive()),
        password: Joi.string().max(255),
        roles: Joi.array().items(Joi.string().max(255)),
    },
};


const updatePerson = async (ctx) => {
    const person = await personService.updateById({
        ...ctx.request.body,
        id: Number(ctx.params.id),
        first_name: ctx.request.body.first_name,
        last_name: ctx.request.body.last_name,
        email: ctx.request.body.email,
        password: ctx.request.body.password,
    });
    ctx.status = 200
    ctx.body = person
};
updatePerson.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
    body: {
        first_name: Joi.string().max(255),
        last_name: Joi.string().max(255),
        email: Joi.string().max(255),
        password: Joi.string().max(255),
    },
};

const deletePersonById = async (ctx) => {
    ctx.body = await personService.deleteById(Number(ctx.params.id));
    ctx.status = 204;// todo check statuscode
};
deletePersonById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

const deleteAllPersons = async (ctx) => {
    ctx.body = await personService.deleteAll();
    ctx.status = 204;// todo check statuscode
};
deleteAllPersons.validationScheme = null;


const checkUserId = (ctx, next) => {
    const {person_id, roles} = ctx.state.session;
    const {id} = ctx.params;

    // You can only get your own data unless you're an admin
    if (id !== person_id && !roles.includes(Role.ADMIN)) {
        return ctx.throw(
            403,
            "You are not allowed to view this user's information",
            {
                code: 'FORBIDDEN',
            }
        );
    }
    return next();
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

    // public
    router.post('/login', validate(login.validationScheme), login);
    router.post('/register', validate(registerPerson.validationScheme), registerPerson);


    const requireAdmin = makeRequireRole(Role.ADMIN);


    // authorization, authentication
    router.use(requireAuthentication)
    router.get('/',
        requireAdmin,
        validate(getAllPersons.validationScheme),
        getAllPersons);

    router.get('/:id',
        validate(getPersonById.validationScheme),
        checkUserId,
        getPersonById);

    router.patch('/:id',
        requireAdmin,
        validate(updatePerson.validationScheme),
        updatePerson);

    router.delete('/:id',
        requireAdmin,
        validate(deletePersonById.validationScheme),
        deletePersonById);

    router.delete('/',
        requireAdmin,
        validate(deleteAllPersons.validationScheme),
        deleteAllPersons);


    app.use(router.routes()).use(router.allowedMethods());
};
