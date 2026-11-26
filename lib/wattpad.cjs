const axios = require('axios');
const cheerio = require('cheerio');

// Helper delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// User-Agent yang lebih umum dan stabil
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function wpsearch(query) {
    // Gunakan fields yang lebih minimal dan umum
    const fields = 'stories(id,title,voteCount,readCount,commentCount,completed,cover,url,numParts,user(name)),total';
    const url = `https://www.wattpad.com/v4/search/stories/?query=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&limit=20`;
    
    try {
        const { data } = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': UA
            }
        });

        if (data.total < 1) {
            return { status: 400, message: `Tidak ditemukan story dari "${query}"` };
        }

        return { status: 200, total: data.total, stories: data.stories };
    } catch (e) {
        console.error('[wpsearch] Error:', e.response?.status, e.message);
        return { status: 400, message: 'Gagal mencari story.' };
    }
}

async function wpreads(id) {
    try {
        // 1. Ambil info part untuk dapat text_url
        const { data: partInfo } = await axios.get(`https://www.wattpad.com/v4/parts/${id}`, {
            headers: { 'User-Agent': UA }
        });

        // 2. Guard: pastikan text_url ada
        const textUrl = partInfo.text_url?.text;
        if (!textUrl) {
            return { status: 400, message: 'Teks chapter tidak ditemukan untuk part ini.' };
        }

        // 3. Ambil teks mentah (HTML)
        await delay(1500); // Jeda untuk hindari rate limit
        const { data: rawHtml } = await axios.get(textUrl, {
            headers: { 'User-Agent': UA }
        });

        // 4. Bersihkan HTML jadi teks
        const $ = cheerio.load(rawHtml);
        // Hapus script/style jika ada
        $('script, style').remove();
        const readText = $.text();

        return {
            status: 200,
            data: partInfo,
            read: readText
        };
    } catch (e) {
        console.error('[wpreads] Error:', e.response?.status, e.message);
        return { status: 400, message: 'Gagal mengambil teks chapter.' };
    }
}

// wpviews tetap sama seperti kodemu, hanya tambahkan UA dan guard
async function wpviews(id) {
    try {
        const fields = 'id,title,voteCount,readCount,commentCount,description,url,cover,user(name),completed,numParts,parts(id,title)';
        const { data } = await axios.get(`https://www.wattpad.com/api/v3/stories/${id}?fields=${encodeURIComponent(fields)}`, {
            headers: { 'User-Agent': UA }
        });
        return { status: 200, ...data };
    } catch (e) {
        console.error('[wpviews] Error:', e.response?.status, e.message);
        return { status: 400, message: 'Gagal mengambil detail story.' };
    }
}

module.exports = { wpsearch, wpviews, wpreads };
