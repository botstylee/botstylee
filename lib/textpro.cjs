var fetch = (...args) => import('node-fetch').then(({
	default: fetch
}) => fetch(...args));
var cheerio = require("cheerio");
var cookie = require("cookie");
var FormData = require("form-data");

async function post(url, formdata = {}, cookies) {
	var encode = encodeURIComponent;
	var body = Object.keys(formdata)
		.map((key) => {
			var vals = formdata[key];
			var isArray = Array.isArray(vals);
			var keys = encode(key + (isArray ? "[]" : ""));
			if (!isArray) vals = [vals];
			var out = [];
			for (var valq of vals) out.push(keys + "=" + encode(valq));
			return out.join("&");
		})
		.join("&");
	return await fetch(`${url}?${body}`, {
		method: "GET",
		headers: {
			Accept: "*/*",
			"Accept-Language": "en-US,en;q=0.9",
			"User-Agent": "GoogleBot",
			Cookie: cookies,
		},
	});
}

/**
 * TextPro Scraper
 * @function
 * @param {String} url - Your phootoxy url, example https://photooxy.com/logo-and-text-effects/make-tik-tok-text-effect-375.html.
 * @param {String[]} text - Text (required). example ["text", "text 2 if any"]
 */

async function textpro(url, text) {
	if (!/^https:\/\/textpro\.me\/.+\.html$/.test(url))
		throw new Error("Url Salah!!");
	var geturl = await fetch(url, {
		method: "GET",
		headers: {
			"User-Agent": "GoogleBot",
		},
	});
	var caritoken = await geturl.text();
	var hasilcookie = geturl.headers
		.get("set-cookie")
		.split(",")
		.map((v) => cookie.parse(v))
		.reduce((a, c) => {
			return {
				...a,
				...c
			};
		}, {});
	hasilcookie = {
		__cfduid: hasilcookie.__cfduid,
		PHPSESSID: hasilcookie.PHPSESSID,
	};
	hasilcookie = Object.entries(hasilcookie)
		.map(([name, value]) => cookie.serialize(name, value))
		.join("; ");
	var $ = cheerio.load(caritoken);
	var token = $('input[name="token"]').attr("value");
	var form = new FormData();
	if (typeof text === "string") text = [text];
	for (var texts of text) form.append("text[]", texts);
	form.append("submit", "Go");
	form.append("token", token);
	form.append("build_server", "https://textpro.me");
	form.append("build_server_id", 1);
	var geturl2 = await fetch(url, {
		method: "POST",
		headers: {
			Accept: "*/*",
			"Accept-Language": "en-US,en;q=0.9",
			"User-Agent": "GoogleBot",
			Cookie: hasilcookie,
			...form.getHeaders(),
		},
		body: form.getBuffer(),
	});
	var caritoken2 = await geturl2.text();
	var token2 = /<div.*?id="form_value".+>(.*?)<\/div>/.exec(caritoken2);
	if (!token2) throw new Error("Token Tidak Ditemukan!!");
	var prosesimage = await post(
		"https://textpro.me/effect/create-image",
		JSON.parse(token2[1]),
		hasilcookie
	);
	var hasil = await prosesimage.json();
	return `https://textpro.me${hasil.fullsize_image}`;
}

module.exports = textpro