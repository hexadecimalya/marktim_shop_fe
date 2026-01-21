pipeline {
  agent any

  environment {
    NODE_VERSION = 'v22.14.0'
    NODE_PATH = "/home/webber/.nvm/versions/node/${NODE_VERSION}/bin"
    PATH = "${NODE_PATH}:${env.PATH}"
    SLACK_WEBHOOK = credentials('slack-webhook')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh '''
          set -e
          npm ci
          npm run build
        '''
      }
    }

    stage('Deploy to staging') {
      when {
        branch 'staging'
      }
      steps {
        sh '''
          echo "Deploying to STAGING"

          sudo -u webber bash -lc "
            export PATH=${NODE_PATH}:\$PATH
            cd /home/webber/Projects/marktim_shop_fe
            git pull origin staging
          "

          sudo systemctl daemon-reload
          sudo systemctl restart marktim_shop_fe_staging.service
        '''
      }
    }
   stage('Smoke tests (staging)') {
    when { branch 'staging' }
    steps {
        script {
            try {
                sh './ci/smoke-staging.sh'
            } catch (err) {
                sh '''
                curl -X POST -H 'Content-type: application/json' \
                --data '{\"text\":\"❌  Smoke test  FAILED for branch: ${BRANCH_NAME}. Check: ${BUILD_URL}\"}' \
                $SLACK_WEBHOOK
                '''
                error "Smoke test failed"
            }
        }
    }
}
    stage('Deploy to production') {
      when {
        branch 'main'
      }
      steps {
        sh '''
          echo "Deploying to PRODUCTION"
          # prod deploy later
        '''
      }
    }
  }
   post {  
    success {
      sh '''
      curl -X POST -H 'Content-type: application/json' \
        --data '{\"text\":\"✅ Staging build SUCCESS for branch: ${BRANCH_NAME}\"}' \
      $SLACK_WEBHOOK
      '''
    }

    failure {
      sh '''
      curl -X POST -H 'Content-type: application/json' \
       --data '{\"text\":\"❌ Staging build FAILED for branch: ${BRANCH_NAME}. Check: ${BUILD_URL}\"}' \
      $SLACK_WEBHOOK
      '''
    }
  }
}
