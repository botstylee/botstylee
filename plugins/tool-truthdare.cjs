var handler = async (m, {
	conn,
	command
}) => {
	 if(command == 'truth') {
		conn.reply(m.chat, `“${pickRandom(global.truth)}”`, m)
	} else {
		conn.reply(m.chat, `“${pickRandom(global.dare)}”`, m)
	}
}
handler.help = ['truth', 'dare']
handler.tags = ['tools']
handler.command = /^(truth|dare)$/i

module.exports = handler

function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}
//https://sumsel-tribunnews-com.cdn.ampproject.org/v/s/sumsel.tribunnews.com/amp/2020/05/14/pertanyaan-dan-tantangan-truth-or-dare-seru-dan-aman-untuk-mencairkan-suasana?amp_js_v=a6&amp_gsa=1&usqp=mq331AQHKAFQArABIA%3D%3D#aoh=16158517341963&referrer=https%3A%2F%2Fwww.google.com&amp_tf=Dari%20%251%24s&ampshare=https%3A%2F%2Fsumsel.tribunnews.com%2F2020%2F05%2F14%2Fpertanyaan-dan-tantangan-truth-or-dare-seru-dan-aman-untuk-mencairkan-suasana
//https://psycatgames-com.cdn.ampproject.org/v/s/psycatgames.com/id/magazine/party-games/truth-or-dare/?amp_js_v=a6&amp_gsa=1&usqp=mq331AQHKAFQArABIA%3D%3D#aoh=16158517866717&amp_ct=1615851787919&referrer=https%3A%2F%2Fwww.google.com&amp_tf=Dari%20%251%24s&ampshare=https%3A%2F%2Fpsycatgames.com%2Fid%2Fmagazine%2Fparty-games%2Ftruth-or-dare%2F
global.dare = ["Nyanyikanlah sebuah lagu yang harus dibawakan dengan penuh penghayatan di depan semua orang saat ini", "Ayo chat mantan atau gebetanmu dan ketiklah aku kangen kamu lalu kirim. Mari tunggu apa belasan dan reaksinya", "Kamu harus menarikan sebuah lagu India dengan diiringi oleh backsound panci dan baskom yang ditabuhkan", "Makan dan telan buah lemon sampai habis tanpa tersisa dan tidak boleh dibuang", "Ajaklah orang yang tidak kamu kenal untuk menari bersama", "Memakai celana legging secara cepat tanpa menggunakan tangan dan hanya diperbolehkan menggunakan kaki", "Panggil orang secara random dan katakanlah kamu tampan atau cantik kepada orang tersebut", "Gelitiki teman sebangkumu tanpa mengatakan apa alasan dibalik kau melakuka hal tersebut", "Larilah ke tengah lapangan seraya menjerit dan mengatakan bahwa aku rindu pada mantanku", "Uploadlah sebuah video pada akun sosial media pribadi dimana kamu menarikan sebuah lagu dengan penuh semangat", "Ajak orang yang tidak kamu kenal untuk selfie berdua dengan mu lalu upload ke snapgram", "Ambil beberapa nomor dari kontakmu secara acak dan kirim sms \"Aku hamil\" sama mereka", "Ambil minuman apa saja yang ada didekat mu lalu campurkan dengan cabai dan minum!", "Ambil nomor secara acak dari kontakmu, telepon dia, dan bilang \"Aku mencintaimu\"", "Beli makanan paling murah di kantin (atau beli sebotol aqua) dan bilang sambil tersedu-sedu pada teman sekelasmu \"Ini.adalah makanan yang paling mahal yang pernah kubeli\"", "Beli satu botol coca cola dan siram bunga dengan coca cola itu di depan orang banyak.", "Berdiri deket kulkas, tutup mata, pilih makanan secara acak didalemnya, pas makanpun mata harus tetep ditutup.", "Berdiri di tengah lapangan basket dan berteriak, \"AKU MENCINTAIMU PANGERANKU/PUTRIKU\"", "Beri hormat pada seseorang di kelas, lalu bilang \"Hamba siap melayani Anda, Yang Mulia.\"", "Berjalan sambil bertepuk tangan dan menyanyi lagu \"Selamat Ulang Tahun\" dari kelas ke koridor.", "Berlutut satu kaki dan bilang \"Marry me?\" sama orang pertama yang masuk ke ruangan.", "Bikin hiasan kepala absurd dari tisu, apapun itu, terus suruh pose didepan kamera, terus upload", "Bikin hiasan kepala absurd dari tisu, apapun itu, terus suruh pose didepan kamera, terus upload", "Bilang \"KAMU CANTIK/GANTENG BANGET NGGAK BOHONG\" sama cewek yang menurutmu paling cantik di kelas ini", "Bilang pada seseorang di kelas, \"Aku baru saja diberi tahu aku adalah kembaranmu dulu, kita dipisahkan, lalu aku menjalani operasi plastik. Dan ini adalah hal paling serius yang pernah aku katakan.\"", "Buang buku catatan seseorang ke tempat sampah, di depan matanya, sambil bilang \"Buku ini isinya tidak ada yang bisa memahami\"", "Cabut bulu kaki mu sendiri sebanyak 3 kali!", "Chat kedua orangtuamu, katakan bahwa kamu kangen dengan mereka lengkap dengan emoticon sedih.", "Coba searcing google mengenai hal-hal yang mengerikan atau menggelikan seperti trypophobia, dll.", "Duduk relaks di tengah lapangan basket sambil berpura-pura itu adalah pantai untuk berjemur.", "Duduk relaks di tengah lapangan basket sambil berpura-pura itu adalah pantai untuk berjemur.", "isi mulut penuh dengan air dan harus tahan hingga dua putaranJika tertawa dan tumpah atau terminum, maka harus ngisi ulang dan ditambah satu putaran lagi.", "Salamanlah dengan orang pertama yang masuk ke ruangan ini dan bilang \"Selamat datang di Who Wants To Be a Millionaire!\"", ".Kirim sms pada orangtuamu \"Hai, bro! Aku baru beli majalah Playboy edisi terbaru!\"", "Kirim sms pada orangtuamu, \"Ma, Pa, aku sudah tahu bahwa aku adalah anak adopsi dari Panti Asuhan. Jangan menyembunyikan hal ini lagi.\"", "Kirim sms pada tiga nomor acak di kontakmu dan tulis \"Aku baru saja menjadi model majalah Playboy.\"", "Makan satu sendok makan kecap manis dan kecap asin!", "Makan sesuatu tapi gak pake tangan.", "Marah-marahi ketemen kamu yang gak dateng padahal udah janjian mau main \"truth or dare\" bareng\"", "Pecahkan telur menggunakan kepala!", "Makanlah makanan yang sudah dicampur-campur dan rasanya pasti aneh, namun pastikan bahwa makanan itu tidak berbahaya untuk kesehatan jangka panjang maupun jangka pendek.", "Menari ala Girls' Generation untuk cowok di depan kelas, atau menari ala Super Junior untuk cewek.", "Mengerek tiang bendera tanpa ada benderanya.", "Menggombali orang yang ditaksir, sahabat terdekat, lawan jenis yang tidak dikenal sama sekali dan  sejenisnya.", "Meniru style rambut semua temen kamu.", "Menyanyikan lagu HAI TAYO di depan banyak orang sambil menari", "Menyanyikan lagu Baby Shark dengan keras di ruang kelas.", "Minjem sesuatu ke tetangga", "Minta tandatangan pada seorang guru yang paling paling galak sambil bilang \"Anda benar-benar orang yang paling saya kagumi di dunia.", "Minta uang pada seseorang (random/acak) di jalan sambil bilang \"Saya tidak punya uang untuk naik angkot.\"", "Minum sesuatu yang udah dibuat/disepakatin, tapi pastiin gak berbahaya, bisa kayak minum sirup yang digaremin terus ditambah kecap."]

global.truth = [
	"Acara tv apa yang paling kamu benci? Berikan alasannya!",
	"Apa baju yang (menurutmu) paling jelek yang pernah kamu pakai, dan kapan kamu memakainya?",
	"Apa hal paling buruk (gosip) yang pernah kamu bilang tentang temenmu?",
	"Apa hal paling memalukan dari dirimu?",
	"Apa hal paling memalukan dari temanmu?",
	"Apa hal pertama yang kamu lihat saat kamu melihat orang lain (lawan jenis)?",
	"Apa hal pertama yang terlintas di pikiranmu saat kamu melihat cermin?",
	"Apa hal terbodoh yang pernah kamu lakukan?",
	"Apa hal terbodoh yang pernah kamu lakukan?",
	"Apa ketakutan terbesar kamu?",
	"Apa mimpi terburuk yang pernah kamu alami?",
	"Apa mimpi terkonyol yang sampai sekarang kamu kamu ingat?",
	"Apa pekerjaan paling konyol yang pernah kamu bayangin kamu akan jadi?",
	"Apa sifat terburukmu menurut kamu?",
	"Apa sifat yang ingin kamu rubah dari dirimu?",
	"Apa sifat yang ingin kamu rubah dari temanmu?",
	"Apa yang akan kamu lakuin bila pacarmu bilang hidung atau jarimu jelek?",
	"Apa yang kamu fikirkan sebelum kamu tidur ? ex: menghayal tentang jodoh,dll.",
	"Apakah hal yang menurutmu paling menonjol dari dirimu?",
	"Bagian tubuh temanmu mana yang paling kamu sukai dan ingin kamu punya?",
	"Bagian tubuhmu mana yang paling kamu benci?",
	"Dari semua kelas yang ada di sekolah, kelas mana yang paling ingin kamu masuki dan kelas mana yang paling ingin kamu hindari?",
	"Deksripsikan teman terdekat mu!",
	"Deskripsikan dirimu dalam satu kata!",
	"Film dan lagu apa yang pernah membuat kamu menangis?",
	"Hal apa yang kamu rahasiakan sampe sekarang dan gak ada satu orangpun yang tau?",
	"Hal paling romantis apa yang seseorang (lawan jenis) pernah lakuin atau kasih ke kamu?",
	"Hal-hal menjijikan apa yang pernah kamu alami ?",
	"Jika kamu lahir kembali dan harus jadi salah satu dari temanmu, siapa yang akan kamu pilih untuk jadi dia?",
	"Jika punya kekuatan super/ super power ingin melakukan apa",
	"Jika sebentar lagi kiamat, apa yang kamu lakukan ?",
	"Kalo kamu disuruh operasi plastik dengan contoh wajah dari teman sekelasmu, wajah siapa yang akan kamu tiru?",
	"Kamu pernah mencuri sesuatu gak?",
	"Apakah kamu takut mati? kenapa?",
	"Kapan terakhir kali kamu menangis dan mengapa?",
	"Apa kemampuan spesial kamu apa?",
	"Kok bisa suka sama orang yang kamu sukai?",
	"Menurutmu, apa sifat baik teman terdekatmu yang nggak dia sadari?",
	"Orang seperti apa yang ingin kamu nikahi suatu saat nanti?",
	"Pekerjaan paling ngenes apa yang menurutmu cocok untuk teman yang sedang duduk di sebelahmu? Dan kenapa?",
	"Pengen tukeran hidup sehari dengan siapa? (teman terdekat yang kalian sama-sama tahu) dan mengapa",
	"Pernahkah kamu diam-diam berharap hubungan seseorang dengan pacarnya putus? Siapa?",
	"Pilih PACAR atau TEMAN ? why?",
	"Quote apa yang paling kamu ingat dan kamu suka?",
	"Rahasia apa yang belum pernah kamu katakan sampai sekarang kepada teman mu ?",
	"Siapa panutan yang benar-benar menjadi panutanmu?",
	"Siapa di antara temanmu yang kamu pikir matre?",
	"Siapa di antara teman-temanmu yang menurutmu potongan rambutnya paling nggak banget?",
	"Siapa diantara temen-temenmu yang paling NGGAK fotogenik dan kalo difoto lagi ketawa mukanya jelek banget?",
	"Siapa mantan terindah mu? dan mengapa kalian putus ?!",
	"Siapa nama artis yang pernah kamu bucinin diam-diam?",
	"Siapa nama guru cowok yang pernah kamu sukai dulu?",
	"Siapa nama mantan pacar teman mu yang pernah kamu sukai diam diam?",
	"Siapa nama orang (lawan jenis) yang menurutmu akan asyik bila dijadikan pacar?",
	"Siapa nama orang yang kamu benci, tapi kamu rasa orang itu suka sama kamu (nggak harus lawan jenis)?",
	"Siapa nama orang yang pernah kamu kepoin diam-diam?",
	"Siapa orang (lawan jenis) yang paling sering terlintas di pikiranmu?",
	"Siapa orang yang paling menjengkelkan di antara teman teman mu ? alasannya!",
	"Siapa sebenernya di antara teman-temanmu yang kamu pikir harus di make-over?",
	"Siapa yang paling mendekati tipe pasangan idealmu di sini",
	"Apa hal pertama yang akan Anda lakukan jika Anda bangun sebagai lawan jenis?",
	"Pernahkah Anda membiarkan orang lain mendapat masalah karena sesuatu yang Anda lakukan?",
	"Kapan terakhir kali Anda mengompol?",
	"Apa yang paling kamu impikan dari tidur?",
	"Jika Anda akan menghasilkan uang secara ilegal, bagaimana Anda membuatnya?",
	"Apa yang kekanak-kanakan yang masih Anda lakukan?",
	"Jika Anda buta, siapa yang akan menjadi anjing pemandu Anda?",
	"Apa yang paling mengesankan Anda?",
	"Jika Anda diizinkan untuk menggunakan hanya 3 kata untuk sisa malam mulai sekarang - yang mana itu?",
	"Jika Anda seorang diktator, hukum mana yang akan Anda undang terlebih dahulu?",
	"Jika Anda hidup selama era Nazi, siapa Anda?",
	"Apa pengalaman paling memalukan di waktu sekolah / waktu belajar / pendidikan / tahun lalu?",
	"Hewan apa yang paling cocok untukmu dan mengapa?",
	"Apa kencan terburukmu?",
	"Siapa yang ingin kamu cium sekarang?",
	"Apa rahasia kamu, fantasi gelap?",
	"Apakah Anda lebih suka tato pantat Anda atau menusuk lidah Anda?",
	"Apakah kamu selalu setia?",
	"Apakah Anda memiliki naksir remaja?",
	"Di orang mana kamu jatuh cinta?",
	"Selebritas mana yang ingin kamu kencani?",
	"Apa waasa saat paling memalukan dalam hidup Anda?"
]
