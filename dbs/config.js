module.exports = {
  dbs:'mongodb://localhost/jd',
  redis: {
    get host(){
      return 'localhost'
    },
    get port(){
      return 6379
    }
  },
  smtp: {
    get host(){
      return 'smtp.qq.com'
    },
    get user(){
      return '2812948720@qq.com'
    },
    get pass(){
      return 'siwvyotobcledgih'
    }
  },
  get code(){
    return () => {
      return Math.random().toString(16).slice(2,6).toUpperCase()
    }
  },
  get expire(){
    return () => {
      return new Date().getTime()+60*1000
    }
  }
}
