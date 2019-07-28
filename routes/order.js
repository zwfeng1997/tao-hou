const router = require('koa-router')()
const Oreder = require('../Add/Order')

router.prefix('/order')

router.post('/AddOrder', async (ctx) => {
  const {list, uid} =ctx.request.body
  await Oreder.update({id: uid}, {
    $push:{ orderList: list }
  })
  ctx.body={
    code: -1
  }
})

router.post('/getOrder', async (ctx) => {
  let {uid} = ctx.request.body
  let data = await Oreder.findOne({id: uid})
  ctx.body = {
    code: -1,
    data
  }
})

router.post('/selectedEvaluate', async (ctx) => {
  let {sid, uid, id} = ctx.request.body
  console.log(sid, uid, id)
  let data = await Oreder.findOne({id: uid}, (err, user) => {
    user.orderList.forEach(item => {
      if (item.id === sid) {
        console.log(item.id)
        item.list.forEach(info => {
          if (info.id === id) {
            console.log(info.id)
            info.evaluate = true
            user.save((err) => {
              console.log('修改成功')
            })
          }
        })
      }
    });
  })
  ctx.body = {
    code: -1,
    data
  }
})
module.exports = router