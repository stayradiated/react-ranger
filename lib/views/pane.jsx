var React = require('react/addons');
var ItemList = require('./itemList');
var classList = React.addons.classList;
var Directory = require('../models/directory');

var Pane = React.createClass({

  render: function () {
    var list = '';

    if (this.props.item) {
      if (this.props.item instanceof Directory) {
        list = <ItemList contents={this.props.item.contents} active={this.props.active} />;
      } else {
        list = (
          <h1>{this.props.item.name}</h1>
        );
      }
    }

    var classes = this.props.type + '-pane pane';

    return (
      <div className={classes}>
        {list}
      </div>
    );
  }

});

module.exports = Pane;
