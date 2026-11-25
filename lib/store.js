// @ts-check
import {
    readFileSync,
    writeFileSync,
    existsSync,
    promises
} from 'fs'
import {
    join
} from 'path'

/** @type {typeof import('@whiskeysockets/baileys')} */ // @ts-ignore
var {
    initAuthCreds,
    BufferJSON,
    proto,
    isJidBroadcast,
    isJidGroup,
    WAMessageStubType,
    updateMessageWithReceipt,
    updateMessageWithReaction,
    // @ts-ignore
    useMultiFileAuthState: baileysMultiFileAuthState
} = (await import('@whiskeysockets/baileys')).default

var TIME_TO_DATA_STALE = 5 * 60 * 1000

function makeInMemoryStore() {
    /** @type {{ [jid: string]: { id: string, lastfetch?: number, subject?: string, name?: string, isChats?: boolean, isContact?: boolean, presence?: any, metadata?: any } & any }}} */
    var chats = {}
    /** @type {{ [jid: string]: any[] }} */
    var messages = {}
    /** @type {any} */
    var state = {
        connection: 'close'
    }

    /**
     * @param {string} jid 
     * @param {string|null|void} id 
     * @returns 
     */
    function loadMessage(jid, id = null) {
        var message = null
        if (jid && !id) {
            id = jid
            var filter = (m) => m.key?.id == id
            var messageFind = Object.entries(messages).find(([, msgs]) => msgs.find(filter))
            message = messageFind?.[1]?.find(filter)
        } else {
            // @ts-ignore
            jid = jid?.decodeJid?.()
            if (!(jid in messages)) return null
            message = messages[jid].find(m => m.key.id == id)
        }
        return message ? message : null
    }

    /**
     * @param {string} jid 
     * @param {(jid: string) => Promise<any> | null} groupMetadata 
     */
    async function fetchGroupMetadata(jid, groupMetadata) {
        // @ts-ignore
        jid = jid?.decodeJid?.()
        if (!isJidGroup(jid)) return
        if (!(jid in chats)) return chats[jid] = { id: jid }
        var isRequiredToUpdate = !chats[jid].metadata || Date.now() - (chats[jid].lastfetch || 0) > TIME_TO_DATA_STALE
        if (isRequiredToUpdate) {
            var metadata = await groupMetadata?.(jid)
            if (metadata) Object.assign(chats[jid], {
                subject: metadata.subject,
                lastfetch: Date.now(),
                metadata
            })
        }
        return chats[jid].metadata
    }

    /** @param {string} id */
    function fetchMessageReceipts(id) {
        var msg = loadMessage(id)
        if (!msg) return null
        return msg.userReceipt
    }

    /**
     * @param {string} jid 
     * @param {(jid: string, type?: 'preview' | 'image', timeoutMs?: number) => Promise<string>} profilePictureUrl 
     */
    async function fetchImageUrl(jid, profilePictureUrl) {
        // @ts-ignore
        jid = jid?.decodeJid?.()
        if (!(jid in chats)) return chats[jid] = { id: jid }
        if (!chats[jid].imgUrl) {
            var url = await profilePictureUrl(jid, 'image').catch(() => './src/avatar_contact.png')
            if (url) chats[jid].imgUrl = url
        }
        return chats[jid].imgUrl
    }

    /** @param {string} jid */
    function getContact(jid) {
        // @ts-ignore
        jid = jid?.decodeJid?.()
        if (!(jid in chats)) return null
        return chats[jid]
    }

    /**
     * @param {string} jid 
     * @param {any} message 
     * @param {string} type 
     */
    var upsertMessage = (jid, message, type = 'append') => {
        // @ts-ignore
        jid = jid?.decodeJid?.()
        if (!(jid in messages)) messages[jid] = []

        // ← perbaikan: cek message.message dulu
        if (message.message) {
            delete message.message.messageContextInfo
            delete message.message.senderKeyDistributionMessage
        }

        var msg = loadMessage(jid, message.key.id)
        if (msg) {
            Object.assign(msg, message)
        } else {
            if (type == 'append') messages[jid].push(message)
            else messages[jid].splice(0, 0, message)
        }
    }

    /** 
     * @param {any} ev 
     * @param {{ groupMetadata: (jid: string, minimal?: boolean) => Promise<any> | null }} opts
     */
    function bind(ev, opts = { groupMetadata: () => null }) {
        ev.on('connection.update', update => {
            Object.assign(state, update)
        })

        ev.on('chats.set', function store(chatsSet) {
            for (var chat of chatsSet.chats) {
                // @ts-ignore
                var id = chat.id?.decodeJid?.()
                if (!id) continue
                if (!(id in chats)) chats[id] = {
                    ...chat,
                    isChats: true,
                    ...(chat.name ? { name: chat.name } : {})
                }
                if (chat.name) chats[id].name = chat.name
            }
        })

        ev.on('contacts.set', function store(contactsSet) {
            for (var contact of contactsSet.contacts) {
                // @ts-ignore
                var id = contact.id?.decodeJid?.()
                if (!id) continue
                chats[id] = Object.assign(chats[id] || {}, {
                    ...contact,
                    isContact: true
                })
            }
        })

        ev.on('messages.set', function store(messagesSet) {
            for (var message of messagesSet.messages) {
                // @ts-ignore
                var jid = message.key.remoteJid?.decodeJid?.()
                if (!jid) continue
                if (isJidBroadcast(jid)) continue
                if (!(jid in messages)) messages[jid] = []
                upsertMessage(jid, proto.WebMessageInfo.fromObject(message), 'prepend')
            }
        })

        ev.on('contacts.update', function store(contactsUpdate) {
            for (var contact of contactsUpdate) {
                // @ts-ignore
                var id = contact.id?.decodeJid?.()
                if (!id) continue
                chats[id] = Object.assign(chats[id] || {}, {
                    id,
                    ...contact,
                    isContact: true
                })
            }
        })

        ev.on('chats.upsert', async function store(chatsUpsert) {
            await Promise.all(chatsUpsert.map(async (chat) => {
                try {
                    // @ts-ignore
                    var id = chat.id?.decodeJid?.()
                    if (!id || isJidBroadcast(id)) return
                    if (!(id in chats)) chats[id] = {
                        id,
                        ...chat,
                        isChats: true
                    }
                    var isGroup = isJidGroup(id)
                    Object.assign(chats[id], {
                        ...chat,
                        isChats: true
                    })
                    if (isGroup && !chats[id].metadata) Object.assign(chats[id], {
                        metadata: await fetchGroupMetadata(id, opts.groupMetadata)
                    })
                } catch (e) {
                    console.error('[store] chats.upsert:', e.message)
                }
            }))
        })

        ev.on('chats.update', function store(chatsUpdate) {
            for (var chat of chatsUpdate) {
                // @ts-ignore
                var id = chat.id?.decodeJid?.()
                if (!id) continue
                if (!(id in chats)) chats[id] = {
                    id,
                    ...chat,
                    isChats: true
                }
                if (chat.unreadCount) chat.unreadCount += chats[id].unreadCount || 0
                Object.assign(chats[id], {
                    id,
                    ...chat,
                    isChats: true
                })
            }
        })

        ev.on('presence.update', function store(presenceUpdate) {
            // @ts-ignore
            var id = presenceUpdate.id?.decodeJid?.()
            if (!id) return
            if (!(id in chats)) chats[id] = {
                id,
                isContact: true
            }
            Object.assign(chats[id], presenceUpdate)
        })

        ev.on('messages.upsert', function store(messagesUpsert) {
            var { messages: newMessages, type } = messagesUpsert
            switch (type) {
                case 'append':
                case 'notify':
                    for (var msg of newMessages) {
                        // @ts-ignore
                        var jid = msg.key.remoteJid?.decodeJid?.()
                        if (!jid || isJidBroadcast(jid)) continue
                        if (msg.messageStubType == WAMessageStubType.CIPHERTEXT) continue
                        if (!(jid in messages)) messages[jid] = []
                        upsertMessage(jid, proto.WebMessageInfo.fromObject(msg))
                        if (type === 'notify' && !(jid in chats))
                            ev.emit('chats.upsert', [{
                                id: jid,
                                conversationTimestamp: msg.messageTimestamp,
                                unreadCount: 1,
                                name: msg.pushName || msg.verifiedBizName,
                            }])
                    }
                    break
            }
        })

        ev.on('messages.update', function store(messagesUpdate) {
            for (var message of messagesUpdate) {
                // @ts-ignore
                var jid = message.key.remoteJid?.decodeJid?.()
                if (!jid) continue
                var id = message.key.id
                if (isJidBroadcast(jid)) continue
                if (!(jid in messages)) messages[jid] = []
                var msg = loadMessage(jid, id)
                if (!msg) return
                if (message.update.messageStubType == WAMessageStubType.REVOKE) continue
                // @ts-ignore
                var msgIndex = messages[jid].findIndex(m => m.key.id === id)
                if (msgIndex !== -1) Object.assign(messages[jid][msgIndex], message.update)
            }
        })

        ev.on('groups.update', async function store(groupsUpdate) {
            await Promise.all(groupsUpdate.map(async (group) => {
                try {
                    // @ts-ignore
                    var id = group.id?.decodeJid?.()
                    if (!id) return
                    if (!isJidGroup(id)) return
                    if (!(id in chats)) chats[id] = {
                        id,
                        ...group,
                        isChats: true
                    }
                    if (!chats[id].metadata) Object.assign(chats[id], {
                        metadata: await fetchGroupMetadata(id, opts.groupMetadata)
                    })
                    if (chats[id].metadata) Object.assign(chats[id].metadata, group)
                } catch (e) {
                    console.error('[store] groups.update:', e.message)
                }
            }))
        })

        ev.on('group-participants.update', async function store(groupParticipantsUpdate) {
            try {
                // @ts-ignore
                var id = groupParticipantsUpdate.id?.decodeJid?.()
                if (!id || !isJidGroup(id)) return
                if (!(id in chats) || !chats[id].metadata) Object.assign(chats[id], {
                    metadata: await fetchGroupMetadata(id, opts.groupMetadata)
                })
                var metadata = chats[id].metadata
                if (!metadata) return console.log(`Try to update group ${id} but metadata not found in 'group-participants.update'`)
                switch (groupParticipantsUpdate.action) {
                    case 'add':
                        metadata.participants.push(...groupParticipantsUpdate.participants.map(id => ({
                            id,
                            admin: null
                        })))
                        break
                    case 'demote':
                    case 'promote':
                        for (var participant of metadata.participants)
                            if (groupParticipantsUpdate.participants.includes(participant.id))
                                participant.admin = groupParticipantsUpdate.action === 'promote' ? 'admin' : null
                        break
                    case 'remove':
                        metadata.participants = metadata.participants.filter(p => !groupParticipantsUpdate.participants.includes(p.id))
                        break
                }
                Object.assign(chats[id], { metadata })
            } catch (e) {
                console.error('[store] group-participants.update:', e.message)
            }
        })

        ev.on('message-receipt.update', function store(messageReceiptUpdate) {
            for (var { key, receipt } of messageReceiptUpdate) {
                // @ts-ignore
                var jid = key.remoteJid?.decodeJid?.()
                if (!jid) continue
                var id = key.id
                if (!(jid in messages)) messages[jid] = []
                var msg = loadMessage(jid, id)
                if (!msg) return
                updateMessageWithReceipt(msg, receipt)
            }
        })

        ev.on('messages.reaction', function store(reactions) {
            for (var { key, reaction } of reactions) {
                // @ts-ignore
                var jid = key.remoteJid?.decodeJid?.()
                if (!jid) continue
                var msg = loadMessage(jid, key.id)
                if (!msg) return
                updateMessageWithReaction(msg, reaction)
            }
        })
    }

    function toJSON() {
        return { chats, messages }
    }

    function fromJSON(json) {
        if (!json) return
        Object.assign(chats, json.chats || {})
        for (var jid in json.messages || {})
            messages[jid] = json.messages[jid].map(m => m && proto.WebMessageInfo.fromObject(m)).filter(m => m && m.messageStubType != WAMessageStubType.CIPHERTEXT)
    }

    /** @param {string} path */
    function writeToFile(path) {
        writeFileSync(path, JSON.stringify(toJSON(), (key, value) => key == 'isChats' ? undefined : value, 2))
    }

    /** @param {string} path */
    function readFromFile(path) {
        try {
            if (existsSync(path)) {
                var result = JSON.parse(readFileSync(path, { encoding: 'utf-8' }))
                fromJSON(result)
            }
        } catch (e) {
            console.error('[store] Gagal readFromFile:', e.message)
        }
    }

    return {
        chats,
        messages,
        state,
        loadMessage,
        fetchGroupMetadata,
        fetchMessageReceipts,
        fetchImageUrl,
        getContact,
        bind,
        writeToFile,
        readFromFile
    }
}

function JSONreplacer(key, value) {
    if (value == null) return
    var baileysJSON = BufferJSON.replacer(key, value)
    return baileysJSON
}

var fixFileName = (file) => file?.replace(/\//g, '__')?.replace(/:/g, '-')

/**
 * @typedef {typeof baileysMultiFileAuthState} MultiFileAuthStateStore
 */
/** @type {MultiFileAuthStateStore} */
var useMultiFileAuthState = baileysMultiFileAuthState ||
    async function useMultiFileAuthState(folder) {
        var writeData = (data, file) => {
            return promises.writeFile(join(folder, fixFileName(file)), JSON.stringify(data, JSONreplacer))
        }
        var readData = async (file) => {
            try {
                var data = await promises.readFile(join(folder, fixFileName(file)), { encoding: 'utf-8' })
                return JSON.parse(data, BufferJSON.reviver)
            } catch (error) {
                return null
            }
        }
        var removeData = async (file) => {
            try {
                // ← perbaikan: pakai join(folder, ...)
                await promises.unlink(join(folder, fixFileName(file)))
            } catch {}
        }
        var folderInfo = await promises.stat(folder).catch(() => {})
        if (folderInfo) {
            if (!folderInfo.isDirectory()) {
                throw new Error(`found something that is not a directory at ${folder}, either delete it or specify a different location`)
            }
        } else {
            await promises.mkdir(folder, { recursive: true })
        }
        var creds = await readData('creds.json') || initAuthCreds()
        return {
            state: {
                creds,
                keys: {
                    get: async (type, ids) => {
                        var data = {}
                        await Promise.all(ids.map(async id => {
                            var value = await readData(`${type}-${id}.json`)
                            if (type === 'app-state-sync-key') {
                                value = proto.AppStateSyncKeyData.fromObject(value)
                            }
                            data[id] = value
                        }))
                        return data
                    },
                    set: async (data) => {
                        var tasks = []
                        for (var category in data) {
                            for (var id in data[category]) {
                                var value = data[category][id]
                                var file = `${category}-${id}.json`
                                tasks.push(value ? writeData(value, file) : removeData(file))
                            }
                        }
                        await Promise.all(tasks)
                    }
                }
            },
            saveCreds: () => {
                return writeData(creds, 'creds.json')
            }
        }
    }

var KEY_MAP = {
    'pre-key': 'preKeys',
    'session': 'sessions',
    'sender-key': 'senderKeys',
    'app-state-sync-key': 'appStateSyncKeys',
    'app-state-sync-version': 'appStateVersions',
    'sender-key-memory': 'senderKeyMemory'
}

var useMemoryAuthState = function useMemoryAuthState() {
    var creds = initAuthCreds()
    var keys = {}
    var saveCreds = () => undefined
    return {
        state: {
            creds,
            keys: {
                get: (type, ids) => {
                    var key = KEY_MAP[type]
                    return ids.reduce((dict, id) => {
                        var value = keys[key]?.[id]
                        if (value) {
                            if (type === 'app-state-sync-key') {
                                value = proto.AppStateSyncKeyData.fromObject(value)
                            }
                            dict[id] = value
                        }
                        return dict
                    }, {})
                },
                set: (data) => {
                    for (var _key in data) {
                        var key = KEY_MAP[_key]
                        keys[key] = keys[key] || {}
                        Object.assign(keys[key], data[_key])
                    }
                }
            }
        },
        saveCreds
    }
}

export default {
    makeInMemoryStore,
    useMultiFileAuthState,
    useMemoryAuthState,
    fixFileName,
    JSONreplacer,
    KEY_MAP
}
