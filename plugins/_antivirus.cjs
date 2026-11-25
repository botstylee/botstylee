var handler = m => m

// === KONFIGURASI ===
const CONFIG = {
    maxTextLength: 2000,
    maxMentions: 20,
    maxNestedDepth: 6,
    maxNullBytes: 2,
    burstWindowMs: 10000,
    burstThreshold: 3,
    autoKick: true,
    autoBlock: true,
    revokeForEveryone: true,
    notifyOwner: true,
    dropRequestId: true // ✅ Workaround CVE: drop pesan dengan requestId
}

const burstMap = new Map()

// === DETEKSI STRUKTURAL ===
function analyzePayload(m) {
    const msg = m.message
    if (!msg) return null

    // ✅ WORKAROUND CVE-2026-48063: Drop pesan dengan requestId
    // Ini adalah event messages.upsert palsu yang dipalsukan lewat placeholderResendMessage
    if (CONFIG.dropRequestId && m.requestId) {
        return { reason: 'spoofed_upsert_requestId', severity: 'critical', spoofed: true }
    }

    // 1. Teks raksasa
    if (m.text && m.text.length >= CONFIG.maxTextLength)
        return { reason: 'text_overflow', severity: 'high' }

    // 2. Null byte / karakter kontrol
    if (m.text) {
        const ctrl = (m.text.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g) || []).length
        if (ctrl >= CONFIG.maxNullBytes)
            return { reason: 'control_char_injection', severity: 'critical' }
    }

    // 3. Mention masif
    if ((m.mentionedJid?.length || 0) >= CONFIG.maxMentions)
        return { reason: 'mass_mention', severity: 'high' }

    // 4. Nested message dalam
    let depth = 0, cur = msg
    while (cur && typeof cur === 'object' && depth < 60) {
        const keys = Object.keys(cur)
        if (keys.length === 1 && keys[0].endsWith('Message')) {
            cur = cur[keys[0]]
            depth++
        } else break
    }
    if (depth >= CONFIG.maxNestedDepth)
        return { reason: 'deep_nesting', severity: 'critical' }

    // 5. Metadata media rusak
    const mediaKeys = ['imageMessage','videoMessage','audioMessage','documentMessage','stickerMessage']
    for (const k of mediaKeys) {
        if (msg[k]) {
            const md = msg[k]
            if (md.fileLength && Number(md.fileLength) < 100)
                return { reason: 'corrupt_media_metadata', severity: 'high' }
            if (md.url && /[\x00-\x1F]/.test(md.url))
                return { reason: 'malicious_media_url', severity: 'critical' }
        }
    }

    // 6. ProtocolMessage spoofing (mitigasi tambahan)
    if (msg.protocolMessage?.placeholderResendMessage)
        return { reason: 'protocol_spoofing', severity: 'critical' }

    // 7. Stub type mencurigakan
    if (m.messageStubType === 68)
        return { reason: 'suspicious_stub_68', severity: 'medium' }

    return null
}

// === DETEKSI BURST ===
function checkBurst(sender) {
    const now = Date.now()
    const entry = burstMap.get(sender) || { count: 0, first: now }
    if (now - entry.first > CONFIG.burstWindowMs) {
        entry.count = 0
        entry.first = now
    }
    entry.count++
    burstMap.set(sender, entry)
    return entry.count >= CONFIG.burstThreshold
}

// === NETRALISASI ===
async function neutralize(conn, m, det, isBurst) {
    const isGroup = m.chat?.endsWith('@g.us')
    const sender = m.sender
    const level = isBurst ? 'BURST' : det.severity.toUpperCase()

    console.log(`[antivirus] 🚨 ${level} | ${det.reason} | ${sender} | ${m.chat}`)

    // 1. Hapus pesan
    try {
        if (isGroup && CONFIG.revokeForEveryone) {
            await conn.sendMessage(m.chat, { delete: m.key })
        } else {
            await conn.chatModify({ clear: { messages: [{ id: m.key, fromMe: false }] } }, m.chat)
        }
    } catch (e) { console.error('[antivirus] delete fail:', e.message) }

    // 2. Kick + Block
    if (isGroup && CONFIG.autoKick && sender && !det.spoofed) {
        try {
            const meta = await conn.groupMetadata(m.chat)
            const bot = meta.participants.find(p => p.id === conn.user.jid)
            const isAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
            if (isAdmin) {
                await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
                console.log(`[antivirus] 👢 kick: ${sender}`)
            }
        } catch (e) { console.error('[antivirus] kick fail:', e.message) }
    }

    if (CONFIG.autoBlock && !m.key.fromMe && sender && !det.spoofed) {
        try {
            await conn.updateBlockStatus(sender, 'block')
            console.log(`[antivirus] 🚫 block: ${sender}`)
        } catch (e) { console.error('[antivirus] block fail:', e.message) }
    }

    // 3. Notifikasi owner
    if (CONFIG.notifyOwner) {
        const owner = global.nomorown || global.owner?.[0]
        if (owner) {
            try {
                await conn.sendMessage(owner + '@s.whatsapp.net', {
                    text: `🛡️ *ANTIVIRUS*\nChat: ${m.chat}\nDari: ${sender}\nAlasan: ${det.reason}\nLevel: ${level}\nTindakan: Hapus + Kick + Block`
                })
            } catch {}
        }
    }
}

// === HANDLER UTAMA ===
handler.all = async function (m) {
    // Skip pesan dari bot sendiri atau tanpa message
    if (m.key?.fromMe || !m.message) return

    const det = analyzePayload(m)
    if (!det) return

    const isBurst = checkBurst(m.sender)
    await neutralize(this, m, det, isBurst)
}

module.exports = handler
