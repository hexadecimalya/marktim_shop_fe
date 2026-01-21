pipeline {
  agent any

  environment {
    NODE_VERSION = 'v22.14.0'
    NODE_PATH = "/home/webber/.nvm/versions/node/${NODE_VERSION}/bin"
    PATH = "${NODE_PATH}:${env.PATH}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Deploy to staging') {
      steps {
        sh '''
          set -e
          echo "Deploying branch: staging"

          sudo -u webber bash -lc "
            set -e
            export PATH=${NODE_PATH}:\$PATH

            cd /home/webber/Projects/marktim_shop_fe

            git checkout staging
            git pull origin staging

            npm ci
            npm run build
          "
        '''
      }
    }

    stage('Restart service') {
      steps {
        sh '''
          sudo systemctl daemon-reload
          sudo systemctl restart marktim_shop_fe_staging.service
        '''
      }
    }
  }

  post {
    success {
      echo 'Staging deployment successful'
    }
    failure {
      echo 'Staging deployment failed'
    }
  }
}
