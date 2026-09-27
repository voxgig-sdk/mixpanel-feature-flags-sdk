
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { MixpanelFeatureFlagsSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = MixpanelFeatureFlagsSDK.test()
    equal(testsdk instanceof MixpanelFeatureFlagsSDK, true,
      'MixpanelFeatureFlagsSDK.test() must return a client synchronously')
  })

})
