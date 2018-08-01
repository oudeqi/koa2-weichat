const { resolve } = require('path')
const isProd = process.env.NODE_ENV === 'production'

let cfg = {
  port: 3007,
  db: 'mongodb://localhost/wechat7day',
  wechat: {
    // appID: 'wxe9e2ec8d631c277d',
    // appSecret: 'ebacae6574a8aa091684c937edf6f48d',
    appID: 'wxe9e2ec8d631c277d',
    appSecret: 'ebacae6574a8aa091684c937edf6f48d',
    token: 'imoocisareallyamzingplacetolearn'
  },
  // 这里是你的代理地址
  baseUrl: 'http://wechat77online.vipgz1.idcfengye.com/'
  // https://wechat7online.iblack7.com/wx
}

if (isProd) {
  const config = require(resolve(__dirname, '../../../../config/config.json'))

  cfg = Object.assign(cfg, config)
}

module.exports = cfg
