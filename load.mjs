import Glob from 'fast-glob'
import path from 'path'
import _ from 'lodash'
import consola from 'consola'
import { __dirname } from './utils/files.mjs'
import { Router } from 'express'
import { createRouter } from './utils/response.mjs'

/**
 *
 * @param {string} staticPath
 * @param {string} cwd
 * @returns {Promise<{}>}
 */
export async function loadRoute (staticPath, cwd = __dirname(import.meta.url)) {
  const staticRoute = {}
  for (const dirName of staticPath) {
    const filelist = await Glob(`./${dirName}/*.mjs`, {
      cwd
    })

    for await (const item of filelist) {
      const module = await import(item)
      const ext = path.extname(item)
      const name = _.isString(module.route)
        ? module.route
        : path.basename(item).replace(ext, '')
      if (_.isFunction(module.default)) {
        _.set(staticRoute, name, module.default())
      } else if (_.isPlainObject(module.default)) {
        _.set(staticRoute, name, module.default)
      }
    }
  }

  return staticRoute
}

export async function loadMiddleWaves (
  middleWareDirs,
  cwd = __dirname(import.meta.url)
) {
  const middlewares = []
  for await (const dirName of middleWareDirs) {
    const filelist = await Glob(`./${dirName}/*.mjs`, {
      cwd
    })

    for await (const item of filelist) {
      const module = await import(item)
      if (_.isFunction(module.default)) {
        middlewares.push(module.default)
      } else {
        consola.warn('中间件必须导出一个函数！')
      }
    }
  }

  return middlewares
}

/**
 *
 * @param {Express} app
 * @param {string[]} handlerDirs
 * @param {string} cwd
 */
export async function mountHandlers (
  app,
  handlerDirs,
  cwd = __dirname(import.meta.url)
) {
  for await (const dirName of handlerDirs) {
    const handlerList = await Glob(`./${dirName}/*.mjs`, {
      cwd
    })
    for await (const item of handlerList) {
      const module = await import(item)
      const ext = path.extname(item)
      const routerPrefix = _.isString(module.route)
        ? module.route
        : path.basename(item).replace(ext, '')

      app.use('/' + routerPrefix, createRouter(module.default))
    }
  }
}
