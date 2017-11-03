import '../node_modules/normalize.css/normalize.css'
import './styles/main.styl'
import {route, basedon, render, page} from './module/view'
import {features, activate} from './module/features'
import {on} from './module/helpers'

const controller = {
  boot: () => {
    activate(features)
    render(page())
  },
  render: () => render(page(basedon(route())))
}

on(window, 'load', controller.boot)

on(window, 'hashchange', controller.render)
