# Ranger

> a column browser for javascript objects

Uses React.

## Structure

```json
{
    "type": "folder",
    "name": "root",
    "contents": [
        {
            "type": "folder",
            "name": "bin",
            "contents": [ ... ]
        },
        {
            "type": "folder",
            "name": "etc",
            "contents": [ ... ]
        },
        {
            "type": "folder",
            "name": "home",
            "contents": [
                {
                    "type": "folder",
                    "name": "stayradiated",
                    "contents": [
                        "type": "folder",
                        "name": ".vim",
                        "contents": [ ... ]
                    ]
                },
                {
                    "type": "file",
                    "name": ".vimrc"
                },
                {
                    "type": "file",
                    "name": ".zshrc"
                }
            ]
        }
    ]
}
```
