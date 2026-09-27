import { FlagEntity } from './entity/FlagEntity';
import { GetFlagDefinitionEntity } from './entity/GetFlagDefinitionEntity';
export type * from './MixpanelFeatureFlagsTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { MixpanelFeatureFlagsEntityBase } from './MixpanelFeatureFlagsEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class MixpanelFeatureFlagsSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Flag(entopts?: Record<string, any>): FlagEntity;
    GetFlagDefinition(entopts?: Record<string, any>): GetFlagDefinitionEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): MixpanelFeatureFlagsSDK;
    tester(testopts?: any, sdkopts?: any): MixpanelFeatureFlagsSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof MixpanelFeatureFlagsSDK;
export { stdutil, config, BaseFeature, MixpanelFeatureFlagsEntityBase, MixpanelFeatureFlagsSDK, SDK, };
