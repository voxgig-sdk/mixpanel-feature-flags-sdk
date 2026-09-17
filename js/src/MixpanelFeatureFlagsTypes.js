// Typed models for the MixpanelFeatureFlags SDK (JSDoc typedefs).
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
// edit by hand.

/**
 * @typedef {Object} Definition
 * @property {string} context
 * @property {string} [experiment_id]
 * @property {string} id
 * @property {boolean} [is_experiment_active]
 * @property {string} key
 * @property {string} name
 * @property {number} project_id
 * @property {Object} ruleset
 * @property {string} status
 * @property {number} workspace_id
 */

/**
 * @typedef {Object} DefinitionListMatch
 * @property {string} [project_id]
 * @property {string} [token]
 */

/**
 * @typedef {Object} Flag
 * @property {string} [experiment_id]
 * @property {boolean} [is_experiment_active]
 * @property {boolean} [is_qa_tester]
 * @property {string} variant_key
 * @property {*} variant_value
 */

/**
 * @typedef {Object} FlagLoadMatch
 * @property {string} context
 * @property {string} [project_id]
 * @property {string} [token]
 */

