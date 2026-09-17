
const { test, describe } = require('node:test')
const { equal } = require('node:assert')


const { MixpanelFeatureFlagsSDK } = require('..')


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await MixpanelFeatureFlagsSDK.test()
    equal(null !== testsdk, true)
  })

})
