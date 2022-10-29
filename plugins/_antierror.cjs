var handler = m => m

handler.all = async function(m, {conn} ) {
	var user = db.data.users[m.sender]
	if ((user.money * 1) > 99999998) {
		user.money = 99999999
	} else if ((user.money * 1) < 0) {
		user.money = 0
	}
	if ((user.limitjoin * 1) > 5) {
		 user.limitjoin = 5
	}
	if ((user.exp * 1) > 99999998) {
		user.exp = 99999999
	} else if ((user.exp * 1) < 0) {
		user.exp = 0
	}
	if ((user.health * 1) > 100) {
		user.health = 100
	} else if ((user.health * 1) < 0) {
		user.health = 0
	}
}

module.exports = handler