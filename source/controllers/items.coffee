
Base = require 'base'

vent = null
template = null

module.exports = (vnt, tmpl) ->
  vent ?= vnt
  template ?= tmpl
  return Items

class Items extends Base.Controller
  
  tagName: 'div'
  className: 'item'

  events:
    'mousedown': 'click'
  
  constructor: ->
    super

    @el = $("<#{@tagName} class=\"#{@className}\">")
    @bind()

    @listen @item,
      'select': @select

    @listen @item.collection,
      'remove': @remove

    @el.toggleClass 'hasChild', !!@item.child

  render: =>
    @el.html template.render @item.toJSON()
    return this

  remove: =>
    @unbind()
    @el.remove()
    delete @el
    @unlisten()

  click: =>
    # Send message to pane view
    @item.collection.trigger 'click:item', @item

  select: =>
    # Receving message from pane view
    @el.addClass 'active'

