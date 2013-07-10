
Base = require 'base'

class Items extends Base.Controller
  
  template: new Base.View $('#item-template').html(), true

  events:
    'mousedown': 'click'
  
  constructor: ->
    @item.on 'select', @select
    @el.toggleClass 'hasChild', !!@model.get('child')

  render: ->
    @el.html @template.render @item.toJSON()
    return this

  click: ->
    # Send message to pane view
    @item.collection.trigger 'click:item', @item

  select: =>
    # Receving message from pane view
    @el.addClass 'active'

module.exports = Items
