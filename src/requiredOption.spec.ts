import * as RequiredOptions from './requiredOption';

describe('getConfig', ()=> {
    let serverless: any;

    beforeEach(() => {
        serverless = {
            cli: {
                consoleLog: () => {},
            },
            service: {
                service: 'required-options',
                custom: {
                    requiredOptions: ['region'],
                },
            },
            pluginManager: {
                cliOptions: {},
            }
        };
    });

    it('empty config if config not exists', () => {
        serverless.service.custom = {};
        expect(RequiredOptions.getConfig(serverless.service)).toStrictEqual({
            requiredOptions: [],
        });
    });

    // it('empty config if custom section not exists', () => {
    //     serverless.service.custom = undefined;
    //     expect(RequiredOptions.getConfig(serverless.service)).toStrictEqual({
    //         requiredOptions: [],
    //     });
    // });

    it('requied region option', () => {
        expect(RequiredOptions.getConfig(serverless.service)).toStrictEqual({
            requiredOptions: ['region'],
        });
    });

    it('not requied stage option', () => {
        expect(RequiredOptions.getConfig(serverless.service).requiredOptions).not.toContain('stage');
    });
});

describe('validateOption', () => {
    let serverless: any;
    class ServerlessError extends Error {};

    beforeEach(() => {
        serverless = {
            cli: {
                consoleLog: () => {},
                log: () => {},
            },
            service: {
                custom: {},
            },
            pluginManager: {
                cliOptions: {},
            },
            classes: {
                Error: ServerlessError,
            }
        };
        serverless.service.service = 'required-options';
    });

    describe('when required option "region" given', () => {
        it('not throw an error when given region option', () => {
            serverless.service.custom.requiredOptions = ['region'];
    
            serverless.pluginManager.cliOptions = {
                region: 'ap-northeast-1',
            };
    
            expect(() => {
                RequiredOptions.validateOption(serverless);
            }).not.toThrow();
        });

        it('throw an error when not given region option', () => {
            serverless.service.custom.requiredOptions = ['region'];
    
            serverless.pluginManager.cliOptions = {
                stage: 'dev',
            };
    
            expect(() => {
                RequiredOptions.validateOption(serverless);
            }).toThrow();
        });
    });
});