var handler = m => m

handler.all = async function(m, {conn} ) {
	var user = db.data.users[m.sender]
	if ((user.mp * 1) > 10000000000) {
		user.mp = 10000000000
	} else if ((user.mp * 1) < 0) {
		user.mp = 0
	}
	if ((user.tokenfree * 1) < 0) {
		 user.tokenfree = 0
	}
	if ((user.tokenpremium * 1) < 0) {
		 user.tokenpremium = 0
	}
	if ((user.tokenupgrade * 1) < 0) {
		 user.tokenupgrade = 0
	}
	if ((user.coin * 1) > 20000000000) {
		 user.coin = 20000000000
	}
	if ((user.coin * 1) < 0) {
		 user.coin = 0
	}
	if ((user.ruby * 1) > 20000000000) {
		 user.ruby = 20000000000
	}
	if ((user.ruby * 1) < 0) {
		 user.ruby = 0
	}
	if ((user.exp * 1) > 10000000000000) {
		user.exp = 10000000000000
	} else if ((user.exp * 1) < 0) {
		user.exp = 0
	}
}

export default handler