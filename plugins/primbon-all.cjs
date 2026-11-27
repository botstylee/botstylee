// plugins/primbon-all.cjs
// Fitur: Semua primbon (BOTSTYLE)

var { Primbon } = require('../lib/primbon.cjs')
var primbon = new Primbon()

var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
	// Helper: kirim hasil
	var send = async (title, data) => {
		if (!data || data.status === false) {
			return m.reply(data?.message || 'Gagal mengambil data.')
		}
		var msg = data.message
		var txt = `*「 ${title} 」*\n\n`
		for (var key in msg) {
			if (typeof msg[key] === 'object' && msg[key] !== null) {
				txt += `*${key}:*\n`
				for (var sub in msg[key]) {
					txt += `  • ${sub}: ${msg[key][sub]}\n`
				}
			} else {
				txt += `*${key}:* ${msg[key]}\n`
			}
		}
		return m.reply(txt.trim())
	}

	// === NOMER HOKI ===
	if (command === 'nomerhoki' || command === 'nohoki') {
		if (!text) throw `Contoh: ${usedPrefix + command} 6281234567890`
		var res = await primbon.nomer_hoki(text.replace(/[^0-9]/g, ''))
		return send('NOMER HOKI', res)
	}

	// === RAMALAN JODOH (JAWA) ===
	if (command === 'ramalanjodoh' || command === 'jodohjawa') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,13,12,2000|Byy,13,12,2000`
		var [p1, p2] = text.split('|')
		if (!p1 || !p2) throw 'Format: nama,tgl,bln,thn|nama,tgl,bln,thn'
		var [n1, t1, b1, y1] = p1.split(',')
		var [n2, t2, b2, y2] = p2.split(',')
		var res = await primbon.ramalan_jodoh(n1, t1, b1, y1, n2, t2, b2, y2)
		return send('RAMALAN JODOH (JAWA)', res)
	}

	// === RAMALAN JODOH (BALI) ===
	if (command === 'ramalanjodohbali' || command === 'jodohbali') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,13,12,2000|Byy,13,12,2000`
		var [p1, p2] = text.split('|')
		if (!p1 || !p2) throw 'Format: nama,tgl,bln,thn|nama,tgl,bln,thn'
		var [n1, t1, b1, y1] = p1.split(',')
		var [n2, t2, b2, y2] = p2.split(',')
		var res = await primbon.ramalan_jodoh_bali(n1, t1, b1, y1, n2, t2, b2, y2)
		return send('RAMALAN JODOH (BALI)', res)
	}

	// === SUAMI ISTRI ===
	if (command === 'suamiistri' || command === 'perjalananhidup') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,13,12,2000|Byy,13,12,2000`
		var [p1, p2] = text.split('|')
		if (!p1 || !p2) throw 'Format: nama,tgl,bln,thn|nama,tgl,bln,thn'
		var [n1, t1, b1, y1] = p1.split(',')
		var [n2, t2, b2, y2] = p2.split(',')
		var res = await primbon.suami_istri(n1, t1, b1, y1, n2, t2, b2, y2)
		return send('PERJALANAN HIDUP SUAMI ISTRI', res)
	}

	// === RAMALAN CINTA ===
	if (command === 'ramalancinta' || command === 'kecocokancinta') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,13,12,2000|Byy,13,12,2000`
		var [p1, p2] = text.split('|')
		if (!p1 || !p2) throw 'Format: nama,tgl,bln,thn|nama,tgl,bln,thn'
		var [n1, t1, b1, y1] = p1.split(',')
		var [n2, t2, b2, y2] = p2.split(',')
		var res = await primbon.ramalan_cinta(n1, t1, b1, y1, n2, t2, b2, y2)
		return send('RAMALAN CINTA', res)
	}

	// === KECOCOKAN NAMA (NUMEROLOGI) ===
	if (command === 'kecocokannama' || command === 'numerologi') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,13,12,2000`
		var [nama, tgl, bln, thn] = text.split(',')
		if (!nama || !tgl) throw 'Format: nama,tgl,bln,thn'
		var res = await primbon.kecocokan_nama(nama, tgl, bln, thn)
		return send('KECOCOKAN NAMA (NUMEROLOGI)', res)
	}

	// === TANGGAL JADIAN/PERNIKAHAN ===
	if (command === 'tanggaljadian' || command === 'tanggalnikah') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.tanggal_jadian_pernikahan(tgl, bln, thn)
		return send('TANGGAL JADIAN/PERNIKAHAN', res)
	}

	// === SIFAT USAHA BISNIS ===
	if (command === 'sifatbisnis' || command === 'sifatusaha') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.sifat_usaha_bisnis(tgl, bln, thn)
		return send('SIFAT USAHA BISNIS', res)
	}

	// === REJEKI HOKI WETON ===
	if (command === 'rejekiweton' || command === 'rejekihoki') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.rejeki_hoki_weton(tgl, bln, thn)
		return send('REJEKI HOKI WETON', res)
	}

	// === PEKERJAAN WETON LAHIR ===
	if (command === 'pekerjaanweton' || command === 'pekerjaan') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.pekerjaan_weton_lahir(tgl, bln, thn)
		return send('PEKERJAAN WETON LAHIR', res)
	}

	// === RAMALAN NASIB ===
	if (command === 'ramalannasib' || command === 'nasib') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.ramalan_nasib(tgl, bln, thn)
		return send('RAMALAN NASIB', res)
	}

	// === CEK POTENSI PENYAKIT ===
	if (command === 'potensipenyakit' || command === 'cekpenyakit') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.cek_potensi_penyakit(tgl, bln, thn)
		return send('CEK POTENSI PENYAKIT', res)
	}

	// === ARTI KARTU TAROT ===
	if (command === 'tarot' || command === 'kartutarot') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.arti_kartu_tarot(tgl, bln, thn)
		return send('ARTI KARTU TAROT', res)
	}

	// === FENG SHUI ===
	if (command === 'fengshui' || command === 'perhitunganfengshui') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,1,2000`
		var [nama, gender, tahun] = text.split(',')
		if (!nama || !gender || !tahun) throw 'Format: nama,gender(1/2),tahun'
		var res = await primbon.perhitungan_feng_shui(nama, gender, tahun)
		return send('PERHITUNGAN FENG SHUI', res)
	}

	// === PETUNG HARI BAIK ===
	if (command === 'haribaik' || command === 'petungharibaik') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.petung_hari_baik(tgl, bln, thn)
		return send('PETUNG HARI BAIK', res)
	}

	// === HARI SANGAR TALIWANGKE ===
	if (command === 'harilangan' || command === 'sangar') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.hari_sangar_taliwangke(tgl, bln, thn)
		return send('HARI LARANGAN (SANGAR/TALIWANGKE)', res)
	}

	// === PRIMBON HARI NAAS ===
	if (command === 'harinaas' || command === 'primbonharinaas') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.primbon_hari_naas(tgl, bln, thn)
		return send('PRIMBON HARI NAAS', res)
	}

	// === RAHASIA NAGA HARI ===
	if (command === 'nagahari' || command === 'rahasianaga') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.rahasia_naga_hari(tgl, bln, thn)
		return send('RAHASIA NAGA HARI', res)
	}

	// === PRIMBON ARAH REJEKI ===
	if (command === 'arahrejeki' || command === 'arahrejeki') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.primbon_arah_rejeki(tgl, bln, thn)
		return send('PRIMBON ARAH REJEKI', res)
	}

	// === RAMALAN PERUNTUNGAN ===
	if (command === 'peruntungan' || command === 'ramalanperuntungan') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,13,12,2000,2024`
		var [nama, tgl, bln, thn, untuk] = text.split(',')
		if (!nama || !tgl || !untuk) throw 'Format: nama,tgl,bln,thn,tahun'
		var res = await primbon.ramalan_peruntungan(nama, tgl, bln, thn, untuk)
		return send('RAMALAN PERUNTUNGAN', res)
	}

	// === WETON JAWA ===
	if (command === 'wetonjawa' || command === 'weton') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.weton_jawa(tgl, bln, thn)
		return send('WETON JAWA', res)
	}

	// === SIFAT KARAKTER TANGGAL LAHIR ===
	if (command === 'sifatkarakter' || command === 'karakterlahir') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,13,12,2000`
		var [nama, tgl, bln, thn] = text.split(',')
		if (!nama || !tgl) throw 'Format: nama,tgl,bln,thn'
		var res = await primbon.sifat_karakter_tanggal_lahir(nama, tgl, bln, thn)
		return send('SIFAT KARAKTER TANGGAL LAHIR', res)
	}

	// === POTENSI KEBERUNTUNGAN ===
	if (command === 'potensikeberuntungan' || command === 'keberuntungan') {
		if (!text) throw `Contoh: ${usedPrefix + command} Benni,13,12,2000`
		var [nama, tgl, bln, thn] = text.split(',')
		if (!nama || !tgl) throw 'Format: nama,tgl,bln,thn'
		var res = await primbon.potensi_keberuntungan(nama, tgl, bln, thn)
		return send('POTENSI KEBERUNTUNGAN', res)
	}

	// === PRIMBON MEMANCING IKAN ===
	if (command === 'mancingikan' || command === 'primbonmancing') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000`
		var [tgl, bln, thn] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn'
		var res = await primbon.primbon_memancing_ikan(tgl, bln, thn)
		return send('PRIMBON MEMANCING IKAN', res)
	}

	// === MASA SUBUR ===
	if (command === 'masasubur' || command === 'subur') {
		if (!text) throw `Contoh: ${usedPrefix + command} 13,12,2000,28`
		var [tgl, bln, thn, siklus] = text.split(',')
		if (!tgl || !bln || !thn) throw 'Format: tgl,bln,thn,siklus'
		var res = await primbon.masa_subur(tgl, bln, thn, siklus || '28')
		return send('MASA SUBUR', res)
	}

	// === ZODIAK ===
	if (command === 'zodiak') {
		if (!text) throw `Contoh: ${usedPrefix + command} aries`
		var res = await primbon.zodiak(text.toLowerCase())
		return send(`ZODIAK ${text.toUpperCase()}`, res)
	}

	// === SHIO ===
	if (command === 'shio') {
		if (!text) throw `Contoh: ${usedPrefix + command} tikus`
		var res = await primbon.shio(text.toLowerCase())
		return send(`SHIO ${text.toUpperCase()}`, res)
	}
}

// Daftar command + help
handler.help = [
	'nomerhoki <nomor>',
	'ramalanjodoh <nama,tgl,bln,thn|nama,tgl,bln,thn>',
	'ramalanjodohbali <nama,tgl,bln,thn|nama,tgl,bln,thn>',
	'suamiistri <nama,tgl,bln,thn|nama,tgl,bln,thn>',
	'ramalancinta <nama,tgl,bln,thn|nama,tgl,bln,thn>',
	'kecocokannama <nama,tgl,bln,thn>',
	'tanggaljadian <tgl,bln,thn>',
	'sifatbisnis <tgl,bln,thn>',
	'rejekiweton <tgl,bln,thn>',
	'pekerjaanweton <tgl,bln,thn>',
	'ramalannasib <tgl,bln,thn>',
	'potensipenyakit <tgl,bln,thn>',
	'tarot <tgl,bln,thn>',
	'fengshui <nama,gender,tahun>',
	'haribaik <tgl,bln,thn>',
	'harilangan <tgl,bln,thn>',
	'harinaas <tgl,bln,thn>',
	'nagahari <tgl,bln,thn>',
	'arahrejeki <tgl,bln,thn>',
	'peruntungan <nama,tgl,bln,thn,tahun>',
	'wetonjawa <tgl,bln,thn>',
	'sifatkarakter <nama,tgl,bln,thn>',
	'potensikeberuntungan <nama,tgl,bln,thn>',
	'mancingikan <tgl,bln,thn>',
	'masasubur <tgl,bln,thn,siklus>',
	'zodiak <nama_zodiak>',
	'shio <nama_shio>'
]

handler.tags = ['primbon']
handler.command = /^(nomerhoki|nohoki|ramalanjodoh|jodohjawa|ramalanjodohbali|jodohbali|suamiistri|perjalananhidup|ramalancinta|kecocokancinta|kecocokannama|numerologi|tanggaljadian|tanggalnikah|sifatbisnis|sifatusaha|rejekiweton|rejekihoki|pekerjaanweton|pekerjaan|ramalannasib|nasib|potensipenyakit|cekpenyakit|tarot|kartutarot|fengshui|perhitunganfengshui|haribaik|petungharibaik|harilangan|sangar|harinaas|primbonharinaas|nagahari|rahasianaga|arahrejeki|peruntungan|ramalanperuntungan|wetonjawa|weton|sifatkarakter|karakterlahir|potensikeberuntungan|keberuntungan|mancingikan|primbonmancing|masasubur|subur|zodiak|shio)$/i

module.exports = handler
