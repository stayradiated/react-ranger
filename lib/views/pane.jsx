var React = require('react');
var Directory = require('./directory');
var File = require('./file');

var Pane = React.createClass({

  render: function () {
    var contents = this.props.contents.map(function (item, i) {
      if (item.type === 'directory') {
        return <Directory key={i} item={item} />;
      } else {
        return <File key={i} item={item} />;
      }
    });

    return (
      <div className='pane'>
        {contents}
      </div>
    );
  }

});

module.exports = Pane;
