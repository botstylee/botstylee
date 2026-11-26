// plugins/rpg-adventure.cjs
// Fitur: Adventure / mulung untuk dapat reward & lost

var cooldown = 300000

var handler = async (m, {
	usedPrefix
}) => {
	// Guard: user harus terdaftar
	var user = db.data.users[m.sender]
	if (!user) return m.reply('Kamu belum terdaftar di database.')

	// Pastikan field penting ada
	if (typeof user.health !== 'number') user.health = 100
	if (typeof user.lastadventure !== 'number') user.lastadventure = 0

	// Hitung timer
	var timers = cooldown - (new Date() - user.lastadventure)

	// Guard: health minimal 80
	if (user.health < 80) {
		return m.reply(`
Requires at least 80 ❤️Healths for the adventure!!
please buy ❤️Healths first by typing *${usedPrefix}buy potion <quantity>*,
and type *${usedPrefix}heal <quantity>* to use potions
`.trim())
	}

	// Guard: cooldown
	if (new Date() - user.lastadventure <= cooldown) {
		var timeStr = typeof timers.toTimeString === 'function'
			? timers.toTimeString()
			: Math.ceil(timers / 1000) + ' detik'
		return m.reply(`You're already adventure!!, please wait *🕐${timeStr}*`)
	}

	// Hitung reward
	var rewards = reward(user)
	var text = "you've been adventure and lost"

	// Proses lost
	for (var lost in rewards.lost) {
		if (user[lost]) {
			var total = rewards.lost[lost].getRandom()
			user[lost] -= total * 1
			if (user[lost] < 0) user[lost] = 0 // jangan sampai minus
			if (total) text += `\n*${global.rpg?.emoticon?.(lost) || ''}${lost}:* ${total}`
		}
	}

	text += '\n\nBut you got'

	// Proses reward
	for (var rewardItem in rewards.reward) {
		if (rewardItem in user) {
			var total = rewards.reward[rewardItem].getRandom()
			user[rewardItem] += total * 1
			if (total) text += `\n*${global.rpg?.emoticon?.(rewardItem) || ''}${rewardItem}:* ${total}`
		}
	}

	await m.reply(text.trim())
	user.lastadventure = new Date() * 1
}

handler.help = ['adventure', 'petualang', 'berpetualang', 'mulung']
handler.tags = ['rpg']
handler.command = /^(adventure|(ber)?petualang(ang)?|mulung)$/i

handler.cooldown = cooldown
handler.disabled = false

module.exports = handler

function reward(user = {}) {
	var rewards = {
		reward: {
			money: 201,
			exp: 301,
			trash: 101,
			potion: 2,
			rock: 2,
			wood: 2,
			string: 2,
			common: 2 * (user.dog && (user.dog > 2 ? 2 : user.dog) * 1.2 || 1),
			uncommon: [0, 0, 0, 1, 0].concat(
				new Array(5 - (
					(user.dog > 2 && user.dog < 6 && user.dog) || (user.dog > 5 && 5) || 2
				)).fill(0)
			),
			mythic: [0, 0, 0, 0, 0, 1, 0, 0, 0].concat(
				new Array(8 - (
					(user.dog > 5 && user.dog < 8 && user.dog) || (user.dog > 7 && 8) || 3
				)).fill(0)
			),
			legendary: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0].concat(
				new Array(10 - (
					(user.dog > 8 && user.dog) || 4
				)).fill(0)
			),
			iron: [0, 0, 0, 1, 0, 0],
			gold: [0, 0, 0, 0, 0, 1, 0],
			diamond: [0, 0, 0, 0, 0, 0, 1, 0].concat(
				new Array(5 - (
					(user.fox < 6 && user.fox) || (user.fox > 5 && 5) || 0
				)).fill(0)
			),
		},
		lost: {
			health: 101 - (user.cat || 0) * 4,
			armordurability: (15 - (user.armor || 0)) * 7
		}
	}
	return rewards
}
