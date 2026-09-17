package core

type MixpanelFeatureFlagsError struct {
	IsMixpanelFeatureFlagsError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewMixpanelFeatureFlagsError(code string, msg string, ctx *Context) *MixpanelFeatureFlagsError {
	return &MixpanelFeatureFlagsError{
		IsMixpanelFeatureFlagsError: true,
		Sdk:              "MixpanelFeatureFlags",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *MixpanelFeatureFlagsError) Error() string {
	return e.Msg
}
