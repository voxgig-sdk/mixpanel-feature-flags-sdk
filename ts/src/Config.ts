
import { BaseFeature } from './feature/base/BaseFeature'
import { DebugFeature } from './feature/debug/DebugFeature'
import { IdempotencyFeature } from './feature/idempotency/IdempotencyFeature'
import { MetricsFeature } from './feature/metrics/MetricsFeature'
import { PagingFeature } from './feature/paging/PagingFeature'
import { RatelimitFeature } from './feature/ratelimit/RatelimitFeature'
import { RetryFeature } from './feature/retry/RetryFeature'
import { TestFeature } from './feature/test/TestFeature'
import { TimeoutFeature } from './feature/timeout/TimeoutFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   debug: DebugFeature,
 idempotency: IdempotencyFeature,
 metrics: MetricsFeature,
 paging: PagingFeature,
 ratelimit: RatelimitFeature,
 retry: RetryFeature,
 test: TestFeature,
 timeout: TimeoutFeature,

}


// Per-feature plugin DEFINITIONS (voxgig/plugin `Definition` values), from
// the model's active plugin groups. A feature that takes a `plugins` option
// (secrets over sekreto) reads its own entry; a feature with no plugins has
// none. Named imports above make each definition statically reachable, so
// an SDK carries exactly the plugin modules its model selects — the same
// leanness the old side-effect registry imports bought, without a registry.
const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    // TODO: errors etc
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'MixpanelFeatureFlags',
        slug: "mixpanel-feature-flags",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     debug:     {
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
 idempotency:     {
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
 metrics:     {
      "options": {
        "active": false
      },
      "optspec": {
        "now": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 paging:     {
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
 ratelimit:     {
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
 retry:     {
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
 test:     {
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
 timeout:     {
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

  }


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
      
        definition: {
        },
  
        flag: {
        },
  
    }
  }


  entity = {
    "definition": {
      "fields": [
        {
          "name": "context",
          "req": true,
          "short": "The context variable used for flag evaluation (e.g., distinct_id, device_id)",
          "type": "`$STRING`"
        },
        {
          "name": "experiment_id",
          "short": "ID of the associated experiment, if any",
          "type": "`$STRING`"
        },
        {
          "name": "id",
          "req": true,
          "short": "Unique identifier for the flag",
          "type": "`$STRING`"
        },
        {
          "name": "is_experiment_active",
          "short": "Whether the associated experiment is currently active",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "key",
          "req": true,
          "short": "Unique key used to reference the flag",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "req": true,
          "short": "Human-readable name of the flag",
          "type": "`$STRING`"
        },
        {
          "format": "int32",
          "name": "project_id",
          "req": true,
          "short": "ID of the project this flag belongs to",
          "type": "`$INTEGER`"
        },
        {
          "name": "ruleset",
          "req": true,
          "short": "Complete ruleset for a feature flag including variants and rollout configuration",
          "type": "`$OBJECT`",
          "union": {
            "branches": 4,
            "count": 1,
            "depth": 5
          }
        },
        {
          "name": "status",
          "req": true,
          "short": "Current status of the flag",
          "type": "`$STRING`"
        },
        {
          "format": "int64",
          "name": "workspace_id",
          "req": true,
          "short": "ID of the workspace (dataview) this flag belongs to",
          "type": "`$INTEGER`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "definition",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "args": {
                "query": [
                  {
                    "kind": "query",
                    "name": "project_id",
                    "orig": "project_id",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "query",
                    "name": "token",
                    "orig": "token",
                    "type": "`$STRING`"
                  }
                ]
              },
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
              "select": {
                "exist": [
                  "project_id",
                  "token"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.flags`"
              },
              "parts": [
                "flags",
                "definitions"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "flag": {
      "fields": [
        {
          "name": "experiment_id",
          "short": "The ID of the associated experiment, if any",
          "type": "`$STRING`"
        },
        {
          "name": "is_experiment_active",
          "short": "Whether the associated experiment is currently active",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "is_qa_tester",
          "short": "Whether the user was identified as a QA tester",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "variant_key",
          "req": true,
          "short": "The key of the selected variant",
          "type": "`$STRING`"
        },
        {
          "name": "variant_value",
          "req": true,
          "short": "The value of the selected variant (can be any type)",
          "type": "`$ANY`",
          "union": {
            "branches": 4,
            "count": 1,
            "depth": 0
          }
        }
      ],
      "name": "flag",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "args": {
                "query": [
                  {
                    "example": "%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22",
                    "kind": "query",
                    "name": "context",
                    "orig": "context",
                    "reqd": true,
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "query",
                    "name": "project_id",
                    "orig": "project_id",
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "query",
                    "name": "token",
                    "orig": "token",
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
              "method": "GET",
              "orig": "/flags",
              "segments": [
                {
                  "lit": "flags"
                }
              ],
              "select": {
                "exist": [
                  "context",
                  "project_id",
                  "token"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.flags`"
              },
              "parts": [
                "flags"
              ]
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

