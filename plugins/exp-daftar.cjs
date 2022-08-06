var {
	createHash
} = require('crypto');
var Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
var handler = async function(m, {
	text,
	usedPrefix,
	command
}) {
	function pickRandom(list) {
		return list[Math.floor(Math.random() * list.length)]
	}
	var namae = conn.getName(m.sender)
	var sections = [{
			title: "Pilih Umur Anda!",
			rows: [{
				title: "Umur Ramdom",
				rowId: '.daftar ' + namae + '.' + pickRandom(['30', '29', '28', '27', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9'])
			}]
		},
		{
			title: "O L D",
			rows: [{
					title: "30 Tahun",
					rowId: '.daftar ' + namae + '.30 '
				},
				{
					title: "29 Tahun",
					rowId: '.daftar ' + namae + '.29 '
				},
				{
					title: "28 Tahun",
					rowId: '.daftar ' + namae + '.28 '
				},
				{
					title: "27 Tahun",
					rowId: '.daftar ' + namae + '.27 '
				},
				{
					title: "26 Tahun",
					rowId: '.daftar ' + namae + '.26 '
				},
				{
					title: "25 Tahun",
					rowId: '.daftar ' + namae + '.25 '
				},
				{
					title: "24 Tahun",
					rowId: '.daftar ' + namae + '.24 '
				},
				{
					title: "23 Tahun",
					rowId: '.daftar ' + namae + '.23 '
				},
				{
					title: "22 Tahun",
					rowId: '.daftar ' + namae + '.22 '
				},
				{
					title: "21 Tahun",
					rowId: '.daftar ' + namae + '.21 '
				}
			]
		},
		{
			title: "Y O U N G",
			rows: [{
					title: "20 Tahun",
					rowId: '.daftar ' + namae + '.20 '
				},
				{
					title: "19 Tahun",
					rowId: '.daftar ' + namae + '.19 '
				},
				{
					title: "18 Tahun",
					rowId: '.daftar ' + namae + '.18 '
				},
				{
					title: "17 Tahun",
					rowId: '.daftar ' + namae + '.17 '
				},
				{
					title: "16 Tahun",
					rowId: '.daftar ' + namae + '.16 '
				},
				{
					title: "15 Tahun",
					rowId: '.daftar ' + namae + '.15 '
				},
				{
					title: "14 Tahun",
					rowId: '.daftar ' + namae + '.14 '
				},
				{
					title: "13 Tahun",
					rowId: '.daftar ' + namae + '.13 '
				},
				{
					title: "12 Tahun",
					rowId: '.daftar ' + namae + '.12 '
				},
				{
					title: "11 Tahun",
					rowId: '.daftar ' + namae + '.11 '
				},
				{
					title: "10 Tahun",
					rowId: '.daftar ' + namae + '.10 '
				},
				{
					title: "9 Tahun",
					rowId: '.daftar ' + namae + '.9 '
				}
			]
		},
	]

	var listMessage = {
		text: `Please select your age at the bottom button...\n*Nama Kamu:* ${conn.getName(m.sender)}\nMau Nama Kostum? Tipe *${usedPrefix + command} yourname.age*`,
		footer: global.wm,
		title: "━━━━「 Daftar 」━━━━",
		buttonText: "Klik Disini Kak!",
		sections
	}

	var user = db.data.users[m.sender]
	if (user.registered === true) throw `[💬] Kamu sudah terdaftar\nMau daftar ulang? *${usedPrefix}unreg <SERIAL NUMBER>*`
	if (!Reg.test(text)) return conn.sendMessage(m.chat, listMessage, m)
	var [_, name, splitter, age] = text.match(Reg)
	if (!name) throw 'Nama tidak boleh kosong (Alphanumeric)'
	if (!age) throw 'Umur tidak boleh kosong (Angka)'
	age = parseInt(age)
	if (age > 30) throw 'YA KEK?'
	if (age < 5) throw 'ANDA TERLALU BOCIL UNTUK MENGGUNAKAN BOT'
	user.name = name.trim()
	user.age = age
	user.regTime = +new Date
	user.registered = true
	var sn = createHash('md5').update(m.sender).digest('hex')
	var who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? conn.user.jid : m.sender
	m.reply(`
━━━━ 「 *Pendaftaran Sukses* 」━━━━

╭─• 〘 INFO 〙
│✧ *Nama:* ${name}
│✧ *Umur:* ${age} Tahun
│✧ *Sn:* ${sn}
▣──────···
`.trim())
}
handler.help = ['daftar', 'register'].map(v => v + ' *nama.umur*')
handler.tags = ['xp']

handler.command = /^(daftar|verify|reg(ister)?)$/i

module.exports = handler