const {get} = require('./plugin/request')
const {parse} = require('./plugin/htmlParser')
const {error, warning, success, info, countDown} = require('./plugin/chalk')
const config = require('./modules')
const fs = require('fs-extra')

const baseUrl = 'https://github.com'

const handler = async (moduleName) => {
  info(`正在获取 ${config[moduleName]['title']} 目录`)
  const moduleConfig = config[moduleName]
  const {path, regexp} = moduleConfig
  const reg = new RegExp(regexp)
  const res = await get(`${baseUrl}${path}`)

  if (!Object.is(200, res.status)) {
    throw new Error(`Error with code ${res.status}`)
  }
  const $ = parse(res.data)
  const subPath = $('.js-navigation-open')
    .filter(function () {
      return reg.test($(this).text())
    })
    .map(function () {
      return $(this).attr('href')
    })
    .get()
  fs.writeJsonSync(`./catalog/${moduleName}.json`, subPath.map((path) => path.replace('blob/', '')))

  success('获取到以下目录：')
  success(subPath.join('\n'))
}

const run = async function () {
  try {
    for (let key of Object.keys(config)) {
      if (!fs.existsSync(`./catalog/${key}.json`)) {
        await handler(key)
        countDown(1 + Math.ceil(Math.random() * 3))
      }
    }
  } catch (e) {
    error('失败了，让我们等等再试。')
    countDown(60)
    run()
  }
  success('已获取全部目录！')
  warning('如需重新获取，请先删除catalog目录')
}

run()
