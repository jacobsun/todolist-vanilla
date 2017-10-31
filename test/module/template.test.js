import Template from '../../src/module/template'
import { expect } from 'chai'

describe('Template', function () {
  let tpl
  beforeEach(function () {
    tpl = new Template
  })
  it('should return a html tag str', function () {
    var items = [
      {id:1, title: 'foo', done: false},
      {id:2, title: 'bar', done: true},
      {id:3, title: 'baz', done: false}
    ]
    var results = `<li data-id="1"><input type="checkbox" class="toggle"><label>foo</label><button class="delete"></button></li><li data-id="2" class="done"><input type="checkbox" class="toggle" checked><label>bar</label><button class="delete"></button></li><li data-id="3"><input type="checkbox" class="toggle"><label>baz</label><button class="delete"></button></li>`
    expect(tpl.itemList(items)).to.equal(results)
  })

  it('should return item(s)', function() {
    expect(tpl.itemCounter(0)).to.equal('0 item left')
    expect(tpl.itemCounter(1)).to.equal('1 item left')
    expect(tpl.itemCounter(2)).to.equal('2 items left')
  })
})
