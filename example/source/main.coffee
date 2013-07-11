
# Load Base
Base = require 'base'

# Load ranger
Ranger = require '../../source/controllers/ranger.coffee'

# Initialise Ranger
window.ranger = new Ranger
  el: $('.ranger')

# Load data
items = require './data.json'

# Panes to render
panes = [
  ['Artists', 'ArtistName']
  ['Albums', 'AlbumName']
  ['Songs', 'Name']
]

# Load data into Ranger
ranger.loadRaw(items, panes)

# Do something when an item is selected
openItem = ->
  item = ranger.open()
  return unless item
  console.log item

# Enable keyboard shortcuts
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
