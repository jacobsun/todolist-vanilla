export default class Store {
  constructor (storage, name = 'db') {
    this.name = name
    if (!storage.getItem || !storage.setItem) {
      this.inMemory = true
      this.ls = {
        data: {},
        getItem (key) {
          return this.data[key]
        },
        setItem (key, value) {
          this.data[key] = value
        },
        removeItem (key) {
          delete this.data[key]
        }
      }
    } else {
      this.inMemory = false
      this.ls = storage
    }
    this.items = JSON.parse(this.ls.getItem(name) || '[]')
  }

  insert (item) {
    if (item instanceof Array) {
      this.items = this.items.concat(item)
    } else {
      this.items.push(item)
    }
    return this.save()
  }

  update (query, fields) {
    let items = this.find(query)
    if (items === -1) return -1
    if (items.length === 0) return 0

    items.forEach(item => {
      Object.keys(fields).forEach(k => {
        item[k] = fields[k]
      })
    })
    this.save()

    return items.length
  }

  remove (query = {}) {
    let len = this.items.length
    let props = Object.keys(query)

    if (props.length === 0) {
      this.items = []
      this.save()
      return len
    }
    this.items = this.items.filter(item => {
      return props.some(prop => {
        return item[prop] !== query[prop]
      })
    })
    this.save()
    return len - this.items.length
  }

  find (query = {}) {
    if (typeof query !== 'object') return -1
    let props = Object.keys(query)
    if (props.length === 0){
      return this.items
    }
    return this.items.filter(item => {
      return !props.some(prop => {
        return item[prop] !== query[prop]
      })
    })
  }

  save () {
    this.ls.setItem(this.name, JSON.stringify(this.items))
    return this.items.length
  }

  destroy () {
    let len = this.ls.getItem(this.name).length
    this.items = []
    this.ls.removeItem(this.name)
    return len
  }

  getName () {
    return this.name
  }
}
