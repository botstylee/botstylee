axios=require ("axios");cheerio=require("cheerio");
function wattpad(judul) {
    return new Promise((resolve, reject) => {
        axios.get("https://www.wattpad.com/search/" + judul).then(({
                data
            }) => {
                var $ = cheerio.load(data)
                var result = [];
                var jdl = [];
                var img = [];
                var des = [];
                var lnk = [];
                var red = [];
                var vt = [];
                var cp = [];
                var dur = [];
                var limk = 'https://www.wattpad.com'
                $('div.story-card-data.shown-xxs > div.top-section > div.cover').each(function(a, b) {
                    img.push($(b).find('img').attr('src'))
                })
                $('div.story-card-data.shown-xxs > div.top-section > div.story-info > div.title').each(function(a, b) {
                    jdl.push($(b).text().trim())
                })
                $('div.story-card-data.shown-xxs > div.description').each(function(a, b) {
                    des.push($(b).eq(0).text().trim())
                })
                $('a.story-card').each(function(a, b) {
                    lnk.push(limk + $(b).attr('href'))
                })
                $('div.story-card-data.shown-xxs > div.top-section > div.story-info >  ul.new-story-stats > li:nth-child(1) > div.icon-container > div.tool-tip > span.stats-value').each(function(a, b) {
                    red.push($(b).text())
                })
                $('div.story-card-data.shown-xxs > div.top-section > div.story-info >  ul.new-story-stats > li:nth-child(2) > div.icon-container > div.tool-tip > span.stats-value').each(function(a, b) {
                    vt.push($(b).text().trim())
                })
                $('div.story-card-data.shown-xxs > div.top-section > div.story-info >  ul.new-story-stats > li:nth-child(3) > div.icon-container > div.tool-tip > span.stats-value').each(function(a, b) {
                    cp.push($(b).text())
                })
                $('div.story-card-data.shown-xxs > div.top-section > div.story-info >  ul.new-story-stats > li:nth-child(4) > div.icon-container > div.tool-tip > span.stats-value').each(function(a, b) {
                    dur.push($(b).text())
                })
                for (let i = 0; i < lnk.length; i++) {
                    result.push({
                        judul: jdl[i],
                        desc: des[i],
                        reads: red[i],
                        votes: vt[i],
                        chapters: cp[i],
                        durations: dur[i],
                        image: img[i],
                        link: lnk[i]
                    })

                }
                resolve(result)
            })
            .catch({
                message: 'err'
            })

    })
}

function random_detail(judul) {
    return new Promise((resolve, reject) => {
        wattpad(judul).then(res => {
            let a = JSON.parse(JSON.stringify(res))
            let b = a[Math.floor(Math.random() * a.length)];
            axios.get(b.link).then(({
                data
            }) => {
                var $ = cheerio.load(data)

                var pp_author = $('div.author-info').find('img').attr('src')
                var author = $('div.story-details-page > div.story-header > div.story-info > div.author-info > div.author-info__username > a').text().trim()
                var link_author = $('div.story-details-page > div.story-header > div.story-info > div.author-info > div.author-info__username > a').attr('href')
                var rc = [];
                var tc = [];
                var to = [];
                $('div.story-parts.shown-xxs > ul > li > a').each(function(a, b) {
                    rc.push($(b).attr('href'))
                })
                $('div.story-parts.shown-xxs > ul > li > a > div.part__label').each(function(a, b) {
                    tc.push($(b).text().trim())
                })

                for (let i = 0; i < tc.length; i++) {
                    to.push({
                        title_part: tc[i],
                        link_part: 'https://wattpad.com' + rc[i]
                    })

                }
                resolve({
                    judul: b.judul,
                    desc: b.desc,
                    reads: b.reads,
                    votes: b.votes,
                    chapters: b.chapters,
                    duration: b.durations,
                    image: b.image,
                    link: b.link,
                    author,
                    pp_author,
                    link_author: 'https://www.wattpad.com' + link_author,
                    read_chapters: to
                })
            })
        })
    })
}
module.exports = { wattpad, random_detail }
/*wattpad("tokyo ghoul").then(res => {
    print(res)
})
random_detail("tokyo ghoul").then(res => {
    print(res)
})*/
