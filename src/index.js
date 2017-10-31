import '../node_modules/normalize.css/normalize.css'
import './styles/main.styl'
import Store from './module/store'
import { on } from './module/helpers'
import View from './module/view'
import Template from './module/template'
import Controller from './module/controller'

const store = new Store(window.localStorage)
const view = new View(new Template())
const controller = new Controller(store, view)
const setView = () => {
  controller.setView(document.location.hash)
}
on(window, 'load', setView)

on(window, 'hashchange', setView)
