(function() {

  var ranger = new Ranger({
    el: $('.ranger')
  });

  window._ranger = ranger;

  var panes = [
    ['Artists', 'ArtistName'],
    ['Albums', 'AlbumName'],
    ['Songs', 'Name']
  ];

  ranger.setPanes(panes);
  // ranger.load(items);

  for (var i = 0; i < items.length; i++) {
    ranger.add(items[i]);
  }

  openItem = function () {
    var item = ranger.open();
    if (!item) { return; }
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
