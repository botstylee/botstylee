let handler = function (m) {
  // this.sendContact(m.chat, '6281515860089', 'Nurutomo', m)
  let contacts = []
  for (let a of Object.keys(Owner)) {
let owner = Owner[a]
    contacts.push(...[a, owner.name])
  }
  if (contacts.length < 1) return this.sendContact(m.chat, contacts[0], contacts[1], m)
  this.sendContactArray(m.chat, contacts, m)
}
handler.help = ['owner', 'creator']
handler.tags = ['info']

handler.command = /^(owner|creator)$/i

module.exports = handler
