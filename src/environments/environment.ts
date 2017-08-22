// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    MEMBER_NODE_CONNECTION: {
        // host: 'localhost',
        host: '10.0.1.106', // Ming's Socket Server
        // host: '10.0.1.163',  // Ollie's Socket Server
        port: 9788,
        path: 'db'
    },
};
