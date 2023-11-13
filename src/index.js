const Koa = require('koa');
const winston = require('winston');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router')
const transactionService = require('./service/transactions')


const app = new Koa();
const router = new Router()

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

// app.use(async (ctx, next) => {
//   console.log('Request Body:', JSON.stringify(ctx.request.body));
//   await next();
// });



app.use(bodyParser());

router.get('/api/events',async(ctx)=>{
  ctx.body = transactionService.getAllEvent()
})

router.post('/api/events',async(ctx) =>{
  const newTransaction = transactionService.createEvent({
  ...ctx.request.body,
  place: ctx.request.body.place,
  name: ctx.request.body.name,
  date: ctx.request.body.date,
  timeStart: ctx.request.body.timeStart,
  timeEnd: ctx.request.body.timeEnd,
  description: ctx.request.body.description
  });
  ctx.body = newTransaction
})

router.get('/api/events/:id', async (ctx) => {
  ctx.body = transactionService.getEventById(Number(ctx.params.id));
});




app.use(router.routes())
app.use(router.allowedMethods())

app.listen(9000, () => {
  logger.info('🚀 Server listening on http://localhost:9000');
});