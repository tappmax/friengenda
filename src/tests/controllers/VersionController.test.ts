import * as _ from 'lodash';
import * as SettingService from '@services/SettingService';
import {
    httpGet,
    initializeTestService,
    shutdownTestService,
    expectError,
    expectSuccess,
} from '../TestService'

beforeAll(initializeTestService(async() => {
    SettingService.setSetting('VersionMinIOS', '1.0.0');
    SettingService.setSetting('VersionMinAndroid', '1.0.0');
    SettingService.setSetting('VersionUpgradeIOS', 't2t_ios');
    SettingService.setSetting('VersionUpgradeAndroid', 't2t_android');
    SettingService.updateSettingsFromDatabase();
}));

afterAll(shutdownTestService);

describe("CheckVersion", () => {    

    test("CheckVersion_MissingVersion_MissingParameter", async () => {        
        expectError(await httpGet(null,'/v1/version/check', {platform:'ios'}), 400, 'MissingParameter', 'version');
    });
    test("CheckVersion_MissingPlatform_MissingParameter", async () => {        
        expectError(await httpGet(null,'/v1/version/check', {version:'1.0.0'}), 400, 'MissingParameter', 'platform');
    });

    test("CheckVersion_InvalidVersion_InvalidParameter", async () => {        
        expectError(await httpGet(null,'/v1/version/check', {version:'1.0.0.0', platform:'ios'}), 400, 'InvalidParameter', 'version');
        expectError(await httpGet(null,'/v1/version/check', {version:'fooey', platform:'ios'}), 400, 'InvalidParameter', 'version');
        expectError(await httpGet(null,'/v1/version/check', {version:'1.1', platform:'ios'}), 400, 'InvalidParameter', 'version');
    });

    test("CheckVersion_InvalidVersion_InvalidPlatform", async () => {        
        expectError(await httpGet(null,'/v1/version/check', {version:'1.0.0', platform:'invalid'}), 400, 'InvalidParameter', 'platform');
    });

    test("CheckVersion_NewerVersion_Success", async () => {        
        expectSuccess(await httpGet(null,'/v1/version/check', {version:'2.0.0', platform:'ios'}),
        {packageName : null});
    });

    test("CheckVersion_OlderVersion_Success", async () => {        
        expectSuccess(await httpGet(null,'/v1/version/check', {version:'0.1.0', platform:'ios'}),
        {packageName : 't2t_ios'});
    });

    test("CheckVersion_EqualVersion_Success", async () => {        
        expectSuccess(await httpGet(null,'/v1/version/check', {version:'1.0.0', platform:'ios'}),
        {packageName : null});
    });

});
