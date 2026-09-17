<?php
declare(strict_types=1);

// MixpanelFeatureFlags SDK utility: result_body

class MixpanelFeatureFlagsResultBody
{
    public static function call(MixpanelFeatureFlagsContext $ctx): ?MixpanelFeatureFlagsResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
