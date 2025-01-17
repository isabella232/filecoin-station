const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path')

const tmp = require('tmp')

if (process.env.CI === 'true') test.setTimeout(120000) // slow ci

// Running test cases one after another
// More examples: https://playwright.dev/docs/api/class-electron
test.describe.serial('Application launch', async () => {
  test('example: start and inspect UI window title', async () => {
    // Launch Electron app against sandbox fake HOME dir
    const userData = tmp.dirSync({ prefix: 'tmp_home_', unsafeCleanup: true }).name
    const electronApp = await electron.launch({
      args: [path.join(__dirname, '..', '..', 'src', 'index.js')],
      env: Object.assign({}, process.env, {
        NODE_ENV: 'test',
        HOME: userData
      })
    })

    // Evaluation expression in the Electron context.
    /*
    const appPath = await electronApp.evaluate(async ({ app }) => {
      return app.getAppPath()
    })
    console.log(appPath)
    */

    // Get the first window that the app opens, wait if necessary.
    const window = await electronApp.firstWindow()

    // See what you can do with 'window':
    // https://playwright.dev/docs/api/class-electronapplication#electron-application-first-window
    // https://playwright.dev/docs/api/class-page

    expect(await window.url()).toBe('https://filecoin.io/')

    // Direct Electron console to Node terminal.
    window.on('console', console.log)

    // Exit app.
    electronApp.close()
  })
})
