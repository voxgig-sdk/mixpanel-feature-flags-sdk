-- MixpanelFeatureFlags SDK error

local MixpanelFeatureFlagsError = {}
MixpanelFeatureFlagsError.__index = MixpanelFeatureFlagsError


function MixpanelFeatureFlagsError.new(code, msg, ctx)
  local self = setmetatable({}, MixpanelFeatureFlagsError)
  self.is_sdk_error = true
  self.sdk = "MixpanelFeatureFlags"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function MixpanelFeatureFlagsError:error()
  return self.msg
end


function MixpanelFeatureFlagsError:__tostring()
  return self.msg
end


return MixpanelFeatureFlagsError
