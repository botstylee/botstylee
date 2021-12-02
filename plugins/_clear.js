let handler = m => m

handler.before = async function (m) {

    if (!global.db.data.settings.clear) return // autoclear aktif?{
        if (new Date() * 1 - global.db.data.settings.cleartime > 1000 * 60 * 60) {
            let chats = this.chats.all().filter(v => !v.read_only && v.message).map(v => v.jid)
            grup = []
            for (let id of chats) {
                if (id.endsWith('g.us')) {
                    grup.push(id)
                } else {
                    this.modifyChat(id, 'delete').catch(_ => _)
                }
            }
            for (let i = 0; i < 1; i++) {
                await this.modifyChat(grup[i], 'clear', {
                    includeStarred: false
                }).catch(_ => _)
            }
        }

}
module.exports = handler
