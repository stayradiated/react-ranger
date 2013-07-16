
Base = require 'base'

# Global event passer
vent = new Base.Event()

# Templates
template =
  pane: require('../views/pane')
  item: require('../views/item')

# Controllers and Models
Panes = require('../controllers/panes')(vent, template.pane)
Items = require('../controllers/items')(vent, template.item)
Pane = require '../models/pane'
Item = require '../models/item'


class Ranger extends Base.Controller

  constructor: ->
    super
    @current =
      pane: null
      item: null
    @panes = new Pane()
    @panes.on 'create:model show', @addOne
    @panes.on 'destroy:model', @remove
    vent.on 'select:item', @selectItem
    vent.on 'select:pane', @selectPane
  
  # Select a pane
  selectPane: (pane) =>
    @current.pane = pane
    @el.find('.active.pane').removeClass('active')
  
  # Select an item
  selectItem: (item, pane) =>
    @current.item = item
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

  remove: (pane) =>
    console.log pane
  
  # Load an array of objects
  loadRaw: (array, panes) =>
    # @panes.get(0).destroy()
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
        else map[x].data = item
    @panes.create(main)
  
  # Select the first item in the first pane
  selectFirst: =>
    pane = @panes.first()
    item = pane.contents.first()
    return pane.contents.trigger('click:item', item)
  
  # Move up
  up: =>
    return @selectFirst() unless @current.pane
    @current.pane.trigger('move:up')
  
  # Move down
  down: =>
    return @selectFirst() unless @current.pane
    @current.pane.trigger('move:down')
  
  # Move right
  right: =>
    return unless @current.pane
    @current.pane.trigger('move:right')
  
  # Move left
  left: =>
    return unless @current.pane?.parent
    item = @current.pane.parent
    pane = item.collection
    pane.trigger('click:item', item)

  # Return the selected item
  open: =>
    @current.item.data


module.exports = Ranger
