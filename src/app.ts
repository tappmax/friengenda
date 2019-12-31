(global as any).__basedir = __dirname;

import 'module-alias/register';

import * as express from 'express';
import * as passport from 'passport';
import * as i18n from 'i18n';

// Services
import * as db from '@services/DatabaseService';
import * as LoggerService from '@services/LoggerService';
import * as SettingService from '@services/SettingService';
import * as MailService from '@services/MailService'
import * as UserService from '@services/UserService'

// Controllers
import * as UserController from '@controllers/UserController';
import * as AuthController from '@controllers/AuthController'
import * as DocumentationController from '@controllers/DocumentationController'
import * as SettingsController from '@controllers/SettingController'
import * as VersionController from '@controllers/VersionController'
import * as FileController from '@controllers/FileController'
import * as EnumController from '@controllers/EnumController'

// Misc
import {errorResponse, successResponse} from '@helpers/ResponseHelpers';
import NotFoundError from '@errors/NotFoundError';
import { dateToString } from '@helpers/DateHelpers';

export const isProduction = process.env.NODE_ENV === 'production';

export const app = express();

export async function initialize() {
    const settingServiceHandler = SettingService.initialize();

    LoggerService.initialize();
    
    LoggerService.logger.info("[STARTUP] Initializing application...");

    // Create the postgres pool and initialize all services
    db.initialize();

    // Now that database is initialized we can update the settings from the database
    await SettingService.updateSettingsFromDatabase();

    // Initialzie any services that need initializing
    MailService.initialize();    
    await UserService.initialize();

    // Initialize localization tables
    i18n.configure({
        locales: ['en'],
        directory: __dirname + '/../locales'
    })

    const bodyParser = require('body-parser');
    const cors = require('cors');
    
    app.set('json spaces', 0);
    app.set('view engine', 'pug');
    app.set('etag', false);
    app.use(i18n.init);
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.text());
    app.use(bodyParser.json());
    app.use(FileController.staticProxy(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local"));
    app.use(passport.initialize());
    app.use(settingServiceHandler);

    app.use((req : express.Request, res : express.Response, next : any) => { 
        req.validatedParams = {}
        res.error = (details : any) => {errorResponse(res,details)};
        res.success = () => {successResponse(res)};
        next();
    });
    
    // TODO: dev only
    app.use((request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    // Controllers
    const apiurl = '/api/v1';
    const routes = express.Router()
        .use(apiurl, AuthController.initialize())
        .use(apiurl, UserController.initialize())
        .use(apiurl, SettingsController.initialize())
        .use(apiurl, VersionController.initialize())
        .use(apiurl, EnumController.initialize())
        .use(apiurl, await DocumentationController.initialize())
        .get("/*", FileController.serveStaticFiles);
        
    app.use(routes);
    
    // NotFound handler
    app.use((req: any, res: any, next: (arg0: Error) => void) => {
        errorResponse(res, new NotFoundError());
    });
    
    // 500
    app.use((err: any, req: any, res: any) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: isProduction ? err : { },
            },
        });
    });
    
    process.on('unhandledRejection', err => {
        console.log('Unhandled rejection:', err);
    });
    
    await SettingService.updateSettingsFromDatabase();
    
    if(!module.parent) {
        app.listen(
            SettingService.getSettingValue<number>('WebServerPort'),
            () => LoggerService.logger.info(`[STARTUP] Server running on ${SettingService.getSettingValue('WebServerBaseUrl')} @${dateToString(new Date())}`));
    }
}

if (process.env.NODE_ENV !== 'test') 
    initialize();

