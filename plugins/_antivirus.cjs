var handler = m => m

// Konfigurasi
const CONFIG = {
    maxTextLength: 3000,           // Turunkan dari 5000 — teks >3000 sudah mencurigakan
    maxMentions: 50,               // Mention >50 orang = spam/bug
    maxNestedDepth: 10,            // Kedalaman nested message yang wajar
    maxNullBytes: 5,               // Null byte >5 dalam teks = payload
    autoKick: true,                // Kick pengirim jika bug terdeteksi (butuh bot admin)
    autoBlock: true,               // Blokir pengirim
    revokeForEveryone: true        // Hapus untuk semua (butuh bot admin)
}

// Deteksi payload berbahaya secara struktural
function isMaliciousPayload(m) {
    const msg = m.message
    if (!msg) return { malicious: false }

    // 1. Cek teks terlalu panjang
    if (m.text && m.text.length >= CONFIG.maxTextLength) {
        return { malicious: true, reason: 'text_too_long', severity: 'high' }
    }

    // 2. Cek null byte / karakter kontrol dalam teks
    if (m.text) {
        const nullBytes = (m.text.match(/\x00/g) || []).length
        if (nullBytes >= CONFIG.maxNullBytes) {
            return { malicious: true, reason: 'null_byte_injection', severity: 'critical' }
        }
    }

    // 3. Cek mention masif
    const mentions = m.mentionedJid || []
    if (mentions.length >= CONFIG.maxMentions) {
        return { malicious: true, reason: 'mass_mention', severity: 'high' }
    }

    // 4. Cek nested message (bug nesting)
    let depth = 0
    let current = msg
    while (current && typeof current === 'object' && depth < 50) {
        const keys = Object.keys(current)
        if (keys.length === 1 && keys[0].endsWith('Message')) {
            current = current[keys[0]]
            depth++
        } else break
    }
    if (depth >= CONFIG.maxNestedDepth) {
        return { malicious: true, reason: 'deep_nesting', severity: 'critical' }
    }

    // 5. Cek metadata media rusak (directPath/url tidak valid)
    const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage']
    for (const type of mediaTypes) {
        if (msg[type]) {
            const media = msg[type]
            // File size 0 atau sangat kecil tapi ada media = mencurigakan
            if (media.fileLength && Number(media.fileLength) < 100) {
                return { malicious: true, reason: 'corrupt_media_metadata', severity: 'high' }
            }
            // URL dengan karakter aneh
            if (media.url && /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(media.url)) {
                return { malicious: true, reason: 'malicious_media_url', severity: 'critical' }
            }
        }
    }

    // 6. Cek messageStubType 68 (revoke aneh) atau tipe stub mencurigakan
    if (m.messageStubType === 68) {
        return { malicious: true, reason: 'suspicious_stub_68', severity: 'medium' }
    }

    return { malicious: false }
}

// Eksekusi tindakan terhadap payload berbahaya
async function neutralize(conn, m, detection) {
    const { reason, severity } = detection
    const isGroup = m.chat?.endsWith('@g.us')
    const sender = m.sender

    console.log(`[antivirus] 🚨 ${severity.toUpperCase()} | ${reason} | from: ${sender} | chat: ${m.chat}`)

    // 1. Hapus pesan
    try {
        if (isGroup && CONFIG.revokeForEveryone) {
            // Hapus untuk semua (butuh bot admin)
            await conn.sendMessage(m.chat, { delete: m.key })
        } else {
            // Delete for me
            await conn.chatModify({
                clear: { messages: [{ id: m.key, fromMe: false }] }
            }, m.chat)
        }
    } catch (e) {
        console.error('[antivirus] Gagal hapus pesan:', e.message)
    }

    // 2. Kick pengirim dari grup (jika bot admin)
    if (isGroup && CONFIG.autoKick && sender) {
        try {
            const metadata = await conn.groupMetadata(m.chat)
            const bot = metadata.participants.find(p => p.id === conn.user.jid)
            const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
            if (isBotAdmin) {
                await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
                console.log(`[antivirus] 👢 Kick: ${sender}`)
            }
        } catch (e) {
            console.error('[antivirus] Gagal kick:', e.message)
        }
    }

    // 3. Blokir pengirim (jika bukan dari diri sendiri)
    if (CONFIG.autoBlock && !m.key.fromMe && sender) {
        try {
            await conn.updateBlockStatus(sender, 'block')
            console.log(`[antivirus] 🚫 Block: ${sender}`)
        } catch (e) {
            console.error('[antivirus] Gagal block:', e.message)
        }
    }

    // 4. Notifikasi ke admin (opsional)
    try {
        const owner = global.nomorown || global.owner?.[0]
        if (owner) {
            await conn.sendMessage(owner + '@s.whatsapp.net', {
                text: `🛡️ *ANTIVIRUS ALERT*\n\nChat: ${m.chat}\nPengirim: ${sender}\nAlasan: ${reason}\nSeverity: ${severity}\n\nTindakan: Hapus + Kick + Block`
            })
        }
    } catch {}
}

handler.all = async function (m) {
    // Skip pesan dari bot sendiri atau tanpa message
    if (m.key?.fromMe || !m.message) return

    // Deteksi
    const detection = isMaliciousPayload(m)

    if (detection.malicious) {
        await neutralize(this, m, detection)
        return // Hentikan pemrosesan lebih lanjut untuk pesan ini
    }
}

module.exports = handler
