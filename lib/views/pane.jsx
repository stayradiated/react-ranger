var _ = require('lodash');
var React = require('react');
var File = require('./file');
var Directory = require('./directory');

var Pane = React.createClass({

  render: function () {
    var contents = this.props.contents.map(function (item, i) {
      var isActive = (item === this.props.active);
      if (item.type === 'directory') {
        return <Directory key={i} item={item} active={isActive} />;
      } else {
        return <File key={i} item={item} active={isActive} />;
      }
    }, this);

    return (
      <div className='pane'>
        {contents}
      </div>
    );
  }

});

module.exports = Pane;
