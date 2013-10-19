(function() {
  (function(files) {
    var cache, module, req;
    cache = {};
    req = function(id) {
      var file;
      if (cache[id] == null) {
        if (files[id] == null) {
          if ((typeof require !== "undefined" && require !== null)) {
            return require(id);
          }
          console.log("Cannot find module '" + id + "'");
          return null;
        }
        file = cache[id] = {
          exports: {}
        };
        files[id][1].call(file.exports, (function(name) {
          var realId;
          realId = files[id][0][name];
          return req(realId != null ? realId : name);
        }), file, file.exports);
      }
      return cache[id].exports;
    };
    if (typeof module === 'undefined') {
      module = {};
    }
    return module.exports = req(0);
  })([
    [
      {
        /*
          /home/stayrad/Projects/Ranger/lib/controllers/ranger.js
        */

        'base': 1,
        '../common': 2,
        '../views/pane': 3,
        '../views/item': 4,
        '../controllers/panes': 5,
        '../controllers/items': 6,
        '../models/pane': 7,
        '../models/item': 8
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      /*global $*/
      
      (function () {
      
          'use strict';
      
          var Base, Item, Items, Pane, Panes, Ranger, template, vent, bind;
      
          Base = require('base');
          bind = require('../common').bind;
      
          // Global event passer
          vent = new Base.Event();
      
          // Templates
          template = {
              pane: require('../views/pane'),
              item: require('../views/item')
          };
      
          // Controllers and Models
          Panes = require('../controllers/panes')(vent, template.pane);
          Items = require('../controllers/items')(vent, template.item);
          Pane  = require('../models/pane');
          Item  = require('../models/item');
      
          Ranger = Base.View.extend({
      
              constructor: function () {
      
                  this.open        = bind(this.open, this);
                  this.left        = bind(this.left, this);
                  this.right       = bind(this.right, this);
                  this.down        = bind(this.down, this);
                  this.up          = bind(this.up, this);
                  this.selectFirst = bind(this.selectFirst, this);
                  this.loadRaw     = bind(this.loadRaw, this);
                  this.remove      = bind(this.remove, this);
                  this.addOne      = bind(this.addOne, this);
                  this.recheck     = bind(this.recheck, this);
                  this.selectItem  = bind(this.selectItem, this);
                  this.selectPane  = bind(this.selectPane, this);
                  Ranger.__super__.constructor.apply(this, arguments);
      
                  this.current = {
                      pane: null,
                      item: null
                  };
      
                  this.panes = new Pane();
                  this.panes.on('create:model show', this.addOne);
                  this.panes.on('before:destroy:model', this.remove);
      
                  vent.on('select:item', this.selectItem);
                  vent.on('select:pane', this.selectPane);
      
              },
      
              // Select a pane
              selectPane: function (pane) {
                  this.current.pane = pane;
                  this.el.find('.active.pane').removeClass('active');
              },
      
              // Select an item
              selectItem: function (item, pane) {
                  this.current.item = item;
                  this.recheck(pane);
                  if (!item.child) {
                      return;
                  }
                  this.panes.trigger('show', item.child);
              },
      
              // Remove panes that aren't displayed
              recheck: function (pane) {
                  var _this = this;
                  return pane.contents.forEach(function (item) {
                      if (!item.child) {
                          return;
                      }
                      item.child.trigger('remove');
                      _this.recheck(item.child);
                  });
              },
      
              // Render a pane
              addOne: function (pane) {
                  var view;
                  view = new Panes({
                      pane: pane
                  });
                  this.el.append(view.render().el);
              },
      
              // Destroying the view of a pane when the model is destroyed
              // Also destroy all child views
              remove: function (pane) {
                  pane.trigger('remove');
                  this.recheck(pane);
              },
      
              // Load an array of objects
              loadRaw: function (array, panes) {
                  var i, id, item, key, length, main, map, out, title, x, j, alen, plen;
      
                  // You can only have one top level pane at a time
                  if (this.panes.length > 0) {
                      this.panes.first().destroy();
                  }
      
                  map    = {};
                  main   = {};
                  length = panes.length - 1;
      
                  for (i = 0, alen = array.length; i < alen; i += 1) {
      
                      item = array[i];
                      out  = main;
                      x    = '';
      
                      for (j = 0, plen = panes.length; j < plen; j += 1) {
      
                          title = panes[j][0];
                          key   = panes[j][1];
      
                          out.title = title;
                          if (out.contents === undefined) {
                              out.contents = [];
                          }
      
                          x += title + ':' + item[key] + ':';
      
                          if (map[x] === undefined) {
                              id = out.contents.push({
                                  title: item[key]
                              }) - 1;
                              map[x] = out.contents[id];
                          }
      
                          if (j !== length) {
      
                              if (map[x].child !== undefined) {
                                  out = map[x].child;
                              } else {
                                  out = map[x].child = {};
                              }
      
                          } else {
                              map[x].data = item;
                          }
                      }
                  }
                  this.panes.create(main);
              },
      
              // Select the first item in the first pane
              selectFirst: function () {
                  var item, pane;
                  pane = this.panes.first();
                  item = pane.contents.first();
                  pane.contents.trigger('click:item', item);
              },
      
              // Move up
              up: function () {
                  if (!this.current.pane) {
                      return this.selectFirst();
                  }
                  this.current.pane.trigger('move:up');
              },
      
              // Move down
              down: function () {
                  if (!this.current.pane) {
                      return this.selectFirst();
                  }
                  this.current.pane.trigger('move:down');
              },
      
              // Move right
              right: function () {
                  if (!this.current.pane) {
                      return;
                  }
                  this.current.pane.trigger('move:right');
              },
      
              // Move left
              left: function () {
                  var item, pane, _ref;
                  if (!((_ref = this.current.pane) !== undefined ? _ref.parent : undefined)) {
                      return;
                  }
                  item = this.current.pane.parent;
                  pane = item.collection;
                  pane.trigger('click:item', item);
              },
      
              // Return the selcted item
              open: function () {
                  return this.current.item.data;
              }
      
          });
      
          // Export global if we are running in a browser
          if (typeof process === 'undefined' || process.title === 'browser') {
              window.Ranger = Ranger;
          }
      
          module.exports = Ranger;
      
      }());
      ;
      }
    ], [
      {
        /*
          /home/stayrad/Projects/Ranger/node_modules/base/index.js
        */

      }, function(require, module, exports) {
        /*jslint node: true, nomen: true*/
      
      (function () {
          'use strict';
      
          var include, extend, inherit, View, Event, Model, Collection;
      
          // Copy object properties
          include = function (to, from) {
              var key;
              for (key in from) {
                  if (from.hasOwnProperty(key)) {
                      to[key] = from[key];
                  }
              }
          };
      
          // CoffeeScript extend for classes
          inherit = function (child, parent) {
              var key, Klass;
              for (key in parent) {
                  if (parent.hasOwnProperty(key)) {
                      child[key] = parent[key];
                  }
              }
              Klass = function () {
                  this.constructor = child;
              };
              Klass.prototype = parent.prototype;
              child.prototype = new Klass();
              child.__super__ = parent.prototype;
              return child;
          };
      
          // Backbone like extending
          extend = function (attrs) {
              var child, parent = this;
              if (!attrs) { attrs = {}; }
              if (attrs.hasOwnProperty('constructor')) {
                  child = attrs.constructor;
              } else {
                  child = function () {
                      child.__super__.constructor.apply(this, arguments);
                  };
              }
              inherit(child, parent);
              include(child.prototype, attrs);
              return child;
          };
      
      
          /*
           * EVENT
           */
      
          Event = (function () {
      
              function Event(attrs) {
                  this._events = {};
                  this._listening = [];
              }
      
              // Bind an event to a function
              // Returns an event ID so you can unbind it later
              Event.prototype.on = function (events, fn) {
                  var ids, id, i, len, event;
                  if (typeof fn !== 'function') {
                      throw new Error('fn not function');
                  }
      
                  // Allow multiple events to be set at once such as:
                  // event.on('update change refresh', this.render);
                  ids = [];
                  events = events.split(' ');
                  for (i = 0, len = events.length; i < len; i += 1) {
                      event = events[i];
                      // If the event has never been listened to before
                      if (!this._events[event]) {
                          this._events[event] = {};
                          this._events[event].index = 0;
                      }
                      // Increment the index and assign an ID
                      id = this._events[event].index += 1;
                      this._events[event][id] = fn;
                      ids.push(id);
                  }
      
                  return ids;
              };
      
              // Trigger an event
              Event.prototype.trigger = function (event) {
                  var args, actions, i;
                  args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
      
                  // Listen to all events
                  if (event !== '*') {
                      this.trigger('*', event, args);
                  }
      
                  actions = this._events[event];
                  if (actions) {
                      for (i in actions) {
                          if (actions.hasOwnProperty(i) && i !== 'index') {
                              actions[i].apply(actions[i], args);
                          }
                      }
                  }
              };
      
              // Remove a listener from an event
              Event.prototype.off = function (events, id) {
                  var i, len;
                  if (Array.isArray(id)) {
                      for (i = 0, len = id.length; i < len; i += 1) {
                          this.off(events, id[i]);
                      }
                      return;
                  }
                  events = events.split(' ');
                  for (i = 0, len = events.length; i < len; i += 1) {
                      delete this._events[events[i]][id];
                  }
              };
      
              /**
               * Listen to multiple events from multiple objects
               * Use this.stopListening to stop listening to them all
               *
               * Example:
               *
               *   this.listen(object, {
               *      'create change': this.render,
               *      'remove': this.remove
               *   });
               *
               *   this.listen([
               *      objectOne, {
               *          'create': this.render,
               *          'remove': this.remove
               *      },
               *      objectTwo, {
               *          'change': 'this.render
               *      }
               *   ]);
               *
               */
              Event.prototype.listen = function (obj, attrs) {
                  var i, len, event, listener;
                  if (Array.isArray(obj)) {
                      for (i = 0, len = obj.length; i < len; i += 2) {
                          this.listen(obj[i], obj[i + 1]);
                      }
                      return;
                  }
                  listener = [obj, {}];
                  for (event in attrs) {
                      if (attrs.hasOwnProperty(event)) {
                          listener[1][event] = obj.on(event, attrs[event]);
                      }
                  }
                  this._listening.push(listener);
              };
      
              // Stop listening to all events
              Event.prototype.stopListening = function (object) {
                  var i, len, obj, events, event;
                  for (i = 0, len = this._listening.length; i < len; i += 1) {
                      obj = this._listening[i][0];
                      if (!object || object === obj) {
                          events = this._listening[i][1];
                          for (event in events) {
                              if (events.hasOwnProperty(event)) {
                                  obj.off(event, events[event]);
                              }
                          }
                      }
                  }
                  this._listening = [];
              };
      
              return Event;
      
          }());
      
      
          /*
           * VIEW
           */
      
          View = (function () {
      
              function View(attrs) {
                  View.__super__.constructor.apply(this, arguments);
                  include(this, attrs);
      
                  if (!this.elements) {
                      this.elements = {};
                  }
      
                  if (!this.events) {
                      this.events = {};
                  }
      
                  if (this.el) {
                      this.bind();
                  }
              }
      
              // Load Events
              inherit(View, Event);
      
              View.prototype.bind = function (el) {
                  var selector, query, action, split, name, event;
      
                  // If el is not specified use this.el
                  if (!el) { el = this.el; }
      
                  // Cache elements
                  for (selector in this.elements) {
                      if (this.elements.hasOwnProperty(selector)) {
                          name = this.elements[selector];
                          this[name] = el.find(selector);
                      }
                  }
      
                  // Bind events
                  for (query in this.events) {
                      if (this.events.hasOwnProperty(query)) {
                          action = this.events[query];
                          split = query.indexOf(' ') + 1;
                          event = query.slice(0, split || 9e9);
                          if (split > 0) {
                              selector = query.slice(split);
                              el.on(event, selector, this[action]);
                          } else {
                              el.on(event, this[action]);
                          }
                      }
                  }
      
              };
      
              View.prototype.unbind = function (el) {
                  var selector, query, action, split, name, event;
      
                  // If el is not specified use this.el
                  if (!el) { el = this.el; }
      
                  // Delete elements
                  for (selector in this.elements) {
                      if (this.elements.hasOwnProperty(selector)) {
                          name = this.elements[selector];
                          delete this[name];
                      }
                  }
      
                  // Unbind events
                  for (query in this.events) {
                      if (this.events.hasOwnProperty(query)) {
                          action = this.events[query];
                          split = query.indexOf(' ') + 1;
                          event = query.slice(0, split || 9e9);
                          if (split > 0) {
                              selector = query.slice(split);
                              el.off(event, selector);
                          } else {
                              el.off(event);
                          }
                      }
                  }
      
              };
      
              // Unbind the view and remove the element
              View.prototype.release = function () {
                  this.unbind();
                  this.el.remove();
                  this.stopListening();
              };
      
              return View;
      
          }());
      
      
          /*
           * MODEL
           */
      
          Model = (function () {
      
              function Model(attrs) {
                  var set, get, key, self = this;
      
                  // Call super
                  Model.__super__.constructor.apply(this, arguments);
      
                  // Set attributes
                  if (!this.defaults) { this.defaults = {}; }
                  this._data = {};
                  include(this._data, this.defaults);
                  include(this._data, attrs);
      
                  set = function (key) {
                      return function (value) {
                          return self.set.call(self, key, value);
                      };
                  };
      
                  get = function (key) {
                      return function () {
                          return self.get(key);
                      };
                  };
      
                  for (key in this.defaults) {
                      if (this.defaults.hasOwnProperty(key)) {
                          this.__defineSetter__(key, set(key));
                          this.__defineGetter__(key, get(key));
                      }
                  }
      
              }
      
              // Load Events
              inherit(Model, Event);
      
              // Change a value
              Model.prototype.set = function (key, value, options) {
                  if (!this.defaults.hasOwnProperty(key)) {
                      this[key] = value;
                      return value;
                  }
                  if (value === this._data[key]) { return; }
                  this._data[key] = value;
                  if (!options || !options.silent) {
                      this.trigger('change', key, value);
                      this.trigger('change:' + key, value);
                  }
              };
      
              // Get a value
              Model.prototype.get = function (key) {
                  if (this.defaults.hasOwnProperty(key)) {
                      return this._data[key];
                  }
                  return this[key];
              };
      
              // Load data into the model
              Model.prototype.refresh = function (data, replace) {
                  if (replace) {
                      this._data = {};
                      include(this._data, this.defaults);
                  }
                  include(this._data, data);
                  this.trigger('refresh');
                  return this;
              };
      
              // Destroy the model
              Model.prototype.destroy = function () {
                  this.trigger('before:destroy');
                  delete this._data;
                  this.trigger('destroy');
                  return this;
              };
      
              // Convert the class instance into a simple object
              Model.prototype.toJSON = function (strict) {
                  var key, json;
                  if (strict) {
                      for (key in this.defaults) {
                          if (this.defaults.hasOwnProperty(key)) {
                              json[key] = this._data[key];
                          }
                      }
                  } else {
                      json = this._data;
                  }
                  return json;
              };
      
      
              return Model;
      
          }());
      
      
          /*
           * COLLECTION
           */
      
          Collection = (function () {
      
              function Collection() {
                  Collection.__super__.constructor.apply(this, arguments);
                  this.length  = 0;
                  this._index  = 0;
                  this._models = [];
                  this._lookup = {};
              }
      
              // Load Events
              inherit(Collection, Event);
      
              // Access all models
              Collection.prototype.all = function () {
                  return this._models;
              };
      
              // Create a new instance of the model and add it to the collection
              Collection.prototype.create = function (attrs, options) {
                  var model = new this.model(attrs);
                  this.add(model, options);
                  return model;
              };
      
              // Add a model to the collection
              Collection.prototype.add = function (model, options) {
      
                  var id, index, self = this;
      
                  // Set ID
                  if (model.id) {
                      id = model.id;
                  } else {
                      id = 'c-' + this._index;
                      this._index += 1;
                      model.set('id', id, {silent: true});
                  }
      
                  // Add to collection
                  model.collection = this;
                  index = this._models.push(model) - 1;
                  this._lookup[id] = index;
                  this.length += 1;
      
                  // Bubble events
                  this.listen(model, {
                      '*': function (event, args) {
                          args = args.slice(0);
                          args.unshift(event + ':model', model);
                          self.trigger.apply(self, args);
                      },
                      'before:destroy': function () {
                          self.remove(model);
                      }
                  });
      
                  // Only trigger create if silent is not set
                  if (!options || !options.silent) {
                      this.trigger('create:model', model);
                      this.trigger('change');
                  }
      
              };
      
              // Remove a model from the collection
              // Does not destroy the model - just removes it from the array
              Collection.prototype.remove = function (model) {
                  var index = this.indexOf(model);
                  this._models.splice(index, 1);
                  delete this._lookup[model.id];
                  this.length -= 1;
                  this.stopListening(model);
                  this.trigger('remove:model');
                  this.trigger('change');
              };
      
              // Reorder the collection
              Collection.prototype.move = function (model, pos) {
                  var index = this.indexOf(model);
                  this._models.splice(index, 1);
                  this._models.splice(pos, 0, model);
                  this._lookup[model.id] = index;
                  this.trigger('change:order');
                  this.trigger('change');
              };
      
              // Append or replace the data in the collection
              // Doesn't trigger any events when updating the array apart from 'refresh'
              Collection.prototype.refresh = function (data, replace) {
                  var i, len;
                  if (replace) {
                      this._models = [];
                      this._lookup = {};
                  }
                  for (i = 0, len = data.length; i < len; i += 1) {
                      this.create(data[i], { silent: true });
                  }
                  return this.trigger('refresh');
              };
      
              // Loop over each record in the collection
              Collection.prototype.forEach = function () {
                  return this._models.forEach.apply(this._models, arguments);
              };
      
              // Filter the models
              Collection.prototype.filter = function () {
                  return this._models.filter.apply(this._models, arguments);
              };
      
              // Sort the models. Does not alter original order
              Collection.prototype.sort = function () {
                  return this._models.sort.apply(this._models, arguments);
              };
      
              // Get the index of the item
              Collection.prototype.indexOf = function (model) {
                  if (typeof model === 'string') {
                      // Convert model id to actual model
                      return this.indexOf(this.get(model));
                  }
                  return this._models.indexOf(model);
              };
      
              // Convert the collection into an array of objects
              Collection.prototype.toJSON = function () {
                  var i, id, len, record, results = [];
                  for (i = 0, len = this._models.length; i < len; i += 1) {
                      record = this._models[i];
                      results.push(record.toJSON());
                  }
                  return results;
              };
      
              // Return the first record in the collection
              Collection.prototype.first = function () {
                  return this.at(0);
              };
      
              // Return the last record in the collection
              Collection.prototype.last = function () {
                  return this.at(this.length - 1);
              };
      
              // Return the record by the id
              Collection.prototype.get = function (id) {
                  var index = this._lookup[id];
                  return this.at(index);
              };
      
              // Return a specified record in the collection
              Collection.prototype.at = function (index) {
                  return this._models[index];
              };
      
              // Check if a model exists in the collection
              Collection.prototype.exists = function (model) {
                  return this.indexOf(model) > -1;
              };
      
              return Collection;
      
          }());
      
          // Add the extend to method to all classes
          Event.extend = View.extend = Model.extend = Collection.extend = extend;
      
          // Export all the classes
          module.exports = {
              Event: Event,
              View: View,
              Model: Model,
              Collection: Collection
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /home/stayrad/Projects/Ranger/lib/common.js
        */

      }, function(require, module, exports) {
        (function () {
      
          'use strict';
      
          module.exports = {
              bind: function (fn, me) {
                  return function () {
                      return fn.apply(me, arguments);
                  };
              }
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /home/stayrad/Projects/Ranger/lib/views/pane.js
        */

      }, function(require, module, exports) {
        (function () {
      
          'use strict';
      
          module.exports = function (obj) {
              return '<div class=\"title\">' + obj.title + '</div><div class="items"></div>';
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /home/stayrad/Projects/Ranger/lib/views/item.js
        */

      }, function(require, module, exports) {
        (function () {
      
          'use strict';
      
          module.exports = function (obj) {
              return obj.title;
          };
      
      }());
      ;
      }
    ], [
      {
        /*
          /home/stayrad/Projects/Ranger/lib/controllers/panes.js
        */

        'base': 1,
        '../controllers/items': 6,
        '../common': 2
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      /*global $*/
      
      (function () {
      
          'use strict';
      
          var Base, Items, bind, Panes, template, vent, SCROLL_OFFSET, SCROLL_HEIGHT;
      
          Base  = require('base');
          Items = require('../controllers/items')();
          bind  = require('../common').bind;
      
          // Constants
          // TODO: Let the user set these
          SCROLL_OFFSET = 20;
          SCROLL_HEIGHT = 50;
      
          // Set globals
          module.exports = function (vnt, tmpl) {
              if (vent === undefined) { vent = vnt; }
              if (template === undefined) { template = tmpl; }
              return Panes;
          };
      
          Panes = Base.View.extend({
      
              tagName: 'section',
      
              className: 'pane',
      
              constructor: function () {
      
                  this.right           = bind(this.right, this);
                  this.down            = bind(this.down, this);
                  this.up              = bind(this.up, this);
                  this.move            = bind(this.move, this);
                  this.addOne          = bind(this.addOne, this);
                  this.render          = bind(this.render, this);
                  this.select          = bind(this.select, this);
                  this.updateScrollbar = bind(this.updateScrollbar, this);
                  this.remove          = bind(this.remove, this);
                  Panes.__super__.constructor.apply(this, arguments);
      
                  this.el = $("<" + this.tagName + " class=\"" + this.className + "\">");
                  this.active = null;
      
                  this.listen([
                      this.pane, {
                          'remove':     this.remove,
                          'move:up':    this.up,
                          'move:down':  this.down,
                          'move:right': this.right
                      },
                      this.pane.contents, {
                          'click:item': this.select
                      }
                  ]);
      
              },
      
              remove: function () {
                  this.pane.contents.trigger('remove');
                  this.unbind();
                  this.el.remove();
                  delete this.el;
                  delete this.items;
                  this.stopListening();
              },
      
              updateScrollbar: function () {
                  var item, parent, height, pos, scroll;
                  item   = this.el.find('.active').get(0);
                  parent = this.items.get(0);
                  height = parent.offsetHeight;
                  pos    = item.offsetTop;
                  scroll = parent.scrollTop;
                  if (pos - scroll < SCROLL_OFFSET) {
                      parent.scrollTop = pos - SCROLL_OFFSET;
                  } else if (pos + SCROLL_HEIGHT > scroll + height - SCROLL_OFFSET) {
                      parent.scrollTop = pos - height + SCROLL_HEIGHT + SCROLL_OFFSET;
                  }
              },
      
              select: function (item) {
                  vent.trigger('select:pane', this.pane);
                  this.active = this.pane.contents.indexOf(item);
                  this.el.addClass('active');
                  this.el.find('.active').removeClass('active');
                  item.trigger('select');
                  vent.trigger('select:item', item, this.pane);
                  this.updateScrollbar();
              },
      
              render: function () {
                  this.el.html(template(this.pane.toJSON()));
                  this.items = this.el.find('.items');
                  this.pane.contents.forEach(this.addOne);
                  return this;
              },
      
              addOne: function (item) {
                  var itemView;
                  itemView = new Items({
                      item: item
                  });
                  this.items.append(itemView.render().el);
              },
      
              move: function (direction) {
                  var active, contents, item, max;
                  active = this.active;
                  contents = this.pane.contents;
                  active += direction;
                  max = contents.length - 1;
      
                  if (active < 0) {
                      active = 0;
                  } else if (active > max) {
                      active = max;
                  }
      
                  if (active === this.active) { return; }
      
                  this.active = active;
                  item = contents.at(this.active);
                  this.select(item);
              },
      
              up: function () {
                  this.move(-1);
              },
      
              down: function () {
                  this.move(1);
              },
      
              right: function () {
                  var child, current, item;
                  current = this.pane.contents.at(this.active);
                  if (!current.child) { return; }
                  child = current.child.contents;
                  item = child.first();
                  child.trigger('click:item', item);
              }
      
          });
      
      }());
      ;
      }
    ], [
      {
        /*
          /home/stayrad/Projects/Ranger/lib/controllers/items.js
        */

        'base': 1,
        '../common': 2
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      /*global $*/
      
      (function () {
      
          'use strict';
      
          var Base, Items, template, vent, bind;
      
          Base = require('base');
          bind = require('../common').bind;
      
          // Set globals
          module.exports = function (vnt, tmpl) {
              if (vent === undefined) { vent = vnt; }
              if (template === undefined) { template = tmpl; }
              window.TEMPLATE = template;
              return Items;
          };
      
          Items = Base.View.extend({
      
              tagName: 'div',
              className: 'item',
      
              events: {
                  'mousedown': 'click'
              },
      
              constructor: function () {
      
                  this.select = bind(this.select, this);
                  this.click  = bind(this.click, this);
                  this.remove = bind(this.remove, this);
                  this.render = bind(this.render, this);
                  Items.__super__.constructor.apply(this, arguments);
      
                  this.el = $("<" + this.tagName + " class=\"" + this.className + "\">");
                  this.bind();
      
                  this.listen([
                      this.item, {
                          'select': this.select
                      },
                      this.item.collection, {
                          'remove': this.remove
                      }
                  ]);
      
                  this.el.toggleClass('hasChild', !!this.item.child);
      
              },
      
              render: function () {
                  this.el.html(template(this.item.toJSON()));
                  return this;
              },
      
              remove: function () {
                  this.unbind();
                  this.el.remove();
                  delete this.el;
                  this.stopListening();
              },
      
              // Sending message to pane view
              click: function () {
                  this.item.collection.trigger('click:item', this.item);
              },
      
              // Receiving message from pane view
              select: function () {
                  this.el.addClass('active');
              }
      
          });
      
      }());
      ;
      }
    ], [
      {
        /*
          /home/stayrad/Projects/Ranger/lib/models/pane.js
        */

        'base': 1,
        '../models/item': 8
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      
      (function () {
      
          'use strict';
      
          var Base, Item, Pane, Panes;
      
          Base = require('base');
          Item = require('../models/item');
      
          Pane = Base.Model.extend({
      
              defaults: {
                  title: '',
                  contents: []
              },
      
              constructor: function (attrs) {
                  Pane.__super__.constructor.apply(this, arguments);
                  this.contents = new Item();
                  this.contents.refresh(attrs.contents, true);
              }
      
          });
      
          Panes = Base.Collection.extend({
      
              constructor: function () {
                  return Panes.__super__.constructor.apply(this, arguments);
              },
      
              model: Pane
      
          });
      
          module.exports = Panes;
      
      }());
      ;
      }
    ], [
      {
        /*
          /home/stayrad/Projects/Ranger/lib/models/item.js
        */

        'base': 1,
        '../models/pane': 7
      }, function(require, module, exports) {
        /*jslint browser: true, node: true, nomen: true*/
      
      (function () {
      
          'use strict';
      
          var Base, Item, Items;
      
          Base = require('base');
      
          // Item Model
          Item = Base.Model.extend({
      
              defaults: {
                  title: '',
                  child: false,
                  data: false
              },
      
              constructor: function (attrs) {
                  var Pane;
                  Item.__super__.constructor.apply(this, arguments);
                  if (attrs.child === undefined) {
                      return;
                  }
                  Pane = require('../models/pane').prototype.model;
                  this.child = new Pane(attrs.child);
                  this.child.parent = this;
              }
      
          });
      
      
          // Item Collection
          Items = Base.Collection.extend({
      
              constructor: function () {
                  return Items.__super__.constructor.apply(this, arguments);
              },
      
              model: Item
      
          });
      
          module.exports = Items;
      
      }());
      ;
      }
    ]
  ]);

}).call(this);
