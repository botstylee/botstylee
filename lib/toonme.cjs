// lib/toonme.cjs (v2 - Pakai OmegaTech API)
// Gratis, tanpa API key, 447+ endpoint

const axios = require('axios')

const BASE = 'https://api.omegatech.app'

/**
 * Ubah gambar jadi kartun (toonme) via OmegaTech
 * @param {Buffer} imageBuffer - Buffer gambar
 * @param {string} filter - v1-v10 (akan dimapping ke prompt)
 * @returns {Promise<string>} URL hasil
 */
async function toonme(imageBuffer, filter = 'v2') {
	// Mapping filter ke prompt gaya
	const styleMap = {
		v1: 'cartoon style, disney pixar',
		v2: 'anime style, studio ghibli',
		v3: 'comic book style, marvel',
		v4: '3d render, pixar style',
		v5: 'watercolor painting style',
		v6: 'oil painting style, classic',
		v7: 'sketch style, pencil drawing',
		v8: 'cyberpunk neon style',
		v9: 'fantasy art style, epic',
		v10: 'minimalist flat design style'
	}

	const prompt = styleMap[filter] || styleMap.v2

	// Upload gambar ke endpoint yang bisa terima base64
	// OmegaTech punya /api/ai/nano-banana yang terima image URL atau base64
	// Tapi karena kita punya buffer, kita perlu upload dulu
	// Alternatif: pakai /api/ai/Ai yang terima imageUrl

	// Untuk sementara, kita pakai endpoint yang terima base64 langsung
	// (cek dokumentasi: /api/ai/nano-banana terima "Public image URL (http/https) or base64-encoded image")

	const base64 = imageBuffer.toString('base64')
	const dataUri = `data:image/jpeg;base64,${base64}`

	try {
		const res = await axios.get(`${BASE}/api/ai/nano-banana`, {
			params: {
				action: 'edit',
				image: dataUri,
				prompt: prompt
			},
			timeout: 120000 // 2 menit, karena AI butuh waktu
		})

		// Respons bisa berupa URL atau base64
		if (res.data?.result) return res.data.result
		if (res.data?.url) return res.data.url
		if (typeof res.data === 'string' && res.data.startsWith('http')) return res.data

		throw new Error('Respons tidak berisi URL gambar')
	} catch (e) {
		console.error('[toonme] Error:', e.response?.data || e.message)
		throw new Error('Gagal memproses gambar: ' + (e.response?.data?.message || e.message))
	}
}

module.exports = toonme
