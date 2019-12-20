const {get} = require('./plugin/request')
const {error, warning, success, info, countDown} = require('./plugin/chalk')
const config = require('./modules')
const fs = require('fs-extra')

const rawBaseUrl = 'https://raw.githubusercontent.com'

const contentGet = async (path, filePath) => {
  const res = await get(`${rawBaseUrl}${path}`, {
    headers: {'Content-Type': 'application/json'}
  })

  fs.writeJsonSync(filePath, res.data, {flag: 'a+'})
  success(`以获取 ${filePath}`)
}

const handler = async (moduleName) => {
  const arr = fs.readJsonSync(`./catalog/${moduleName}.json`)

  for (const path of arr) {
    const fileName = path.slice(path.lastIndexOf('/') + 1)
    const filePath = `./content/${moduleName}/${fileName}`

    if (!fs.existsSync(filePath)) {
      info(`正在获取 ${config[moduleName]['title']} 下的 ${fileName}`)
      await contentGet(path, filePath)
      countDown(1 + Math.ceil(Math.random() * 3))
    }
  }
}

const run = async function () {
  try {
    for (let key of Object.keys(config)) {
      fs.mkdirsSync(`./content/${key}/`)
      await handler(key)
      countDown(1 + Math.ceil(Math.random() * 3))
    }
  } catch (e) {
    error('失败了，让我们等等再试。')
    countDown(60)
    run()
  }
}

run()
