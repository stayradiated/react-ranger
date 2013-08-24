(function() {

  window.ranger = new Ranger({
    el: $('.ranger')
  });

  var panes = [
    ['Artists', 'ArtistName'],
    ['Albums', 'AlbumName'],
    ['Songs', 'Name']
  ];

  ranger.loadRaw(items, panes);

  window.stressTest = function () {
    var state = true;
    var i = 0;
    var count = 100;
    var repeat = function() {
      console.log('refresh', i, state);
      if (state) {
        state = false;
        panes = [
          ['Artists', 'ArtistName'],
          ['Songs', 'Name']
        ];
      } else {
        state = true;
        panes = [
          ['Albums', 'AlbumName'],
          ['Songs', 'Name']
        ];
      }
      ranger.loadRaw(items, panes);
      if (i++ < count) { setTimeout(repeat, 1000); }
    };
    repeat();
  };

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
