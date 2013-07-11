
Base = require 'base'
Item = require '../models/item.coffee'

class Pane extends Base.Model

  defaults:
    title: ''
    contents: []

  constructor: (attrs) ->
    super
    @contents = new Item()
    @contents.refresh(attrs.contents, true)

class Panes extends Base.Collection
  
  model: Pane

module.exports = Panes
