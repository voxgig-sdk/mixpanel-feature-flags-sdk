# MixpanelFeatureFlags SDK utility: make_context

from projectname_sdk.core.context import MixpanelFeatureFlagsContext


def make_context_util(ctxmap, basectx):
    return MixpanelFeatureFlagsContext(ctxmap, basectx)
