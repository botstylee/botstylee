// lib/primbon.cjs
// Scraper primbon.com (diperbaiki: timeout, catch, UA, guard)

const axios = require('axios')
const cheerio = require('cheerio')

// User-Agent browser
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

/**
 * Helper request ke primbon.com
 * @param {string} url
 * @param {'GET'|'POST'} method
 * @param {object} data
 * @returns {Promise<string>} HTML
 */
async function request(url, method = 'GET', data = null) {
	const config = {
		url,
		method,
		timeout: 30000,
		headers: {
			'User-Agent': UA,
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Language': 'id,en;q=0.9'
		}
	}
	if (method === 'POST' && data) {
		config.headers['content-type'] = 'application/x-www-form-urlencoded'
		config.data = new URLSearchParams(Object.entries(data))
	}
	const res = await axios(config)
	return res.data
}

class Primbon {
	constructor({ base_url } = {}) {
		this.base_url = base_url || 'https://primbon.com/'
	}

	async nomer_hoki(nomor) {
		try {
			const data = await request(this.base_url + 'no_hoki_bagua_shuzi.php', 'POST', {
				nomer,
				submit: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text().trim()
			const hasil = {
				status: true,
				message: {
					nomer_hp: fetchText.split('No. HP : ')[1]?.split('\n')[0] || '-',
					angka_shuzi: fetchText.split('Angka Bagua Shuzi : ')[1]?.split('\n')[0] || '-',
					energi_positif: {
						kekayaan: fetchText.split('Kekayaan = ')[1]?.split('\n')[0] || '-',
						kesehatan: fetchText.split('Kesehatan = ')[1]?.split('\n')[0] || '-',
						cinta: fetchText.split('Cinta/Relasi = ')[1]?.split('\n')[0] || '-',
						kestabilan: fetchText.split('Kestabilan = ')[1]?.split('\n')[0] || '-',
						persentase: (fetchText.split('%ENERGI NEGATIF')[0]?.split('% = ')[1] || '0') + '%'
					},
					energi_negatif: {
						perselisihan: fetchText.split('Perselisihan = ')[1]?.split('\n')[0] || '-',
						kehilangan: fetchText.split('Kehilangan = ')[1]?.split('\n')[0] || '-',
						malapetaka: fetchText.split('Malapetaka = ')[1]?.split('\n')[0] || '-',
						kehancuran: fetchText.split('Kehancuran = ')[1]?.split('\n')[0] || '-',
						persentase: fetchText.split('Kehancuran = ')[1]?.split('= ')[1]?.split('\n')[0] || '-'
					},
					catatan: fetchText.split('* ')[1]?.split('Masukkan Nomor HP Anda')[0]?.trim() || '-'
				}
			}
			return hasil
		} catch (e) {
			return { status: false, message: 'ERROR! No. Handphone Tidak Valid! (' + e.message + ')' }
		}
	}

	async tafsir_mimpi(value) {
		try {
			const data = await request(`https://primbon.com/tafsir_mimpi.php?mimpi=${encodeURIComponent(value)}&submit=+Submit+`)
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					mimpi: value,
					arti: fetchText.split(`Hasil pencarian untuk kata kunci: ${value}`)[1]?.split('\n')[0] || '-',
					solusi: fetchText.split('Solusi -')[1]?.trim() || '-'
				}
			}
		} catch (e) {
			return { status: false, message: `Tidak ditemukan tafsir mimpi "${value}" Cari dengan kata kunci yang lain.` }
		}
	}

	async ramalan_jodoh(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2) {
		try {
			const data = await request(this.base_url + 'ramalan_jodoh.php', 'POST', {
				nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2,
				submit: '  RAMALAN JODOH »  '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama_anda: {
						nama: nama1,
						tgl_lahir: fetchText.split('Tgl. Lahir: ')[1]?.split(nama2)[0]?.trim() || '-'
					},
					nama_pasangan: {
						nama: nama2,
						tgl_lahir: fetchText.split(nama2)[1]?.split('Tgl. Lahir: ')[1]?.split('Dibawah')[0]?.trim() || '-'
					},
					result: fetchText.split('begitu pula sebaliknya.')[1]?.split('Konsultasi Hari Baik Akad Nikah >>>')[0]?.trim() || '-',
					catatan: 'Untuk melihat kecocokan jodoh dengan pasangan, dapat dikombinasikan dengan Ramalan Jodoh (Jawa), numerologi Kecocokan Cinta, tingkat keserasian Nama Pasangan, Ramalan Perjalanan Hidup Suami Istri, dan makna dari Tanggal Jadian/Pernikahan.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async ramalan_jodoh_bali(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2) {
		try {
			const data = await request(this.base_url + 'ramalan_jodoh_bali.php', 'POST', {
				nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2,
				submit: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama_anda: {
						nama: nama1,
						tgl_lahir: fetchText.split('Hari Lahir: ')[1]?.split('Nama')[0]?.trim() || '-'
					},
					nama_pasangan: {
						nama: nama2,
						tgl_lahir: fetchText.split(nama2 + 'Hari Lahir: ')[1]?.split('HASILNYA MENURUT PAL SRI SEDANAI')[0]?.trim() || '-'
					},
					result: fetchText.split('HASILNYA MENURUT PAL SRI SEDANAI. ')[1]?.split('Konsultasi Hari Baik Akad Nikah >>>')[0]?.trim() || '-',
					catatan: 'Untuk melihat kecocokan jodoh dengan pasangan, dapat dikombinasikan dengan Ramalan Jodoh (Jawa), numerologi Kecocokan Cinta, tingkat keserasian Nama Pasangan, Ramalan Perjalanan Hidup Suami Istri, dan makna dari Tanggal Jadian/Pernikahan.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async suami_istri(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2) {
		try {
			const data = await request(this.base_url + 'suami_istri.php', 'POST', {
				nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2,
				submit: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					suami: {
						nama: nama1,
						tgl_lahir: fetchText.split('Tgl. Lahir: ')[1]?.split(nama2)[0]?.trim() || '-'
					},
					istri: {
						nama: nama2,
						tgl_lahir: fetchText.split(nama2 + 'Tgl. Lahir: ')[1]?.split('HASIL RAMALAN MENURUT USIA PERNIKAHAN')[0]?.trim() || '-'
					},
					result: fetchText.split('HASIL RAMALAN MENURUT USIA PERNIKAHAN')[1]?.split('Konsultasi Hari Baik Akad Nikah >>>')[0]?.trim() || '-',
					catatan: 'Untuk melihat kecocokan jodoh dengan pasangan, dapat dikombinasikan dengan Ramalan Jodoh (Jawa), Ramalan Jodoh (Bali), numerologi Kecocokan Cinta, tingkat keserasian Nama Pasangan, dan makna dari Tanggal Jadian/Pernikahan.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async ramalan_cinta(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2) {
		try {
			const data = await request(this.base_url + 'ramalan_cinta.php', 'POST', {
				nama1, tanggal1: tgl1, bulan1: bln1, tahun1: thn1,
				nama2, tanggal2: tgl2, bulan2: bln2, tahun2: thn2,
				submit: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama_anda: {
						nama: nama1,
						tgl_lahir: fetchText.split('Tgl. Lahir : ')[1]?.split(nama2)[0]?.trim() || '-'
					},
					nama_pasangan: {
						nama: nama2,
						tgl_lahir: fetchText.split(nama2 + 'Tgl. Lahir : ')[1]?.split('Sisi Positif')[0]?.trim() || '-'
					},
					sisi_positif: fetchText.split('Sisi Positif Anda: ')[1]?.split('Sisi Negatif Anda:')[0]?.trim() || '-',
					sisi_negatif: fetchText.split('Sisi Negatif Anda: ')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: 'Untuk melihat kecocokan jodoh dengan pasangan, dapat dikombinasikan dengan primbon Ramalan Jodoh (Jawa), Ramalan Jodoh (Bali), tingkat keserasian Nama Pasangan, Ramalan Perjalanan Hidup Suami Istri, dan makna dari Tanggal Jadian/Pernikahan.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async arti_nama(value) {
		try {
			const data = await request('https://primbon.com/arti_nama.php?nama1=' + encodeURIComponent(value) + '&proses=+Submit%21+')
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama: value,
					arti: fetchText.split('memiliki arti: ')[1]?.split('Nama:')[0]?.trim() || '-',
					catatan: 'Gunakan juga aplikasi numerologi Kecocokan Nama, untuk melihat sejauh mana keselarasan nama anda dengan diri anda.'
				}
			}
		} catch (e) {
			return { status: false, message: `Tidak ditemukan arti nama "${value}" Cari dengan kata kunci yang lain.` }
		}
	}

	async kecocokan_nama(nama, tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'kecocokan_nama.php', 'POST', {
				nama, tgl, bln, thn,
				kirim: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama,
					tgl_lahir: fetchText.split('Tgl. Lahir: ')[1]?.split('\n')[0] || '-',
					life_path: fetchText.split('Life Path Number : ')[1]?.split('\n')[0] || '-',
					destiny: fetchText.split('Destiny Number : ')[1]?.split('\n')[0] || '-',
					destiny_desire: fetchText.split("Heart's Desire Number : ")[1]?.split('\n')[0] || '-',
					personality: fetchText.split('Personality Number : ')[1]?.split('\n')[0] || '-',
					persentase_kecocokan: fetchText.split('PERSENTASE KECOCOKAN')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: 'Gunakan juga aplikasi numerologi Arti Nama, untuk melihat arti dan karakter dari nama anda.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async kecocokan_nama_pasangan(nama1, nama2) {
		try {
			const data = await request('https://primbon.com/kecocokan_nama_pasangan.php?nama1=' + encodeURIComponent(nama1) + '&nama2=' + encodeURIComponent(nama2) + '&proses=+Submit%21+')
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama_anda: nama1,
					nama_pasangan: nama2,
					sisi_positif: fetchText.split('Sisi Positif Anda: ')[1]?.split('Sisi Negatif Anda: ')[0]?.trim() || '-',
					sisi_negatif: fetchText.split('Sisi Negatif Anda: ')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					gambar: 'https://primbon.com/ramalan_kecocokan_cinta2.png',
					catatan: 'Untuk melihat kecocokan jodoh dengan pasangan, dapat dikombinasikan dengan primbon Ramalan Jodoh (Jawa), Ramalan Jodoh (Bali), numerologi Kecocokan Cinta, Ramalan Perjalanan Hidup Suami Istri, dan makna dari Tanggal Jadian/Pernikahan.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async tanggal_jadian_pernikahan(tgl, bln, thn) {
		try {
			const data = await request(`https://primbon.com/tanggal_jadian_pernikahan.php?tgl=${tgl}&bln=${bln}&thn=${thn}&proses=+Submit%21+`)
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					tanggal: fetchText.split('Tanggal: ')[1]?.split('Karakteristik: ')[0]?.trim() || '-',
					karakteristik: fetchText.split('Karakteristik: ')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: 'Untuk melihat kecocokan jodoh dengan pasangan, dapat dikombinasikan dengan primbon Ramalan Jodoh (Jawa), Ramalan Jodoh (Bali), numerologi Kecocokan Cinta, tingkat keserasian Nama Pasangan, dan Ramalan Perjalanan Hidup Suami Istri.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async sifat_usaha_bisnis(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'sifat_usaha_bisnis.php', 'POST', { tgl, bln, thn, submit: ' Submit! ' })
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					hari_lahir: fetchText.split('Hari Lahir Anda: ')[1]?.split(thn)[0]?.trim() || '-',
					usaha: fetchText.split(thn)[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: 'Setiap manusia memiliki sifat atau karakter yang berbeda-beda dalam menjalankan bisnis atau usaha. Dengan memahami sifat bisnis kita, rekan kita, atau bahkan kompetitor kita, akan membantu kita memperbaiki diri atau untuk menjalin hubungan kerjasama yang lebih baik. Para ahli primbon di tanah Jawa sejak jaman dahulu telah merumuskan karakter atau sifat bisnis seseorang berdasarkan weton hari kelahirannya. Hasil perhitungannya bisa dijadikan referensi untuk memilih bidang usaha atau rekan bisnis yang cocok bagi kita.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async rejeki_hoki_weton(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'rejeki_hoki_weton.php', 'POST', { tgl, bln, thn, submit: ' Submit! ' })
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					hari_lahir: fetchText.split('Hari Lahir: ')[1]?.split(thn)[0]?.trim() || '-',
					rejeki: fetchText.split(thn)[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: 'Rejeki itu bukan lah tentang ramalan tetapi tentang usaha dan ikhtiar seseorang. From Admin'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async pekerjaan_weton_lahir(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'pekerjaan_weton_lahir.php', 'POST', { tgl, bln, thn, submit: ' Submit! ' })
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					hari_lahir: fetchText.split('Hari Lahir: ')[1]?.split(thn)[0]?.trim() || '-',
					pekerjaan: fetchText.split(thn)[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: 'Setiap manusia membawa potensi bakat dan keberuntungannya sejak lahir, dengan mengetahui potensi tersebut dan menyesuaikannya dengan usaha atau pekerjaan yang dilakukan, diharapkan dapat mempermudah kita meraih kesuksesan. Para ahli primbon di tanah Jawa sejak jaman dahulu telah merumuskan jenis pekerjaan yang cocok berdasarkan weton kelahiran. Hasil perhitungannya bisa kita jadikan referensi untuk memilih pekerjaan atau bidang usaha yang cocok untuk kita.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async ramalan_nasib(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'ramalan_nasib.php', 'POST', {
				tanggal: tgl, bulan: bln, tahun: thn,
				hitung: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					analisa: fetchText.split('RAMALAN NASIB (METODE PITAGORAS)')[1]?.split('The Holy Tetraktys')[0]?.trim() || '-',
					sifat: fetchText.split('The Holy Tetraktys')[1]?.split('Dalam numerologi Pitagoras,')[0]?.trim() || '-',
					element: ('Dalam numerologi Pitagoras' + (fetchText.split('Dalam numerologi Pitagoras')[1]?.split('Angka Kombinasi')[0] || '')).trim(),
					catatan: 'Gunakan juga aplikasi ramalan dengan Kartu Tarot, Tarot Cinta, Kartu Lenormand , ramalan Peruntungan sepanjang tahun. Cari solusi atau nasehat dari masalah anda melalui hexagram I Ching.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async cek_potensi_penyakit(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'cek_potensi_penyakit.php', 'POST', {
				tanggal: tgl, bulan: bln, tahun: thn,
				hitung: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					analisa: fetchText.split('CEK POTENSI PENYAKIT (METODE PITAGORAS)')[1]?.split('Sektor yg dianalisa:')[0]?.trim() || '-',
					sektor: fetchText.split('Sektor yg dianalisa:')[1]?.split('Anda tidak memiliki elemen')[0]?.trim() || '-',
					elemen: 'Anda tidak memiliki elemen ' + (fetchText.split('Anda tidak memiliki elemen')[1]?.split('*')[0]?.trim() || ''),
					catatan: 'Potensi penyakit harus dipandang secara positif. Sakit pada daftar tidak berarti anda akan mengalami semuanya. Anda mungkin hanya akan mengalami 1 atau 2 macam penyakit. Pencegahan adalah yang terbaik, makanan yang sehat, olahraga teratur, istirahat yang cukup, hidup bahagia, adalah resep paling manjur untuk menghindari segala penyakit.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async arti_kartu_tarot(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'arti_kartu_tarot.php', 'POST', {
				tgl, bln, thn,
				kirim: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			const imgSrc = $('#body').find('img').attr('src')
			return {
				status: true,
				message: {
					arti: fetchText.split('JALAN HIDUP')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					image: imgSrc ? 'https://primbon.com/' + imgSrc : null
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async perhitungan_feng_shui(nama, gender, tahun) {
		/**
		 * value nama isi sesuai namamu
		 * value gender "1" untuk laki-laki & "2" untuk perempuan
		 * value tahun isi sesuai tahun lahirmu
		 */
		try {
			const data = await request(this.base_url + 'perhitungan_feng_shui.php', 'POST', {
				nama, gender, tahun,
				submit: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama: fetchText.split('Nama: ')[1]?.split('Thn. Lahir: ')[0]?.trim() || '-',
					tahun_lahir: fetchText.split('Thn. Lahir: ')[1]?.split('Jns. Kelamin: ')[0]?.trim() || '-',
					jenis_kelamin: fetchText.split('Jns. Kelamin: ')[1]?.split('Angka Kua Anda: ')[0]?.trim() || '-',
					angka_kua: fetchText.split('Angka Kua Anda: ')[1]?.split('Anda termasuk kelompok')[0]?.trim() || '-',
					kelompok: fetchText.split('Anda termasuk kelompok')[1]?.split('Orang dalam kelompok ini mempunyai karakter:')[0]?.trim() || '-',
					karakter: fetchText.split('Orang dalam kelompok ini mempunyai karakter: ')[1]?.split('SEKTOR/ARAH BAIK')[0]?.trim() || '-',
					sektor_baik: fetchText.split('SEKTOR/ARAH BAIK')[1]?.split('SEKTOR/ARAH BURUK')[0]?.trim() || '-',
					sektor_buruk: fetchText.split('SEKTOR/ARAH BURUK')[1]?.split('< Hitung Kembali')[0]?.trim() || '-'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async petung_hari_baik(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'petung_hari_baik.php', 'POST', { tgl, bln, thn, submit: ' Submit! ' })
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					tgl_lahir: fetchText.split('Watak Hari Menurut Kamarokam')[1]?.split('Kala Tinantang:')[0]?.trim() || '-',
					kala_tinantang: fetchText.split('Kala Tinantang: ')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					info: 'Dalam kitab Primbon dituliskan bahwa setiap hari memiliki karakter atau watak yang berbeda-beda. Dengan mengetahui watak hari tersebut, kita dapat menentukan kapan hari atau saat yang tepat untuk melaksanakan suatu hal atau kegiatan sehingga dapat tercapai tujuan yang kita harapkan. Salah satu cara untuk menentukan watak hari baik/buruk adalah berdasarkan Petung Kamarokam. Petung Kamarokam sebenarnya adalah perpaduan Petung Pancasuda Asli dengan Petung Pancasuda Pakuwon yang sudah disaring dan diringkas intisarinya.',
					catatan: 'Untuk mencari hari baik berbagai keperluan, dapat dikombinasikan dengan primbon Hari Larangan dan primbon Hari Naas. Sedangkan untuk mencari hari baik Akad Nikah diperlukan perhitungan secara khusus, prosedurnya dapat dilihat disini.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async hari_sangar_taliwangke(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'hari_sangar_taliwangke.php', 'POST', {
				tgl, bln, thn,
				kirim: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					tgl_lahir: fetchText.split('Primbon Hari Larangan (Tanggal Sangar, Bangas Padewan, Taliwangke)')[1]?.split('Termasuk hari BIASA')[0]?.trim() || '-',
					result: 'Termasuk hari BIASA' + (fetchText.split('Termasuk hari BIASA')[1]?.split('Untuk mengetahui watak hari, masukkan:')[0] || ''),
					info: fetchText.split('*')[1]?.split('Catatan:')[0]?.trim() || '-',
					catatan: 'Untuk mencari hari baik berbagai keperluan, dapat dikombinasikan dengan primbon Hari Baik dan primbon Hari Naas. Sedangkan untuk mencari hari baik Akad Nikah diperlukan perhitungan secara khusus, prosedurnya dapat dilihat disini.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async primbon_hari_naas(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'primbon_hari_naas.php', 'POST', { tgl, bln, thn, submit: ' Submit! ' })
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					hari_lahir: fetchText.split('Hari Lahir Anda: ')[1]?.split(',')[0]?.trim() || '-',
					tgl_lahir: fetchText.split('Tgl. ')[1]?.split('Hari Naas Anda:')[0]?.trim() || '-',
					hari_naas: fetchText.split('Hari Naas Anda: ')[1]?.split('Catatan:')[0]?.trim() || '-',
					catatan: fetchText.split('Catatan: ')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					info: 'Pada dasarnya setiap orang yang dilahirkan selalu membawa takdir positif dan takdir negatif. Takdir positif seperti misalnya sehat, sukses, rejeki, dll. Sedangkan takdir negatif seperti misalnya sakit, musibah, kematian, dll. Primbon Hari Naas itu sendiri adalah "Ilmu Titen" yang diwariskan oleh leluhur kita  dari tanah Jawa secara turun temurun, yang niteni atau mempelajari bahwa ternyata ada hubungan antara weton hari lahir dengan weton hari naas seseorang. Primbon Hari Naas ini tidak dimaksudkan untuk menakut-nakuti kita, tetapi lebih diharapkan supaya kita jadi lebih waspada akan adanya takdir negatif yang dapat menimpa kita. Pada hari itu, sebaiknya kita menghindari perjalanan jauh ataupun mengadakan acara-acara penting, serta memperbanyak doa dan sedekah.'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async rahasia_naga_hari(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'rahasia_naga_hari.php', 'POST', { tgl, bln, thn, submit: ' Submit! ' })
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					hari_lahir: fetchText.split('RAHASIA NAGA HARI')[1]?.split(',')[0]?.trim() || '-',
					tgl_lahir: fetchText.split('Tgl. ')[1]?.split('Naga Hari berada di')[0]?.trim() || '-',
					arah_naga_hari: fetchText.split('Naga Hari berada di ')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: fetchText.split('< Hitung Kembali')[1]?.trim() || '-'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async primbon_arah_rejeki(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'primbon_arah_rejeki.php', 'POST', { tgl, bln, thn, submit: ' Submit! ' })
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					hari_lahir: fetchText.split('MENURUT PRIMBON GAYATRI:')[1]?.split(',')[0]?.trim() || '-',
					tgl_lahir: fetchText.split('Tgl. ')[1]?.split('Rejeki berada di ')[0]?.trim() || '-',
					arah_rejeki: fetchText.split('Rejeki berada di ')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: fetchText.split('< Hitung Kembali')[1]?.trim() || '-'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async ramalan_peruntungan(nama, tgl, bln, thn, untuk) {
		try {
			const data = await request(this.base_url + 'ramalan_peruntungan.php', 'POST', {
				nama1: nama, tgl1: tgl, bln1: bln, thn1: thn, thn2: untuk,
				submit: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama,
					tgl_lahir: fetchText.split('Tgl. Lahir : ')[1]?.split('PERUNTUNGAN ANDA DI TAHUN')[0]?.trim() || '-',
					peruntungan_tahun: untuk,
					result: fetchText.split(`PERUNTUNGAN ANDA DI TAHUN ${untuk}`)[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: fetchText.split('Catatan: ')[1]?.trim() || '-'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async weton_jawa(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'weton_jawa.php', 'POST', {
				tgl, bln, thn,
				submit: '  WETON JAWA »  '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					tanggal: fetchText.split('Tanggal: ')[1]?.split('Jumlah Neptu')[0]?.trim() || '-',
					jumlah_neptu: fetchText.split('Jumlah Neptu')[1]?.split('Watak Hari (Kamarokam)')[0]?.trim() || '-',
					watak_hari: fetchText.split('Watak Hari (Kamarokam)')[1]?.split('Naga Hari')[0]?.trim() || '-',
					naga_hari: fetchText.split('.Naga Hari')[1]?.split('Jam Baik (Saptawara & Pancawara)')[0]?.trim() || '-',
					jam_baik: fetchText.split('Jam Baik (Saptawara & Pancawara)')[1]?.split('Watak Kelahiran')[0]?.trim() || '-',
					watak_kelahiran: fetchText.split('Watak Kelahiran')[1]?.split('< Hitung Kembali')[0]?.trim() || '-'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async sifat_karakter_tanggal_lahir(nama, tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'sifat_karakter_tanggal_lahir.php', 'POST', {
				nama, tanggal: tgl, bulan: bln, tahun: thn,
				submit: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama,
					tgl_lahir: fetchText.split('Tgl. Lahir : ')[1]?.split('GARIS HIDUP')[0]?.trim() || '-',
					garis_hidup: fetchText.split('GARIS HIDUP')[1]?.split('< Hitung Kembali')[0]?.trim() || '-'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async potensi_keberuntungan(nama, tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'potensi_keberuntungan.php', 'POST', {
				nama, tanggal: tgl, bulan: bln, tahun: thn,
				submit: ' Submit! '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					nama,
					tgl_lahir: fetchText.split('Tgl. Lahir : ')[1]?.split('Setiap orang')[0]?.trim() || '-',
					result: 'Setiap orang' + (fetchText.split('Setiap orang')[1]?.split('< Hitung Kembali')[0] || '')
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async primbon_memancing_ikan(tgl, bln, thn) {
		try {
			const data = await request(this.base_url + 'primbon_memancing_ikan.php', 'POST', { tgl, bln, thn, submit: ' Submit! ' })
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					tgl_mancing: fetchText.split('PRIMBON MEMANCING IKAN')[1]?.split('Maka hasilnya: ')[0]?.trim() || '-',
					result: fetchText.split('Maka hasilnya: ')[1]?.split('< Hitung Kembali')[0]?.trim() || '-',
					catatan: fetchText.split('< Hitung Kembali')[1]?.trim() || '-'
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async masa_subur(dateday, datemonth, dateyear, siklus = '28') {
		try {
			const data = await request(this.base_url + 'masa_subur.php', 'POST', {
				dateday, datemonth, dateyear, days: siklus,
				calculator_ok: ' Submit '
			})
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: {
					result: fetchText.split('KALKULATOR MASA SUBUR')[1]?.split('Menentukan Ovulasi & Masa Subur')[0]?.trim() || '-',
					catatan: 'Menentukan Ovulasi & Masa Subur\n' + (fetchText.split('Menentukan Ovulasi & Masa Subur')[1]?.trim() || '')
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async zodiak(zodiak) {
		try {
			const data = await request(`https://primbon.com/zodiak/${zodiak}.htm`)
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			// Guard: cari pemisah newline yang aman
			const parts = fetchText.split(/\n{5,}/)
			const catatan = parts[1] ? parts[1].split('<<< Kembali')[0].trim() : '-'
			return {
				status: true,
				message: {
					zodiak: fetchText.split('Nomor Keberuntungan:')[0]?.trim() || '-',
					nomor_keberuntungan: fetchText.split('Nomor Keberuntungan: ')[1]?.split('\n')[0] || '-',
					aroma_keberuntungan: fetchText.split('Aroma Keberuntungan: ')[1]?.split('\n')[0] || '-',
					planet_yang_mengitari: fetchText.split('Planet Yang Mengitari: ')[1]?.split('\n')[0] || '-',
					bunga_keberuntungan: fetchText.split('Bunga Keberuntungan: ')[1]?.split('\n')[0] || '-',
					warna_keberuntungan: fetchText.split('Warna Keberuntungan: ')[1]?.split('\n')[0] || '-',
					batu_keberuntungan: fetchText.split('Batu Keberuntungan: ')[1]?.split('\n')[0] || '-',
					elemen_keberuntungan: fetchText.split('Elemen Keberuntungan: ')[1]?.split('\n')[0] || '-',
					pasangan_zodiak: fetchText.split('Pasangan Serasi: ')[1]?.split('\n')[0] || '-',
					catatan
				}
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}

	async shio(shio) {
		try {
			const data = await request(`https://primbon.com/shio/${shio}.htm`)
			const $ = cheerio.load(data)
			const fetchText = $('#body').text()
			return {
				status: true,
				message: fetchText.split('<<< Kembali')[0]?.trim() || '-'
			}
		} catch (e) {
			return { status: false, message: 'Error, Mungkin Input Yang Anda Masukkan Salah' }
		}
	}
}

module.exports = Primbon
