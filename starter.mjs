import nodemon from 'nodemon'
import consola from 'consola'
import chalk from 'chalk'
import path from 'path'
import shelljs from 'shelljs'
import _ from 'lodash'
import url from 'url'
import * as fs from 'fs'
import { __dirname } from './utils/files.mjs'
import dayjs from 'dayjs'

let packageJson = undefined

try {
  packageJson = JSON.parse(fs.readFileSync('./package.json').toString())
} catch (e) {
  consola.warn(chalk.yellow('The package.json file was not read\n'))
}

shelljs.cd(__dirname(import.meta.url))

async function devServer () {
  const NodemonClient = nodemon({
    script: './index.mjs',
    ext: 'mjs json',
    // 忽略启动文件
    ignore: ['starter.mjs','package.json']
  })
  // NodemonClient.on('')

  NodemonClient.once('start', files => {
    if (packageJson) consola.info(`client version: ${packageJson.version}`)
    consola.info(chalk.green(`Start listening for file changes\n`))
  })

  NodemonClient.on('restart', files => {
    if (!_.isUndefined(files) && _.isArray(files) && files.length > 0) {
      files = files
        .map(filename => {
          return path.relative(process.cwd(), filename)
        })
        .toString()
    } else {
      files = ''
    }

    console.info(
      chalk.green(dayjs().format('YYYY-MM-DD HH:mm:ss')),
      chalk.cyan('file update'),
      files
    )
  })
}

devServer()
  .then(v => {})
  .catch(e => {
    consola.error(e)
  })
