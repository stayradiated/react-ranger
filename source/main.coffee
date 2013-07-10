
Base = require 'base'

Ranger = require './controllers/ranger.coffee'
Panes = require './controllers/panes.coffee'
Items = require './controllers/items.coffee'


# Global event passer
window.vent = new Base.Event()

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
    else console.log e.which

ranger.loadRaw(items, panes)
