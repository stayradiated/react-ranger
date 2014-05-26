var React = require('react');
var classSet = React.addons.classSet;

var File = React.createClass({

  render: function () {
    var classes = classSet({
      file: true,
      active: this.props.active
    });

    return (
      <div className={classes}>
        {this.props.item.name}
      </div>
    );
  }

});

module.exports = File;
