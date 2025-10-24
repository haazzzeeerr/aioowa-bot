const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { default: jimp } = require("jimp");

module.exports = {
  name: "welcome",
  alias: ["welcome"],
  desc: "Mengaktifkan atau menonaktifkan welcome/goodbye message",
  type: "group",
  async exec(m, { client, args, text }) {
    const isGroup = m.chat.endsWith("@g.us");
    if (!isGroup) return m.reply("❌ Fitur ini hanya untuk grup.");
    const isEnable = text.toLowerCase() === "on";
    const isDisable = text.toLowerCase() === "off";
    const dbPath = path.join(__dirname, "../flowie-minee/lib/database/welcome.json");

    // Buat file database jika belum ada
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

    let db = JSON.parse(fs.readFileSync(dbPath));
    if (isEnable) {
      db[m.chat] = true;
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return m.reply("✅ Welcome & goodbye aktif di grup ini!");
    } else if (isDisable) {
      delete db[m.chat];
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return m.reply("❎ Welcome & goodbye dimatikan.");
    } else {
      return m.reply(`📜 Gunakan:\n• .welcome on\n• .welcome off`);
    }
  },
};

// === HANDLE JOIN/LEAVE (auto trigger dari event) ===
module.exports.groupParticipantsUpdate = async (client, anu) => {
  try {
    const dbPath = path.join(__dirname, "../flowie-minee/lib/database/welcome.json");
    if (!fs.existsSync(dbPath)) return;
    const db = JSON.parse(fs.readFileSync(dbPath));
    if (!db[anu.id]) return; // skip jika welcome off

    const metadata = await client.groupMetadata(anu.id);
    const participants = anu.participants;

    for (let num of participants) {
      const userPp = await client
        .profilePictureUrl(num, "image")
        .catch(() => "https://files.catbox.moe/9zkwzj.jpg");
      const groupPp = await client
        .profilePictureUrl(anu.id, "image")
        .catch(() => "https://files.catbox.moe/9zkwzj.jpg");

      const username = (await client.getName(num)) || num.split("@")[0];
      const groupName = metadata.subject;

      // Pakai API banner image (kustom welcome/goodbye)
      const imgUrl = anu.action === "add"
        ? `https://api.akuari.my.id/canvas/welcome?name=${encodeURIComponent(username)}&gcname=${encodeURIComponent(groupName)}&pp=${encodeURIComponent(userPp)}&bg=${encodeURIComponent(groupPp)}`
        : `https://api.akuari.my.id/canvas/goodbye?name=${encodeURIComponent(username)}&gcname=${encodeURIComponent(groupName)}&pp=${encodeURIComponent(userPp)}&bg=${encodeURIComponent(groupPp)}`;

      const caption =
        anu.action === "add"
          ? `👋 *Selamat datang* @${num.split("@")[0]} di grup *${groupName}*!\nJangan lupa baca deskripsi ya 😄`
          : `👋 *Selamat tinggal* @${num.split("@")[0]}!\nSemoga betah di luar sana 🌿`;

      await client.sendMessage(
        anu.id,
        {
          image: { url: imgUrl },
          caption,
          mentions: [num],
        }
      );
    }
  } catch (err) {
    console.log("Error welcome handler:", err);
  }
};
