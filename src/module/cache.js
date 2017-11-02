import {qs} from './helpers'
import Store from './store'
export const store = new Store(localStorage)
export const doms = {
  markAll: qs('#mark-all'),
  inputBox: qs('#textbox'),
  toggleItem: qs('.toggle'),
  content: qs('#content'),
  lists: qs('#content ul'),
  counts: qs('#count'),
  edit: qs('.edit'),
  clearDone: qs('#clear-done')
}
