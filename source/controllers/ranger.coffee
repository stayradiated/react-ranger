
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
  
  # Select a pane
  selectPane: (pane) =>
    @active = pane
    @el.find('.active.pane').removeClass('active')
  
  # Select an item
  selectItem: (item, pane) =>
    @recheck(pane)
    return unless item.child
    @panes.trigger 'show', item.child
  
  # Remove panes that aren't displayed
  recheck: (pane) =>
    pane.contents.forEach (item) =>
      return unless item.child
      item.child.trigger 'remove'
      @recheck item.child
  
  # Render a pane
  addOne: (pane) =>
    view = new Panes( pane: pane )
    @el.append view.render().el
  
  # Load an array of objects
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
  
  # Select the first item in the first pane
  selectFirst: =>
    pane = @panes.first()
    item = pane.contents.first()
    return pane.contents.trigger('click:item', item)
  
  # Move up
  up: =>
    return @selectFirst() unless @active
    @active.trigger('move:up')
  
  # Move down
  down: =>
    return @selectFirst() unless @active
    @active.trigger('move:down')
  
  # Move right
  right: =>
    return unless @active
    @active.trigger('move:right')
  
  # Move left
  left: =>
    return unless @active?.parent
    item = @active.parent
    pane = item.collection
    pane.trigger('click:item', item)

module.exports = Ranger
