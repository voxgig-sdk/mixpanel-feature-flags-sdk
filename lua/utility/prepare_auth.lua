-- MixpanelFeatureFlags SDK utility: prepare_auth

local vs = require("utility.struct.struct")

local HEADER_AUTH = "authorization"
local OPTION_APIKEY = "apikey"
local OPTION_SECRET = "secret"
local NOT_FOUND = "__NOTFOUND__"

local B64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"


local function base64(text)
  local out = {}
  local size = #text
  local index = 1

  while index <= size do
    local rest = size - index + 1
    local a = string.byte(text, index)
    local b = string.byte(text, index + 1) or 0
    local c = string.byte(text, index + 2) or 0
    local word = (a << 16) | (b << 8) | c

    local chunk = {}
    for shift = 18, 0, -6 do
      local at = (word >> shift) & 0x3f
      chunk[#chunk + 1] = string.sub(B64_ALPHABET, at + 1, at + 1)
    end

    -- One trailing source byte yields two characters and "==", two yield
    -- three and "=".
    if rest == 1 then
      chunk[3] = "="
      chunk[4] = "="
    elseif rest == 2 then
      chunk[4] = "="
    end

    out[#out + 1] = table.concat(chunk)
    index = index + 3
  end

  return table.concat(out)
end


local function prepare_auth_util(ctx)
  local spec = ctx.spec
  if spec == nil then
    return nil, ctx:make_error("auth_no_spec",
      "Expected context spec property to be defined.")
  end

  local headers = spec.headers
  local options = ctx.client:options_map()

  -- Public APIs that need no auth omit the options.auth block entirely.
  if options.auth == nil then
    headers[HEADER_AUTH] = nil
    return spec, nil
  end

  local apikey = vs.getprop(options, OPTION_APIKEY, NOT_FOUND)

  -- True HTTP Basic Auth needs TWO credentials, base64-joined - a single
  -- token in the header (the branch below) can never authenticate against
  -- an API that actually checks "Authorization: Basic base64(user:pass)".
  if vs.getpath(options, "auth.basic") == true then
    local secret = vs.getprop(options, OPTION_SECRET, NOT_FOUND)

    if apikey == nil or secret == nil
      or (type(apikey) == "string" and (apikey == NOT_FOUND or apikey == ""))
      or (type(secret) == "string" and (secret == NOT_FOUND or secret == ""))
    then
      headers[HEADER_AUTH] = nil
    else
      local auth_prefix = ""
      local ap = vs.getpath(options, "auth.prefix")
      if type(ap) == "string" then
        auth_prefix = ap
      end
      local joined = base64(tostring(apikey) .. ":" .. tostring(secret))
      if auth_prefix == "" then
        headers[HEADER_AUTH] = joined
      else
        headers[HEADER_AUTH] = auth_prefix .. " " .. joined
      end
    end

    return spec, nil
  end

  if apikey == nil
    or (type(apikey) == "string" and (apikey == NOT_FOUND or apikey == ""))
  then
    headers[HEADER_AUTH] = nil
  else
    local auth_prefix = ""
    local ap = vs.getpath(options, "auth.prefix")
    if type(ap) == "string" then
      auth_prefix = ap
    end
    local apikey_val = ""
    if type(apikey) == "string" then
      apikey_val = apikey
    end
    -- Empty prefix (raw apiKey credential) must not add a leading space.
    if auth_prefix == "" then
      headers[HEADER_AUTH] = apikey_val
    else
      headers[HEADER_AUTH] = auth_prefix .. " " .. apikey_val
    end
  end

  return spec, nil
end

return prepare_auth_util
