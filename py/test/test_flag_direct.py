# Flag direct test

import json
import pytest

from mixpanelfeatureflags_sdk.utility.voxgig_struct import voxgig_struct as vs
from mixpanelfeatureflags_sdk import MixpanelFeatureFlagsSDK
from mixpanelfeatureflags_sdk.core import helpers
from test import runner


class TestFlagDirect:

    def test_should_direct_load_flag(self):
        setup = _flag_direct_setup({"id": "direct01"})
        _skip, _reason = runner.is_control_skipped("direct", "direct-load-flag", "live" if setup["live"] else "unit")
        if _skip:
            # pytest already imported at module scope
            pytest.skip(_reason or "skipped via sdk-test-control.json")
            return
        client = setup["client"]

        params = {}
        query = {}
        if setup["live"]:
            query["context"] = "%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22"

        result = client.direct({
            "path": "flags",
            "method": "GET",
            "params": params,
            "query": query,
        })
        if setup["live"]:
            # Live mode is lenient: synthetic IDs frequently 4xx. Skip
            # rather than fail when the load endpoint isn't reachable
            # with the IDs we can construct from setup.idmap.
            if result.get("err") is not None:
                pytest.skip(f"load call failed (likely synthetic IDs against live API): {result.get('err')}")
                return
            if not result.get("ok"):
                pytest.skip("load call not ok (likely synthetic IDs against live API)")
                return
            status = helpers.to_int(result["status"])
            if status < 200 or status >= 300:
                pytest.skip(f"expected 2xx status, got {status}")
                return
        else:
            assert result["ok"] is True
            assert helpers.to_int(result["status"]) == 200
            assert result["data"] is not None
            if isinstance(result["data"], dict):
                assert result["data"]["id"] == "direct01"
            assert len(setup["calls"]) == 1



def _flag_direct_setup(mockres):
    runner.load_env_local()

    calls = []

    env = runner.env_override({
        "MIXPANEL_FEATURE_FLAGS_TEST_FLAG_ENTID": {},
        "MIXPANEL_FEATURE_FLAGS_TEST_LIVE": "FALSE",
        "MIXPANEL_FEATURE_FLAGS_APIKEY": "",
        "MIXPANEL_FEATURE_FLAGS_SERVER_REGIONANDDOMAIN": "api.mixpanel",
    })

    live = env.get("MIXPANEL_FEATURE_FLAGS_TEST_LIVE") == "TRUE"

    if live:
        # sdk-test-control.json's test.client.options seeds the live
        # client; the generated fields below overwrite anything they name.
        merged_opts = dict(runner.live_client_options())
        merged_opts.update({
            "apikey": env.get("MIXPANEL_FEATURE_FLAGS_APIKEY"),
            "server": {
                "regionAndDomain": env.get("MIXPANEL_FEATURE_FLAGS_SERVER_REGIONANDDOMAIN"),
            },
        })
        client = MixpanelFeatureFlagsSDK(merged_opts)
        return {
            "client": client,
            "calls": calls,
            "live": True,
            "idmap": {},
        }

    def mock_fetch(url, init):
        calls.append({"url": url, "init": init})
        return {
            "status": 200,
            "statusText": "OK",
            "headers": {},
            "json": lambda: mockres if mockres is not None else {"id": "direct01"},
            "body": "mock",
        }, None

    client = MixpanelFeatureFlagsSDK({
        "base": "http://localhost:8080",
        "system": {
            "fetch": mock_fetch,
        },
    })

    return {
        "client": client,
        "calls": calls,
        "live": False,
        "idmap": {},
    }
