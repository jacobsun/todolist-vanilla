import {qs, delegate, on} from './helpers'
import Todo from './todo'
import {doms, store} from './cache'
import {render, page} from './view'

const _id = el => parseInt(el.parentNode.dataset.id, 10)

const when = selector => ({
  _selector: selector,
  do (cb) {
    this._do = cb
    return this
  },
  isChanged () {
    this._action = 'change'
    return this
  },
  isClicked () {
    this._action = 'click'
    return this
  },

  isDoubleClicked () {
    this._action = 'dblclick'
    return this
  },

  isBlur () {
    this._action = 'blur'
    return this
  },

  isKeyPressed (keyCode) {
    this._action = 'keypress'
    this._keyCode = keyCode
    return this
  },

  isKeyUp (keyCode) {
    this._action = 'keyup'
    this._keyCode = keyCode
    return this
  },
  from (selector) {
    this._from = selector
    return this
  },

  lastly (cb) {
    this._lastly = cb
    return this
  }
})

export const activate = arr => {
  arr.forEach(feature => {
    if (feature._from) {
      delegate(feature._selector, feature._from, feature._action, (evt) => {
        if (feature._keyCode && feature._keyCode !== evt.keyCode) return
        feature._do(evt)
        if (feature._lastly) feature._lastly(evt)
      }, feature._action === 'blur')
    } else {
      on(feature._selector, feature._action, (evt) => {
        if (feature._keyCode && feature._keyCode !== evt.keyCode) return
        feature._do(evt)
        if (feature._lastly) feature._lastly(evt)
      }, feature._action === 'blur')
    }
  })
}

const addItem = when(doms.inputBox)
  .isChanged()
  .do(({target}) => {
    let title = Todo.validator(target.value)
    if (!title) return
    store.insert(Todo.generator(title))
    target.value = ''
  })
  .lastly(({target}) => {
    render(page())
  })

const toggleItem = when(doms.content)
  .isClicked()
  .from('.toggle')
  .do(({target}) => {
    let isDone = target.checked
    store.update({id: _id(target)}, {done: isDone})
    target.parentNode.className = isDone ? 'done' : ''
  })
  .lastly(({target}) => {
    render(page())
  })

const destroyItem = when(doms.content)
  .isClicked()
  .from('.destroy')
  .do(({target}) => {
    store.remove({id: _id(target)})
    let todo = target.parentNode
    todo.parentNode.removeChild(todo)
  })
  .lastly(({target}) => {
    render(page())
  })

const toggleAll = when(doms.markAll)
  .isClicked()
  .do(({target}) => {
    let doneStatus = !!target.checked
    store.update({done: !doneStatus}, {done: doneStatus})
  })
  .lastly(({target}) => {
    render(page())
  })

const editItem = when(doms.content)
  .isDoubleClicked()
  .from('#content ul li label')
  .do(({target}) => {
    let box = document.createElement('input')
    box.value = target.innerText
    box.className = 'edit'
    let li = target.parentNode
    li.classList.add('editing')
    li.appendChild(box)
    box.focus()
  })
  .lastly(({target}) => {
    // render(page())
  })

const editItemDone = when(doms.content)
  .isBlur()
  .from('.edit')
  .do(({target}) => {
    if (target.dataset.iscanceled !== true) {
      store.update({id: _id(target)}, {title: target.value})
      let li = target.parentNode
      let label = qs('label', li)
      label.innerText = target.value
      li.removeChild(target)
      li.classList.remove('editing')
    }
  })
  .lastly(({target}) => {
    render(page())
  })

const editItemSave = when(doms.content)
  .isKeyPressed(13)
  .from('.edit')
  .do(({target}) => {
    target.blur()
  })
  .lastly(({target}) => {
    // render(page())
  })

const editItemCancel = when(doms.content)
  .isKeyUp(27)
  .from('.edit')
  .do(({target}) => {
    target.dataset.iscanceled = true
    let title = store.find({id: _id(target)})[0].title
    let li = target.parentNode
    let label = qs('label', li)
    label.innerText = title
    target.blur()
    li.classList.remove('editing')
  })
  .lastly(({target}) => {

  })

const clearDone = when(doms.clearDone)
  .isClicked()
  .do(({target}) => {
    store.remove({done: true})
  })
  .lastly(({target}) => {
    render(page())
  })

export const features = [addItem, toggleItem, destroyItem, toggleAll, editItem, editItemDone, editItemCancel, editItemSave, clearDone]
