
# Load Base
Base = require 'base'

# Load ranger
Ranger = require './controllers/ranger.coffee'

window.ranger = new Ranger
  el: $('.ranger')

items = require './data.json'

panes = [
  ['Artists', 'ArtistName']
  ['Albums', 'AlbumName']
  ['Songs', 'Name']
]

openItem = ->
  item = ranger.open()
  return unless item
  console.log item

document.onkeydown = (e) ->

  switch e.which
    when 13 then openItem()
    when 38 then ranger.up()
    when 37 then ranger.left()
    when 39 then ranger.right()
    when 40 then ranger.down()

  if 37 <= e.which <= 40
    e.preventDefault()
    return false

ranger.loadRaw(items, panes)
