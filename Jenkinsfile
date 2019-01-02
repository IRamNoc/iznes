node('jenkins03') {
    timestamps {
        stage('Check Out Tests') {
            checkout([$class: 'GitSCM', branches: [[name: '*/master']],
                      doGenerateSubmoduleConfigurations: false, extensions: [],
                      submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'd2b5fbd5-eb0f-4619-a094-d7d6f7fa249c',
                                                             url: 'git@si-nexus01.dev.setl.io:opencsd-rewrite/opencsd-frontend-clarity.git']]])
        }

        stage('Build & Unit Test') {

            sh '''rm -f yarn.lock &&
                        yarn install &&
                        yarn upgrade &&
                        yarn test &&
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
            sh '''  rm -rf /var/lib/jenkins/Deploy/dist &&
                        cp VERSION ./dist &&
                        rsync -a ./dist /var/lib/jenkins/Deploy/'''

            sh 'php /var/lib/jenkins/build/tools/move-code.php opencsd-iznes dev /var/lib/jenkins/Deploy/dist'

        }

        stage('Sonar Scan') {
            withSonarQubeEnv {

                sh 'gulp sonar --project New_OpenCSD_FrontEnd '
            }
        }
    }
}
