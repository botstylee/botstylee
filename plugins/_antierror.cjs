let handler = m => m

handler.all = async function(m, {conn} ) {
	let user = global.db.data.users[m.sender]
	if ((user.money * 1) > 99999998) {
		user.money = 99999999
	} else if ((user.money * 1) < 0) {
		user.money = 0
	}
	if ((user.exp * 1) > 99999998) {
		user.exp = 99999999
	} else if ((user.exp * 1) < 0) {
		user.exp = 0
	}
	if ((user.healt * 1) > 100) {
		user.healt = 100
	} else if ((user.money * 1) < 0) {
		user.healt = 0
	}
}

module.exports = handler