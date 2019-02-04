node() {
    timestamps {
        stage('Check Out Tests') {
            checkout([$class: 'GitSCM', branches: [[name: '*/master']],
                      doGenerateSubmoduleConfigurations: false, extensions: [],
                      submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'd2b5fbd5-eb0f-4619-a094-d7d6f7fa249c',
                                                             url: 'git@si-nexus01.dev.setl.io:opencsd-rewrite/opencsd-frontend-clarity.git']]])
        }

        try {
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
        }catch (e) {
            currentBuild.result = "FAILED"

            emailext attachLog: true,
                compressLog: true,

                recipientProviders: [culprits()],
                replyTo: 'no-reply@setl.io',
                subject: "Unit Tests for Job '${env.JOB_NAME}'- (${env.BUILD_NUMBER}) have FAILED",
                body: "Please go to ${env.BUILD_URL} for more details. "

            mail(to: 'bill.mackie@setl.io, neil.gentry@setl.io, jordan.miller@setl.io, mingrui.huang@setl.io, ollie.kett@setl.io',
                subject: "Unit tests For Job '${env.JOB_NAME}'- (${env.BUILD_NUMBER}) has FAILED",
                body: "Please go to ${env.BUILD_URL} for more details. ");

        }

        try {
            stage('Build Prod') {
                sh 'yarn build-prod '
            }
        }catch (e) {
            currentBuild.result = "FAILED"

            emailext attachLog: true,
                compressLog: true,

                recipientProviders: [culprits()],
                replyTo: 'no-reply@setl.io',
                subject: "Production Build for Job '${env.JOB_NAME}'- (${env.BUILD_NUMBER}) have FAILED",
                body: "Please go to ${env.BUILD_URL} for more details. "

            mail(to: 'bill.mackie@setl.io, neil.gentry@setl.io, jordan.miller@setl.io, mingrui.huang@setl.io, ollie.kett@setl.io',
                subject: "Production Build for Job '${env.JOB_NAME}'- (${env.BUILD_NUMBER}) has FAILED",
                body: "Please go to ${env.BUILD_URL} for more details. ");

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
