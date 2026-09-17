# MixpanelFeatureFlags SDK exists test

import pytest
from mixpanelfeatureflags_sdk import MixpanelFeatureFlagsSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = MixpanelFeatureFlagsSDK.test(None, None)
        assert testsdk is not None
