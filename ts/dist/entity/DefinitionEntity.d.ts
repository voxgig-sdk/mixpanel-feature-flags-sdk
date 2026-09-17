import { MixpanelFeatureFlagsEntityBase } from '../MixpanelFeatureFlagsEntityBase';
import type { MixpanelFeatureFlagsSDK } from '../MixpanelFeatureFlagsSDK';
import type { Control } from '../types';
import type { Definition, DefinitionListMatch } from '../MixpanelFeatureFlagsTypes';
declare class DefinitionEntity extends MixpanelFeatureFlagsEntityBase<Definition> {
    constructor(client: MixpanelFeatureFlagsSDK, entopts: any);
    make(this: DefinitionEntity): DefinitionEntity;
    list(this: any, reqmatch?: DefinitionListMatch, ctrl?: Control): Promise<DefinitionEntity[]>;
}
export { DefinitionEntity };
