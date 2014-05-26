var React = require('react');
var Pane = require('./pane');
var $ = require('jquery');

var Ranger = React.createClass({

  getInitialState: function () {
    return {
      active: null
    };
  },

  focus: function () {
    $(this.refs.input.getDOMNode()).focus();
  },

  handleKeyDown: function (e) {
    switch (e.keyCode) {
      case 37: // left
        break;
      case 38: // up
        this.refs.pane.up();
        break;
      case 39: // right
        break;
      case 40: // down
        this.refs.pane.down();
        break;
    }
  },

  render: function () {
    return (
      <div className='ranger' onClick={this.focus}>
        <Pane contents={this.props.data} ref='pane' />
        <input type='text' ref='input' onKeyDown={this.handleKeyDown} />
      </div>
    );
  }

});

module.exports = Ranger;
