const { exec } = require('child_process');

/*
To run from project root:
node src/projects/tools/updateRepos.js
*/

const repos = {
    "ofi-main": "git@si-nexus01.dev.setl.io:OFI_Modules/ofi-main.git",
    "asset-servicing": "git@si-nexus01.dev.setl.io:SETL_Modules/Angular-Module.git#feat/angular6",
    "core-account": "git@si-nexus01.dev.setl.io:SETL_Modules/core-account.git#feat/angular6",
    "core-account-admin": "git@si-nexus01.dev.setl.io:SETL_Modules/core-account-admin.git#feat/angular6",
    "core-balances": "git@si-nexus01.dev.setl.io:SETL_Modules/core-balances.git#feat/angular6",
    "core-connections": "git@si-nexus01.dev.setl.io:SETL_Modules/core-connections.git#feat/angular6",
    "core-contracts": "git@si-nexus01.dev.setl.io:SETL_Modules/core-contracts.git#feat/angular6",
    "core-corp-actions": "git@si-nexus01.dev.setl.io:SETL_Modules/core-corp-actions.git#feat/angular6",
    "core-filedrop": "git@si-nexus01.dev.setl.io:SETL_Modules/Angular_components/filedrop.git#feat/angular6",
    "core-fileviewer": "git@si-nexus01.dev.setl.io:SETL_Modules/core-fileviewer.git#feat/angular6",
    "core-layout": "git@si-nexus01.dev.setl.io:SETL_Modules/core-layout.git#feat/angular6",
    "core-login": "git@si-nexus01.dev.setl.io:SETL_Modules/login.git#feat/angular6",
    "core-manage-member": "git@si-nexus01.dev.setl.io:SETL_Modules/core-manage-member.git#feat/angular6",
    "core-messages": "git@si-nexus01.dev.setl.io:SETL_Modules/core-messages.git#feat/angular6",
    "core-persist": "git@si-nexus01.dev.setl.io:SETL_Modules/core-persist.git#feat/angular6",
    "core-redux-store": "git@si-nexus01.dev.setl.io:SETL_Modules/Generic_modules/core-redux-store.git#feat/angular6",
    "core-req-services": "git@si-nexus01.dev.setl.io:SETL_Modules/Angular_services/core-req-services.git#feat/angular6",
    "core-test-util": "git@si-nexus01.dev.setl.io:SETL_Modules/core-test-util.git",
    "core-useradmin": "git@si-nexus01.dev.setl.io:SETL_Modules/core-useradmin.git#feat/angular6",
    "jaspero-ng2-alerts": "git@si-nexus01.dev.setl.io:SETL_Modules/Angular_components/jaspero-ng2-alerts.git#feat/angular6",
    "multilingual": "git@si-nexus01.dev.setl.io:SETL_Modules/multilingual.git#feat/angular6",
    "permission-grid": "git@si-nexus01.dev.setl.io:SETL_Modules/Angular_components/permission-grid.git#feat/angular6",
    "socketcluster-wrapper": "git@si-nexus01.dev.setl.io:SETL_Modules/Generic_modules/socketcluster-wrapper.git#feat/angular6",
    "tslint-config-setl": "git@si-nexus01.dev.setl.io:common-components/tslint-config-setl.git",
    "utils": "git@si-nexus01.dev.setl.io:SETL_Modules/Generic_modules/utils.git#feat/angular6",
    "vanilla-websocket-wrapper": "git@si-nexus01.dev.setl.io:SETL_Modules/Generic_modules/vanilla_websocket_wrapper.git#feat/angular6",
    "websocket-service": "git@si-nexus01.dev.setl.io:SETL_Modules/Angular_services/websocket-service.git#feat/angular6"
};


// const repos = {
//     "core-layout": "git@si-nexus01.dev.setl.io:SETL_Modules/core-layout.git#feat/angular6#feat/angular8",
// };

// Start function
const start = async () => {
    for (name in repos) {
        let url = repos[name];
        url = url.split('#');

        let branch = 'master';
        
        // check for custom branch
        if(url[1]){
            branch = url[1];
        }

        url = url[0];

        console.log(`[Origin] Add: ${name} (Branch: ${branch})`);
        await addOrigin(name, url);

        console.log(`[Pull] ${name}`);
        await getLatest(name, url, branch);
    }

    console.log('\x1b[32m%s\x1b[0m', '[Success] Merged all subrepos');  //cyan
}

const addOrigin = async (name, url) => {
    return new Promise(function(resolve, reject) {

        console.log(`git remote add ${name} ${url}`);

        exec(`git remote add ${name} ${url}`, (err, stdout, stderr) => {
            if(err){
                console.log(`[Origin] Exsits: ${name}`);
                resolve(false);
            }else {
                resolve(true);
            }
        });
    });
}

const getLatest = async (name, url, branch = 'master') => {
    return new Promise(function(resolve, reject) {

        console.log(`git pull -s subtree -Xsubtree=src/projects/${name}/ ${name} ${branch}`);

        exec(`git subtree add --prefix=src/projects/${name}/ ${name} ${branch}`, (err, stdout, stderr) => {
            if(err){
                console.log(err);
                console.log('\x1b[31m%s\x1b[0m', `[Pull] Cannot Auto Resolve: ${name}`);  //cyan
                process.exit(1);
                resolve(false);
            }else {
                resolve(true);
            }
        });
    });
}

// Call start
start();