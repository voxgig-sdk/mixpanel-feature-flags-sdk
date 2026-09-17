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
				"definition": map[string]any{},
				"flag": map[string]any{},
			},
		},
		"entity": map[string]any{
			"definition": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "context",
						"req": true,
						"short": "The context variable used for flag evaluation (e.g., distinct_id, device_id)",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "experiment_id",
						"short": "ID of the associated experiment, if any",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "id",
						"req": true,
						"short": "Unique identifier for the flag",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "is_experiment_active",
						"short": "Whether the associated experiment is currently active",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "key",
						"req": true,
						"short": "Unique key used to reference the flag",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "name",
						"req": true,
						"short": "Human-readable name of the flag",
						"type": "`$STRING`",
					},
					map[string]any{
						"format": "int32",
						"name": "project_id",
						"req": true,
						"short": "ID of the project this flag belongs to",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "ruleset",
						"req": true,
						"short": "Complete ruleset for a feature flag including variants and rollout configuration",
						"type": "`$OBJECT`",
						"union": map[string]any{
							"branches": 4,
							"count": 1,
							"depth": 5,
						},
					},
					map[string]any{
						"name": "status",
						"req": true,
						"short": "Current status of the flag",
						"type": "`$STRING`",
					},
					map[string]any{
						"format": "int64",
						"name": "workspace_id",
						"req": true,
						"short": "ID of the workspace (dataview) this flag belongs to",
						"type": "`$INTEGER`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "definition",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"kind": "query",
											"name": "project_id",
											"orig": "project_id",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "query",
											"name": "token",
											"orig": "token",
											"type": "`$STRING`",
										},
									},
								},
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
								"select": map[string]any{
									"exist": []any{
										"project_id",
										"token",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.flags`",
								},
								"parts": []any{
									"flags",
									"definitions",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"flag": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "experiment_id",
						"short": "The ID of the associated experiment, if any",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "is_experiment_active",
						"short": "Whether the associated experiment is currently active",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "is_qa_tester",
						"short": "Whether the user was identified as a QA tester",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "variant_key",
						"req": true,
						"short": "The key of the selected variant",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "variant_value",
						"req": true,
						"short": "The value of the selected variant (can be any type)",
						"type": "`$ANY`",
						"union": map[string]any{
							"branches": 4,
							"count": 1,
							"depth": 0,
						},
					},
				},
				"name": "flag",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"example": "%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22",
											"kind": "query",
											"name": "context",
											"orig": "context",
											"reqd": true,
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "query",
											"name": "project_id",
											"orig": "project_id",
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "query",
											"name": "token",
											"orig": "token",
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "GET",
								"orig": "/flags",
								"segments": []any{
									map[string]any{
										"lit": "flags",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"context",
										"project_id",
										"token",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.flags`",
								},
								"parts": []any{
									"flags",
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
