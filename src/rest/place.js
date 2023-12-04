const Router = require('@koa/router');
const placeService = require('../service/place');

const getAllPlaces = async (ctx) => {
    ctx.body = await placeService.getAll()
};

const createPlace = async (ctx) => {
    const newPlace = await placeService.create({
        ...ctx.request.body,
        place: ctx.request.body.name,
        name: ctx.request.body.street,
        date: ctx.request.body.postal_code,
        timeStart: ctx.request.body.province,
        timeEnd: ctx.request.body.country,
    });
    ctx.body = newPlace
};

const getPlaceById = async (ctx) => {
    ctx.body = placeService.getById(Number(ctx.params.id));
};

const updatePlaceById = async (ctx) => {
    ctx.body = placeService.updateById({
        ...ctx.request.body,
        id: Number(ctx.params.id),
        name: ctx.request.body.name,
        street: ctx.request.body.street,
        postal_code: ctx.request.body.postal_code,
        province: ctx.request.body.province,
        country: ctx.request.body.country,
    });
};

const deletePlaceById = async (ctx) => {
    ctx.body = placeService.deleteById(Number(ctx.params.id));
};

const deleteAllPlaces = async (ctx) => {
    ctx.body = placeService.deleteAll(Number(ctx.params.id));
};


/**
 * Install place routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
        prefix: '/place',
    });

    router.get('/', getAllPlaces);
    router.post('/', createPlace);
    router.get('/:id', getPlaceById);
    router.patch('/:id', updatePlaceById);
    router.delete('/:id', deletePlaceById);
    router.delete('/', deleteAllPlaces);

    app.use(router.routes())
        .use(router.allowedMethods());
};