import * as _ from 'lodash';
import * as fs from 'fs'
import * as express from 'express';
import {logger} from '@services/LoggerService';
import {getSettingValue} from '@services/SettingService';

const basePath = (global as any).__basedir + '/../docs/';
const indexPath = basePath + 'index.yaml';
const readmePath = (global as any).__basedir + '/../README.md';

import {resolveRefs} from 'json-refs';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'js-yaml';
const markdown = require( "markdown").markdown;

export async function initialize() {
    const router = express.Router();

    if(process.env.NODE_ENV !== 'production') {
        logger.info(`[STARTUP] Documentation installed at ${getSettingValue('WebServerBaseUrl')}/docs`);

        const results = await resolveRefs(
            YAML.safeLoad(fs.readFileSync(indexPath, 'utf8')), {
                filter : ['relative'],
                includeInvalid : false,
                location: indexPath,
                loaderOptions : {
                    processContent : function (res,callback) {
                        callback(YAML.safeLoad(res.text))
                    },
                }
            }
        );

        // File separation leaves as an array, flatten it into one object
        results.resolved['paths'] = _.assign({}, ...results.resolved['paths']);

        router.use('/docs/api', swaggerUi.serve, swaggerUi.setup(results.resolved));

        const readme = markdown.toHTML(
            fs.readFileSync(readmePath, 'utf8')
        );

        router.use('/docs', (req: express.Request, res: express.Response)=> {
            res.set('Content-Type', 'text/html');
            res.send(readme);
        })


    }

    return router;
}


