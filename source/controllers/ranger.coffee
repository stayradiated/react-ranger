
Base = require 'base'

Panes = require '../controllers/panes.coffee'
Items = require '../controllers/items.coffee'

Pane = require '../models/pane.coffee'
Item = require '../models/item.coffee'

class Ranger extends Base.Controller

  constructor: ->
    super
    @panes = new Pane()
    @panes.on 'create:model show', @addOne
    vent.on 'select:item', @selectItem
    vent.on 'select:pane', @selectPane

  selectPane: (pane) =>
    @active = pane
    @el.find('.active.pane').removeClass('active')

  selectItem: (item, pane) =>
    @recheck(pane)
    return unless item.child
    @panes.trigger 'show', item.child

  recheck: (pane) =>
    pane.contents.forEach (item) =>
      return unless item.child
      item.child.trigger 'remove'
      @recheck item.child

  addOne: (pane) =>
    view = new Panes( pane: pane )
    @el.append view.render().el

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

  selectFirst: =>
    pane = @panes.first()
    item = pane.contents.first()
    return pane.contents.trigger('click:item', item)

  up: =>
    return @selectFirst() unless @active
    @active.trigger('move:up')

  down: =>
    return @selectFirst() unless @active
    @active.trigger('move:down')

  right: =>
    @active.trigger('move:right')

  left: =>
    console.log @pane

module.exports = Ranger
