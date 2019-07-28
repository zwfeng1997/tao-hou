const router = require('koa-router')()
const Evaluate = require('../Add/Evaluate')

router.prefix('/evaluate')
router.post('/addEvaluate', async (ctx) => {
  let {id, imgUser, img, desc, name} = ctx.request.body
  let value = {
    imgUser,
    img,
    desc,
    name
  }
  let data = await Evaluate.update({id: id}, {
      $push:{ userEvaluateList: value }
    })
  ctx.body = {
    code: -1,
    data
  }
})

router.post('/getEvaluate', async (ctx) => {
  let {id} = ctx.request.body
  let data = await Evaluate.findOne({id})
  ctx.body = {
    code: -1,
    data
  }
})
module.exports = router