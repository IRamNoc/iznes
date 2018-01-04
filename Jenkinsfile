node {

}
def notifySlack(String buildStatus = 'STARTED') {
  // Build status of null means success.
  buildStatus = buildStatus ?: 'SUCCESS'

  def color

  if (buildStatus == 'STARTED') {
    color = '#0000CD'
  } else if (buildStatus == 'SUCCESS') {
    color = '#008000'
  } else if (buildStatus == 'UNSTABLE') {
    color = '#FFFF00'
  } else {
    color = '#FF0000'
  }
  def msg = "${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER}:\n${env.BUILD_URL}"
  slackSend(channel : "opencsdfrontenddev", color: color, message: msg)
}

node {
    timestamps {
        try {
            notifySlack()

            stage('Check Out Application Code') {

                checkout([$class                           : 'GitSCM', branches: [[name: '*/master']],
                          doGenerateSubmoduleConfigurations: false, extensions: [],
                          submoduleCfg                     : [], userRemoteConfigs:
                              [[credentialsId: '6afd5a8d-023a-49f6-ba58-4f6b35cf3023',
                                url          : 'git@si-nexus01.dev.setl.io:opencsd-rewrite/opencsd-frontend-clarity.git']]])
            }

            stage('Build & Unit Test') {


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
                }sh '''rm -f yarn.lock
                             yarn install &&
                             yarn test-single &&
                             cd src &&
                             sass styles.scss:styles.css &&
                             cd ../ '''
            }

        } catch (e) {
            currentBuild.result = 'FAILURE'
            throw e
        } finally {
            notifySlack(currentBuild.result)
        }
    }
}
