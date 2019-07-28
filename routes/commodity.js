const router = require('koa-router')()
const User = require('../Add/User')
const UserComm = require('../Add/Comm')
router.prefix('/comm')

router.get('/allComm', async (ctx) => {
  let data = await User.find()
  ctx.body = {
    code: -1,
    data
  }
})

router.post('/getCommodity', async (ctx) => {
  let {id} = ctx.request.body
  let data = await UserComm.findOne({id})
  ctx.body = {
    code: -1,
    data
  }
})
router.post('/commodity', async (ctx) => {
  let sid = ctx.request.body.id
  let data = await UserComm.findOne({id: sid})
  ctx.body = {
    code: -1,
    data
  }
})

module.exports = router