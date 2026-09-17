// Typed models for the MixpanelFeatureFlags SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Definition {
  context: string
  experiment_id?: string
  id: string
  is_experiment_active?: boolean
  key: string
  name: string
  project_id: number
  ruleset: Record<string, any>
  status: string
  workspace_id: number
}

export interface DefinitionListMatch {
  project_id?: string
  token?: string
}

export interface Flag {
  experiment_id?: string
  is_experiment_active?: boolean
  is_qa_tester?: boolean
  variant_key: string
  variant_value: any
}

export interface FlagLoadMatch {
  context: string
  project_id?: string
  token?: string
}

