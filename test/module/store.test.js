import Store from '../../src/module/store'
import { expect } from 'chai'

describe('Store', function () {
  describe('#constructor()', function () {
    let store
    let fakeStorage

    beforeEach(function () {
      fakeStorage = {
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
    })
    it('should create "db" when name is not specified', function () {
      store = new Store(fakeStorage)
      expect(store.getName()).to.equal('db')
      expect(store.inMemory).to.equal(false)
    })
    it('should create "foo" when name is foo', function () {
      store = new Store(fakeStorage, 'foo')
      expect(store.getName()).to.equal('foo')
    })
    it('should have score:99', function () {
      let data = {score: 99}
      store = new Store(fakeStorage, 'foo')
      store.insert(data)
      expect(JSON.parse(fakeStorage.data.foo)[0]).to.deep.equal(data)
    })
    it('should have nothing after destroyed', function () {
      let data = {score: 99}
      store = new Store(fakeStorage)
      store.insert(data)
      store.remove({score: 99})
      expect(JSON.parse(fakeStorage.data.db)).to.deep.equal([])
    })
    it('should not complain when nothing to remove', function () {
      store = new Store(fakeStorage)
      store.remove({score: 99})
      expect(JSON.parse(fakeStorage.data.db)).to.deep.equal([])
    })
    it('should remove all', function () {
      store = new Store(fakeStorage)
      store.insert({score: 99})
      store.insert({score: 93})
      store.insert({score: 94})
      store.remove({})
      expect(JSON.parse(fakeStorage.data.db)).to.deep.equal([])
    })
    it('should update value', function () {
      let data = {id: 1, score: 99}
      let data2 = {id: 1, score: 9}
      let field = {score: 9}
      let query = {id: 1}
      store = new Store(fakeStorage)
      store.insert(data)
      expect(JSON.parse(fakeStorage.data.db)[0]).to.deep.equal(data)
      store.update(query, field)
      expect(JSON.parse(fakeStorage.data.db)[0]).to.deep.equal(data2)
    })
    it('should find score 99', function () {
      let data = [
        {id: 1, score: 99},
        {id: 2, score: 93},
        {id: 3, score: 99},
        {id: 4, score: 100}
      ]
      let result = [
        {id: 1, score: 99},
        {id: 3, score: 99}
      ]
      let query = {score: 99}
      store = new Store(fakeStorage)
      store.insert(data)
      expect(JSON.parse(fakeStorage.data.db).length).to.equal(4)
      store.find(result)
      expect(store.find(query)).to.deep.equal(result)
    })
    it('should destroy storage', function () {
      store = new Store(fakeStorage)
      store.insert({score: 99})
      store.destroy()
      expect(Object.keys(fakeStorage.data).length).to.equal(0)
    })
  })
})

describe('In-memory store', function () {
  let useless = {}
  let store
  let data
  beforeEach(function () {
    store = new Store(useless)
    data = {id: 1, score: 99}
  })
  it('should save in memory', function () {
    store.insert(data)
    expect(store.find({})[0]).to.deep.equal(data)
    expect(store.inMemory).to.equal(true)
  })

  it('should delete in memory', function () {
    store.insert(data)
    store.remove({})
    expect(store.find({}).length).to.equal(0)
  })
  it('should find in memory', function () {
    store.insert(data)
    expect(store.find({score: 99})[0]).to.deep.equal(data)
  })
  it('should update value in memory', function () {
    store.insert(data)
    store.update({id: 1}, {score: 9})
    expect(store.find({score: 9})[0]).to.deep.equal({id: 1, score: 9})
  })
  it('should destroy storage', function () {
    store.insert(data)
    store.destroy()
    expect(store.find({}).length).to.equal(0)
  })
})
