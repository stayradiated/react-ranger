
Base = require 'base'

class Items extends Base.Controller
  
  tagName: 'div'
  className: 'item'
  template: new Base.View $('#item-template').html(), true

  events:
    'mousedown': 'click'
  
  constructor: ->
    super
    @el = $("<#{@tagName} class=\"#{@className}\">")
    @bind()
    @item.on 'select', @select
    @el.toggleClass 'hasChild', !!@item.child

  render: =>
    @el.html @template.render @item.toJSON()
    return this

  click: =>
    # Send message to pane view
    @item.collection.trigger 'click:item', @item

  select: =>
    # Receving message from pane view
    @el.addClass 'active'

module.exports = Items
