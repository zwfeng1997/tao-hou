const router = require('koa-router')()
const Cart = require('../Add/shoppingCart')
const axios = require('axios')

router.prefix('/cart')

router.post('/getCartData', async (ctx) => {
  let sid = ctx.request.body.id
  let data = await Cart.findOne({id: sid})
  ctx.body = {
    code: -1,
    data
  }
})

router.post('/addCartNum', async (ctx) => {
  let {title,id, uid}= ctx.request.body
  let data = await Cart.findOne({id: uid}, (err, user) => {
    user.cartList.forEach(item => {
      if (item.title === title) {
        item.itemList.forEach(info => {
          if (info.id === id) {
            info.num = info.num + 1
            user.save((err) => {
              console.log('修改成功')
            })
          }
        });
      }
    });
  })
  ctx.body = {
    code: -1
  }
})

router.post('/ReduceCartNum', async (ctx) => {
  let {title,id, uid}= ctx.request.body
  let data = await Cart.findOne({id: uid}, (err, user) => {
    user.cartList.forEach(item => {
      if (item.title === title) {
        item.itemList.forEach(info => {
          if (info.id === id) {
            if (info.num === 1) {
              return false
            }
            info.num = info.num - 1
            user.save((err) => {
              console.log('修改成功')
            })
          }
        });
      }
    });
  })
  ctx.body = {
    code: -1
  }
})

router.post('/CartListSelected', async (ctx) => {
  let {title,id, uid}= ctx.request.body
  let data = await Cart.findOne({id: uid}, (err, user) => {
    user.cartList.forEach(item => {
      if (item.title === title) {
        item.itemList.forEach(info => {
          if (info.id === id) {
            info.selected = !info.selected          
            user.save((err) => {
              console.log('修改成功')
            })
          }
        });
      }
    });
  })
  ctx.body = {
    code: -1
  }
})

router.post('/CartListAllElectionsTure', async (ctx) => {
  let {title, uid}= ctx.request.body
  let data = await Cart.findOne({id: uid}, (err, user) => {
    user.cartList.forEach(item => {
      if (item.title === title) {
        item.itemList.forEach(info => {
          info.selected = true
          user.save((err) => {
            console.log('修改成功')
          })
        });
      }
    });
  })
  ctx.body = {
    code: -1
  }
})

router.post('/CartListAllElectionsFlase', async (ctx) => {
  let {title, uid}= ctx.request.body
  let data = await Cart.findOne({id: uid}, (err, user) => {
    user.cartList.forEach(item => {
      if (item.title === title) {
        item.itemList.forEach(info => {
          info.selected = false
          user.save((err) => {
            console.log('修改成功')
          })
        });
      }
    });
  })
  ctx.body = {
    code: -1
  }
})

router.post('/AddCart', async (ctx) => {
  let {title, uid, desc, id, imgUrl, num, selected, price}= ctx.request.body
  let MyFind = false
  let IFind = false
  await Cart.findOne({id: uid}, (err, user) => {
    user.cartList.forEach(item => {
      if (item.title === title) {
        MyFind = true
        item.itemList.forEach(info => {
          if (info.id === id) {
            IFind = true
            info.num = info.num + num
            user.save((err) => {
              console.log('修改成功')
            })
          }
        })
        if (!IFind) {
          item.itemList.push({
            desc,
            id,
            imgUrl,
            num,
            selected,
            price
          })
          user.save((err) => {
            console.log('修改成功')
          })
        }
      }
    })
    if (!MyFind) {
      user.cartList.push({
        title,
        itemList: [
          {
            desc,
            id,
            imgUrl,
            num,
            selected,
            price
          }
        ]
      })
      user.save((err) => {
        console.log('修改成功')
      })
    }
  })
  ctx.body = {
    code: -1
  }
})

router.post('/Settlement', async (ctx) => {
  let {uid} = ctx.request.body
  let orderList = []
  await Cart.findOne({id: uid}, (err, user) => {
    user.cartList.forEach(item => {
      item.itemList.forEach(info => {
        if (info.selected) {
          orderList.push({
            info,
            title: item.title
          })
          info.remove()
          user.save((err) => {
            console.log('修改成功')
          })
        }
      })
    })
  })

  Cart.findOne({id: uid}, (err, user) => {
    user.cartList.forEach(item => {
      if (item.itemList.length == 0) {
        item.remove()
        user.save((err) => {
          console.log('修改成功')
        })
      }
    })
  })
  let id = new Date().getTime() + Math.random().toString(16).slice(2,6).toUpperCase()
  let value = {
    id,
    list: []
  }
  orderList.forEach(item => {
    value.list.push({
      title: item.title,
      id: item.info.id,
      desc: item.info.desc,
      num: item.info.num,
      price: item.info.price,
      evaluate: false,
      imgUrl: item.info.imgUrl,
    })
  })
  let data = {
    uid,
    list: value
  }
  await axios.post('http://localhost:3000/order/AddOrder', data)
    .then(res => {})
  ctx.body = {
    code: -1,
    data
  }
})
module.exports = router
