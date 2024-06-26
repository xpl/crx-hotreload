# Chrome Extension Hot Reloader

> [!IMPORTANT]  
> Does not work with Manifest Version 3, as Chrome has recently removed the APIs essential for working with file system from background scripts: https://stackoverflow.com/questions/65975659/how-do-i-get-access-to-all-the-files-in-the-extension-in-chrome-extension-manife/65976345 :(

Watches for file changes in your extension's directory. When a change is detected, it reloads the extension and refreshes the active tab (to re-trigger the updated scripts).

Here's [a blog post explaining it](https://60devs.com/hot-reloading-for-chrome-extensions.html) (thanks to [KingOfNothing](https://habrahabr.ru/users/KingOfNothing/) for the translation).

## Features

- Works by checking timestamps of files
- Supports nested directories
- Automatically disables itself in production
- And it's under a <a href="https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js">40 lines of code</a>!

## How To Use

1. Drop [`hot-reload.js`](https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js) to your extension's directory.

2. Put the following into your `manifest.json` file:

```json
    "background": { "scripts": ["hot-reload.js"] }
```

Also, you can simply clone this repository and use it as a boilerplate for your extension.

## Installing From NPM

It is also available as NPM module:

```
npm install crx-hotreload
```

Then use a `require` (or `import`) to execute the script.
