
window.App =
	Models: {}
	Collections: {}
	Views: {}

vent = _.extend(Backbone.Events)

template = (id) ->
	_.template $("##{ id }-template").html()


# Models

class App.Models.Item extends Backbone.Model
	defaults:
		name: ''
		child: false

	initialize: (data) ->
		# Load @child as a Pane model
		return if not data.child?
		child = new App.Models.Pane(data.child)
		@set('child', child)


class App.Models.Pane extends Backbone.Model
	defaults:
		title: ''
		contents: []

	initialize: (data) ->
		# Load @contents as a collection of Items
		contents = new App.Collections.Items()
		@set('contents', contents)
		contents.add(data.contents)


# Collections

class App.Collections.Items extends Backbone.Collection
	model: App.Models.Item

class App.Collections.Panes extends Backbone.Collection
	model: App.Models.Pane


# Views

class App.Views.Item extends Backbone.View

	tagName: 'div'
	className: 'item'
	template: template('item')

	events:
		'mousedown': 'click'

	initialize: ->
		@model.on('select', @select)
		@$el.toggleClass 'hasChild', !!@model.get('child')

	render: ->
		@$el.html @template @model.toJSON()
		return this

	click: ->
		# Send message to Pane view
		@model.collection.trigger('click:item', @model)

	select: =>
		# Receiving message from Pane view
		@$el.addClass('active')






class App.Views.Pane extends Backbone.View

	tagName: 'section'
	className: 'pane'
	template: template('pane')

	initialize: ->
		@active = null
		@model.on 'remove', =>
			@remove()
		@model.on('move:up', @up)
		@model.on('move:down', @down)
		@model.on('move:right', @right)
		@model.get('contents').on('click:item', @select)

	select: (item) =>
		vent.trigger('select:pane', @model)
		@active = @model.get('contents').indexOf(item)
		@$el.addClass('active')
		@$('.active').removeClass('active')
		item.trigger('select')
		vent.trigger('select:item', item, @model)

	render: =>
		@$el.html @template @model.toJSON()
		@$items = @$('.items')
		@model.get('contents').each(@addOne)
		return this

	addOne: (item) =>
		itemView = new App.Views.Item( model: item )
		@$items.append( itemView.render().el )

	move: (direction) =>
		active = @active
		contents = @model.get('contents')
		active += direction
		if active < 0 then active = 0
		else if active > contents.length - 1 then active = contents.length - 1
		return if active is @active
		@active = active
		item = contents.at(@active)
		@select(item)

	up: =>
		@move(-1)

	down: =>
		@move(1)

	right: =>
		current = @model.get('contents').at(@active)
		child = current.get('child').get('contents')
		item = child.at(0)
		child.trigger('click:item', item)





class App.Views.Ranger extends Backbone.View

	el: '.ranger'

	initialize: ->
		@active = null
		@panes = new App.Collections.Panes
		@panes.on('add show', @addOne)
		vent.on('select:item', @selectItem)
		vent.on('select:pane', @selectPane)

	selectPane: (pane) =>
		@active = pane
		@$('.active.pane').removeClass('active')

	# Load the items child pane
	selectItem: (item, pane) =>
		@recheck(pane)
		childPane = item.get('child')
		return if childPane is false
		@panes.trigger('show', childPane)

	# Hide all panes that are children of `pane`
	recheck: (pane) =>
		pane.get('contents').each (item) =>
			childPane = item.get('child')
			return if childPane is false
			childPane.trigger('remove')
			@recheck(childPane)

	addOne: (pane) =>
		paneView = new App.Views.Pane( model: pane )
		@$el.append(paneView.render().el)

	loadRaw: (array, panes) =>
		map = {}
		main = {}
		length = panes.length - 1
		for item in array
			out = main
			x = ''
			for [title, key], i in panes
				x += title + ':' + item[key] + ':'
				out.title = title
				out.contents ?= []
				if map[x] is undefined
					id = out.contents.push( name: item[key] ) - 1
					map[x] = out.contents[id]
				if (i isnt length) then out = map[x].child ?= {}
				# else map[x].child = item
		@panes.add(main)

	up: =>
		@active.trigger('move:up')

	down: =>
		@active.trigger('move:down')

	right: =>
		@active.trigger('move:right')

	left: =>
		pane = @panes.get(id)
		console.log pane

