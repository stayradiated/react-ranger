
Base = require 'base'

class Item extends Base.Model

  defaults:
    name: ''
    child: false
    data: false

  constructor: (attrs) ->
    super
    return unless attrs.child?
    Pane = require('../models/pane')::model
    @child = new Pane(attrs.child)
    @child.parent = this

class Items extends Base.Collection

  model: Item

module.exports = Items
