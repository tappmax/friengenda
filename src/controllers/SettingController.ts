import * as _ from 'lodash';
import * as express from "express";
import { IRoute, router } from '@helpers/RouteHelpers'
import { userHasRole } from '@helpers/RequestHelpers';
import { setSetting, getSetting, getSettings, updateSettingsFromDatabase } from '@services/SettingService';
import { validateString, validateBoolean } from '@helpers/ValidationHelpers';
import NotAuthorizedError from '@errors/NotAuthorizedError';
import { stringToSettingName, SettingAccess, Setting, SettingName, settingsToResponse, settingToResponse } from '@models/Setting';
import NotFoundError from '@errors/NotFoundError';


async function validateSettingParameters (req: express.Request, res: express.Response, next : any) {
    req.validatedParams.access = 'Protected';
    
    // Admins...
    if(req.validatedParams.access === 'Protected') {
        // Make sure admins have the right option
        if(!await userHasRole(req, 'SettingView'))
            throw new NotAuthorizedError('SettingView');

        // Admins can choose to get latest values from database
        if(!validateBoolean(req.query, 'useCache', false))
            await updateSettingsFromDatabase();
    }

    next();
}

function filterSetting (req: express.Request, setting : Setting, name?: string) : boolean {
    const access = req.validatedParams.access as SettingAccess;
    return ((setting.access === access) || (setting.access === 'Public' && access === 'Protected')) &&
        (!name || name === setting.name);
}

/**
 * All routes for the order controller
 */
const routes : IRoute[] = [ 
    // GET /settings (GetSettings)
    {
        method : 'GET',
        url : '/settings',
        handlers : [
            validateSettingParameters,

            async (req: express.Request, res: express.Response) => {
                res.json(
                    settingsToResponse(
                        _.filter(getSettings(), setting => filterSetting(req, setting, validateString(req.query, 'name', false))),
                        req.validatedParams.access === 'Public'));
            }        
        ]
    },

    // GET /settings/:name (GetSetting)
    {
        method : 'GET',
        url : '/settings/:name',

        handlers : [
            validateSettingParameters,

            async (req: express.Request, res: express.Response) => {
                const setting = getSetting(req.params.name as SettingName);
                if(!filterSetting(req, setting))
                    throw new NotFoundError('setting');

                res.json(settingToResponse(setting, req.validatedParams.access === 'Public'));
            }        
        ]
    },

    // PUT /settings/:setting (SetSetting)
    {
        method : 'POST',
        url: '/settings/:name',
        roleAccept : 'SettingEdit',
        handlers : async (req: express.Request, res: express.Response) => {

            await setSetting(
                stringToSettingName(req.params.name),
                validateString(req.body, 'value', true, 0, 1024));

            // Set the value
            return res.json(getSetting(req.params.name as SettingName));
        }
    }
];

/**
 * Initialize the settings by creating an express router and returning it
 */
export function initialize () {
    return router(routes);
}

