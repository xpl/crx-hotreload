# Chrome Extension Hot Reloader

Watches for file changes in an extension's directory. When a change detected, it reloads the extension and refreshes the active tab (to re-trigger updated content scripts).

## Features

- Works by checking timestamps of files
- Supports nested directories
- Automatically disables itself in production build

## How to use

1. Drop [`hot-reload.js`](https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js) and [`hot-reload-background.js`](https://github.com/xpl/crx-hotreload/blob/master/hot-reload-background.js) to your extension's directory.

2. Edit your `manifest.json` this way (see the [example](https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js) here):

```json
    "permissions": ["tabs", "activeTab"],

    "content_scripts": [{ "js": ["hot-reload.js"] }],
    
    "background": { "scripts": ["hot-reload-background.js"] }
```
