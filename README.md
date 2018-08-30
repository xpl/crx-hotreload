# Chrome Extension Hot Reloader

Watches for file changes in your extension's directory. When a change is detected, it reloads the extension and refreshes the active tab (to re-trigger the updated scripts).

Here's [a blog post explaining it](https://60devs.com/hot-reloading-for-chrome-extensions.html) (thanks to [KingOfNothing](https://habrahabr.ru/users/KingOfNothing/) for the translation).

## Features

- Works by checking timestamps of files
- Supports nested directories
- Automatically disables itself in production

## How to use

1. Drop [`hot-reload.js`](https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js) to your extension's directory.

2. Put the following into your `manifest.json` file:

```json
    "background": { "scripts": ["hot-reload.js"] }
```

Also, you can simply clone this repository and use it as a boilerplate for your extension.

## TODO

- [ ] See https://github.com/xpl/crx-hotreload/issues/5 (a feedback needed)

- [ ] Make it `import`able from the [NPM module](https://www.npmjs.com/package/crx-hotreload), as it's suggested [here](https://stackoverflow.com/questions/2963260/how-do-i-auto-reload-a-chrome-extension-im-developing/40454227#comment79536659_40454227). I think a `require` would work now, as it executes the script, but not sure about the `import`... May need to tweak code a little bit.
