// Legacy button/list response converter intentionally disabled.
// This bot uses ordinary text commands and no longer creates interactive messages.
var handler = m => m
handler.disabled = true
module.exports = handler
