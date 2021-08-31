# PostCSS Plugin Border 1px

[PostCSS] plugin to resolve 1px border in mobile app.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
  border: 1px solid red;
  border-radius: 2px;
}
```
will be processed to:

```css
@media (-webkit-min-device-pixel-ratio: 1), (min-device-pixel-ratio: 1) {
  .foo:after {
    border: 1px solid red;
    -webkit-border-radius: 2px;
	  border-radius: 2px;
    position: absolute;
    content: ' ';
    top: 0;
    left: 0;
    -webkit-transform-origin: top left;
    transform-origin: top left;
    width: 100%;
    height: 100%;
    -webkit-transform: scale(1);
    transform: scale(1);
    pointer-events: none;
  }
}
  
  
@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .foo:after {
    border: 1px solid red;
    -webkit-border-radius: 4px;
	  border-radius: 4px;
    position: absolute;
    content: ' ';
    top: 0;
    left: 0;
    -webkit-transform-origin: top left;
    transform-origin: top left;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    pointer-events: none;
  }
}
  
  
@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
  .foo:after {
    border: 1px solid red;
    -webkit-border-radius: 6px;
	  border-radius: 6px;
    position: absolute;
    content: ' ';
    top: 0;
    left: 0;
    -webkit-transform-origin: top left;
    transform-origin: top left;
    width: 300%;
    height: 300%;
    -webkit-transform: scale(0.3333333333333333);
    transform: scale(0.3333333333333333);
    pointer-events: none;
  }
}

.foo {
  position:relative;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-plugin-border-1px
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-plugin-border-1px'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage


## Options

### `ignoreCommentText`
By default, plugin use `no` comment to ignore process.
You can config your own ignore comment by `ignoreCommentText` option:

```js
require('postcss-plugin-border-1px')({
  ignoreCommentText: 'your config'
})
```
