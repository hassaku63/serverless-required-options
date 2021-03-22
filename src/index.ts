import * as Serverless from 'serverless';
import * as BbPromise from 'bluebird';
import { validateOption } from './requiredOption';


class RequiredOptionPlugin {
    public serverless: Serverless;
    public options: Serverless.Options;
    public hooks;

    constructor (serverless: Serverless, options: Serverless.Options) {
        this.serverless = serverless;
        this.options = options;

        this.hooks = {
            'after:package:initialize': this.serverless.pluginManager.run(['requiredOption', 'validate']),
            'requiredoption:validate': BbPromise.bind(this).then(this.validate),
        };

        // @ts-ignore
        this.commands = {
            requiredoption: {
                commands: {
                    validate: {
                        usage: 'Internal command. do NOT use from CLI.',
                    },
                },
                lifecycleEvents: ['validate'],
                usage: 'Internal command. do NOT use from CLI.',
            },
        };
    }

    async validate() {
        validateOption(this.serverless);
    }
}

module.exports = RequiredOptionPlugin;
