node
  {
    stage('Check Out Application Code'){

      checkout([$class: 'GitSCM', branches: [[name: '*/master']],
                doGenerateSubmoduleConfigurations: false, extensions: [],
                submoduleCfg: [], userRemoteConfigs:
                  [[credentialsId: '6afd5a8d-023a-49f6-ba58-4f6b35cf3023',
                    url: 'git@si-nexus01.dev.setl.io:opencsd-rewrite/opencsd-frontend-clarity.git']]])
    }

    stage('Build & Test'){

      sh '''yarn upgrade && 
              yarn test-single'''

    }

    stage('Sonar Scan'){
      withSonarQubeEnv {

        sh 'sudo gulp sonar --project New_OpenCSD_FrontEnd '
      }
    }
  }
