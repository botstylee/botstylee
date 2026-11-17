const { webp2png } = require('../lib/webp2mp4.cjs')

const handler = async (m, { conn, command, isBotAdmin, isAdmin, isOwner }) => {
	const useForGroup = typeof command === 'string' && /group/i.test(command)
	if (useForGroup && !m.isGroup) throw 'Perintah setppgroup hanya bisa digunakan di grup.'

	const target = m.quoted || m
	const mime = target?.msg?.mimetype || target?.mimetype || target?.mediaType || ''
	if (!/^image\//i.test(mime) && !/webp/i.test(mime)) {
		throw 'Kirim atau balas gambar/stiker dengan perintah setpp atau setppgroup.'
	}

	if (useForGroup) {
		if (!isAdmin) throw 'Hanya admin grup yang dapat mengubah foto grup.'
		if (!isBotAdmin) throw 'Bot harus menjadi admin grup untuk mengubah foto grup.'
	} else if (!isOwner) {
		throw 'Hanya owner bot yang dapat mengubah foto profil bot.'
	}

	try {
		let image = await target.download?.()
		if (!image || !Buffer.isBuffer(image)) throw new Error('Media tidak dapat diunduh.')

		if (/webp/i.test(mime)) {
			const convertedUrl = await webp2png(image)
			if (typeof convertedUrl !== 'string' || !/^https?:\/\//i.test(convertedUrl)) {
				throw new Error('Konversi stiker gagal menghasilkan URL gambar.')
			}
			const response = await fetch(convertedUrl)
			if (!response.ok) throw new Error(`Unduh hasil konversi gagal (${response.status}).`)
			image = Buffer.from(await response.arrayBuffer())
			if (!image.length) throw new Error('Hasil konversi gambar kosong.')
		}

		const jid = useForGroup ? m.chat : (conn.user?.jid || conn.user?.id)
		if (!jid) throw new Error('ID profil tidak tersedia.')
		await conn.updateProfilePicture(jid, image)
		return m.reply(useForGroup ? 'Foto grup berhasil diperbarui.' : 'Foto profil bot berhasil diperbarui.')
	} catch (error) {
		conn.logger?.error?.({ err: error, group: useForGroup ? m.chat : undefined }, 'Gagal memperbarui foto profil')
		throw error instanceof Error ? `Gagal memperbarui foto profil: ${error.message}` : 'Gagal memperbarui foto profil.'
	}
}

handler.help = ['setpp', 'setppgroup']
handler.tags = ['group']
handler.command = ['setpp', 'setppgroup']

module.exports = handler
