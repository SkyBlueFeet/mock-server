import _ from 'lodash'

export class Message {
  /**
   * @type {'OK' | 'ERROR' | 'WARNING'}
   */
  status

  /**
   * @type {Array<any> | Record<string, any> | string | boolean | number | null|undefined}
   */
  results

  /**
   * @type string
   */
  message

  /**
   * @type {number}
   */
  code

  /**
   *
   * @param {Message['status']} status
   * @param {string} message
   * @param {Message['results']} results
   * @param {number} code
   */
  constructor (status, message, results, code) {
    this.status = status
    this.message = message
    this.results = results
    this.code = code
  }

  toJson () {
    return _.assign({}, this)
  }
}

export class SuccessMessage extends Message {
  /**
   *
   * @param {string} message
   * @param {Message['results']} results
   */
  constructor (message, results) {
    super('OK', message, results, 200)
  }
}

export class ErrorMessage extends Message {
  /**
   *
   * @param {string} message
   * @param {number} code
   */
  constructor (message, code) {
    super('ERROR', message, null, code)
  }
}

export class WarningMessage extends Message {
  /**
   *
   * @param {string} message
   * @param {Message['results']} results
   */
  constructor (message, results) {
    super('WARNING', message, results, 200)
  }
}

/**
 *
 * @param {string} message
 * @returns {string|*}
 */
export function formatErrorMessage (message) {
  if (message.indexOf('Could not find any entity') >= 0) {
    return '未查询到该Id数据'
  }

  return message
}
