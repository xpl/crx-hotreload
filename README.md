# Chrome Extension Hot Reloader

Watches for file changes in an extension's directory (by constantly polling file contents via XHR requests). When a change detected, it reloads the extension and refreshes the active tab (to re-trigger updated content scripts).

## How to use

1. Drop [`hot-reload.js`](https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js) and [`hot-reload-background.js`](https://github.com/xpl/crx-hotreload/blob/master/hot-reload-background.js) to your extension's directory.

2. Edit the `manifest.json` this way:

```json
    "permissions": ["contextMenus", "tabs", "activeTab"],

    "content_scripts": [{ "js": ["hot-reload.js"] }],
    
    "background": { "scripts": ["hot-reload-background.js"] }
```
