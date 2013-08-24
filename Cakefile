{spawn} = require 'child_process'
node_static = require 'node-static'
http = require 'http'
fs = require 'fs'

# Configuration
INIT = 'bin/controllers/ranger.js'
OUT = 'bin/ranger.js'
IGNORE = 'swig'

option '-w', '--watch', 'Watch the folder for changes'

build = (options) ->

  # Modules
  watchify = './node_modules/watchify/bin/cmd.js'
  browserify = './node_modules/browserify/bin/cmd.js'

  args = [INIT, '--ignore', IGNORE, '--outfile', OUT]

  # Build or Watch
  if options.watch
    cmd = watchify
    args.push '-v'
  else
    cmd = browserify

  console.log cmd, args.join(' ')

  # Start browserify
  browserify = spawn(cmd, args)
  browserify.stdout.on 'data', (data) -> console.log(data.toString()[0...-1])
  browserify.stderr.on 'data', (data) -> console.log(data.toString()[0...-1])

task 'build', 'Merge JS files into ranger.js', (options) ->
  build(options)
