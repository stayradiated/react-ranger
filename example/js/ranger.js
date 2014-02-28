!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Ranger=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = _dereq_('./lib/controllers/ranger');

},{"./lib/controllers/ranger":2}],2:[function(_dereq_,module,exports){
'use strict';

var View, Ranger, Pane;

View = _dereq_('../views/ranger');
Pane = _dereq_('../models/pane');

Ranger = function (attrs) {
  this._view = new View(attrs);

  this.up = this._view.up.bind(this._view);
  this.down = this._view.down.bind(this._view);
  this.left = this._view.left.bind(this._view);
  this.right = this._view.right.bind(this._view);
  this.open = this._view.open.bind(this._view);
};

Ranger.prototype.setPanes = function(panes) {
  this._panes = panes;
  this.clear();
};

Ranger.prototype.findPane = function(name) {
  for (var i = this._panes.length - 1; i >= 0; i--) {
    if (this._panes[i][1] == name) {
      return i;
    }
  }
  return -1;
};

// Remove all the current items
Ranger.prototype.clear = function() {
  this._view.pane.destroy();
  this._view.pane.refresh({
    title: this._panes[0][0],
    key: this._panes[0][1]
  }, true);
};

Ranger.prototype.load = function(array)  {
  var i, id, item, key, length, main, map, out, title, x, j, alen, plen;

  // You can only have one top level pane at a time
  this._view.pane.destroy();

  map    = {};
  main   = {};
  length = this._panes.length - 1;

  // Loop through each item in the array - { object }
  for (i = 0, alen = array.length; i < alen; i += 1) {

      item = array[i];
      out  = main;
      x    = '';

      // Loop through each panel - [name, title]
      for (j = 0, plen = this._panes.length; j < plen; j += 1) {

          title = this._panes[j][0];
          key   = this._panes[j][1];

          out.key = key;
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
  this._view.pane = new Pane(main);
};

Ranger.prototype.add = function(object) {
  var first, itemData, self = this;

  // Add the item to the first pane
  itemData = this._addItem(object, this._view.pane);

  // Recursive function
  var addPane = function (itemData) {
    var item, pane, index;

    item = itemData[0];
    pane = itemData[1];
    index = self.findPane(pane.key);

    if (index > -1 && ++index < self._panes.length) {
      pane = self._panes[index];
      item.child = new Pane({
        title: pane[0],
        key: pane[1]
      });
      item.child.parent = item;
      addPane(self._addItem(object, item.child));
    }
  };

  addPane(itemData);

};

Ranger.prototype._addItem = function(object, pane) {
  var key, value, item, data, exists, force, self = this;
  key = pane.key;
  value = object[key];

  force = this.findPane(pane.key) >= this._panes.length - 1;

  if (! force) {
    pane.contents.forEach(function (el) {
      if (! exists && el.title === value && el.child) {
        exists = true;
        data = self._addItem(object, el.child);
      }
    });
  }

  if (! exists || force) {
    item = pane.contents.create({
      title: value
    });
    if (force) item.data = object;
  }

  return data || [item, pane];

};

module.exports = Ranger;

},{"../models/pane":4,"../views/ranger":9}],3:[function(_dereq_,module,exports){
'use strict';

var Base, Item, Items, Pane;

Base = _dereq_('base');
Pane = _dereq_('../models/pane');

// Item Model
Item = Base.Model.extend({

  defaults: {
    id: null,
    title: '',
    child: false,
    data: false
  },

  constructor: function (attrs) {
    Item.__super__.constructor.apply(this, arguments);
    if (typeof attrs.child !== 'undefined') {
      this.child = new Pane(attrs.child);
      this.child.parent = this;
    }
  }

});


// Item Collection
Items = Base.Collection.extend({

  model: Item

});

module.exports = Items;


},{"../models/pane":4,"base":10}],4:[function(_dereq_,module,exports){
'use strict';

var Base, Pane;

Base = _dereq_('base');

/*
 * Pane
 *
 * Represents a column
 *
 * - key (string) : item property name to display
 * - title (string) : the name of the column
 * - contents (item collection) : a collection of items
 */

Pane = Base.Model.extend({

  defaults: {
    key: '',
    title: '',
    contents: null
  },

  constructor: function (attrs) {
    var ItemCollection;

    Pane.__super__.constructor.apply(this, arguments);

    ItemCollection = _dereq_('../models/item');
    this.contents = new ItemCollection();

    if (attrs && attrs.contents) {
      this.contents.refresh(attrs.contents, true);
    }

    this.on('refresh', function (self) {
      self.contents = new ItemCollection();
    });
  }

});

module.exports = Pane;

},{"../models/item":3,"base":10}],5:[function(_dereq_,module,exports){
(function () {

    'use strict';

    module.exports = function (obj) {
        return obj.title;
    };

}());

},{}],6:[function(_dereq_,module,exports){
(function () {

    'use strict';

    module.exports = function (obj) {
        return '<div class=\"title\">' + obj.title + '</div><div class="items"></div>';
    };

}());

},{}],7:[function(_dereq_,module,exports){
'use strict';

var Base, Items, template, vent;

Base = _dereq_('base');

// Set globals
module.exports = function (_vent, _template) {
  if (vent === undefined) vent = _vent;
  if (template === undefined) template = _template;
  return Items;
};

Items = Base.View.extend({

  tagName: 'div',
  className: 'item',

  events: {
    'mousedown': 'click'
  },

  constructor: function () {
    this.click = this.click.bind(this);

    Items.__super__.constructor.apply(this, arguments);

    this.bind($('<' + this.tagName + ' class="' + this.className + '">'));

    this.listen([
      this.item, {
        'select': this.select.bind(this),
        'change:child': this.render.bind(this)
      },
      this.item.collection, {
        'remove': this.release.bind(this)
      }
    ]);
  },

  render: function () {
    this.el.html(template(this.item.toJSON()));
    this.el.toggleClass('hasChild', !! this.item.child);
    return this;
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


},{"base":10}],8:[function(_dereq_,module,exports){
'use strict';

var Base, Items, Panes, template, vent, SCROLL_OFFSET, SCROLL_HEIGHT;

Base  = _dereq_('base');
Items = _dereq_('../views/items')();

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
    Panes.__super__.constructor.apply(this, arguments);

    this.bind($('<' + this.tagName + ' class="' + this.className + '">'));

    this.active = null;

    this.listen([
      this.pane, {
        'remove':     this.remove.bind(this),
        'move:up':    this.up.bind(this),
        'move:down':  this.down.bind(this),
        'move:right': this.right.bind(this)
      },
      this.pane.contents, {
        'click:item': this.select.bind(this),
        'create:model': this.addOne.bind(this)
      }
    ]);

  },

  remove: function () {
    this.pane.contents.trigger('remove');
    this.release();
    delete this.items;
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
    this.pane.contents.forEach(this.addOne, this);
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

},{"../views/items":7,"base":10}],9:[function(_dereq_,module,exports){
'use strict';

var Base, Item, ItemView, Pane, PaneView, Ranger, template, vent;

Base = _dereq_('base');

// Global event passer
vent = new Base.Event();

// Templates
template = {
  pane: _dereq_('../templates/pane'),
  item: _dereq_('../templates/item')
};

// Intialise views
PaneView = _dereq_('../views/panes')(vent, template.pane);
ItemView = _dereq_('../views/items')(vent, template.item);

// Models
Pane  = _dereq_('../models/pane');
Item  = _dereq_('../models/item');

Ranger = Base.View.extend({

  constructor: function () {
    Ranger.__super__.constructor.apply(this, arguments);

    this.current = {
      pane: null,
       item: null
    };

    this.pane = new Pane();

    this.listen([
      this.pane, {
        'refresh': this.addOne.bind(this),
        'before:destroy': this.remove.bind(this)
      },
      vent, {
        'select:item': this.selectItem.bind(this),
        'select:pane': this.selectPane.bind(this),
        'show:pane': this.addOne.bind(this)
      }
    ]);

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
    vent.trigger('show:pane', item.child);
  },

  // Remove panes that aren't displayed
  recheck: function (pane) {
    var self = this;
    return pane.contents.forEach(function (item) {
      if (!item.child) {
        return;
      }
      item.child.trigger('remove');
      self.recheck(item.child);
    });
  },

  // Render a pane
  addOne: function (pane) {
    var view = new PaneView({
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

  // Select the first item in the first pane
  selectFirst: function () {
    var item = this.pane.contents.first();
    this.pane.contents.trigger('click:item', item);
  },

  // Move up
  up: function () {
    if (! this.current.pane) return this.selectFirst();
    this.current.pane.trigger('move:up');
  },

  // Move down
  down: function () {
    if (! this.current.pane) return this.selectFirst();
    this.current.pane.trigger('move:down');
  },

  // Move right
  right: function () {
    if (! this.current.pane) return;
    this.current.pane.trigger('move:right');
  },

  // Move left
  left: function () {
    var current, item, pane, _ref;
    current = this.current.pane;
    if (current === undefined || current.parent === undefined) return;
    item = this.current.pane.parent;
    pane = item.collection;
    pane.trigger('click:item', item);
  },

  // Return the selcted item
  open: function () {
    return this.current.item.data;
  }

});

module.exports = Ranger;

},{"../models/item":3,"../models/pane":4,"../templates/item":5,"../templates/pane":6,"../views/items":7,"../views/panes":8,"base":10}],10:[function(_dereq_,module,exports){
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
    return to;
  };

  // CoffeeScript extend for classes
  inherit = function (child, parent) {
    var Klass;

    include(child, parent);

    Klass = function () {
      this.constructor = child;
    };

    Klass.prototype = parent.prototype;
    child.prototype = new Klass();
    child.__super__ = parent.prototype;

    Klass = undefined;
    parent = undefined;

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

    attrs = undefined;
    parent = undefined;

    return child;
  };


  /*
   * EVENT
   */

  Event = function () {

    // Stores all the event handlers that others are listening to on us
    this._events = {};

    // Stores some of the event handlers that we are listening to on others
    this._listening = [];

  };

  // Bind an event to a function
  // Returns an event ID so you can unbind it later
  Event.prototype.on = function (_events, fn) {
    var i, len, event, events;

    // Allow multiple events to be set at once such as:
    // event.on('update change refresh', this.render);
    events = _events.split(' ');
    len = events.length;

    for (i = 0; i < len; i += 1) {
      event = events[i];

      // If the event has never been listened to before
      if (! this._events.hasOwnProperty(event)) {
        this._events[event] = [];
      }

      // Add the event handler
      this._events[event].push(fn);
    }

    // Return the arguments so they can be reused to unbind
    // the event handlers
    return arguments;
  };


  // Only run an event once and then remove the handler
  Event.prototype.once = function (event, fn) {
    var self, once;
    self = this;

    // Create a wrapper function that unbinds the event
    // and then runs the original function
    once = function () {
      self.off(event, once);
      fn.apply(this, arguments);
    };

    // So that you can use `fn` to unbind the event as well
    once._callback = fn;

    return this.on(event, once);
  };


  // Trigger an event
  Event.prototype.trigger = function (event) {
    var args, events, a1, a2, a3, i, len, ev;
    args = [].slice.call(arguments, 1);

    // Listen to all events
    if (event !== '*') {
      this.trigger('*', event, args);
    }

    // Don't do anything if there are not any events
    if (! this._events.hasOwnProperty(event)) {
      return;
    }

    i = -1;
    a1 = args[0];
    a2 = args[1];
    a3 = args[2];

    events = this._events[event];
    len = events.length;

    // Backbone.js does this and it seems pretty fast

    switch (args.length) {
      case 0:  while (++i < len) events[i].call(this); return;
      case 1:  while (++i < len) events[i].call(this, a1); return;
      case 2:  while (++i < len) events[i].call(this, a1, a2); return;
      case 3:  while (++i < len) events[i].call(this, a1, a2, a3); return;
      default: while (++i < len) events[i].apply(this, args); return;
    }

  };

  // Remove a listener from an event
  Event.prototype.off = function (events, fn) {
    var i, j, k, l, name, event, retain, handler;
    events = events.split(' ');
    l = events.length;

    // Go through each event specified
    for (i = 0; i < l; i += 1) {

      name = events[i];
      event = this._events[name];
      this._events[name] = retain = [];

      if (typeof fn !== 'undefined') {

        // Loop through each of the event handlers
        k = event.length;
        for (j = 0; j < k; j += 1) {

          handler = event[j];

          if (handler !== fn && handler._callback !== fn) {
            retain.push(event[j]);
          }
        }
      }
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
            event = events[event];
            obj.off.call(obj, event[0], event[1]);
          }
        }

      }
    }
    this._listening = [];
  };

  /*
   * VIEW
   */

  View = function (attrs) {
    View.__super__.constructor.apply(this, arguments);
    include(this, attrs);

    if (!this.ui) {
      this.ui = {};
    }

    if (!this.events) {
      this.events = {};
    }

    if (this.el) {
      this.bind();
    }

  };

  // Load Events
  inherit(View, Event);

  View.prototype.bind = function (el) {
    var selector, query, action, split, name, ui;

    // If el is not specified use this.el
    if (!el) { el = this.el; }

    // Convert strings into jQuery objects
    if (typeof el === 'string') {
      el = $(el);
    }

    this.el = el;

    // Clone the ui list so we can use it in sub classes
    if (! this._ui) {
      this._ui = include({}, this.ui);
    }

    this.ui = {};

    // Load UI elements
    for (name in this._ui) {
      if (this._ui.hasOwnProperty(name)) {
        this.ui[name] = el.find(this._ui[name]);
      }
    }

    // Bind events
    for (query in this.events) {
      if (this.events.hasOwnProperty(query)) {

        action = this.events[query];
        split = query.indexOf(' ');

        if (split > -1) {
          selector = query.slice(split + 1);
          el.on(query.slice(0, split), selector, this[action]);
        } else {
          el.on(query, this[action]);
        }

      }
    }

  };

  View.prototype.unbind = function (el) {
    var selector, query, action, split, name, event;

    // If el is not specified use this.el
    if (!el) { el = this.el; }

    // Delete elements
    delete this.ui;

    // Unbind events
    for (query in this.events) {
      if (this.events.hasOwnProperty(query)) {

        action = this.events[query];
        split = query.indexOf(' ');
        event = query.slice(0, split || undefined);

        if (split > -1) {
          selector = query.slice(split + 1);
          el.off(event, selector, this[action]);
        } else {
          el.off(event, this[action]);
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


  /*
   * MODEL
   */

  Model = function (attrs) {
    var set, get, key, self = this;

    // Call super
    Model.__super__.constructor.apply(this, arguments);

    // Set attributes
    if (!this.defaults) { this.defaults = {}; }
    this._data = {};
    include(this._data, this.defaults);

    // Merge attributes into the correct object
    // depending on whether the key is in the defaults object
    for (key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        if (this.defaults.hasOwnProperty(key)) {
          this._data[key] = attrs[key];
        } else {
          this[key] = attrs[key];
        }
      }
    }

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

  };

  // Load Events
  inherit(Model, Event);

  // Change a value
  Model.prototype.set = function (key, value, options) {
    if (! this.defaults.hasOwnProperty(key)) {
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
  Model.prototype.get = function(key) {
    if (this.defaults.hasOwnProperty(key)) {
      return this._data[key];
    }
    return this[key];
  };

  // Change multiple values
  Model.prototype.setAttributes = function (obj, options) {
    for (var key in obj) {
      this.set(key, obj[key], options);
    }
  };

  // Load data into the model
  Model.prototype.refresh = function (data, replace) {
    if (replace) {
      this._data = {};
      include(this._data, this.defaults);
    }
    include(this._data, data);
    this.trigger('refresh', this);
    return this;
  };

  // Destroy the model
  Model.prototype.destroy = function () {
    this.trigger('before:destroy', this);
    delete this._data;
    this.trigger('destroy', this);
    return this;
  };

  // Convert the class instance into a simple object
  Model.prototype.toJSON = function () {
    var key, json = {};
    for (key in this.defaults) {
      if (this.defaults.hasOwnProperty(key)) {
        json[key] = this._data[key];
      }
    }
    return json;
  };


  /*
   * COLLECTION
   */

  Collection = function () {
    Collection.__super__.constructor.apply(this, arguments);
    this.length  = 0;
    this._index  = 0;
    this._models = [];
    this._lookup = {};
  };

  // Load Events
  inherit(Collection, Event);

  // Generate a new id
  Collection.prototype._generateId = function () {
    return 'c' + this._index++;
  };

  // Parse id
  Collection.prototype._parseId = function (id) {
    var number;
    id = id.toString();
    number = parseInt(id.slice(1), 10);
    return isNaN(number) ? id : number;
  };

  // Update id
  // - id (number) : output from this.parseId()
  Collection.prototype._updateIndex = function (id) {
    if (id > this._index) {
      this._index = id + 1;
    }
  };

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
    var id, number, index;

    // Require model defaults to contain 'id'
    if (! model.defaults.hasOwnProperty('id')) {
      throw new Error('Base: Models in Collections must have a default id');
    }

    // Set ID
    if (model.id !== null && model.id !== undefined) {
      // Make sure we don't reuse an existing id
      id = this._parseId(model.id);
      this._updateIndex(id);
    } else {
      id = this._generateId();
      model.set('id', id, {silent: true});
    }

    // Add to collection
    model.collection = this;
    this._models.push(model);
    this._lookup[id] = model;
    this.length += 1;

    // Bubble events
    this._bubble(model);

    // Only trigger create if silent is not set
    if (!options || !options.silent) {
      this.trigger('create:model', model);
      this.trigger('change');
    }

  };


  // Hook into the events of a model and bubble them
  // up to this collection
  Collection.prototype._bubble = function (model) {

    var self, id;

    self = this;
    id = model.id;

    this.listen(model, {
      '*': function (event, args) {
        args = args.slice(0);
        args.unshift(event + ':model', model);
        self.trigger.apply(self, args);
      },
      'before:destroy': function () {
        self.remove(model);
      },
      'change:id': function (newId) {
        self._lookup[newId] = model;
        delete self._lookup[id];
        id = newId;
      }
    });

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

  /**
   * Collection::Move
   *
   * Reorder the collection.
   * Will place the model before the position.
   * This means that the model may not be at the position afterwards.
   *
   * - model (id|Model)
   * - pos (int)
   * > null
   */

  Collection.prototype.move = function (model, pos) {
    var index = this.indexOf(model);
    if (index === pos) { return; }
    if (index < pos) { pos--; }
    this._models.splice(index, 1);
    this._models.splice(pos, 0, model);
    this.trigger('change:order');
    this.trigger('change');
  };

  // Append or replace the data in the collection
  // Doesn't trigger any events when updating the array apart from 'refresh'
  Collection.prototype.refresh = function (data, replace) {
    var i, len;
    if (replace) { this.deleteAll(); }
    for (i = 0, len = data.length; i < len; i += 1) {
      this.create(data[i], { silent: true });
    }
    return this.trigger('refresh');
  };

  Collection.prototype.deleteAll = function () {
    this._models = [];
    this._lookup = {};
    this.length = 0;
  };

  // Get a range from the collection
  Collection.prototype.slice = function (begin, end) {
    return this._models.slice(begin, end);
  };

  // Loop over each record in the collection
  Collection.prototype.forEach = function (callback, _this) {
    return this._models.forEach(callback, _this);
  };

  // Filter the models
  Collection.prototype.filter = function (callback, _this) {
    return this._models.filter(callback, _this);
  };

  // Sort the models. Does not alter original order
  Collection.prototype.sort = function (fn) {
    return this._models.sort(fn);
  };

  // Get an array of all the properties from the models
  Collection.prototype.pluck = function(property) {
    var i, len = this.length, array = [];
    for (i = 0; i < len; i += 1) {
      array.push(this._models[i][property]);
    }
    return array;
  };

  // Get the index of the item
  Collection.prototype.indexOf = function (model) {
    var type = typeof model;
    if (type === 'string' || type === 'number') {
      // Convert model id to actual model
      return this.indexOf(this.get(model));
    }
    return this._models.indexOf(model);
  };

  // Convert the collection into an array of objects
  Collection.prototype.toJSON = function () {
    var i, len, record, results = [];
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
    return this._lookup[id];
  };

  // Return a specified record in the collection
  Collection.prototype.at = function (index) {
    return this._models[index];
  };

  // Check if a model exists in the collection
  Collection.prototype.exists = function (model) {
    return this.indexOf(model) > -1;
  };


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

},{}]},{},[1])
(1)
});