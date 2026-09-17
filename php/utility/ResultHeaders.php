<?php
declare(strict_types=1);

// MixpanelFeatureFlags SDK utility: result_headers

class MixpanelFeatureFlagsResultHeaders
{
    public static function call(MixpanelFeatureFlagsContext $ctx): ?MixpanelFeatureFlagsResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
