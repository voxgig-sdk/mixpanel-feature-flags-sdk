import { MixpanelFeatureFlagsEntityBase } from '../MixpanelFeatureFlagsEntityBase';
import type { MixpanelFeatureFlagsSDK } from '../MixpanelFeatureFlagsSDK';
import type { Control } from '../types';
import type { GetFlagDefinition, GetFlagDefinitionListMatch } from '../MixpanelFeatureFlagsTypes';
declare class GetFlagDefinitionEntity extends MixpanelFeatureFlagsEntityBase<GetFlagDefinition> {
    constructor(client: MixpanelFeatureFlagsSDK, entopts: any);
    make(this: GetFlagDefinitionEntity): GetFlagDefinitionEntity;
    list(this: any, reqmatch?: GetFlagDefinitionListMatch, ctrl?: Control): Promise<GetFlagDefinitionEntity[]>;
}
export { GetFlagDefinitionEntity };
