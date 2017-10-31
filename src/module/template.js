import { toEntity } from './helpers'
export default class Template {
  itemList (items) {
    return items.reduce((t, item) => {
      return t + `<li data-id="${item.id}"${item.done ? ' class="done"' : ''}><input type="checkbox" class="toggle"${ item.done ? ' checked' : ''}><label>${toEntity(item.title)}</label><button class="delete"></button></li>`}, '')
  }

  itemCounter (n) {
    return `${n} item${n > 1 ? 's' : ''} left`
  }
}
