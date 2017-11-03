export default {
  validator: (title) => title.trim().length > 0 ? title.trim() : false,
  generator: (title) => ({id: Date.now(), title, done: false})
}
