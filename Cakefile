{spawn} = require 'child_process'
node_static = require 'node-static'
http = require 'http'
fs = require 'fs'

# Configuration
source = 'source'
bin = 'bin'
exampleInput = 'example/js/init.js'
exampleOutput = 'example/js/main.js'
publicFolder = './example'

option '-p', '--port [port]', 'Set port for cake server'
option '-w', '--watch', 'Watch the folder for changes'


compileCoffee = (options) ->

  # Arguments
  args = ['-o', bin, source]

  # Build or Watch
  if options.watch
    args.unshift '-w'

  # Start coffee
  terminal = spawn('coffee', args)
  terminal.stdout.on 'data', (data) -> console.log(data.toString())
  terminal.stderr.on 'data', (data) -> console.log(data.toString())


browserify = (options) ->

  # Modules
  watchify = './node_modules/watchify/bin/cmd.js'
  browserify = './node_modules/browserify/bin/cmd.js'

  args = [exampleInput, '-o', exampleOutput]

  # Build or Watch
  if options.watch
    cmd = watchify
  else
    cmd = browserify

  console.log cmd, args.join(' ')

  # Start browserify
  browserify = spawn(cmd, args)
  browserify.stdout.on 'data', (data) -> console.log(data.toString())
  browserify.stderr.on 'data', (data) -> console.log(data.toString())
  browserify.on 'error', (data) -> console.log(data.toString())
  browserify.on 'exit', (data) -> console.log(data.toString())


task 'server', 'Start server', (options) ->

  # Set port
  port = options.port or 9294

  compileCoffee(options)
  browserify(options)

  # Run http server on localhost:9294
  file= new(node_static.Server)(publicFolder)

  server = http.createServer (req, res) ->

    req.addListener( 'end', ->
      file.serve(req, res)
    ).resume()

  server.listen port

  console.log 'Server started on ' + port


task 'build', 'Compile coffeescript', (options) ->
 compileCoffee(options)

task 'build_example', 'Build example', (options) ->
  browserify(options)
