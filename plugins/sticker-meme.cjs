var {
    sticker
} = require('../lib/sticker.cjs');
var uploadImage = require('../lib/uploadImage.cjs');
var {
    webp2png
} = require('../lib/webp2mp4.cjs');

var handler = async (m, {
    conn,
    args,
    usedPrefix,
    command,
    text
}) => {
    var stiker = false;
    try {
        var q = m.quoted ? m.quoted : m;
        var mime = (q.msg || q).mimetype || q.mediaType || '';
        var [text1, text2] = text.split('|');
        if (!text1) text1 = '-';
        if (!text2) text2 = '';

        // Cek apakah ada media yang di-reply
        if (/webp|image/g.test(mime)) {
            var img = await q.download?.();
            if (!img) return m.reply(`balas gambar/video/stiker dengan perintah\n\ncontoh: ${usedPrefix + command} text1|text2`);

            var out;
            // Konversi webp ke png, atau upload gambar langsung
            if (/webp/g.test(mime)) out = await webp2png(img);
            else if (/image/g.test(mime)) out = await uploadImage(img);
            
            // Pastikan out adalah URL string
            if (typeof out !== 'string') out = await uploadImage(img);

            // Panggil API memegen.link dengan background kustom
            // Format: /images/custom/{teks_atas}/{teks_bawah}.png?style=<URL_BACKGROUND>
            var memeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(text1)}/${encodeURIComponent(text2)}.png?style=${encodeURIComponent(out)}`;
            
            var memeResponse = await fetch(memeUrl);
            if (!memeResponse.ok) throw new Error(`API memegen error: ${memeResponse.status}`);
            
            var memeBuffer = Buffer.from(await memeResponse.arrayBuffer());
            
            // Buat stiker (pastikan packname & author tersedia secara global atau didefinisikan)
            stiker = await sticker(memeBuffer, global.packname || 'Bot', global.author || 'Bot');
        }
    } catch (e) {
        console.error('[memegen] Error:', e);
        // Jangan set stiker = e, karena nanti akan dikirim sebagai file error
        // Cukup biarkan stiker false agar masuk ke finally
    } finally {
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        } else {
            throw 'Gagal membuat stiker meme. Pastikan gambar yang direply valid.';
        }
    }
};

handler.help = ['memegen *teks1|teks2*'];
handler.tags = ['sticker'];
handler.command = /^memegen$/i;
handler.limit = true;

module.exports = handler;
