{spawn} = require 'child_process'
node_static = require 'node-static'
http = require 'http'
fs = require 'fs'

# Configuration
input = 'source/main.coffee'
output = 'public/js/main.js'
publicFolder = './public'

option '-p', '--port [port]', 'Set port for cake server'
option '-w', '--watch', 'Watch the folder for changes'

task 'server', 'Start server', (options) ->

  # Set port
  port = options.port or 9294
  
  # Modules
  watchify = './node_modules/watchify/bin/cmd.js'
  browserify = './node_modules/browserify/bin/cmd.js'
  coffeeify = './node_modules/caching-coffeeify/index.js'

  args = ['-v', '-t', coffeeify, input, '-o', output]
  
  # Start browserify
  terminal = spawn(watchify, args)
  terminal.stdout.on 'data', (data) -> console.log(data.toString())
  terminal.stderr.on 'data', (data) -> console.log(data.toString())
  terminal.on 'error', (data) -> console.log(data.toString())
  terminal.on 'close', (data) -> console.log(data.toString())
  
  # Run http server on localhost:9294
  file= new(node_static.Server)(publicFolder)

  server = http.createServer (req, res) ->

    req.addListener( 'end', ->
      file.serve(req, res)
    ).resume()

  server.listen port

  console.log 'Server started on ' + port


task 'build', 'Start server', (options) ->
  
  # Modules
  watchify = './node_modules/watchify/bin/cmd.js'
  browserify = './node_modules/browserify/bin/cmd.js'
  coffeeify = './node_modules/caching-coffeeify/index.js'

  # Arguments
  args = ['-v', '-t', coffeeify, input, '-o', output]
  
  # Build or Watch
  if options.watch
    cmd = watchify
  else
    cmd = browserify
  
  # Start browserify
  terminal = spawn(cmd, args)
  terminal.stdout.on 'data', (data) -> console.log(data.toString())
  terminal.stderr.on 'data', (data) -> console.log(data.toString())
  terminal.on 'error', (data) -> console.log(data.toString())
  terminal.on 'close', (data) -> console.log(data.toString())
