###

fs = require 'fs'
Scrunch = require 'coffee-scrunch'

# Configuration
input = 'source/controllers/ranger.coffee'
output = 'bin/ranger.js'

scrunch = new Scrunch
  path: input
  compile: true
  watch: true
  verbose: true

build = (options) ->

scrunch.vent.on 'run', ->
  scrunch.compile()

scrunch.vent.on 'compile', (data) ->
  fs.writeFile output, data

scrunch.run()
###

task 'build', 'Merge JS files into ranger.js', (options) ->
