const postcss = require('postcss')

const plugin = require('./')

async function run(input, output, opts = { ignoreCommentText: 'no' }) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined
  })
  expect(result.css.replace(/[ ]/g, '').replace(/[\r\n]/g, '')).toBe(output)
  expect(result.warnings()).toHaveLength(0)
}

it(`dont't resolve`, async () => {
  await run(
    `.a { color: red; border: 2px solid red; }`,
   `.a{color:red;border:2pxsolidred;}`)
})

it('resolve border 1px', async () => {
  await run(
    `.a { color: red; border: 1px solid red; }`,
   `@media(-webkit-min-device-pixel-ratio:1),(min-device-pixel-ratio:1){.a:after{border:1pxsolidred;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:100%;height:100%;-webkit-transform:scale(1);transform:scale(1);pointer-events:none;}}@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2){.a:after{border:1pxsolidred;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:200%;height:200%;-webkit-transform:scale(0.5);transform:scale(0.5);pointer-events:none;}}@media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){.a:after{border:1pxsolidred;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:300%;height:300%;-webkit-transform:scale(0.3333333333333333);transform:scale(0.3333333333333333);pointer-events:none;}}.a{color:red;position:relative;}`)
})

it('resolve no comment', async () => {
  await run(
    `.a {
      color: red;
        border: 1px solid red; /*no*/
    }`,
    `.a{color:red;border:1pxsolidred;/*no*/}`
  )
})

it('resolve other comment', async () => {
  await run(
    `.a {
      color: red;
        border: 1px solid red; /*ignore*/
    }`,
    `.a{color:red;border:1pxsolidred;/*ignore*/}`,
    { ignoreCommentText: 'ignore' }
  )
})

it('resolve ignore comment text', async () => {
  await run(
    `.a {
      color: red;
        border: 1px solid red; /*no*/
    }`,
    `.a{color:red;border:1pxsolidred;/*no*/}`
  )
})

it('resolve other comment text with opts', async () => {
  await run(
    `.a {
      color: red;
        border: 1px solid red; /*other*/
    }`,
    `.a{color:red;border:1pxsolidred;/*other*/}`,
    { ignoreCommentText: 'ignore' }
  )
})

it('resolve after pseudo with no comment', async () => {
  await run(
    `.a:after {
      color: red;
        border: 1px solid red; /*no*/
    }`,
    `.a:after{color:red;border:1pxsolidred;/*no*/}`
  )
})

it('resolve before pseudo', async () => {
  await run(
    `.a:before {
      color: red;
        border: 1px solid red;
    }`,
    `.a:before{color:red;border:1pxsolidred;}`
  )
})

it('resolve border 1px & border-radius with px unit', async () => {
  await run(
    `.a {
      color: red;
        border: 1px solid red;
  	    border-radius: 2px;
    }`,
    `@media(-webkit-min-device-pixel-ratio:1),(min-device-pixel-ratio:1){.a:after{border:1pxsolidred;-webkit-border-radius:2px;border-radius:2px;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:100%;height:100%;-webkit-transform:scale(1);transform:scale(1);pointer-events:none;}}@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2){.a:after{border:1pxsolidred;-webkit-border-radius:4px;border-radius:4px;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:200%;height:200%;-webkit-transform:scale(0.5);transform:scale(0.5);pointer-events:none;}}@media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){.a:after{border:1pxsolidred;-webkit-border-radius:6px;border-radius:6px;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:300%;height:300%;-webkit-transform:scale(0.3333333333333333);transform:scale(0.3333333333333333);pointer-events:none;}}.a{color:red;position:relative;}`
  )
})

it('resolve border 1px & border-radius with % unit', async () => {
  await run(
    `.a {
      color: red;
        border: 1px solid red;
  	    border-radius: 50%;
    }`,
    `@media(-webkit-min-device-pixel-ratio:1),(min-device-pixel-ratio:1){.a:after{border:1pxsolidred;-webkit-border-radius:50%;border-radius:50%;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:100%;height:100%;-webkit-transform:scale(1);transform:scale(1);pointer-events:none;}}@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2){.a:after{border:1pxsolidred;-webkit-border-radius:50%;border-radius:50%;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:200%;height:200%;-webkit-transform:scale(0.5);transform:scale(0.5);pointer-events:none;}}@media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){.a:after{border:1pxsolidred;-webkit-border-radius:50%;border-radius:50%;position:absolute;content:'';top:0;left:0;-webkit-transform-origin:topleft;transform-origin:topleft;width:300%;height:300%;-webkit-transform:scale(0.3333333333333333);transform:scale(0.3333333333333333);pointer-events:none;}}.a{color:red;position:relative;}`
  )
})
