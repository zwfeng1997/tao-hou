const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
router.prefix('/upload')


router.post('/post', async (ctx) => {
    const files = []
    await ctx.request.body.fileList.forEach(item => {
      files.push(item.content)
    })
    let filePath = []
    files.forEach(item => {
      var path = 'public/uploads/zhouweifeng-' + Date.now() + '.jpg';
      var base64 = item.replace(/^data:image\/\w+;base64,/, "");
      var dataBuffer = new Buffer(base64, 'base64');
      var str = path.slice(7)
      filePath.push(`http://localhost:3000/${str}`)
      fs.writeFile(path, dataBuffer, function(err){
        if(err){
          console.log(err);
        }
      })
    })
    ctx.body = {
      code: -1,
      filePath
    }
})

router.post('/userImg', async (ctx) => {
  const file = ctx.request.body.file
  let filePath = ''
  var path = 'public/uploads/user/zhouweifeng-' + Date.now() + '.jpg';
  var base64 = file.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64, 'base64');
  var str = path.slice(7)
  filePath = `http://localhost:3000/${str}`
  fs.writeFile(path, dataBuffer, function(err){
    if(err){
      console.log(err);
    }
  })
  ctx.body = {
    code: -1,
    filePath
  }
})

module.exports = router