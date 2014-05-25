var React = require('react');
var Pane = require('./pane');

var Ranger = React.createClass({

  render: function () {
    console.log(JSON.stringify(this.props.data, null, 2));
    return (
      <div className='ranger'>
        <Pane />
        <Pane />
        <Pane />
      </div>
    );
  }

});

module.exports = Ranger;
