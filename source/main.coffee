
Base = require 'base'

Ranger = require './controllers/ranger.coffee'
Panes = require './controllers/panes.coffee'
Items = require './controllers/items.coffee'


# Global event passer
window.vent = new Base.Event()

window.templates =
  pane: require('./views/pane.coffee')
  item: require('./views/item.coffee')

window.ranger = new Ranger
  el: $('.ranger')

items = require './data.json'

panes = [
  ['Artists', 'ArtistName']
  ['Albums', 'AlbumName']
  ['Songs', 'Name']
]

document.onkeydown = (e) ->

  switch e.which
    when 38 then ranger.up()
    when 37 then ranger.left()
    when 39 then ranger.right()
    when 40 then ranger.down()

  if 37 <= e.which <= 40
    e.preventDefault()
    return false

ranger.loadRaw(items, panes)
