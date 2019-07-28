const router = require('koa-router')()
const Redis = require('koa-redis')
const nodeMailer = require('nodemailer')
const User = require('../dbs/models/users')
const Cart = require('../Add/shoppingCart')
const Order = require('../Add/Order')
const Passport = require('../dbs/utils/passport')
const Email = require('../dbs/config')
const axios = require('../dbs/utils/axios')

router.prefix('/users')
let Store = new Redis().client

router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body
  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
      return false
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
    return false
  }

  let user = await User.find({
    username
  })

  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '账号已经被注册了'
    }
    return false
  }

  let nuser = await User.create({
    username,
    password,
    email
  })

  if (nuser) {
    let res = await axios.post('/users/signin', {
      username,
      password
    })

    if (res.data.code === 0) {
      console.log(res.data.user._id)
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
      let value = {
        id: res.data.user._id,
        orderList: []
      }
      let shu = {
        id: res.data.user._id,
        cartList: []
      }
      await Order.create(value)
      await Cart.create(shu)
      return true
    } else {
     ctx.body = {
       code: -1,
       msg: '服务器异常，注册失败'
     }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '服务器异常，注册失败'
    }
  }
})

router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', (err, user, info, status) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登陆成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: -1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.post('/verify', async (ctx) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内一次'
    }
    return false
  }
  let transporter = nodeMailer.createTransport({
    service: 'qq',
    host: Email.redis.host,
    port: 456,
    secureConnection: true,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })

  let ko = {
    code: Email.code(),
    expire: Email.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '仿淘宝网注册码',
    html: `您在仿淘宝网的注册码是${ko.code}`
  }
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      return console.log('error-----')
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟，请不要告诉他人'
  }
})

router.get('/exit', async (ctx, nexr) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const {username, email} = ctx.session.passport.user
    ctx.body = {
      code: 0,
      user: username,
      email
    }
  } else {
    ctx.body = {
      code: -1,
      user: '',
      email: ''
    }
  }
})
module.exports = router
