import * as _ from 'lodash';
import * as SettingService from '@services/SettingService';
import {
    MockUser,
    httpGet,
    httpPost,
    initializeTestService,
    shutdownTestService,
    expectError,
    expectSuccess,
    mockUser,
    mockAdmin
} from '../TestService'
import { Setting, settingsToResponse, settingToResponse } from '@models/Setting';

let userWithAllRoles : MockUser;
let userWithNoRoles : MockUser;
let settingsAll : Setting[];

beforeAll(initializeTestService(async() => {
    userWithAllRoles = await mockAdmin('adminWithAllOptions@admin.com');
    userWithNoRoles = await mockUser('adminWithNoOptions@admin.com', 'Active', true);
    settingsAll = _.filter(SettingService.getSettings(), setting => setting.access === 'Public' || setting.access === 'Protected');
}));

afterAll(shutdownTestService);

describe("GetSettings", () => {    

    test("GetSettings_AdminWithNoOptions_NotAuthorized", async () => {      
        expectError(await httpGet(userWithNoRoles,'/v1/settings'), 401, 'NotAuthorized', 'SettingView');
    });

    test("GetSettings_AdminWithAllOptions_Settings", async () => {      
        expectSuccess(await httpGet(userWithAllRoles,'/v1/settings', settingsToResponse(settingsAll)));
    });

    test("GetSettings_InvalidOrigin_Settings", async () => {      
        expectError(await httpGet(userWithAllRoles,'/v1/settings', {origin : 'Invalid'}), 400, 'InvalidParameter');
    });
});


describe("SetSetting", () => {    

    test("SetSetting_AdminWithNoOptions_NotAuthorized", async () => {        
        expectError(await httpPost(userWithNoRoles,'/v1/settings/ProductMarkup'), 401, 'NotAuthorized', 'SettingEdit');
    });

    test("SetSetting_NoValue_MissingParameter", async () => {      
        expectError(await httpPost(userWithAllRoles,'/v1/settings/ProductMarkup'), 400, 'MissingParameter')
    });

    test("SetSetting_InvalidName_NotFound", async () => {      
        expectError(await httpPost(userWithAllRoles,'/v1/settings/invalid', { value : 'test'}), 404, 'NotFound', 'setting')
    });

    test("SetSetting_AdminWithAllOptions_Setting", async () => {      
        await SettingService.setSetting('WebServerPort', 1000);
        expectSuccess(
            await httpPost(userWithAllRoles,'/v1/settings/WebServerPort', { value : '1000'}),
            settingToResponse(SettingService.getSetting('WebServerPort'), false));
    });
});

