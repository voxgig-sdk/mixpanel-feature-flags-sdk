# Typed models for the MixpanelFeatureFlags SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class DefinitionRequired(TypedDict):
    context: str
    id: str
    key: str
    name: str
    project_id: int
    ruleset: dict
    status: str
    workspace_id: int


class Definition(DefinitionRequired, total=False):
    experiment_id: str
    is_experiment_active: bool


class DefinitionListMatch(TypedDict, total=False):
    project_id: str
    token: str


class FlagRequired(TypedDict):
    variant_key: str
    variant_value: Any


class Flag(FlagRequired, total=False):
    experiment_id: str
    is_experiment_active: bool
    is_qa_tester: bool


class FlagLoadMatchRequired(TypedDict):
    context: str


class FlagLoadMatch(FlagLoadMatchRequired, total=False):
    project_id: str
    token: str
