import { MixpanelFeatureFlagsEntityBase } from '../MixpanelFeatureFlagsEntityBase';
import type { MixpanelFeatureFlagsSDK } from '../MixpanelFeatureFlagsSDK';
import type { Control } from '../types';
import type { Flag, FlagLoadMatch } from '../MixpanelFeatureFlagsTypes';
declare class FlagEntity extends MixpanelFeatureFlagsEntityBase<Flag> {
    constructor(client: MixpanelFeatureFlagsSDK, entopts: any);
    make(this: FlagEntity): FlagEntity;
    load(this: any, reqmatch?: FlagLoadMatch, ctrl?: Control): Promise<FlagEntity>;
}
export { FlagEntity };
