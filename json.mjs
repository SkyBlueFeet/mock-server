import { readJson } from './utils/files.mjs'
import jsonServer from 'json-server'
import { SuccessMessage } from './utils/message.mjs'

/**
 * 挂载 json-server Mock服务
 * @param {Application} server
 * @param {object} staticRoute
 * @returns {Promise<*>}
 */
export async function resolveJsonServer (server, staticRoute) {
  const routerMapping = staticRoute.router

  server.use(jsonServer.rewriter(routerMapping))

  // Use default router
  const router = jsonServer.router(staticRoute.db, {
    format: function (data) {
      return new SuccessMessage('请求成功！', data)
    }
  })
  server.use(router)

  // console.log(server)

  return server
}
