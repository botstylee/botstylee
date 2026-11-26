var handler = async (m, {
	conn
}) => {
	try {
		var blocked = (await conn.fetchBlocklist())
			.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
			.filter(v => v != conn.user?.jid)

		if (!blocked.length) {
			return conn.reply(m.chat, `┌〔 *Daftar Terblokir* 〕\n│\n│ Tidak ada kontak yang diblokir.\n│\n└────`, m)
		}

		var teks = `┌〔 *Daftar Terblokir* 〕\n│ Total: ${blocked.length}\n` +
			blocked.map((v, i) => `├ ${i + 1}. @${v.split`@`[0]}`).join`\n` +
			`\n└────`

		await conn.reply(m.chat, teks, m, {
			mentions: blocked
		})
	} catch (e) {
		console.error('[blocklist] Error:', e)
		await conn.reply(m.chat, 'Gagal mengambil daftar blokir: ' + (e.message || e), m)
	}
}

handler.help = ['blocklist']
handler.tags = ['info']
handler.command = /^(listbloc?k|bloc?klist|daftarbloc?k)$/i

module.exports = handler
