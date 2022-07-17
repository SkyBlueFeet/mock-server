import express from 'express'
import path from 'path'
import _ from 'lodash'
import { getRoutes, rewriteUse } from './get-route.mjs'

/**
 *
 * @param {Function} handlerFunc
 */
export function createRouter (handlerFunc) {
  const router = new express.Router()

 const getRouter= rewriteUse(router)

  if (_.isFunction(handlerFunc)) {
    handlerFunc(router)
  } else {
    consola.warn('中间件必须导出一个函数！')
  }

  router.all((req, res) => {
    if (!res.locals.data) {
      res.locals.data = {}
    }

    res.jsonp(res.locals.data)
  })

  return router
}

export function defineHandler (func) {
  return function (req, res, next) {
    Promise.resolve(func)
      .then(func => func(req, res))
      .then(data => {
        res.locals.data = data
        next()
      })
  }
}
