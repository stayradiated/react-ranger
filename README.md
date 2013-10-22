Ranger
======

_A column browser for JavaScript objects_

Basically this but for browsers:

![](./assets/finder.png)

It's similar to the terminal app of the same name.

![](./assets/ranger.png)

## Technical Details

    <pane:model> {
      title: 'First Pane'
      key: 'a'
      contents: <item:collection> [
        <item:model> {
          title: '1'
        }
        <item:model> {
          title: '2'
          child: <pane:model> {
            title: 'Second Pane'
            key: 'b'
            contents: <item:collection> [
              <item:model> {
                title: 'b - 1'
              }
            ]
          }
        }
      ]
    }
