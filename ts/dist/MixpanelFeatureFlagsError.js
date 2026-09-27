"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixpanelFeatureFlagsError = void 0;
class MixpanelFeatureFlagsError extends Error {
    isMixpanelFeatureFlagsError = true;
    sdk = 'MixpanelFeatureFlags';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.MixpanelFeatureFlagsError = MixpanelFeatureFlagsError;
//# sourceMappingURL=MixpanelFeatureFlagsError.js.map