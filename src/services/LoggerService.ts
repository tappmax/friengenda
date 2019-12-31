import * as winston from 'winston';
import { getSettingValue } from '@services/SettingService';
import { isProduction } from '../app'

export let logger : winston.Logger;

const format = getSettingValue<string>("LoggerFormat") == 'json' ?
    winston.format.json() :
    winston.format.simple();

export function initialize () {
    const transports = [];

    if(!isProduction)
        transports.push(
            new winston.transports.Console({
            level : getSettingValue<string>("LoggerLevel"),
            format : format
            })
        )

    const loggerFilename = getSettingValue<string>('LoggerFilename');
    if(loggerFilename && loggerFilename.length > 0)
        transports.push(
            new winston.transports.File({ 
                filename: `${loggerFilename}`, 
                level: getSettingValue<string>("LoggerLevel"),
                format: format
            })
        )

    logger = winston.createLogger({
        transports: transports
    });
}

