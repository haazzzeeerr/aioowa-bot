
/*─────────────────────────────────────────
  GitHub   : https://github.com/haazzzeeerr    
  YouTube  : coming soon!
  Rest API : coming soon!        
  Telegram : https://t.me/d3jsz       
──────────────────────────────────────────*/

const chalk = require('chalk')

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
  return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

const Lognyong = (text, color) => {
  return !color ? chalk.yellow('[ ! ] ') + chalk.green(text) : chalk.yellow('=> ') + chalk.keyword(color)(text)
}

module.exports = {
  color,
  bgcolor,
  Lognyong
}
