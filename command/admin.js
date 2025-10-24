module.exports = {
  name: 'admin',
  alias: ['kick', 'add', 'promote', 'demote', 'lock', 'unlock', 'setname'],
  desc: 'Perintah admin grup',
  type: 'group',
  async exec(m, { client, args, text, command }) {
    try {
      const isGroup = m.chat.endsWith('@g.us')
      if (!isGroup) return m.reply('❌ Fitur hanya bisa digunakan di grup.')

      const groupMetadata = await client.groupMetadata(m.chat)
      const participants = groupMetadata.participants || []
      const isBotAdmin = participants.find(p => p.id === client.user.id)?.admin
      const isAdmin = participants.find(p => p.id === m.sender)?.admin

      if (!isAdmin) return m.reply('🚫 Kamu bukan admin grup.')
      if (!isBotAdmin) return m.reply('⚠️ Jadikan bot sebagai admin dulu.')

      switch (command) {
        case 'kick': {
          const users = m.mentionedJid.length
            ? m.mentionedJid
            : args.length
            ? [args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net']
            : []
          if (!users[0]) return m.reply('Tag atau reply member yang ingin dikeluarkan.')
          await client.groupParticipantsUpdate(m.chat, users, 'remove')
          m.reply(`✅ Sukses mengeluarkan ${users.length} anggota.`)
          break
        }

        case 'add': {
          const num = args[0]?.replace(/[^0-9]/g, '')
          if (!num) return m.reply('Masukkan nomor tanpa +62.')
          await client.groupParticipantsUpdate(m.chat, [num + '@s.whatsapp.net'], 'add')
          m.reply(`✅ Ditambahkan: @${num}`, { mentions: [num + '@s.whatsapp.net'] })
          break
        }

        case 'promote':
        case 'demote': {
          const users = m.mentionedJid
          if (!users[0]) return m.reply('Tag anggota yang ingin dipromote/demote.')
          await client.groupParticipantsUpdate(m.chat, users, command === 'promote' ? 'promote' : 'demote')
          m.reply(
            `✅ ${command === 'promote' ? 'Naik jadi admin' : 'Turun jadi member'}: ${users
              .map(u => '@' + u.split('@')[0])
              .join(', ')}`,
            { mentions: users }
          )
          break
        }

        case 'lock':
        case 'unlock': {
          const locked = command === 'lock'
          await client.groupSettingUpdate(m.chat, locked ? 'announcement' : 'not_announcement')
          m.reply(locked ? '🔒 Grup dikunci (hanya admin yang bisa kirim pesan).' : '🔓 Grup dibuka untuk semua anggota.')
          break
        }

        case 'setname': {
          if (!text) return m.reply('Masukkan nama grup baru.')
          await client.groupUpdateSubject(m.chat, text)
          m.reply('✅ Nama grup telah diubah.')
          break
        }

        default:
          m.reply('❌ Perintah admin tidak dikenal.')
      }
    } catch (err) {
      console.error(err)
      m.reply('⚠️ Gagal mengeksekusi perintah admin.')
    }
  },
}
