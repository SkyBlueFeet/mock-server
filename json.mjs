import { readJson } from './utils/files.mjs'
import jsonServer from 'json-server'
import { SuccessMessage } from './utils/message.mjs'
import gPkg from 'get-routes'
import { Router } from 'express'
import { rewriteUse } from './utils/get-route.mjs'

/**
 * 挂载 json-server Mock服务
 * @param {Application} server
 * @param {object} staticRoute
 * @returns {Promise<*>}
 */
export async function resolveJsonServer (server, staticRoute) {
  const routerMapping = staticRoute.router

  // const router=new Router()

  // rewriteUse(router)

  server.use(jsonServer.rewriter(routerMapping))

  // Use default router
  const router = jsonServer.router(staticRoute.db, {
    format: function (data) {
      return new SuccessMessage('请求成功！', data)
    }
  })
  server.use(router)
  // console.log(
  //   router.stack // registered routes
  //     .filter(r => r.route)
  //     .map(r => r.route.path)
  // )

  // console.log(gPkg.getRoutes(server))

  // console.log(server)

  return server
}
