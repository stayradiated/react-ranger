
Base = require 'base'

Items = require '../controllers/items.coffee'

class Panes extends Base.Controller

  template: new Base.View $('#pane-template').html(), true

  elements:
    '.items': 'items'

  constructor: ->
    super
    @active = null
    console.log '> creating a new view', @pane
    @pane.on 'remove', @remove
    @pane.on 'move:up', @up
    @pane.on 'move:down', @down
    @pane.on 'move:right', @right
    @pane.contents.on 'click:item', @select

  remove: =>
    console.log '-- removing pane', @pane
    @el.remove()

  select: (item) =>
    console.log item.toJSON(), @pane.toJSON()
    vent.trigger 'select:pane', @pane 
    @active = @model.contents.indexOf(item)
    @el.addClass 'active'
    @el.find('.active').removeClass('active')
    item.trigger 'select'
    vent.trigger 'select:item', item, @pane

  render: =>
    @el.html @template @pane.toJSON()
    @items = @el.find('.items')
    @pane.contents.forEach(@addOne)
    return this
  
  addOne: (item) =>
    itemView = new Items(item: item)
    @items.append itemView.render().el

  move: (direction) =>
    active = @active
    contents = @pane.contents
    active += direction
    max = contents.length - 1
    if active < 0 then active = 0
    else if active > mac then active = max
    return if active is @active
    @active = active
    item = contents.get(@active)
    @select(item)

  up: =>
    @move(-1)

  down: =>
    @move(1)

  right: =>
    current = @model.contents.at(@active)
    child = current.child.contents
    item = child.get(0)
    child.trigger 'click:item', item

module.exports = Panes

