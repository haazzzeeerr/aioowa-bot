const axios = require('axios')

module.exports = {
  name: 'downloader',
  alias: ['ytmp3', 'ytmp4', 'tiktok', 'igdl'],
  desc: 'Download media dari berbagai platform',
  type: 'download',
  async exec(m, { client, args, text, command }) {
    try {
      if (!text) return m.reply(`🔍 Contoh:\n• .ytmp3 https://youtube.com/watch?v=xxxx\n• .tiktok https://vt.tiktok.com/xxxx\n• .igdl https://www.instagram.com/reel/xxxx`)

      const url = text.trim()
      let result

      if (command === 'ytmp3' || command === 'ytmp4') {
        const res = await axios.get(`https://api.akuari.my.id/downloader/youtube?link=${encodeURIComponent(url)}`)
        result = res.data
        if (!result?.data) return m.reply('❌ Gagal ambil data YouTube.')
        const media = command === 'ytmp3' ? result.data.mp3 : result.data.mp4
        const caption = `🎬 *${result.data.title}*\n📺 ${result.data.channel}`
        await client.sendMessage(
          m.chat,
          { [command === 'ytmp3' ? 'audio' : 'video']: { url: media }, caption, mimetype: command === 'ytmp3' ? 'audio/mpeg' : 'video/mp4' },
          { quoted: m }
        )

      } else if (command === 'tiktok') {
        const res = await axios.get(`https://api.akuari.my.id/downloader/tiktok?link=${encodeURIComponent(url)}`)
        result = res.data
        if (!result?.video) return m.reply('❌ Gagal ambil data TikTok.')
        await client.sendMessage(m.chat, { video: { url: result.video }, caption: `🎵 ${result.desc || 'Tanpa deskripsi'}` }, { quoted: m })

      } else if (command === 'igdl') {
        const res = await axios.get(`https://api.akuari.my.id/downloader/ig?link=${encodeURIComponent(url)}`)
        result = res.data
        if (!result?.media?.[0]) return m.reply('❌ Gagal ambil data Instagram.')
        for (const media of result.media) {
          await client.sendMessage(
            m.chat,
            { [media.type.includes('video') ? 'video' : 'image']: { url: media.url }, caption: `📸 Instagram Downloader` },
            { quoted: m }
          )
        }
      } else {
        m.reply('❌ Command tidak dikenali.')
      }
    } catch (err) {
      console.error(err)
      m.reply('⚠️ Terjadi kesalahan saat memproses permintaan.')
    }
  },
}
