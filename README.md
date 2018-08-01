### 项目改善

### 一、项目代码优化与重构建议


##### 1. 加入代码风格校验

```
npm i standard husky  snazzy -S


"precommit": "standard  'app/**/*.js' 'wechat/**/*.js' 'wechat-lib/**/*.js' | snazzy",
```


##### 2. 代码用法优化

app.js

resolve(__dirname + '/app/views')
resolve(__dirname, 'app/views')

views/wechat.pug

head.pug => wechat_head.pug

##### 增加 gitinore

```
.DS_Store
npm-debug.log
node_modules
.vscode
```

### 3. 植入 babel 编译支持更多语法特性

### 4. 规划 config 的加载位置

也可以对 config 加密，在项目中进行解密

### 5. API 的进一步分离，让 controller 层只有业务逻辑，无任何 model 层的直接操作能力


### 二. 往线上进行发布部署

- 剔除敏感密码部分，在进行仓库 push
- 发布脚本 ecosyste.yaml
- 服务器 /www 目录，保证 nginx/mongodb 的配置正确性
- pm2 deloy

### 三. 课程大结局，总结展望