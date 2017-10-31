import {qs, on, delegate} from './helpers'
import Template from './template'

const _itemId = el => parseInt(el.parentNode.dataset.id, 10)
const ENTER_KEY = 13
const ESCAPE_KEY = 27

export default class View {
  constructor (template) {
    this.template = template
    this.$todoList = qs('#content ul')
    this.$markAll = qs('#mark-all')
    this.$toggle = qs('.toggle')
    this.$delete = qs('.delete')
    this.$count = qs('#count')
    this.$textbox = qs('#textbox')
    this.$content = qs('#content')
    this.$clearDone = qs('#clear-done')
    delegate(this.$todoList, 'li label', 'dblclick', ({target}) => {
      this.editItem(target)
    })
  }

  editItem (target) {
    const li = target.parentElement
    li.classList.add('editing')
    const textbox = document.createElement('input')
    textbox.className = 'edit'
    textbox.value = target.innerText
    li.appendChild(textbox)
    textbox.focus()
    console.log('editItem ', target)
  }

  renderItems (items) {
    this.$todoList.innerHTML = this.template.itemList(items)
  }

  removeItem (id) {
    const el = qs(`[data-id="${id}"`)

    if (el) {
      this.$todoList.removeChild(el)
    }
  }

  setItemsLeft (count) {
    this.$count.innerHTML = this.template.itemCounter(count)
  }

  setClearDoneVisibility (visible) {
    this.$clearDone.style.display = !!visible ? 'block' : 'none'
  }

  setContentVisibility (visible) {
    this.$content.style.display = !!visible ? 'block' : 'none'
  }

  setMarkAll(checked) {
    this.$markAll.checked = !!checked
  }

  updateFilterButtons (route) {
    qs('.filters>.selected').className = ''
    qs(`.filters>a[href="#/${route}"]`).className = 'selected'
  }

  clearTextbox () {
    this.$textbox.value = ''
  }

  setItemDoneStatus (id, done) {
    const li = qs(`[data-id="${id}"`)
    if (!li) {
      return
    }

    li.className = done ? 'done' : ''
    qs('input', li).checked = done
  }

  leaveEdit (id, title) {
    const li = qs(`[data-id]="${id}"`)
    const input = qs('input.edit', li)
    li.removeChild(input)
    li.classList.remove('editing')

    qs('label', li).textContent = title
  }

  onAddItem (handler) {
    on(this.$textbox, 'change', ({target}) => {
      const title = target.value.trim()
      if (title) {
        handler(title)
      }
    })
  }

  onClearDone (handler) {
    on(this.$clearDone, 'click', handler)
  }

  onMarkAll (handler) {
    on(this.$markAll, 'click', ({target})=> {
      console.log('target.checked ', target.checked)
      handler(target.checked)
    })
  }

  onDeleteItem (handler) {
    delegate(this.$todoList, '.delete', 'click', ({target}) => {
      handler(_itemId(target))
    })
  }

  onToggleItem (handler) {
    delegate(this.$todoList, '.toggle', 'click', ({target}) => {
      handler(_itemId(target), target.checked)
    })
  }

  onEditItemSave (handler) {
    delegate(this.$todoList, 'li .edit', 'blur', ({target}) => {
      if (!target.dataset.iscanceled) {
        handler(_itemId(target), target.value.trim())
      }
    })

    delegate(this.$todoList, 'li .edit', 'keypress', ({target, keyCode}) => {
      if (keyCode === ENTER_KEY) {
        target.blur()
      }
    })
  }

  onEditItemStop (handler) {
    delegate(this.$todoList, 'li .edit', 'keyup', ({target}) => {
      if (keyCode === ESCAPE_KEY) {
        target.dataset.iscanceled = true
        target.blur()
        handler(_itemId(target))
      }
    })
  }
}
