var handler = async (m, {
	conn,
	text,
	args,
	command
}) => {
	if (command == 'stopmenfes') {
		const find = Object.values(db.data.menfes).find(id => [id.to, id.id].includes(m.sender))
		if (!find) return m.reply('Room tidak ditemukan/anda tidak berada didalam room')
		if (m.sender != find.id) return m.reply('Fitur ini hanya untuk pengirim pesan!')
		m.reply('*MENFES*\nBerhasil meninggalkan obrolan')
		await conn.reply(find.to, '*MENFES*\nPengirim telah meninggalkan obrolan', null)
		delete db.data.menfes[find.id]
		return
	}
	if (!text) return m.reply('Berbicara kepada orang yang kamu suka secara anonim\n\nCara Penggunaan : .menfes nomor(diawali kode negara)|pesan\n\nExample : .menfes 62895xxxxx|I Love You')
	if (args[0] == 'accept') {
		const find = Object.values(db.data.menfes).find(t => t.to == m.sender)
		db.data.menfes[find.id].chatting = true
		await m.reply('Anda menerima ajakan chatting dari dia\n\nGood Luck!')
		return await conn.sendButton(find.id, 'Dia telah menerima ajakan chatting denganmu\n\nGood Luck Bro & Sis:', `Ingin stop chat? Silahkan klik tombol dibawah`, [
			['Stop Chat', '.stopmenfes']
		], null)
	} else if (args[0] == 'decline') {
		const find = Object.values(db.data.menfes).find(t => t.to == m.sender)
		if (!find) return m.reply('Silahkan ketik #stopmenfes')
		if (find.chatting == true) {
			conn.reply(m.sender, 'Anda telah menghentikan chattingan dengan dia!', null).then(v => conn.reply(find.id, `@${find.to.split('@')[0]} telah menghentikan chattingan dengan kamu\n\nNT dan Tetap semangat bro & Sis:)`, null, {
				mentions: [find.to]
			}))
			delete db.data.menfes[find.id]
		} else {
			conn.reply(m.sender, 'Anda menolak ajakan chatting dari dia!', null)
			conn.reply(find.id, `@${find.to.split('@')[0]} Menolak ajakan untuk chatting\n\nNT dan Tetap semangat bro & Sis:)`, null, {
				mentions: [find.to]
			})
			delete db.data.menfes[find.id]
		}
	}
	const to = `${text.split('|')[0].replace(/\D/g, '')}@s.whatsapp.net`
	const onWa = await conn.onWhatsApp(to)
	if (!onWa) return m.reply('Number not registered on whatsapp')
	db.data.menfes[m.sender] = {
		id: m.sender,
		to: to,
		chatting: false
	}
	const teks = `Halo ${await conn.getName(to)} 👋🏻\n Kamu mendapat pesan dari seseorang\n\n"${text.split('|')[1]}"`
	await conn.reply(to, teks, `Jika ingin chatting bersama dia? Ketik Y/N`, null)
	await m.reply('Pesan sudah dikirim ke target\n\nSilahkan tunggu jawaban dari dia:')
}
handler.help = ['menfes', 'stopmenfes']
handler.tags = ['anonymous']
handler.command = ['menfes', 'stopmenfes']
handler.private = true
module.exports = handler
