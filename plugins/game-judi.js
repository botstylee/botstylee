var confirm = {}

async function handler(m, {
	conn,
	args
}) {
	//if (!isROwner) throw 'Dalam perbaikan'
	if (m.sender in confirm) throw 'Kamu masih melakukan judi, tunggu sampai selesai!!'
	try {
		var user = db.data.users[m.sender]
		var count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.mp)) : 100) * 1
		if ((user.mp * 1) < count) return conn.reply(m.chat, 'MP kamu tidak cukup!!', m)
		if (!(m.sender in confirm)) {
			confirm[m.sender] = {
				sender: m.sender,
				count,
				timeout: setTimeout(() => (m.reply('timed out'), delete confirm[m.sender]), 60000)
			}
			var txt = '⚠️Warning⚠️\n*Jangan judi karena tidak akan menang, BENERAN!!*\nApakah anda yakin (pikirkan baik-baik) mau melakukan judi (Y/n) (60s Timeout)'
			txt += `\ntekan y untuk melanjutkan, tekan n untuk berhenti`
			conn.reply(m.chat, txt, m)
		}
	} catch (e) {
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

handler.before = async (m, {
	conn
}) => {
	if (!(m.sender in confirm)) return
	if (m.isBaileys) return
	var {
		timeout,
		count
	} = confirm[m.sender]
	var tod = conn.getName(m.sender)
	var pe = ["🍷", "🥃", "☄️", "🍄", "🌹", "🌷", "🎄", "🌲", "⚡", "🌬️", "💫", "🥂", "🍸", "🥤", "🧊", "♟️", "🎯", "🎮", "🛰️", "🛸", "🗿", "🗿", "🖲️", "💎", "🚬", "💉", "📌", "📍", "♠️", "♣️", "♥️", "♦️"]
	var cewe = pe[Math.floor(Math.random() * pe.length)]
	var user = db.data.users[m.sender]
	var moneyDulu = user.mp * 1
	var txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '').toLowerCase()
	try {
		if (/^y(es|a)?$/i.test(txt)) {
			var Bot = (Math.ceil(Math.random() * 90)) * 1
			var Kamu = (Math.floor(Math.random() * 85)) * 1
			var status = '\t\t\t\t\t[ LOSE!! ]'
			var isWin = false
			if (Bot < Kamu) {
				user.mp += count * 2
				status = '\t\t\t\t\t\t[ WIN!! ]'
				isWin = true
			} else if (Bot > Kamu) {
				user.mp -= count * 1
			} else {
				status = '\t\t\t\t\t[ SERI!! ]'
				user.mp += (Math.floor(count * 1.5)) * 1
			}
			conn.reply(m.chat, `‎\t\t\t\t\t[ CASINO ]

\`\`\`${tod}:\`\`\` ${Kamu} ${cewe}
\`\`\`Computer:\`\`\` ${Bot} ${cewe}

${status}\n\n${isWin == true ? `${tod} mendapatkan ${Number(count * 2).toLocaleString().replace(/,/g, '.')} MP\n\nlagi gak? ` : isWin == false ? `MP ${tod} Berkurang Sebanyak ${Number(count * 1).toLocaleString().replace(/,/g, '.')} MP\n\nAwokawok Kalah:v\nlagi gak?` : `${tod} mendapatkan ${Number(Math.floor(count * 1.5)).toLocaleString().replace(/,/g, '.')} MP\n\nlagi gak?`}
    `.trim(), m)
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
		log(e)
		clearTimeout(timeout)
		delete confirm[m.sender]
		if (moneyDulu > (user.mp * 1)) user.mp = moneyDulu * 1
		m.reply('Error saat melakukan judi (Rejected)')
		return !0
	} finally {
		clearTimeout(timeout)
		delete confirm[m.sender]
		return !0
	}
}

handler.help = ['judi [jumlah]']
handler.tags = ['game']
handler.command = /^(judi)$/i
handler.level = 18
export default handler

/**
 * Detect if thats number
 * @param {Number} x 
 * @returns Boolean
 */
function number(x = 0) {
	x = parseInt(x)
	return !isNaN(x) && typeof x == 'number'
}