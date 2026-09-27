package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/mixpanel-feature-flags-sdk/go"
	"github.com/voxgig-sdk/mixpanel-feature-flags-sdk/go/core"

	vs "github.com/voxgig-sdk/mixpanel-feature-flags-sdk/go/utility/struct"
)

func TestGetFlagDefinitionEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.GetFlagDefinition(nil)
		if ent == nil {
			t.Fatal("expected non-nil GetFlagDefinitionEntity")
		}
	})

	// Feature #4: the entity Stream(action, ...) method runs the op pipeline and
	// returns a channel over result items. With the streaming feature active it
	// yields the feature's incremental output; otherwise it falls back to the
	// materialised list so Stream always yields.
	t.Run("stream", func(t *testing.T) {
		seed := map[string]any{
			"entity": map[string]any{
				"get_flag_definition": map[string]any{
					"s1": map[string]any{"id": "s1"},
					"s2": map[string]any{"id": "s2"},
					"s3": map[string]any{"id": "s3"},
				},
			},
		}

		// Fallback: streaming inactive -> yields the materialised list items.
		base := sdk.TestSDK(seed, nil)
		var seen []any
		for item := range base.GetFlagDefinition(nil).Stream("list", nil, nil) {
			seen = append(seen, item)
		}
		if len(seen) != 3 {
			t.Fatalf("expected 3 streamed items, got %d", len(seen))
		}

		// Inbound: streaming active -> yields each item from the feature iterator.
		hasStreaming := false
		if fm, ok := core.SharedConfig()["feature"].(map[string]any); ok {
			_, hasStreaming = fm["streaming"]
		}
		if hasStreaming {
			streamSdk := sdk.TestSDK(seed, map[string]any{
				"feature": map[string]any{"streaming": map[string]any{"active": true}},
			})
			var got []any
			for item := range streamSdk.GetFlagDefinition(nil).Stream("list", nil, nil) {
				if sub, ok := item.([]any); ok {
					got = append(got, sub...)
				} else {
					got = append(got, item)
				}
			}
			if len(got) != 3 {
				t.Fatalf("expected 3 items via streaming feature, got %d", len(got))
			}
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := get_flag_definitionBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"list"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "get_flag_definition." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set MIXPANEL_FEATURE_FLAGS_TEST_GET_FLAG_DEFINITION_ENTID JSON to run live")
			return
		}
		client := setup.client

		// Bootstrap entity data from existing test data (no create step in flow).
		getFlagDefinitionRef01DataRaw := vs.Items(core.ToMapAny(vs.GetPath(setup.data, "existing.get_flag_definition")))
		var getFlagDefinitionRef01Data map[string]any
		if len(getFlagDefinitionRef01DataRaw) > 0 {
			getFlagDefinitionRef01Data = core.ToMapAny(getFlagDefinitionRef01DataRaw[0][1])
		}
		// Discard guards against Go's unused-var check when the flow's steps
		// happen not to consume the bootstrap data (e.g. list-only flows).
		_ = getFlagDefinitionRef01Data

		// LIST
		getFlagDefinitionRef01Ent := client.GetFlagDefinition(nil)
		getFlagDefinitionRef01Match := map[string]any{}

		getFlagDefinitionRef01ListResult, err := getFlagDefinitionRef01Ent.List(getFlagDefinitionRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		_, getFlagDefinitionRef01ListOk := getFlagDefinitionRef01ListResult.([]any)
		if !getFlagDefinitionRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", getFlagDefinitionRef01ListResult)
		}

	})
}

func get_flag_definitionBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "get_flag_definition", "GetFlagDefinitionTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read get_flag_definition test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse get_flag_definition test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"get_flag_definition01", "get_flag_definition02", "get_flag_definition03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("MIXPANEL_FEATURE_FLAGS_TEST_GET_FLAG_DEFINITION_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"MIXPANEL_FEATURE_FLAGS_TEST_GET_FLAG_DEFINITION_ENTID": idmap,
		"MIXPANEL_FEATURE_FLAGS_TEST_LIVE":      "FALSE",
		"MIXPANEL_FEATURE_FLAGS_TEST_EXPLAIN":   "FALSE",
		"MIXPANEL_FEATURE_FLAGS_APIKEY":         "",
		"MIXPANEL_FEATURE_FLAGS_SERVER_REGIONANDDOMAIN": "api.mixpanel",
	})

	idmapResolved := core.ToMapAny(env["MIXPANEL_FEATURE_FLAGS_TEST_GET_FLAG_DEFINITION_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["MIXPANEL_FEATURE_FLAGS_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["MIXPANEL_FEATURE_FLAGS_APIKEY"],
				"server": map[string]any{
					"regionAndDomain": env["MIXPANEL_FEATURE_FLAGS_SERVER_REGIONANDDOMAIN"],
				},
			},
			extraOpts,
		})
		client = sdk.NewMixpanelFeatureFlagsSDK(core.ToMapAny(mergedOpts))
	}

	live := env["MIXPANEL_FEATURE_FLAGS_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["MIXPANEL_FEATURE_FLAGS_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
