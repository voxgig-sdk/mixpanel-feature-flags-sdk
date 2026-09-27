<?php
declare(strict_types=1);

// Typed models for the MixpanelFeatureFlags SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Flag entity data model. */
class Flag
{
    public ?string $experiment_id = null;
    public ?bool $is_experiment_active = null;
    public ?bool $is_qa_tester = null;
    public string $variant_key;
    public mixed $variant_value;
}

/** Request payload for Flag#load. */
class FlagLoadMatch
{
    public string $context;
    public ?string $project_id = null;
    public ?string $token = null;
}

/** GetFlagDefinition entity data model. */
class GetFlagDefinition
{
    public string $context;
    public ?string $experiment_id = null;
    public string $id;
    public ?bool $is_experiment_active = null;
    public string $key;
    public string $name;
    public int $project_id;
    public array $ruleset;
    public string $status;
    public int $workspace_id;
}

/** Request payload for GetFlagDefinition#list. */
class GetFlagDefinitionListMatch
{
    public ?string $project_id = null;
    public ?string $token = null;
}

