import url from 'url'
import path from 'path'
import * as fsPromise from 'fs/promises'
import _ from 'lodash'

/**
 *
 * @param {string} importUrl import.meta.url
 * @returns {string}
 * @private
 */
export function __filename (importUrl) {
  return url.fileURLToPath(importUrl)
}

/**
 *
 * @param {string} importUrl import.meta.url
 * @returns {string}
 * @private
 */
export function __dirname (importUrl) {
  const __filename = url.fileURLToPath(importUrl)
  return path.dirname(__filename)
}

/**
 * @template T
 * @param importUrl
 * @returns {Promise<T | {}>}
 */
export function readJson (importUrl) {
  const filePath = path.resolve(process.cwd(), importUrl)

  return fsPromise
    .readFile(filePath)
    .then(v => {
      return JSON.parse(v.toString())
    })
    .catch(e => {
      console.error('JSON解析错误:\n' + e.message)
      return {}
    })
}

/**
 *
 * @param importUrl
 * @param {array|object} data
 * @returns {Promise<T | {}>}
 */
export function writeJson (importUrl, data) {
  const filePath = path.resolve(process.cwd(), importUrl)

  return fsPromise
    .writeFile(filePath, JSON.stringify(data))
    .then(v => {
      return JSON.parse(v.toString())
    })
    .catch(e => {
      console.error('JSON解析错误:' + e.message)
      return {}
    })
}
