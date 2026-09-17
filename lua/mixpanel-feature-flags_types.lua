-- Typed models for the MixpanelFeatureFlags SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Definition
---@field context string
---@field experiment_id? string
---@field id string
---@field is_experiment_active? boolean
---@field key string
---@field name string
---@field project_id number
---@field ruleset table
---@field status string
---@field workspace_id number

---@class DefinitionListMatch
---@field project_id? string
---@field token? string

---@class Flag
---@field experiment_id? string
---@field is_experiment_active? boolean
---@field is_qa_tester? boolean
---@field variant_key string
---@field variant_value any

---@class FlagLoadMatch
---@field context string
---@field project_id? string
---@field token? string

local M = {}

return M
