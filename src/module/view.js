import {doms, store} from './cache'
import {toEntity} from './helpers'
export const route = () => {
  let uri = document.location.hash.replace(/^#\//, '')
  if (!uri) { return 'all' }
  return uri
}

const _basedon = (store) => (uri) => store.find({all: {}, done: {done: true}, active: {done: false}}[uri])

export const basedon = _basedon(store)

const updateActiveLeft = (n) => {
  doms.counts.innerText = `${n} item${n > 1 ? 's' : ''} left`
}

const updateClearComplete = (haveDone) => {
  doms.clearDone.style.display = haveDone ? 'block' : 'none'
}

const updateMarkAll = (allDone) => {
  doms.markAll.checked = allDone
}

const _render = dom => content => {
  dom.innerHTML = content
  let all = store.find({}).length
  let active = store.find({done: false}).length
  let done = all - active
  updateActiveLeft(active)
  updateClearComplete(done)
  updateMarkAll(done === all)
}

export const render = _render(doms.lists)

export const page = (items) => {
  if (!items) {
    items = basedon(route())
  }
  return items.reduce((tag, item) => tag + `
<li data-id="${item.id}"${item.done ? ' class="done"' : ''}>
  <input class="toggle" type="checkbox" ${item.done ? 'checked' : ''}>
  <label>${toEntity(item.title)}</label>
  <button class="destroy"></button>
</li>`, '')
}
