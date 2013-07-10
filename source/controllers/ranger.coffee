
Base = require 'base'

Panes = require '../controllers/panes.coffee'
Items = require '../controllers/items.coffee'

Pane = require '../models/pane.coffee'
Item = require '../models/item.coffee'

class Ranger extends Base.Controller

  constructor: ->
    @panes = new Pane()
    @panes.on 'add show', @addone
    vent.on 'select:item', @selectItem
    vent.on 'select:pane', @selectPane

  selectPane: (pane) =>
    @active = pane
    @el.find('.active.pane').removeClass('active')

  selectItem: (item, pane) =>
    console.log '> selecting pane', pane.id
    @recheck(pane)
    return unless item.child
    @panes.trigger 'show', item.child

  recheck: (pane) =>
    pane.contents.each (item) =>
      return unless item.child
      item.child.trigger 'remove'
      @recheck item.child

  addOne: (pane) =>
    view = new Panes( pane: pane )
    @el.append pane.render().el

  loadRaw: (array, panes) =>
    map = {}
    main = {}
    length = panes.length - 1
    for item in array
      out = main
      x = ''
      for [title, key], i in panes
        x += title + ':' + item[key] + ':'
        out.title = title
        out.contents ?= []
        if map[x] is undefined
          id = out.contents.push( name: item[key] ) - 1
          map[x] = out.contents[id]
        if i isnt length then out = map[x].child ?= {}
        # else map[x].child = item
    @panes.create(main)

  up: =>
    @active.trigger('move:up')

  down: =>
    @active.trigger('move:down')

  right: =>
    @active.trigger('move:right')

  left: =>
    pane = @panes.id
    console.log pane

module.exports = Ranger
