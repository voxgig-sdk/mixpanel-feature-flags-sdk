<?php
declare(strict_types=1);

// MixpanelFeatureFlags SDK utility: prepare_auth

class MixpanelFeatureFlagsPrepareAuth
{
    private const HEADER_AUTH = 'authorization';
    private const OPTION_APIKEY = 'apikey';
    private const OPTION_SECRET = 'secret';
    private const NOT_FOUND = '__NOTFOUND__';

    public static function call(MixpanelFeatureFlagsContext $ctx): array
    {
        $spec = $ctx->spec;
        if (!$spec) {
            return [null, $ctx->make_error('auth_no_spec', 'Expected context spec property to be defined.')];
        }

        $headers = &$spec->headers;
        $options = $ctx->client->options_map();

        // Public APIs that need no auth omit the options.auth block entirely.
        if (!isset($options['auth']) || $options['auth'] === null) {
            unset($headers[self::HEADER_AUTH]);
            return [$spec, null];
        }

        $apikey = \Voxgig\Struct\Struct::getprop($options, self::OPTION_APIKEY, self::NOT_FOUND);

        // True HTTP Basic Auth needs TWO credentials, base64-joined - a
        // single token in the header (the branch below) can never
        // authenticate against an API that actually checks
        // `Authorization: Basic base64(user:pass)`.
        if (true === (\Voxgig\Struct\Struct::getpath($options, 'auth.basic') ?? false)) {
            $secret = \Voxgig\Struct\Struct::getprop($options, self::OPTION_SECRET, self::NOT_FOUND);
            $apikey_val = is_string($apikey) && $apikey !== self::NOT_FOUND ? $apikey : '';
            $secret_val = is_string($secret) && $secret !== self::NOT_FOUND ? $secret : '';

            if ($apikey_val === '' || $secret_val === '') {
                unset($headers[self::HEADER_AUTH]);
            } else {
                $auth_prefix = \Voxgig\Struct\Struct::getpath($options, 'auth.prefix') ?? '';
                $b64 = base64_encode("{$apikey_val}:{$secret_val}");
                $headers[self::HEADER_AUTH] = $auth_prefix === ''
                    ? $b64 : "{$auth_prefix} {$b64}";
            }

            return [$spec, null];
        }

        if (
            (is_string($apikey) && ($apikey === self::NOT_FOUND || $apikey === ''))
            || $apikey === null
        ) {
            unset($headers[self::HEADER_AUTH]);
        } else {
            $auth_prefix = \Voxgig\Struct\Struct::getpath($options, 'auth.prefix') ?? '';
            $apikey_val = is_string($apikey) ? $apikey : '';
            // Empty prefix (raw apiKey credential) must not add a leading space.
            $headers[self::HEADER_AUTH] = $auth_prefix === ''
                ? $apikey_val : "{$auth_prefix} {$apikey_val}";
        }

        return [$spec, null];
    }
}
