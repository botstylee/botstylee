// @ts-check

import {
	existsSync,
	readFileSync,
	writeFileSync
} from 'fs'

import {
	BufferJSON,
	initAuthCreds,
	isJidBroadcast,
	isJidGroup,
	proto,
	updateMessageWithReaction,
	updateMessageWithReceipt,
	useMultiFileAuthState as baileysMultiFileAuthState,
	WAMessageStubType
} from '@whiskeysockets/baileys'

const TIME_TO_DATA_STALE = 5 * 60 * 1000

/**
 * Buat store sederhana untuk chat, kontak, metadata grup, dan pesan.
 */
function makeInMemoryStore() {
	/** @type {Record<string, any>} */
	const chats = {}

	/** @type {Record<string, import('@whiskeysockets/baileys').proto.IWebMessageInfo[]>} */
	const messages = {}

	/** @type {Record<string, any>} */
	const state = {
		connection: 'close'
	}

	/**
	 * Cari pesan berdasarkan ID. Jika hanya satu argumen yang diberikan,
	 * argumen dianggap sebagai message ID.
	 *
	 * @param {string} jid
	 * @param {string|null|undefined} id
	 */
	function loadMessage(jid, id = null) {
		let message = null

		if (jid && !id) {
			id = jid

			for (const chatMessages of Object.values(messages)) {
				message = chatMessages.find(item => item.key?.id === id) || null
				if (message) break
			}
		} else {
			const chatJid = decodeJid(jid)

			if (!chatJid || !messages[chatJid]) {
				return null
			}

			message = messages[chatJid].find(item => item.key?.id === id) || null
		}

		return message
	}

	/**
	 * Ambil metadata grup dan simpan sementara di store.
	 *
	 * @param {string} jid
	 * @param {(jid: string) => Promise<import('@whiskeysockets/baileys').GroupMetadata>|null|undefined} groupMetadata
	 */
	async function fetchGroupMetadata(jid, groupMetadata) {
		jid = decodeJid(jid)

		if (!jid || !isJidGroup(jid)) {
			return undefined
		}

		if (!chats[jid]) {
			chats[jid] = { id: jid }
		}

		const shouldRefresh =
			!chats[jid].metadata ||
			Date.now() - (chats[jid].lastfetch || 0) > TIME_TO_DATA_STALE

		if (shouldRefresh && groupMetadata) {
			const metadata = await groupMetadata(jid)

			if (metadata) {
				Object.assign(chats[jid], {
					subject: metadata.subject,
					lastfetch: Date.now(),
					metadata
				})
			}
		}

		return chats[jid].metadata
	}

	/**
	 * Ambil receipt pesan berdasarkan ID.
	 *
	 * @param {string} id
	 */
	function fetchMessageReceipts(id) {
		return loadMessage(id)?.userReceipt || null
	}

	/**
	 * Ambil URL foto profil dan cache hasilnya.
	 *
	 * @param {string} jid
	 * @param {(jid: string, type?: 'preview'|'image', timeoutMs?: number) => Promise<string>} profilePictureUrl
	 */
	async function fetchImageUrl(jid, profilePictureUrl) {
		jid = decodeJid(jid)

		if (!jid) {
			return undefined
		}

		if (!chats[jid]) {
			chats[jid] = { id: jid }
		}

		if (!chats[jid].imgUrl) {
			try {
				chats[jid].imgUrl = await profilePictureUrl(jid, 'image')
			} catch {
				chats[jid].imgUrl = './src/avatar_contact.png'
			}
		}

		return chats[jid].imgUrl
	}

	/**
	 * Ambil kontak dari store.
	 *
	 * @param {string} jid
	 */
	function getContact(jid) {
		jid = decodeJid(jid)
		return jid ? chats[jid] || null : null
	}

	/**
	 * Tambahkan atau perbarui pesan di store.
	 *
	 * @param {string} jid
	 * @param {import('@whiskeysockets/baileys').proto.IWebMessageInfo} message
	 * @param {'append'|'prepend'} [type]
	 */
	function upsertMessage(jid, message, type = 'append') {
		jid = decodeJid(jid)

		if (!jid || !message.key?.id) {
			return
		}

		if (!messages[jid]) {
			messages[jid] = []
		}

		// Buang metadata yang tidak diperlukan di salinan store.
		if (message.message) {
			delete message.message.messageContextInfo
			delete message.message.senderKeyDistributionMessage
		}

		const existing = loadMessage(jid, message.key.id)

		if (existing) {
			Object.assign(existing, message)
			return
		}

		if (type === 'append') {
			messages[jid].push(message)
		} else {
			messages[jid].unshift(message)
		}
	}

	/**
	 * Masukkan batch pesan ke store, misalnya dari event history.
	 *
	 * @param {import('@whiskeysockets/baileys').proto.IWebMessageInfo[]} messageList
	 * @param {'append'|'prepend'} [type]
	 */
	function upsertMessages(messageList, type = 'prepend') {
		for (const message of messageList || []) {
			const jid = decodeJid(message.key?.remoteJid)

			if (!jid || isJidBroadcast(jid)) {
				continue
			}

			if (message.messageStubType === WAMessageStubType.CIPHERTEXT) {
				continue
			}

			upsertMessage(
				jid,
				proto.WebMessageInfo.fromObject(message),
				type
			)
		}
	}

	/**
	 * Gabungkan data kontak ke chat/contact store.
	 *
	 * @param {Array<Record<string, any>>} contacts
	 */
	function upsertContacts(contacts) {
		for (const contact of contacts || []) {
			const id = decodeJid(contact.id)

			if (!id) {
				continue
			}

			chats[id] = Object.assign(chats[id] || {}, contact, {
				id,
				isContact: true
			})
		}
	}

	/**
	 * Kaitkan event Baileys dengan store lokal.
	 *
	 * @param {import('@whiskeysockets/baileys').BaileysEventEmitter} ev
	 * @param {{
	 *   groupMetadata?: (jid: string) => Promise<import('@whiskeysockets/baileys').GroupMetadata>|null
	 * }} [opts]
	 */
	function bind(ev, opts = {}) {
		const groupMetadata = opts.groupMetadata || null

		ev.on('connection.update', update => {
			Object.assign(state, update)
		})

		// v7 mengirim history gabungan melalui messaging-history.set.
		ev.on('messaging-history.set', history => {
			for (const chat of history.chats || []) {
				const id = decodeJid(chat.id)

				if (!id) {
					continue
				}

				chats[id] = Object.assign(chats[id] || {}, chat, {
					id,
					isChats: true
				})
			}

			upsertContacts(history.contacts || [])
			upsertMessages(history.messages || [], 'prepend')
		})

		ev.on('contacts.upsert', contacts => {
			upsertContacts(contacts)
		})

		ev.on('contacts.update', contacts => {
			upsertContacts(contacts)
		})

		ev.on('chats.upsert', async chatList => {
			for (const chat of chatList || []) {
				const id = decodeJid(chat.id)

				if (!id || isJidBroadcast(id)) {
					continue
				}

				chats[id] = Object.assign(chats[id] || {}, chat, {
					id,
					isChats: true
				})

				if (isJidGroup(id) && !chats[id].metadata && groupMetadata) {
					const metadata = await fetchGroupMetadata(id, groupMetadata)

					if (metadata) {
						chats[id].metadata = metadata
					}
				}
			}
		})

		ev.on('chats.update', chatUpdates => {
			for (const chat of chatUpdates || []) {
				const id = decodeJid(chat.id)

				if (!id) {
					continue
				}

				if (!chats[id]) {
					chats[id] = { id, isChats: true }
				}

				Object.assign(chats[id], chat, {
					id,
					isChats: true
				})
			}
		})

		ev.on('chats.delete', chatIds => {
			for (const jid of chatIds || []) {
				const id = decodeJid(jid)
				if (id) delete chats[id]
			}
		})

		ev.on('presence.update', presenceUpdate => {
			const id = decodeJid(presenceUpdate.id)

			if (!id) {
				return
			}

			if (!chats[id]) {
				chats[id] = {
					id,
					isContact: true
				}
			}

			Object.assign(chats[id], presenceUpdate)
		})

		ev.on('messages.upsert', upsert => {
			const { messages: newMessages = [], type } = upsert

			if (type !== 'append' && type !== 'notify' && type !== 'prepend') {
				return
			}

			for (const message of newMessages) {
				const jid = decodeJid(message.key?.remoteJid)

				if (!jid || isJidBroadcast(jid)) {
					continue
				}

				if (message.messageStubType === WAMessageStubType.CIPHERTEXT) {
					continue
				}

				upsertMessage(
					jid,
					proto.WebMessageInfo.fromObject(message),
					type === 'prepend' ? 'prepend' : 'append'
				)

				if (type === 'notify' && !chats[jid]) {
					ev.emit('chats.upsert', [{
						id: jid,
						conversationTimestamp: message.messageTimestamp,
						unreadCount: 1,
						name: message.pushName || message.verifiedBizName
					}])
				}
			}
		})

		ev.on('messages.update', updates => {
			for (const item of updates || []) {
				const jid = decodeJid(item.key?.remoteJid)
				const id = item.key?.id

				if (!jid || !id || isJidBroadcast(jid)) {
					continue
				}

				const existing = loadMessage(jid, id)

				if (!existing) {
					continue
				}

				// Simpan pesan yang direvoke untuk kebutuhan fitur antidelete.
				if (item.update?.messageStubType === WAMessageStubType.REVOKE) {
					Object.assign(existing, item.update)
					continue
				}

				Object.assign(existing, item.update)
			}
		})

		ev.on('groups.update', async updates => {
			for (const group of updates || []) {
				const id = decodeJid(group.id)

				if (!id || !isJidGroup(id)) {
					continue
				}

				if (!chats[id]) {
					chats[id] = { id, isChats: true }
				}

				if (!chats[id].metadata && groupMetadata) {
					chats[id].metadata = await fetchGroupMetadata(id, groupMetadata)
				}

				if (chats[id].metadata) {
					Object.assign(chats[id].metadata, group)
				}

				Object.assign(chats[id], group)
			}
		})

		ev.on('group-participants.update', async update => {
			const id = decodeJid(update.id)

			if (!id || !isJidGroup(id)) {
				return
			}

			if (!chats[id]) {
				chats[id] = { id, isChats: true }
			}

			if (!chats[id].metadata && groupMetadata) {
				chats[id].metadata = await fetchGroupMetadata(id, groupMetadata)
			}

			const metadata = chats[id].metadata

			if (!metadata) {
				console.log(
					`Try to update group ${id} but metadata not found in 'group-participants.update'`
				)
				return
			}

			const participants = update.participants || []
			const participantIds = participants
				.map(participant => typeof participant === 'string' ? participant : participant.id)
				.filter(Boolean)

			switch (update.action) {
				case 'add':
					for (const participant of participants) {
						const participantData = typeof participant === 'string'
							? { id: participant, admin: null }
							: participant

						if (!metadata.participants.some(item => item.id === participantData.id)) {
							metadata.participants.push(participantData)
						}
					}
					break

				case 'promote':
				case 'demote':
					for (const participant of metadata.participants) {
						if (participantIds.includes(participant.id)) {
							participant.admin = update.action === 'promote' ? 'admin' : null
						}
					}
					break

				case 'remove':
					metadata.participants = metadata.participants.filter(
						participant => !participantIds.includes(participant.id)
					)
					break
			}
		})

		ev.on('message-receipt.update', updates => {
			for (const { key, receipt } of updates || []) {
				const jid = decodeJid(key?.remoteJid)
				const id = key?.id

				if (!jid || !id) {
					continue
				}

				const message = loadMessage(jid, id)

				if (message) {
					updateMessageWithReceipt(message, receipt)
				}
			}
		})

		ev.on('messages.reaction', updates => {
			for (const { key, reaction } of updates || []) {
				const jid = decodeJid(key?.remoteJid)
				const id = key?.id

				if (!jid || !id) {
					continue
				}

				const message = loadMessage(jid, id)

				if (message) {
					updateMessageWithReaction(message, reaction)
				}
			}
		})
	}

	function toJSON() {
		return { chats, messages }
	}

	/**
	 * Muat store dari data JSON sebelumnya.
	 *
	 * @param {{ chats?: Record<string, any>, messages?: Record<string, any[]> }} json
	 */
	function fromJSON(json = {}) {
		Object.assign(chats, json.chats || {})

		for (const [jid, chatMessages] of Object.entries(json.messages || {})) {
			messages[jid] = (chatMessages || [])
				.filter(message => message && message.messageStubType !== WAMessageStubType.CIPHERTEXT)
				.map(message => proto.WebMessageInfo.fromObject(message))
		}
	}

	/**
	 * Tulis store ke file JSON.
	 *
	 * @param {string} filePath
	 */
	function writeToFile(filePath) {
		writeFileSync(
			filePath,
			JSON.stringify(
				toJSON(),
				(key, value) => key === 'isChats' ? undefined : BufferJSON.replacer(key, value),
				2
			)
		)
	}

	/**
	 * Baca store dari file JSON.
	 *
	 * @param {string} filePath
	 */
	function readFromFile(filePath) {
		if (!existsSync(filePath)) {
			return
		}

		const json = JSON.parse(
			readFileSync(filePath, { encoding: 'utf-8' }),
			BufferJSON.reviver
		)

		fromJSON(json)
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
		toJSON,
		fromJSON,
		writeToFile,
		readFromFile
	}
}

/**
 * Normalisasi JID jika helper decodeJid dari lib/simple.js sudah dipasang.
 *
 * @param {string|undefined|null} jid
 */
function decodeJid(jid) {
	if (!jid || typeof jid !== 'string') {
		return ''
	}

	return jid.decodeJid?.() || jid
}

/**
 * Serializer yang dipakai untuk kompatibilitas data auth lama.
 *
 * @param {string} key
 * @param {any} value
 */
function JSONreplacer(key, value) {
	return BufferJSON.replacer(key, value)
}

const fixFileName = file => file?.replace(/\//g, '__')?.replace(/:/g, '-')

/**
 * Gunakan helper auth multi-file resmi dari Baileys v7.
 */
const useMultiFileAuthState = baileysMultiFileAuthState

// Tetap diekspor untuk kompatibilitas dengan lib/single2multi.js.
const KEY_MAP = {
	'pre-key': 'preKeys',
	session: 'sessions',
	'sender-key': 'senderKeys',
	'app-state-sync-key': 'appStateSyncKeys',
	'app-state-sync-version': 'appStateVersions',
	'sender-key-memory': 'senderKeyMemory'
}

/**
 * Auth state di memori untuk pemakaian sementara/testing.
 */
function useMemoryAuthState() {
	const creds = initAuthCreds()
	/** @type {Record<string, Record<string, any>>} */
	const keys = {}

	return {
		state: {
			creds,
			keys: {
				get(type, ids) {
					const storageKey = KEY_MAP[type] || type
					const result = {}

					for (const id of ids) {
						let value = keys[storageKey]?.[id]

						if (value && type === 'app-state-sync-key') {
							value = proto.Message.AppStateSyncKeyData.fromObject(value)
						}

						if (value !== undefined) {
							result[id] = value
						}
					}

					return result
				},

				set(data) {
					for (const [type, values] of Object.entries(data)) {
						const storageKey = KEY_MAP[type] || type
						keys[storageKey] ||= {}
						Object.assign(keys[storageKey], values)
					}
				}
			}
		},
		saveCreds: async () => {}
	}
}

export {
	makeInMemoryStore,
	useMultiFileAuthState,
	useMemoryAuthState,
	fixFileName,
	JSONreplacer,
	KEY_MAP
}

export default {
	makeInMemoryStore,
	useMultiFileAuthState,
	useMemoryAuthState,
	fixFileName,
	JSONreplacer,
	KEY_MAP
}
