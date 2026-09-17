# MixpanelFeatureFlags SDK feature factory

from mixpanelfeatureflags_sdk.feature.base_feature import MixpanelFeatureFlagsBaseFeature
from mixpanelfeatureflags_sdk.feature.debug_feature import MixpanelFeatureFlagsDebugFeature
from mixpanelfeatureflags_sdk.feature.idempotency_feature import MixpanelFeatureFlagsIdempotencyFeature
from mixpanelfeatureflags_sdk.feature.metrics_feature import MixpanelFeatureFlagsMetricsFeature
from mixpanelfeatureflags_sdk.feature.paging_feature import MixpanelFeatureFlagsPagingFeature
from mixpanelfeatureflags_sdk.feature.ratelimit_feature import MixpanelFeatureFlagsRatelimitFeature
from mixpanelfeatureflags_sdk.feature.retry_feature import MixpanelFeatureFlagsRetryFeature
from mixpanelfeatureflags_sdk.feature.test_feature import MixpanelFeatureFlagsTestFeature
from mixpanelfeatureflags_sdk.feature.timeout_feature import MixpanelFeatureFlagsTimeoutFeature


_FEATURES = {
    "base": lambda: MixpanelFeatureFlagsBaseFeature(),
    "debug": lambda: MixpanelFeatureFlagsDebugFeature(),
    "idempotency": lambda: MixpanelFeatureFlagsIdempotencyFeature(),
    "metrics": lambda: MixpanelFeatureFlagsMetricsFeature(),
    "paging": lambda: MixpanelFeatureFlagsPagingFeature(),
    "ratelimit": lambda: MixpanelFeatureFlagsRatelimitFeature(),
    "retry": lambda: MixpanelFeatureFlagsRetryFeature(),
    "test": lambda: MixpanelFeatureFlagsTestFeature(),
    "timeout": lambda: MixpanelFeatureFlagsTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
