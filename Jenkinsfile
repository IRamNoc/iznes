node {

}

node {
    timestamps {

            stage('Check Out Application Code') {

                checkout([$class                           : 'GitSCM', branches: [[name: '*/master']],
                          doGenerateSubmoduleConfigurations: false, extensions: [],
                          submoduleCfg                     : [], userRemoteConfigs:
                              [[credentialsId: '6afd5a8d-023a-49f6-ba58-4f6b35cf3023',
                                url          : 'git@si-nexus01.dev.setl.io:opencsd-rewrite/opencsd-frontend-clarity.git']]])
            }

            stage('Build & Unit Test') {

                sh '''rm -f yarn.lock &&
                        yarn install &&
                        yarn test-single &&
                        cd src &&
                        sass styles.scss:styles.css &&
                        cd ../ '''

                junit allowEmptyResults: true, keepLongStdio: true,
                    testResults: '/TESTS-Headless**'
            }

            stage('Build Prod') {
                sh 'yarn build-prod '
            }

            stage('Copy code to deployment folder') {
                sh '''rsync -avzh /var/lib/jenkins/Deploy/* /var/lib/jenkins/Deploy_old/ &&
                        rm -rf /var/lib/jenkins/Deploy/dist &&
                        rsync -a ./dist /var/lib/jenkins/Deploy/'''

            }

            stage('Sonar Scan') {
                withSonarQubeEnv {

                    sh 'sudo gulp sonar --project New_OpenCSD_FrontEnd '
                }
            }
        }
}
