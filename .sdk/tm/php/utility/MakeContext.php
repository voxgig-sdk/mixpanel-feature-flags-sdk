<?php
declare(strict_types=1);

// MixpanelFeatureFlags SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class MixpanelFeatureFlagsMakeContext
{
    public static function call(array $ctxmap, ?MixpanelFeatureFlagsContext $basectx): MixpanelFeatureFlagsContext
    {
        return new MixpanelFeatureFlagsContext($ctxmap, $basectx);
    }
}
