
(function() {

  var Base = require('base');
  var Ranger = require('../../bin/controllers/ranger');

  window.ranger = new Ranger({
    el: $('.ranger')
  });

  var items = require('./data.json');
  var panes = [
    ['Artists', 'ArtistName'],
    ['Albums', 'AlbumName'],
    ['Songs', 'Name']
  ];

  ranger.loadRaw(items, panes);

  openItem = function () {
    var item = ranger.open();
    if (!item) { return; }
    console.log(item);
  };

  document.onkeydown = function (e) {

    switch (e.keyCode) {
      case 13:
        openItem();
        break;

      case 37:
        ranger.left();
        break;

      case 38:
        ranger.up();
        break;

      case 39:
        ranger.right();
        break;

      case 40:
        ranger.down();
        break;

    }

    if (e.keyCode >= 37 && e.keyCode <= 40) {
      e.preventDefault();
      return false;
    }

  };

}());
