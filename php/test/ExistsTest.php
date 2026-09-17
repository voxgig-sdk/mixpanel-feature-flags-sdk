<?php
declare(strict_types=1);

// MixpanelFeatureFlags SDK exists test

require_once __DIR__ . '/../mixpanelfeatureflags_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = MixpanelFeatureFlagsSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
