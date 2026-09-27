# MixpanelFeatureFlags SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "MixpanelFeatureFlags",
            "slug": "mixpanel-feature-flags",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "debug": {
        "options": {
          "active": False,
          "max": 100,
          "redact": [
            "authorization",
            "cookie",
            "set-cookie",
            "api-key",
            "apikey",
            "x-api-key",
            "idempotency-key",
          ],
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "onEntry": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "idempotency": {
        "options": {
          "active": False,
          "header": "Idempotency-Key",
          "methods": [
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          ],
          "ops": [
            "create",
            "update",
            "remove",
          ],
        },
        "optspec": {
          "keygen": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "metrics": {
        "options": {
          "active": False,
        },
        "optspec": {
          "now": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "paging": {
        "options": {
          "active": False,
          "afterVar": "after",
          "cursorParam": "cursor",
          "firstVar": "first",
          "limitParam": "limit",
          "pageParam": "page",
          "startPage": 1,
        },
        "optspec": {
          "limit": "`$NUMBER`",
          "ops": "`$LIST`",
        },
        "strict": False,
        "transport": "none",
      },
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
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
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://{regionAndDomain}.com",
            "server": {
                "regionAndDomain": "api.mixpanel",
            },
            "auth": {
                "prefix": "Basic",
            },
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "flag": {},
                "get_flag_definition": {},
            },
        },
        "entity": {
      "flag": {
        "fields": [
          {
            "name": "experiment_id",
            "title": "Experiment Id",
            "type": "`$STRING`",
            "short": "The ID of the associated experiment, if any",
          },
          {
            "name": "is_experiment_active",
            "title": "Is Experiment Active",
            "type": "`$BOOLEAN`",
            "short": "Whether the associated experiment is currently active",
          },
          {
            "name": "is_qa_tester",
            "title": "Is Qa Tester",
            "type": "`$BOOLEAN`",
            "short": "Whether the user was identified as a QA tester",
          },
          {
            "name": "variant_key",
            "title": "Variant Key",
            "type": "`$STRING`",
            "req": True,
            "short": "The key of the selected variant",
          },
          {
            "name": "variant_value",
            "title": "Variant Value",
            "type": "`$ANY`",
            "req": True,
            "short": "The value of the selected variant (can be any type)",
          },
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
                    "lit": "flags",
                  },
                ],
                "parts": [
                  "flags",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.flags`",
                },
                "args": {
                  "query": [
                    {
                      "name": "context",
                      "orig": "context",
                      "type": "`$STRING`",
                      "kind": "query",
                      "reqd": True,
                      "example": "%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22",
                    },
                    {
                      "name": "project_id",
                      "orig": "project_id",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "token",
                      "orig": "token",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "context",
                    "project_id",
                    "token",
                  ],
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "get_flag_definition": {
        "fields": [
          {
            "name": "context",
            "title": "Context",
            "type": "`$STRING`",
            "req": True,
            "short": "The context variable used for flag evaluation (e.g., distinct_id, device_id)",
          },
          {
            "name": "experiment_id",
            "title": "Experiment Id",
            "type": "`$STRING`",
            "short": "ID of the associated experiment, if any",
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "req": True,
            "short": "Unique identifier for the flag",
          },
          {
            "name": "is_experiment_active",
            "title": "Is Experiment Active",
            "type": "`$BOOLEAN`",
            "short": "Whether the associated experiment is currently active",
          },
          {
            "name": "key",
            "title": "Key",
            "type": "`$STRING`",
            "req": True,
            "short": "Unique key used to reference the flag",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
            "req": True,
            "short": "Human-readable name of the flag",
          },
          {
            "name": "project_id",
            "title": "Project Id",
            "type": "`$INTEGER`",
            "req": True,
            "short": "ID of the project this flag belongs to",
            "format": "int32",
          },
          {
            "name": "ruleset",
            "title": "Ruleset",
            "type": "`$OBJECT`",
            "req": True,
            "short": "Complete ruleset for a feature flag including variants and rollout configuration",
          },
          {
            "name": "status",
            "title": "Status",
            "type": "`$STRING`",
            "req": True,
            "short": "Current status of the flag",
          },
          {
            "name": "workspace_id",
            "title": "Workspace Id",
            "type": "`$INTEGER`",
            "req": True,
            "short": "ID of the workspace (dataview) this flag belongs to",
            "format": "int64",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
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
                    "lit": "flags",
                  },
                  {
                    "lit": "definitions",
                  },
                ],
                "parts": [
                  "flags",
                  "definitions",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.flags`",
                },
                "args": {
                  "query": [
                    {
                      "name": "project_id",
                      "orig": "project_id",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "token",
                      "orig": "token",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "project_id",
                    "token",
                  ],
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
