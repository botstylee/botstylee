//kalo mau ngambil jangan lupa kasih tag github.com/findme-19 and github.com/botstylee
var uploadFile = require('../lib/uploadFile.cjs');
var {
	webp2png
} = require('../lib/webp2mp4.cjs');
async function handler(m, {
	conn,
	text,
	usedPrefix: _p,
	command
}) {
	var q = m.quoted ? m.quoted : m
	var mime = (q.msg || q).mimetype || q.mediaType || ''
	var url
	switch (command) {
		case 'fire':
			url = 'https://photooxy.com/other-design/flame-up-your-photo-on-a-paper-399.html';
			break;
		case 'frame':
			url = 'https://photooxy.com/birthday-frames/frame-hoa-violet-nature-382.html';
			break;
		case 'camframe':
			url = 'https://photooxy.com/photo-frames/camera-photo-frame-359.html';
			break;
		case 'halftone':
			url = 'https://photooxy.com/create-halftone-photo-effects-online-410.html';
			break;
		case 'pine':
			url = 'https://photooxy.com/photo-frames/beautiful-pine-leaf-frame-384.html';
			break;
		case 'puzzle':
			url = 'https://photooxy.com/art-effects/turn-any-photo-into-a-jigsaw-puzzle-358.html';
			break;
		case 'rain':
			url = 'https://photooxy.com/art-effects/gif-animated-rain-online-361.html';
			break;
		case 'gwp':
			url = 'https://photooxy.com/art-effects/gray-watercolor-painting-effect-357.html';
			break;
		case 'sketch':
			url = 'https://photooxy.com/art-effects/apply-online-a-pencil-sketch-effect-on-a-picture-356.html';
			break;
		case 'pfb':
			url = 'https://photooxy.com/photo-frames/photo-frame-on-beach-345.html';
			break;
		case 'nbp':
			url = 'https://photooxy.com/art-effects/night-beach-photo-effect-353.html';
			break;
		case 'gpf':
			url = 'https://photooxy.com/art-effects/galaxy-photo-frames-352.html';
			break;
		case 'bgp':
			url = 'https://photooxy.com/art-effects/blender-galaxy-effect-351.html';
			break;
		case 'rde':
			url = 'https://photooxy.com/other-design/your-photo-with-rain-drops-effect-350.html';
			break;
		case 'pip':
			url = 'https://photooxy.com/photo-frames/simple-pip-frame-349.html';
			break;
		case 'tpo':
			url = 'https://photooxy.com/art-effects/typographic-portrait-online-346.html';
			break;
		case 'briliant':
			url = 'https://photooxy.com/photo-frames/brilliant-photo-frame-344.html';
			break;
		case 'lhc':
			url = 'https://photooxy.com/other-design/piece-of-heart-338.html';
			break;
		case 'lvp':
			url = 'https://photooxy.com/other-design/photo-frame-valentine-love-328.html';
			break;
		case 'cob':
			url = 'https://photooxy.com/birthday-frames/happy-birthday-photo-frame-325.html';
			break;
		case 'lhb':
			url = 'https://photooxy.com/birthday-frames/lovely-photo-frame-324.html';
			break;
		case 'sbp':
			url = 'https://photooxy.com/birthday-frames/very-cute-birthday-photo-frame-323.html';
			break;
		case 'flf':
			url = 'https://photooxy.com/other-design/picture-frame-text-heart-318.html';
			break;
		case 'pte':
			url = 'https://photooxy.com/photo-frames/paper-tearing-effect-311.html';
			break;
		case 'notebook':
			url = 'https://photooxy.com/other-design/photo-on-notebook-310.html';
			break;
		case 'tpd':
			url = 'https://photooxy.com/art-effects/turn-part-of-your-photo-into-a-drawing-303.html';
			break;
		case 'ballon':
			url = 'https://photooxy.com/art-effects/print-photo-on-balloon-300.html';
			break;
		case 'bme':
			url = 'https://photooxy.com/art-effects/broken-mirrors-effect-299.html';
			break;
		case 'shattered':
			url = 'https://photooxy.com/art-effects/broke-a-card-298.html';
			break;
		case 'crystal':
			url = 'https://photooxy.com/other-design/crystal-frame-274.html';
			break;
		case 'cph':
			url = 'https://photooxy.com/christmas/photo-on-hand-266.html';
			break;
		case 'lines':
			url = 'https://photooxy.com/art-effects/photo-effects-from-the-lines-251.html';
			break;
		case 'exposure':
			url = 'https://photooxy.com/art-effects/amazing-typography-portraits-photo-effect-250.html';
			break;
		case 'leaves':
			url = 'https://photooxy.com/art-effects/photo-effect-with-leaves-248.html';
			break;
		case 'halftone2':
			url = 'https://photooxy.com/art-effects/amazing-halftone-effects-247.html';
			break;
		case 'lens':
			url = 'https://photooxy.com/art-effects/photo-on-camera-lens-240.html';
			break;
		case 'nightcity':
			url = 'https://photooxy.com/art-effects/night-city-double-exposure-effect-235.html';
			break;
		case 'forest':
			url = 'https://photooxy.com/art-effects/blending-face-with-forest-233.html';
			break;
		case 'painting':
			url = 'https://photooxy.com/art-effects/photo-to-painting-effect-230.html';
			break;
		case 'artmath':
			url = 'https://photooxy.com/art-effects/add-math-background-to-a-photo-229.html';
			break;
		case 'toilet':
			url = 'https://photooxy.com/art-effects/put-your-photo-down-the-toilet-224.html';
			break;
		case 'anaglyph':
			url = 'https://photooxy.com/art-effects/photo-to-painting-effect-230.html';
			break;
		case 'pig':
			url = 'https://photooxy.com/other-design/mix-into-galaxy-169.html';
			break;
		case 'underwater':
			url = 'https://photooxy.com/art-effects/half-underwater-photo-effect-163.html';
			break;
		case 'hpp':
			url = 'https://photooxy.com/photo-frames/simple-nightmare-photo-frame-402.html';
			break;
		case 'fde':
			url = 'https://photooxy.com/other-design/firework-video-effect-online-396.html';
			break;
		case 'freezy':
			url = 'https://photooxy.com/other-design/freezy-rain-and-appear-your-photo-395.html';
			break;
		case 'valentine':
			url = 'https://photooxy.com/love-romance/photo-in-valentine-gift-box-336.html';
			break;
		case '3dlines':
			url = 'https://photooxy.com/art-effects/3d-lines-photo-effect-302.html';
			break;
		case 'winter':
			url = 'https://photooxy.com/christmas/christmas-photo-frame-262.html';
			break;
		case 'sparkling':
			url = 'https://photooxy.com/christmas/shimmering-frame-259.html';
			break;
		case 'glitch':
			url = 'https://photooxy.com/art-effects/glitch-red-cyan-photo-effect-202.html';
			break;
		case 'pgp':
			url = 'https://photooxy.com/other-design/put-your-photo-to-glass-pokeball-144.html';
			break;
		case 'gta':
			url = 'https://photooxy.com/game-effects/make-grand-theft-auto-v-official-cover-132.html';
			break;
		case 'wanted':
			url = 'https://photooxy.com/manga-and-anime/make-one-piece-wanted-poster-online-129.html';
			break;
		default:
			url = 'https://photooxy.com/game-effects/make-grand-theft-auto-v-official-cover-132.html';
	}
	if (/webp|image/g.test(mime)) {
		var img = await q.download?.()
		if (!img) throw `balas gambar/stiker dengan perintah ${usedPrefix + command}`
		try {
			var out
			if ('image/webp'.includes(mime)) out = await webp2png(img)
			else if (/image/g.test(mime)) out = await uploadFile(img)
			var a = (await axios.get(API('ghst', 'api/photooxyi', {
				url,
				urlimg: out
			}, 'key'))).data
			conn.sendFile(m.chat, a.url, '', 'nih bang', m)
		} catch (e) {
			if (e.response) {
				log(e.response.data)
				throw 'server error'
			} else {
				throw 'ada yang gak beres nih'
			}
		}
	}
}
handler.help = ['fire', 'frame', 'camframe', 'halftone', 'pine', 'puzzle', 'rain', 'gwp', 'sketch', 'pfb', 'nbp', 'gpf', 'bgp', 'rde', 'pip', 'tpo', 'briliant', 'lhc', 'lvp', 'cob', 'lhb', 'sbp', 'flf', 'pte', 'notebook', 'tpd', 'ballon', 'bme', 'shattered', 'crystal', 'cph', 'lines', 'exposure', 'leaves', 'halftone2', 'lens', 'nightcity', 'forest', 'painting', 'artmath', 'toilet', 'anaglyph', 'pig', 'underwater', 'hpp', 'fde', 'freezy', 'valentine', '3dlines', 'winter', 'sparkling', 'glitch', 'pgp', 'gta', 'wanted']
handler.tags = ['photooxy']
handler.command = ['fire', 'frame', 'camframe', 'halftone', 'pine', 'puzzle', 'rain', 'gwp', 'sketch', 'pfb', 'nbp', 'gpf', 'bgp', 'rde', 'pip', 'tpo', 'briliant', 'lhc', 'lvp', 'cob', 'lhb', 'sbp', 'flf', 'pte', 'notebook', 'tpd', 'ballon', 'bme', 'shattered', 'crystal', 'cph', 'lines', 'exposure', 'leaves', 'halftone2', 'lens', 'nightcity', 'forest', 'painting', 'artmath', 'toilet', 'anaglyph', 'pig', 'underwater', 'hpp', 'fde', 'freezy', 'valentine', '3dlines', 'winter', 'sparkling', 'glitch', 'pgp', 'gta', 'wanted']
module.exports = handler
