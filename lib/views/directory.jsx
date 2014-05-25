var React = require('react');

var Directory = React.createClass({

  render: function () {
    return (
      <div className='directory'>
        {this.props.item.name}
      </div>
    );
  }

});

module.exports = Directory;
