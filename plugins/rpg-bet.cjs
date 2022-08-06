var confirm = {}

async function handler(m, {
	conn,
	args
}) {
	//if (!isROwner) throw 'Dalam perbaikan'
	if (m.sender in confirm) throw 'Kamu masih melakukan judi, tunggu sampai selesai!!'
	try {
		var user = db.data.users[m.sender]
		if (!args[0]) return m.reply('brani taruhan brapa?')
		if (args[0] < 1000 || args > 100000) return m.reply('minimal 1000, max 100000 buat taruhan')
		var count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
		if ((user.money * 1) < count) return m.reply('💵Uang kamu tidak cukup!!')
		if (!(m.sender in confirm)) {
			confirm[m.sender] = {
				sender: m.sender,
				count,
				timeout: setTimeout(() => (m.reply('timed out'), delete confirm[m.sender]), 60000)
			}
			var txt = '⚠️Warning⚠️\n*Jangan judi karena tidak akan menang, BENERAN!!*\nApakah anda yakin (pikirkan baik-baik) mau melakukan judi (Y/n) (60s Timeout)'
			return conn.sendButton(m.chat, txt, author, null, [
				['y'],
				['n']
			], m)
		}
	} catch (e) {
		console.error(e)
		if (m.sender in confirm) {
			var {
				timeout
			} = confirm[m.sender]
			clearTimeout(timeout)
			delete confirm[m.sender]
			m.reply('Rejected')
		}
	}
}

handler.before = async m => {
	if (!(m.sender in confirm)) return
	if (m.isBaileys) return
	var {
		timeout,
		count
	} = confirm[m.sender]
	var user = db.data.users[m.sender]
	var moneyDulu = user.money * 1
	var txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '').toLowerCase()
	try {
		if (/^y(es|a)?$/i.test(txt)) {
			var Bot = (Math.floor(Math.random() * 80)) * 1
			var Kamu = (Math.floor(Math.random() * 71)) * 1
			var status = 'Kalah'
			if (Bot < Kamu) {
				user.money += count * 1
				status = 'Menang'
			} else if (Bot > Kamu) {
				user.money -= count * 1
			} else {
				status = 'Seri'
				user.money += (Math.floor(count / 1.5)) * 1
			}
			m.reply(`
Bot roll: *${Bot}*
Kamu roll: *${Kamu}*

Kamu *${status}*, kamu ${status == 'Menang' ? `Mendapatkan *+${count * 2}*` : status == 'Kalah' ? `Kehilangan *-${count * 1}*` : `Mendapatkan *+${Math.floor(count / 1.5)}*`} 💵Money
    `.trim())
			clearTimeout(timeout)
			delete confirm[m.sender]
			return !0
		} else if (/^no?$/i.test(txt)) {
			clearTimeout(timeout)
			delete confirm[m.sender]
			m.reply('Rejected')
			return !0
		}

	} catch (e) {
		clearTimeout(timeout)
		delete confirm[m.sender]
		if (moneyDulu > (user.money * 1)) user.money = moneyDulu * 1
		m.reply('Error saat melakukan judi (Rejected)')
		return !0
	} finally {
		clearTimeout(timeout)
		delete confirm[m.sender]
		return !0
	}
}

handler.help = ['judi *jumlah*']
handler.tags = ['rpg']
handler.command = /^(judi|bet)$/i

module.exports = handler

/**
 * Detect if thats number
 * @param {Number} x 
 * @returns Boolean
 */
function number(x = 0) {
	x = parseInt(x)
	return !isNaN(x) && typeof x == 'number'
}