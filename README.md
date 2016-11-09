# Chrome Extension Hot Reloader

Watches for file changes in an extension's directory. When a change detected, it reloads the extension and refreshes the active tab (to re-trigger updated content scripts).

## Features

- Works by checking timestamps of files
- Supports nested directories
- Automatically disables itself in the production configuration

## How to use

1. Drop [`hot-reload.js`](https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js) to your extension's directory.

2. Edit your `manifest.json` this way:

```json
    "permissions": ["tabs", "activeTab"],
    
    "background": { "scripts": ["hot-reload.js"] }
```

You can also simply clone this repository and use it as a boilerplate for your extension.
