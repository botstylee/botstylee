var handler = async (m, {
	conn,
	usedPrefix
}) => {
	conn.reply(m.chat, `
「 *Tutorial RPG Games BOTSTYLEE* 」
*${usedPrefix}daily*
${usedPrefix}weekly*
${usedPrefix}monthly*
\`\`\`\Staterpack yang bisa di klaim 1 - 30 hari sekali\`\`\`\

*${usedPrefix}mulung*
*${usedPrefix}adventure*
*${usedPrefix}petualang*
\`\`\`\Untuk mencari resource seperti Money, Exp, dll..,dibutuhkan  minimal 80 nyawa untuk bisa melakukannya dan, kamu tidak dapat spam karena ada delay 5 menit\`\`\`\

*${usedPrefix}mancing*
*${usedPrefix}berburu*
*${usedPrefix}mining/nambang*
*${usedPrefix}nebang*
*${usedPrefix}berkebon*
\`\`\`\Untuk mencari mob atau sumberdaya yang dapat digunakan untuk memasak atau mengcrafting item\`\`\`\

*${usedPrefix}lb*
*${usedPrefix}leaderboard*
\`\`\`\Untuk melihat list leader board money/exp/money\`\`\`\

*${usedPrefix}repair*
*${usedPrefix}upgrade*
\`\`\`\Untuk mengupgrade atau merepair tools anda\`\`\`\

*${usedPrefix}nabung*
*${usedPrefix}narik*
\`\`\`\Untuk memasukkan/menarik money anda kedalam tabungan \`\`\`\

*${usedPrefix}craft*
*${usedPrefix}burn*
\`\`\`\Untuk melakukan crafting item atau pembakaran item\`\`\`\

*${usedPrefix}cook*
\`\`\`\Untuk memasak makanan dari hasil berburu\`\`\`\

*${usedPrefix}eat*
*${usedPrefix}heal*
\`\`\`\Untuk menambah stamina atau health anda\`\`\`\

*${usedPrefix}sell*
*${usedPrefix}buy*
\`\`\`\Untuk membeli atau menjual item yang tersedia\`\`\`\

*${usedPrefix}open*
*${usedPrefix}gacha*
\`\`\`\Untuk membuka crate yang berisi item RPG\`\`\`\

*${usedPrefix}kerja*
*${usedPrefix}ojek*
*${usedPrefix}taxy*
\`\`\`\Bekerja untuk mendapatkan money dan exp\`\`\`\

*${usedPrefix}feed
\`\`\`\Untuk memberi makan hewan peliharaan anda\`\`\`\

*${usedPrefix}inv*
*${usedPrefix}inventory*
\`\`\`\Untuk mengecek inventory anda\`\`\`\

*${usedPrefix}judi <jumlah>*
\`\`\`\Jangan judi, Karena gk bakal balik modal.BENERAN GK BOHONG\`\`\`\
`.trim(), m)
}
handler.help = ['tutorial']
handler.tags = ['rpg']
handler.command = /^(tutorial)$/i

module.exports = handler