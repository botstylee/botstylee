import mongoose from 'mongoose'

var {
    Schema,
    connect,
    model: _model
} = mongoose

// ← perbaikan: hapus opsi deprecated
var defaultOptions = {}

export class mongoDB {
    constructor(url, options = defaultOptions) {
        /** @type {string} */
        this.url = url
        /** @type {mongoose.ConnectOptions} */
        this.options = options
        this.data = this._data = {}
        /** @type {mongoose.Schema} */
        this._schema = {}
        /** @type {mongoose.Model} */
        this._model = {}
        /** @type {Promise<typeof mongoose>} */
        this.db = connect(this.url, { ...this.options }).catch(console.error)
    }

    async read() {
        this.conn = await this.db
        var schema = this._schema = new Schema({
            data: { type: Object, required: true, default: {} }
        })
        try {
            this._model = _model('data', schema)
        } catch {
            this._model = _model('data')
        }
        this._data = await this._model.findOne({})
        if (!this._data) {
            this.data = {}
            await this.write(this.data)
            this._data = await this._model.findOne({})
        } else this.data = this._data.data
        return this.data
    }

    async write(data) {
        // ← perbaikan: async/await, bukan callback (Mongoose 6+ tidak support callback)
        if (!data) throw new Error('Data is required')
        if (!this._data) {
            return await new this._model({ data }).save()
        }
        var docs = await this._model.findById(this._data._id)
        if (!docs) throw new Error('Document not found')
        if (!docs.data) docs.data = {}
        docs.data = data
        this.data = {}
        return await docs.save()
    }
}

export var mongoDBV2 = class MongoDBV2 {
    constructor(url, options = defaultOptions) {
        /** @type {string} */
        this.url = url
        /** @type {mongoose.ConnectOptions} */
        this.options = options
        /** @type {{ name: string, model: mongoose.Model}[]} */
        this.models = []
        /** @type {{ [Key: string]: any }} */
        this.data = {}
        this.lists
        /** @type {mongoose.Model} */
        this.list
        /** @type {Promise<typeof mongoose>} */
        this.db = connect(this.url, { ...this.options }).catch(console.error)
    }

    async read() {
        this.conn = await this.db
        var schema = new Schema({
            data: [{ name: String }]
        })
        try {
            this.list = _model('lists', schema)
        } catch (e) {
            this.list = _model('lists')
        }
        this.lists = await this.list.findOne({})
        if (!this.lists?.data) {
            await this.list.create({ data: [] })
            this.lists = await this.list.findOne({})
        }
        var garbage = []
        await Promise.all(this.lists.data.map(async ({ name }) => {
            /** @type {mongoose.Model} */
            var collection
            try {
                collection = _model(name, new Schema({ data: Array }))
            } catch (e) {
                console.error(e)
                try {
                    collection = _model(name)
                } catch (e) {
                    garbage.push(name)
                    console.error(e)
                }
            }
            if (collection) {
                var index = this.models.findIndex(v => v.name === name)
                if (index !== -1) this.models[index].model = collection
                else this.models.push({ name, model: collection })
                var collectionsData = await collection.find({})
                this.data[name] = Object.fromEntries(collectionsData.map(v => v.data))
            }
        }))

        try {
            // Delete list if not exist
            var del = await this.list.findById(this.lists._id)
            if (del) {
                del.data = del.data.filter(v => !garbage.includes(v.name))
                await del.save()
            }
        } catch (e) {
            console.error(e)
        }

        return this.data
    }

    async write(data) {
        // ← perbaikan: async/await, bukan callback
        if (!this.lists || !data) throw new Error('Lists or data is required')
        var collections = Object.keys(data)
        var listDoc = []

        await Promise.all(collections.map(async (key) => {
            var index = this.models.findIndex(v => v.name === key)
            if (index !== -1) {
                var doc = this.models[index].model
                if (Object.keys(data[key]).length > 0) {
                    await doc.deleteMany().catch(console.error)
                    await doc.insertMany(Object.entries(data[key]).map(v => ({ data: v })))
                }
                listDoc.push({ name: key })
            } else {
                var schema = new Schema({ data: Array })
                /** @type {mongoose.Model} */
                var doc
                try {
                    doc = _model(key, schema)
                } catch (e) {
                    console.error(e)
                    doc = _model(key)
                }
                if (doc) {
                    var idx = this.models.findIndex(v => v.name === key)
                    if (idx !== -1) this.models[idx].model = doc
                    else this.models.push({ name: key, model: doc })
                    await doc.insertMany(Object.entries(data[key]).map(v => ({ data: v })))
                    listDoc.push({ name: key })
                }
            }
        }))

        // save list
        var doc = await this.list.findById(this.lists._id)
        if (!doc) {
            await this.read()
            return await this.write(data)
        }
        doc.data = listDoc
        await doc.save()
        this.data = {}
        return true
    }
}
