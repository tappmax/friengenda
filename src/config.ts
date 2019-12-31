const fs = require ('fs');

module.exports = {

    loadConfig : () => {
        // Load the approriate config file for the environment
        let configNames = [ 'local' ]
        if(process.env["NODE_ENV"]) {
            configNames = [process.env["NODE_ENV"], ...configNames];
    
            if(process.env["NODE_ENV"]==='test')
                configNames = ['local-test', ...configNames];
        }
    
        const configPaths = [
            `${__dirname}/../config/`,
            `${__dirname}/../../config/`
        ]
    
        let config;
        for(let i=0; i<configNames.length && !config; i++) {    
            for(var j=0; j<configPaths.length && !config; j++) {    
                try {
                    config = JSON.parse(fs.readFileSync(`${configPaths[j]}${configNames[i]}.json`, 'utf8'))
                    console.log(`Using config: '${configNames[i]}'`);
                } catch (err) {
                }    
            }
        }
    
        return config;
    }
};
