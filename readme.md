# Ranger

> a column browser for javascript objects

Uses React.

## Usage

```javscript
var React = require('react');
var Ranger = require('ranger');

var files = [
    'code/test.txt',
    'code/makefile',
    'readme.md',
];

React.renderComponent(new Ranger({
    data: Ranger.parseList(files),
    onExecute: function (item) {
        console.log('opening', item);
    }
}, document.body);
```
