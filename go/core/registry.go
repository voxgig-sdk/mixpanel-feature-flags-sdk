package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewDebugFeatureFunc func() Feature

var NewIdempotencyFeatureFunc func() Feature

var NewMetricsFeatureFunc func() Feature

var NewPagingFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewDefinitionEntityFunc func(client *MixpanelFeatureFlagsSDK, entopts map[string]any) MixpanelFeatureFlagsEntity

var NewFlagEntityFunc func(client *MixpanelFeatureFlagsSDK, entopts map[string]any) MixpanelFeatureFlagsEntity

