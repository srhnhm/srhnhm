process.title = process.env.NAME || "static"
express = require 'express'
request = require 'request'
stylus = require 'stylus'
nib = require 'nib'

app = express()

compile = (str, path) ->
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())

app.use express.logger()
app.use '/_check', (req, res) -> res.send 'OK'
app.use require("stylus").middleware
  src: "#{__dirname}/styles",
  dest: "#{__dirname}/public",
  compress: true
  compile: compile

app.use express.static "#{__dirname}/public"

# I'm sure there's a nicer way to do this, but whatever this'll do for now.
for name in ['about', 'help', 'privacy', 'cookies', 'terms']
  app.use "/#{name}", do (name) -> (req, res) -> res.redirect "/#{name}.html"

app.use express.json()
app.use express.urlencoded()

port = process.env.PORT or 4000
app.listen port

console.log "Listening on port #{port}"
