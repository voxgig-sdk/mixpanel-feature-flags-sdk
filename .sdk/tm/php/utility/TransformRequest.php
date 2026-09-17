<?php
declare(strict_types=1);

// MixpanelFeatureFlags SDK utility: transform_request

require_once __DIR__ . '/../core/Helpers.php';

class MixpanelFeatureFlagsTransformRequest
{
    public static function call(MixpanelFeatureFlagsContext $ctx): mixed
    {
        $spec = $ctx->spec;
        $point = $ctx->point;
        if ($spec) {
            $spec->step = 'reqform';
        }
        $transform = MixpanelFeatureFlagsHelpers::to_map(\Voxgig\Struct\Struct::getprop($point, 'transform'));
        if (!$transform) {
            return $ctx->reqdata;
        }
        $reqform = \Voxgig\Struct\Struct::getprop($transform, 'req');
        if (!$reqform) {
            return $ctx->reqdata;
        }
        return \Voxgig\Struct\Struct::transform(['reqdata' => $ctx->reqdata], $reqform);
    }
}
