const Router = require('@koa/router');
const Joi = require('joi')
    .extend(require('@joi/date'));
const placeService = require('../service/place');
const validate = require('../core/validation');
const {requireAuthentication, makeRequireRole} = require("../core/auth");
const Role = require("../core/roles");

const getAllPlaces = async (ctx) => {
    ctx.body = await placeService.getAll();
};
getAllPlaces.validationScheme = null;

const createPlace = async (ctx) => {
    const place = await placeService.create({
        ...ctx.request.body,
        name: ctx.request.body.name,
        street: ctx.request.body.street,
        postal_code: ctx.request.body.postal_code,
        province: ctx.request.body.province,
        country: ctx.request.body.country,
    });
    ctx.status = 201; // created
    ctx.body = place;
};
createPlace.validationScheme = {
    body: {
        name: Joi.string().max(255),
        street: Joi.string().max(255),
        postal_code: Joi.number().integer().min(1000).max(9999),
        province: Joi.string().max(255),
        country: Joi.string().max(255)
    },
};

const getPlaceById = async (ctx) => {
    ctx.body = await placeService.getById(Number(ctx.params.id));
};
getPlaceById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

const updatePlace = async (ctx) => {
    ctx.body = await placeService.updateById(Number(ctx.params.id), {
        ...ctx.request.body,
        id: Number(ctx.params.id),
        name: ctx.request.body.name,
        street: ctx.request.body.street,
        postal_code: Joi.number().integer().min(1000).max(9999),
        province: ctx.request.body.province,
        country: ctx.request.body.country,
    });
    ctx.status = 201 // created
};
updatePlace.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
    body: {
        name: Joi.string().max(255),
        street: Joi.string().max(255),
        postal_code: Joi.number().integer(),
        province: Joi.string().max(255),
        country: Joi.string().max(255)
    },
};

const deletePlaceById = async (ctx) => {
    await placeService.deleteById(ctx.params.id);
    ctx.status = 200;// ok
};
deletePlaceById.validationScheme = {
    params: {
        id: Joi.number().integer().positive(),
    },
};

const deleteAllPlaces = async (ctx) => {
    ctx.body = await placeService.deleteAll();
    ctx.status = 204 // no content
};
deleteAllPlaces.validationScheme = null;

/**
 * Install places routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
        prefix: '/places',
    });

    router.use(requireAuthentication)
    const requireAdmin = makeRequireRole(Role.ADMIN);

    router.get('/',
        validate(getAllPlaces.validationScheme),
        getAllPlaces);

    router.post('/',
        requireAdmin,
        validate(createPlace.validationScheme),
        createPlace);

    router.get('/:id',
        validate(getPlaceById.validationScheme),
        getPlaceById);

    router.patch('/:id',
        requireAdmin,
        validate(updatePlace.validationScheme),
        updatePlace);

    router.delete('/:id',
        requireAdmin,
        validate(deletePlaceById.validationScheme),
        deletePlaceById);

    router.delete('/',
        requireAdmin,
        validate(deleteAllPlaces.validationScheme),
        deleteAllPlaces);


    app.use(router.routes()).use(router.allowedMethods());
};
