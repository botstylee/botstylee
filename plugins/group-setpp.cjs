const { webp2png } = require('../lib/webp2mp4.cjs')

const handler = async (m, { conn, command, isBotAdmin, isAdmin, isOwner }) => {
	const useForGroup = /group/i.test(command)
	if (useForGroup && !m.isGroup) throw 'Perintah setppgroup hanya bisa digunakan di grup.'

	const quoted = m.quoted || m
	const mime = quoted?.msg?.mimetype || quoted?.mimetype || quoted?.mediaType || ''
	if (!/^(image\/|image\/webp|webp)/i.test(mime)) {
		throw 'Kirim atau balas gambar/stiker dengan perintah setpp atau setppgroup.'
	}

	if (useForGroup) {
		if (!isAdmin) throw 'Hanya admin grup yang dapat mengubah foto grup.'
		if (!isBotAdmin) throw 'Bot harus menjadi admin grup untuk mengubah foto grup.'
	} else if (!isOwner) {
		throw 'Hanya owner bot yang dapat mengubah foto profil bot.'
	}

	try {
		let buffer = await quoted.download?.()
		if (!buffer) throw new Error('Media tidak dapat diunduh.')

		if (/webp/i.test(mime)) {
			const convertedUrl = await webp2png(buffer)
			if (!convertedUrl) throw new Error('Konversi stiker gagal.')
			const response = await fetch(convertedUrl)
			if (!response.ok) throw new Error(`Unduh hasil konversi gagal (${response.status}).`)
			buffer = Buffer.from(await response.arrayBuffer())
		}

		const jid = useForGroup ? m.chat : (conn.user?.jid || conn.user?.id)
		if (!jid) throw new Error('ID profil tidak tersedia.')
		await conn.updateProfilePicture(jid, buffer)
		return m.reply(useForGroup ? 'Foto grup berhasil diperbarui.' : 'Foto profil bot berhasil diperbarui.')
	} catch (error) {
		console.error('Gagal memperbarui foto profil:', error)
		throw error instanceof Error ? `Gagal memperbarui foto profil: ${error.message}` : 'Gagal memperbarui foto profil.'
	}
}

handler.help = ['setpp', 'setppgroup']
handler.tags = ['group']
handler.command = ['setpp', 'setppgroup']

module.exports = handler
