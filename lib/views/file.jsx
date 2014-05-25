var React = require('react');

var File = React.createClass({

  render: function () {
    return (
      <div className='file'>
        {this.props.item.name}
      </div>
    );
  }

});

module.exports = File;
