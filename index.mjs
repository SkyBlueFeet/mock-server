import jsonServer from 'json-server'
import { Router } from 'express'
import Glob from 'fast-glob'
import _ from 'lodash'
import path from 'path'
import consola from 'consola'


import { __dirname, readJson } from './utils/files.mjs'
import { resolveJsonServer } from './json.mjs'
import { mountHandlers, loadMiddleWaves, loadRoute } from './load.mjs'
import {rewriteUse,getRoutes} from './utils/get-route.mjs'
// import StaticServe from ''

// 加载配置
const mockConfig = await readJson('.mock.config.json')

// 默认的json文件
const dbPath = _.get(mockConfig, 'db', 'db.json')

// 静态文件夹
const publicPath = _.get(mockConfig, 'public', 'public')

// 路由映射
const jsonRouter = _.get(mockConfig, 'router')


// faker数据
const _fakerPath = _.get(mockConfig, 'faker', ['faker'])

const fakerPath = _.isArray(_fakerPath)
  ? _fakerPath
  : [_fakerPath].filter(i => !!i)

const _middleWares = _.get(mockConfig, 'middlewares', ['middlewares'])

//  中间件
const middleWareDirs = _.isArray(_middleWares)
  ? _middleWares
  : [_middleWares].filter(i => !!i)

const server = jsonServer.create()

const json= rewriteUse(server)


server.use(jsonServer.bodyParser)

let staticRoute = await readJson(dbPath)

if (!_.isPlainObject(staticRoute)) {
  consola.warn(
    '输入文件没有输出正确的对象格式，将会被重置为空对象，请检查文件！'
  )
  staticRoute = {}
}

_.assign(staticRoute, await loadRoute(fakerPath))

for (const middleware of await loadMiddleWaves(middleWareDirs)) {
  server.use(middleware)
}

const middlewares = jsonServer.defaults({
  // static: publicPath
})

// Set default middlewares (logger, faker, cors and no-cache)
server.use(middlewares)

await mountHandlers(server, ['handlers'])

// server.get('/',(req,res)=>{
//   // const routes=getRoutes()
//   res.send([])
// })

server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// 加载JSON MOCK服务器
await resolveJsonServer(server, {
  // 数据对象
  db: staticRoute,
  router: jsonRouter
})

server.listen(3001, () => {
  console.log('Mock Server is running')
})
