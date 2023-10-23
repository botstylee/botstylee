var handler = async (m, {
	conn
}) => {
	if (!/viewOnce/.test(m.quoted?.mtype)) throw 'Reply a viewOnceMessage' 
	var q = await m.getQuotedObj()
	var vtype = Object.keys(q.message)[0]
	var mtype = Object.keys(q.message[vtype].message)[0]
	delete q.message[vtype].message[mtype].viewOnce
	conn.sendMessage(m.chat, { forward: q }, { quoted: m })
}
handler.help = ['readviewonce', 'rvo']
handler.tags = ['tools']
handler.command = /^(retrieve|rvo|readviewonce)$/i

export default handler