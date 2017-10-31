export function qs (selector, scope = document) {
  return scope.querySelector(selector)
}

export function on (target, type, cb, capture = false) {
  if (typeof target === 'string') target = document.querySelector(target)
  target.addEventListener(type, cb, capture)
}

export function delegate (target, selector, type, handler, capture = false) {
  if (typeof target === 'string') target = document.querySelector(target)
  let dispatchEvent = event => {
    let targetEl = event.target
    let potentialEl = target.querySelectorAll(selector)
    let i = potentialEl.length
    while (i--) {
      if (potentialEl[i] === targetEl) {
        handler.call(targetEl, event)
        break
      }
    }
  }
  on(target, type, dispatchEvent, capture)
}
export const toEntity = s => s.replace(/[&<]/g, c => {
  if (s === '&') return '&amp;'
  if (s === '<') return '&lt;'
  if (s === '>') return '&gt;'
})
