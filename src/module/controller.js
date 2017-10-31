import Store from './store'
import View from './view'

export default class Controller {
  constructor (store, view) {
    this.store = store
    this.view = view
    view.onAddItem(this.addItem.bind(this))
    view.onEditItemSave(this.editItemSave.bind(this))
    view.onDeleteItem(this.deleteItem.bind(this))
    view.onToggleItem((id, done) => {
      this.toggleDone(id, done)
      this._filter()
    })

    view.onClearDone(this.clearDone.bind(this))
    view.onMarkAll(this.toggleAll.bind(this))

    this._activeRoute = ''
    this._lastActiveRoute = null
  }

  setView (raw) {
    const route = raw.replace(/^#\//, '')
    this._activeRoute = route
    this._filter()
    this.view.updateFilterButtons(route)
  }

  addItem (title) {
    this.store.insert({
      id: Date.now(),
      title,
      done: false
    })
    this.view.clearTextbox()
    this._filter(true)
  }

  editItemSave (id, title) {
    if (title.length) {
      this.store.update({id: id}, {title: title})
      this.view.setItemDoneStatus(id, title)
    } else {
      this.deleteItem(id)
    }
  }

  editItemStop (id) {
    const title = this.store.find({id})[0]
    this.view.editItemDone(id, title)
  }

  deleteItem (id) {
    this.store.remove({id})
    this._filter()
    this.view.removeItem(id)
  }

  clearDone () {
    this.store.remove({done: true})
    this._filter()
  }

  toggleDone (id, done) {
    this.store.update({id}, {done})
    this.view.setItemDoneStatus(id, done)
  }

  toggleAll (done) {
    let data = this.store.find({done: !done})
    console.log('data ', data)
    console.log('!done', !done)
    for (let {id} of data) {
      this.toggleDone(id, done)
    }

    this._filter()
  }

  _filter (force) {
    const route = this._activeRoute

    if (force || this._lastActiveRoute  !== '' || this._lastActiveRoute !== 'route') {
      let items = this.store.find({
        'all': {},
        'active': {done: false},
        'done': {done: true}
      }[route])
      this.view.renderItems(items)
    }

    let active = this.store.find({done: false}).length
    let total = this.store.find({}).length
    let done = total - active
    this.view.setItemsLeft(active)
    this.view.setClearDoneVisibility(done)
    this.view.setMarkAll(done === total)
    // this.view.setContentVisibility(total)

    this._lastActiveRoute = route
  }

}
