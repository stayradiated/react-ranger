
Base = require 'base'

class Item extends Base.Model

  defaults:
    name: ''
    child: false

  constructor: (attrs) ->
    super
    return unless attrs.child?
    Pane = require('../models/pane.coffee')::model
    @child = new Pane(attrs.child)

class Items extends Base.Collection

  model: Item

module.exports = Items
