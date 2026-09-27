package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "MixpanelFeatureFlags",
			"slug": "mixpanel-feature-flags",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"debug": map[string]any{
				"options": map[string]any{
					"active": false,
					"max": 100,
					"redact": []any{
						"authorization",
						"cookie",
						"set-cookie",
						"api-key",
						"apikey",
						"x-api-key",
						"idempotency-key",
					},
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"onEntry": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"idempotency": map[string]any{
				"options": map[string]any{
					"active": false,
					"header": "Idempotency-Key",
					"methods": []any{
						"POST",
						"PUT",
						"PATCH",
						"DELETE",
					},
					"ops": []any{
						"create",
						"update",
						"remove",
					},
				},
				"optspec": map[string]any{
					"keygen": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"metrics": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"paging": map[string]any{
				"options": map[string]any{
					"active": false,
					"afterVar": "after",
					"cursorParam": "cursor",
					"firstVar": "first",
					"limitParam": "limit",
					"pageParam": "page",
					"startPage": 1,
				},
				"optspec": map[string]any{
					"limit": "`$NUMBER`",
					"ops": "`$LIST`",
				},
				"strict": false,
				"transport": "none",
			},
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://{regionAndDomain}.com",
			"server": map[string]any{
				"regionAndDomain": "api.mixpanel",
			},
			"auth": map[string]any{
				"prefix": "Basic",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"flag": map[string]any{},
				"get_flag_definition": map[string]any{},
			},
		},
		"entity": map[string]any{
			"flag": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "experiment_id",
						"title": "Experiment Id",
						"type": "`$STRING`",
						"short": "The ID of the associated experiment, if any",
					},
					map[string]any{
						"name": "is_experiment_active",
						"title": "Is Experiment Active",
						"type": "`$BOOLEAN`",
						"short": "Whether the associated experiment is currently active",
					},
					map[string]any{
						"name": "is_qa_tester",
						"title": "Is Qa Tester",
						"type": "`$BOOLEAN`",
						"short": "Whether the user was identified as a QA tester",
					},
					map[string]any{
						"name": "variant_key",
						"title": "Variant Key",
						"type": "`$STRING`",
						"req": true,
						"short": "The key of the selected variant",
					},
					map[string]any{
						"name": "variant_value",
						"title": "Variant Value",
						"type": "`$ANY`",
						"req": true,
						"short": "The value of the selected variant (can be any type)",
					},
				},
				"name": "flag",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/flags",
								"segments": []any{
									map[string]any{
										"lit": "flags",
									},
								},
								"parts": []any{
									"flags",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.flags`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "context",
											"orig": "context",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22",
										},
										map[string]any{
											"name": "project_id",
											"orig": "project_id",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "token",
											"orig": "token",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"context",
										"project_id",
										"token",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"get_flag_definition": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "context",
						"title": "Context",
						"type": "`$STRING`",
						"req": true,
						"short": "The context variable used for flag evaluation (e.g., distinct_id, device_id)",
					},
					map[string]any{
						"name": "experiment_id",
						"title": "Experiment Id",
						"type": "`$STRING`",
						"short": "ID of the associated experiment, if any",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
						"req": true,
						"short": "Unique identifier for the flag",
					},
					map[string]any{
						"name": "is_experiment_active",
						"title": "Is Experiment Active",
						"type": "`$BOOLEAN`",
						"short": "Whether the associated experiment is currently active",
					},
					map[string]any{
						"name": "key",
						"title": "Key",
						"type": "`$STRING`",
						"req": true,
						"short": "Unique key used to reference the flag",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
						"req": true,
						"short": "Human-readable name of the flag",
					},
					map[string]any{
						"name": "project_id",
						"title": "Project Id",
						"type": "`$INTEGER`",
						"req": true,
						"short": "ID of the project this flag belongs to",
						"format": "int32",
					},
					map[string]any{
						"name": "ruleset",
						"title": "Ruleset",
						"type": "`$OBJECT`",
						"req": true,
						"short": "Complete ruleset for a feature flag including variants and rollout configuration",
					},
					map[string]any{
						"name": "status",
						"title": "Status",
						"type": "`$STRING`",
						"req": true,
						"short": "Current status of the flag",
					},
					map[string]any{
						"name": "workspace_id",
						"title": "Workspace Id",
						"type": "`$INTEGER`",
						"req": true,
						"short": "ID of the workspace (dataview) this flag belongs to",
						"format": "int64",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "get_flag_definition",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/flags/definitions",
								"segments": []any{
									map[string]any{
										"lit": "flags",
									},
									map[string]any{
										"lit": "definitions",
									},
								},
								"parts": []any{
									"flags",
									"definitions",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.flags`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "project_id",
											"orig": "project_id",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "token",
											"orig": "token",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"project_id",
										"token",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "debug":
		if NewDebugFeatureFunc != nil {
			return NewDebugFeatureFunc()
		}
	case "idempotency":
		if NewIdempotencyFeatureFunc != nil {
			return NewIdempotencyFeatureFunc()
		}
	case "metrics":
		if NewMetricsFeatureFunc != nil {
			return NewMetricsFeatureFunc()
		}
	case "paging":
		if NewPagingFeatureFunc != nil {
			return NewPagingFeatureFunc()
		}
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
