const { reply } = require('../../wechat/reply')
const config = require('../../config/config')
const api = require('../api/index')
const wechatMiddle = require('../../wechat-lib/middleware')

exports.getSDKSignature = async (ctx, next) => {
  let url = ctx.query.url

  url = decodeURIComponent(url)

  const params = await api.wechat.getSignature(url)

  ctx.body = {
    success: true,
    data: params
  }
}

// 接入微信消息中间件
exports.sdk = async (ctx, next) => {
  const url = ctx.href
  const params = await api.wechat.getSignature(url)

  await ctx.render('wechat/sdk', params)
}

// 接入微信消息中间件
exports.hear = async (ctx, next) => {
  const middle = wechatMiddle(config.wechat, reply)

  await middle(ctx, next)
}

exports.oauth = async (ctx, next) => {
  const state = ctx.query.id
  const scope = 'snsapi_userinfo'
  const target = config.baseUrl + 'userinfo'
  const url = api.wechat.getAuthorizeURL(scope, target, state)

  ctx.redirect(url)
}

exports.userinfo = async (ctx, next) => {
  const userData = await api.wechat.getUserinfoByCode(ctx.query.code)

  ctx.body = userData
}

function isWechat (ua) {
  if (ua.indexOf('MicroMessenger') >= 0) {
    return true
  } else {
    return false
  }
}

exports.checkWechat = async (ctx, next) => {
  const ua = ctx.headers['user-agent']
  const code = ctx.query.code

  // 所有的网页请求都会流经这个中间件，包括微信的网页访问
  // 针对 POST 非 GET 请求，不走用户授权流程
  if (ctx.method === 'GET') {
    // 如果参数带 code，说明用户已经授权
    if (code) {
      await next()
      // 如果没有 code，且来自微信访问，就可以配置授权的跳转
    } else if (isWechat(ua)) {
      const target = ctx.href
      const scope = 'snsapi_userinfo'
      const url = api.wechat.getAuthorizeURL(scope, target, 'fromWechat')

      ctx.redirect(url)
    } else {
      await next()
    }
  } else {
    await next()
  }
}

exports.wechatRedirect = async (ctx, next) => {
  const { code, state } = ctx.query

  if (code && state === 'fromWechat') {
    const userData = await api.wechat.getUserinfoByCode(code)
    const user = await api.wechat.saveWechatUser(userData)

    ctx.session.user = {
      _id: user._id,
      role: user.role,
      nickname: user.nickname
    }

    ctx.state = Object.assign(ctx.state, {
      user: {
        _id: user._id,
        role: user.role,
        nickname: user.nickname
      }
    })
  }

  await next()
}
