const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const Redis = require('koa-redis')
const koaBody = require('koa-body');
const mongoose = require('mongoose')
const serve = require('koa-static');
const index = require('./routes/index')
const users = require('./routes/users')
const comm = require('./routes/commodity')
const cart = require('./routes/shoppingCart')
const order = require('./routes/order')
const evaluate = require('./routes/evaluate')
const upload = require('./routes/upload')
const dbConfig = require('./dbs/config')
const passport = require('./dbs/utils/passport')

const home   = serve(__dirname+'/public/');
// error handler
onerror(app)
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024,
    keepExtensions: true
  }
}));

app.keys=['key', 'keyskeys']
app.proxy = true
app.use(session({
  key: 'taob',
  prefix: 'taob:uid',
  store: new Redis()
}))
// middlewares

app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})
  .then(()=> console.log('链接成功'))
  .catch((err) => console.log('Error:'+err));

app.use(passport.initialize())

app.use(passport.session())

app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(comm.routes(), comm.allowedMethods())
app.use(cart.routes(), cart.allowedMethods())
app.use(order.routes(), order.allowedMethods())
app.use(evaluate.routes(), evaluate.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())
app.use(home);
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
