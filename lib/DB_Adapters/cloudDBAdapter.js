import got from 'got'

var stringify = obj => JSON.stringify(obj, null, 2)
var parse = str => JSON.parse(str, (_, v) => {
    if (
        v !== null &&
        typeof v === 'object' &&
        'type' in v &&
        v.type === 'Buffer' &&
        'data' in v &&
        Array.isArray(v.data)) {
        return Buffer.from(v.data)
    }
    return v
})

class CloudDBAdapter {
    constructor(url, {
        serialize = stringify,
        deserialize = parse,
        fetchOptions = {}
    } = {}) {
        this.url = url
        this.serialize = serialize
        this.deserialize = deserialize
        this.fetchOptions = fetchOptions
    }

    async read() {
        try {
            var res = await got(this.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;q=0.9,text/plain'
                },
                timeout: { request: 30000 },
                retry: { limit: 2 },
                ...this.fetchOptions
            })
            if (res.statusCode !== 200)
                throw new Error(res.statusMessage || `HTTP ${res.statusCode}`)
            var body = res.body
            if (!body) return null
            return this.deserialize(body)
        } catch (e) {
            console.error('[cloudDB] read error:', e.message)
            return null
        }
    }

    async write(obj) {
        var res = await got(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: { request: 30000 },
            retry: { limit: 2 },
            ...this.fetchOptions,
            body: this.serialize(obj)
        })
        if (![200, 201, 204].includes(res.statusCode))
            throw new Error(res.statusMessage || `HTTP ${res.statusCode}`)
        return res.body
    }
}

export default CloudDBAdapter
