import * as semver from 'semver';
import * as _ from 'lodash';
import * as express from "express";
import { IRoute, router } from '@helpers/RouteHelpers'
import { getSettingValue } from '@services/SettingService';
import { validateString, validateEnum } from '@helpers/ValidationHelpers';
import InvalidParameterError from '@errors/InvalidParameterError';
import { parseStringUnionType } from '@helpers/ModelHelpers';
import { SettingName } from '@models/Setting';

const PlatformNameStrings = ['IOS', 'Android'] as const;
type PlatformName = typeof PlatformNameStrings[number];
const stringToPlatformName = parseStringUnionType<PlatformName>(PlatformNameStrings);

/**
 * All routes for the version controller
 */
const routes : IRoute[] = [ 
    
    // GET /version/check (CheckVersion)
    {
        method : 'GET',
        url : '/version/check',
        authenticate : false,
        handlers : [
            async (req: express.Request, res: express.Response) => {
                var version = semver.valid(validateString(req.query,'version',true));
                if(null == version)
                    throw new InvalidParameterError('version');

                const platform = validateEnum<PlatformName>(req.query,'platform',true,stringToPlatformName);
                const minVersion = getSettingValue<string>(`${origin}VersionMin${platform}` as SettingName);
                res.json({
                    packageName : semver.gte(version, minVersion) ? 
                        null : 
                        getSettingValue<string>(`${origin}VersionUpgrade${platform}` as SettingName)
                });
            }      
        ]
    }    
];

export function initialize () {
    return router(routes);
}
