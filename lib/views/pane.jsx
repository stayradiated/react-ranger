var _ = require('lodash');
var React = require('react');
var File = require('./file');
var Directory = require('./directory');

var Pane = React.createClass({

  getInitialState: function () {
    return {
      index: 0
    };
  },

  up: function () {
    this.setState({
      index: Math.max(this.state.index - 1, 0)
    });
  },

  down: function () {
    this.setState({
      index: Math.min(this.state.index + 1, this.props.contents.length - 1)
    });
  },

  getSelected: function () {
    return this.props.content[this.state.index];
  },

  render: function () {
    var contents = this.props.contents.map(function (item, i) {
      var isActive = (i === this.state.index);
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
