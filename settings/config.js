const fs = require('fs')

const config = {
    owner: "-",
    botNumber: "-",
    setPair: "H4ZZ1212",
    thumbUrl: "https://avatars.githubusercontent.com/u/239936108?s=400&u=3cc1bed5dbff3358cf95664ec3a3e2927bd1cc9c&v=4",
    session: "sessions",
    status: {
        public: true,
        terminal: true,
        reactsw: false
    },
    message: {
        owner: "no, this is for owners only",
        group: "this is for groups only",
        admin: "this command is for admin only",
        private: "this is specifically for private chat"
    },
    settings: {
        title: "f-haazzeerr",
        packname: 'aioowa-wabot',
        description: "this script was created by Hazzer",
        author: 'https://www.hazzeryy.site',
        footer: "hazér, no 1225`"
    },
    newsletter: {
        name: "haazzzeerr told-u?",
        id: "120363297591152843@newsletter"
    },
    socialMedia: {
        YouTube: "coming soon!",
        GitHub: "https://github.com/haazzzeeerr",
        Telegram: "https://t.me/d3jsz",
        ChannelWA: "https://whatsapp.com/channel/"
    }
}

module.exports = config;

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
