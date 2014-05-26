var React = require('react/addons');
var classSet = React.addons.classSet;

var Directory = React.createClass({

  render: function () {
    var classes = classSet({
      directory: true,
      active: this.props.active
    });

    return (
      <div className={classes}>
        {this.props.item.name}
      </div>
    );
  }

});

module.exports = Directory;
