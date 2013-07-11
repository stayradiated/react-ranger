
Base = require 'base'

template = """
  <div class="title">{{ title }}</div>
  <div class="items"></div>
"""

module.exports = new Base.View(template, true)
