import { defineHandler } from '../utils/response.mjs'

export default router => {
  router.get(
    '/test',
    defineHandler(function (res, req) {
      return [
        {
          routeName: 'test'
        }
      ]
    })
  )

  return router
}
