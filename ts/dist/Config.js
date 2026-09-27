"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_PLUGINS = exports.config = void 0;
const DebugFeature_1 = require("./feature/debug/DebugFeature");
const IdempotencyFeature_1 = require("./feature/idempotency/IdempotencyFeature");
const MetricsFeature_1 = require("./feature/metrics/MetricsFeature");
const PagingFeature_1 = require("./feature/paging/PagingFeature");
const RatelimitFeature_1 = require("./feature/ratelimit/RatelimitFeature");
const RetryFeature_1 = require("./feature/retry/RetryFeature");
const TestFeature_1 = require("./feature/test/TestFeature");
const TimeoutFeature_1 = require("./feature/timeout/TimeoutFeature");
const FEATURE_CLASS = {
    debug: DebugFeature_1.DebugFeature,
    idempotency: IdempotencyFeature_1.IdempotencyFeature,
    metrics: MetricsFeature_1.MetricsFeature,
    paging: PagingFeature_1.PagingFeature,
    ratelimit: RatelimitFeature_1.RatelimitFeature,
    retry: RetryFeature_1.RetryFeature,
    test: TestFeature_1.TestFeature,
    timeout: TimeoutFeature_1.TimeoutFeature,
};
const FEATURE_PLUGINS = {};
exports.FEATURE_PLUGINS = FEATURE_PLUGINS;
class Config {
    makeFeature(fn) {
        const fc = FEATURE_CLASS[fn];
        const fi = new fc();
        return fi;
    }
    // False for a feature added at runtime via options.extend (station's
    // adopt path) - the constructor uses this to skip makeFeature for names
    // no generated class backs.
    hasFeature(fn) {
        return null != FEATURE_CLASS[fn];
    }
    main = {
        name: 'MixpanelFeatureFlags',
        slug: "mixpanel-feature-flags",
        version: "0.0.1",
        target: "ts",
    };
    feature = {
        debug: {
            "options": {
                "active": false,
                "max": 100,
                "redact": [
                    "authorization",
                    "cookie",
                    "set-cookie",
                    "api-key",
                    "apikey",
                    "x-api-key",
                    "idempotency-key"
                ]
            },
            "optspec": {
                "now": "`$FUNCTION`",
                "onEntry": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "none"
        },
        idempotency: {
            "options": {
                "active": false,
                "header": "Idempotency-Key",
                "methods": [
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE"
                ],
                "ops": [
                    "create",
                    "update",
                    "remove"
                ]
            },
            "optspec": {
                "keygen": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "none"
        },
        metrics: {
            "options": {
                "active": false
            },
            "optspec": {
                "now": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "none"
        },
        paging: {
            "options": {
                "active": false,
                "afterVar": "after",
                "cursorParam": "cursor",
                "firstVar": "first",
                "limitParam": "limit",
                "pageParam": "page",
                "startPage": 1
            },
            "optspec": {
                "limit": "`$NUMBER`",
                "ops": "`$LIST`"
            },
            "strict": false,
            "transport": "none"
        },
        ratelimit: {
            "options": {
                "active": false,
                "burst": 5,
                "rate": 5
            },
            "optspec": {
                "now": "`$FUNCTION`",
                "sleep": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
        retry: {
            "options": {
                "active": false,
                "factor": 2,
                "maxDelay": 2000,
                "minDelay": 50,
                "retries": 2,
                "statuses": [
                    408,
                    425,
                    429,
                    500,
                    502,
                    503,
                    504
                ]
            },
            "optspec": {
                "jitter": "`$BOOLEAN`",
                "sleep": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
        test: {
            "options": {
                "active": false
            },
            "optspec": {
                "entity": "`$MAP`",
                "net": "`$MAP`"
            },
            "strict": false,
            "transport": "base"
        },
        timeout: {
            "options": {
                "active": false,
                "ms": 30000
            },
            "optspec": {
                "clearTimer": "`$FUNCTION`",
                "setTimer": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
    };
    options = {
        base: "https://{regionAndDomain}.com",
        server: {
            "regionAndDomain": "api.mixpanel",
        },
        auth: {
            prefix: 'Basic',
            basic: true,
        },
        headers: {
            "content-type": "application/json"
        },
        entity: {
            flag: {},
            get_flag_definition: {},
        }
    };
    entity = {
        "flag": {
            "fields": [
                {
                    "name": "experiment_id",
                    "title": "Experiment Id",
                    "type": "`$STRING`",
                    "short": "The ID of the associated experiment, if any"
                },
                {
                    "name": "is_experiment_active",
                    "title": "Is Experiment Active",
                    "type": "`$BOOLEAN`",
                    "short": "Whether the associated experiment is currently active"
                },
                {
                    "name": "is_qa_tester",
                    "title": "Is Qa Tester",
                    "type": "`$BOOLEAN`",
                    "short": "Whether the user was identified as a QA tester"
                },
                {
                    "name": "variant_key",
                    "title": "Variant Key",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "The key of the selected variant"
                },
                {
                    "name": "variant_value",
                    "title": "Variant Value",
                    "type": "`$ANY`",
                    "req": true,
                    "short": "The value of the selected variant (can be any type)"
                }
            ],
            "name": "flag",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/flags",
                            "segments": [
                                {
                                    "lit": "flags"
                                }
                            ],
                            "parts": [
                                "flags"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.flags`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "context",
                                        "orig": "context",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22"
                                    },
                                    {
                                        "name": "project_id",
                                        "orig": "project_id",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "token",
                                        "orig": "token",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "context",
                                    "project_id",
                                    "token"
                                ]
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "get_flag_definition": {
            "fields": [
                {
                    "name": "context",
                    "title": "Context",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "The context variable used for flag evaluation (e.g., distinct_id, device_id)"
                },
                {
                    "name": "experiment_id",
                    "title": "Experiment Id",
                    "type": "`$STRING`",
                    "short": "ID of the associated experiment, if any"
                },
                {
                    "name": "id",
                    "title": "Id",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Unique identifier for the flag"
                },
                {
                    "name": "is_experiment_active",
                    "title": "Is Experiment Active",
                    "type": "`$BOOLEAN`",
                    "short": "Whether the associated experiment is currently active"
                },
                {
                    "name": "key",
                    "title": "Key",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Unique key used to reference the flag"
                },
                {
                    "name": "name",
                    "title": "Name",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Human-readable name of the flag"
                },
                {
                    "name": "project_id",
                    "title": "Project Id",
                    "type": "`$INTEGER`",
                    "req": true,
                    "short": "ID of the project this flag belongs to",
                    "format": "int32"
                },
                {
                    "name": "ruleset",
                    "title": "Ruleset",
                    "type": "`$OBJECT`",
                    "req": true,
                    "short": "Complete ruleset for a feature flag including variants and rollout configuration"
                },
                {
                    "name": "status",
                    "title": "Status",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Current status of the flag"
                },
                {
                    "name": "workspace_id",
                    "title": "Workspace Id",
                    "type": "`$INTEGER`",
                    "req": true,
                    "short": "ID of the workspace (dataview) this flag belongs to",
                    "format": "int64"
                }
            ],
            "id": {
                "field": "id",
                "name": "id"
            },
            "name": "get_flag_definition",
            "op": {
                "list": {
                    "input": "data",
                    "name": "list",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/flags/definitions",
                            "segments": [
                                {
                                    "lit": "flags"
                                },
                                {
                                    "lit": "definitions"
                                }
                            ],
                            "parts": [
                                "flags",
                                "definitions"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.flags`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "project_id",
                                        "orig": "project_id",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "token",
                                        "orig": "token",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "project_id",
                                    "token"
                                ]
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        }
    };
}
const config = new Config();
exports.config = config;
//# sourceMappingURL=Config.js.map