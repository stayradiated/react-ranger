
Base = require 'base'
Item = require '../models/item.coffee'

class Pane extends Base.Model

  defaults:
    title: ''
    contents: []

  constructor: (attrs) ->
    console.log '> creating pane', attrs.title
    @contents = new Item()
    console.log '| contents', attrs.contents
    @contents.refresh(attrs.contents, true)

class Panes extends Base.Collection
  
  model: Pane

module.exports = Panes
