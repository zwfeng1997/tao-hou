const router = require('koa-router')()
const User = require('../Add/User')
const UserComm = require('../Add/Comm')
const ShoppingCart = require('../Add/shoppingCart')
const UserId = require('../dbs/models/users')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/zwf', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello ZhouWeifeng!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 string',
    cookie: ctx.cookies.get('pivd')
  }
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/add', async (ctx) => {
  let data = await User.create( ctx.request.body )
  ctx.body = {
    code: 1,
    data
  }
})

router.post('/addComm', async (ctx) => {
  console.log(ctx.request.body)
  let data = await UserComm.create( ctx.request.body )
  ctx.body = {
    code: 1,
    data
  }
})

router.post('/addshoppingCart', async (ctx) => {
  // console.log(ctx.request.body)
  let data = await ShoppingCart.create( ctx.request.body )
  ctx.body = {
    code: 1,
    data
  }
})

router.post('/userId', async (ctx) => {
  let name = ctx.request.body.name
  console.log(name,'-----')
  let data = await UserId.findOne({username: name})
  ctx.body = {
    code: -1,
    data
  }
})

module.exports = router
