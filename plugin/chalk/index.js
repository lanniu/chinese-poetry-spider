const chalk = require('chalk')
const sleep = require('sleep')
const log = console.log

const error = (msg) => {
  log(chalk.red.bold(msg))
}
const warning = (msg) => {
  log(chalk.yellow.bold(msg))
}
const success = (msg) => {
  log(chalk.green.bold(msg))
}
const info = (msg) => {
  log(chalk.hex('#9c9c9c').bold(msg))
}
const countDown = (time) => {
  const num = Math.ceil(time)

  for (const i of Array.from({length: num}, (a, i) => i).reverse()) {
    warning(`倒计时 ${i}`)
    sleep.sleep(1)
  }
}

module.exports = {error, warning, success, info, countDown}
