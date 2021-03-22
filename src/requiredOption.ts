import { Console } from 'node:console';
import { type } from 'node:os';
import * as Serverless from 'serverless';
import * as Service from 'serverless/classes/Service';

const ERROR_PREFIX = 'RequiredOptions error:'

interface RequiredOptionsConfig {
    requiredOptions: string[];
};

function validateOption(serverless: Serverless): void {
    const config = getConfig(serverless.service);
    const cliOptions = serverless.pluginManager.cliOptions;

    (config.requiredOptions).forEach((requiredOption) => {
        if (!cliOptions.hasOwnProperty(requiredOption)){
            const errorMessage: string = `${ERROR_PREFIX} Option ${requiredOption} is required but has no value`;
            serverless.cli.log(errorMessage);
            // @ts-ignore
            throw new serverless.classes.Error(errorMessage);
        }
    });
}

function getConfig(service: Service): RequiredOptionsConfig{
    if(!service.custom.requiredOptions || service.custom.requiredOptions === undefined) {
        return {
            requiredOptions: [],
        };
    }
    return {
        requiredOptions: service.custom.requiredOptions,
    };
}


export {
    validateOption,
    getConfig,
};