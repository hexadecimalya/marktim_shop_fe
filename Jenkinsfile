def envConfig = [
    staging: [
        url: "https://staging.marktim.shop/api/health",
        service: "marktim_shop_fe_staging.service",
        branch: "staging",
        name: "STAGING" ],
    main: [
        url: "https://marktim.shop/api/health",
        service: "marktim_shop_fe.service",
        branch: "main",
        name: "PRODUCTION" ] ]

def cfg = [:]

pipeline {
  agent any

  environment {
    NODE_VERSION = 'v22.14.0'
    NODE_PATH = "/home/webber/.nvm/versions/node/${NODE_VERSION}/bin"
    PATH = "${NODE_PATH}:${env.PATH}"
    SLACK_WEBHOOK = credentials('slack-webhook')
    NODE_OPTIONS = "--max-old-space-size=4096"
  }

  stages {
     stage('Init') {
      steps {
        script {
          if (!envConfig.containsKey(env.BRANCH_NAME)) {
            error "Branch ${env.BRANCH_NAME} is not deployable"
          }
          cfg = envConfig[env.BRANCH_NAME]
        }
      }
    }
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

    stage('Deploy') {
      steps {
        sh """
          echo "Deploying to ${cfg.name}"
          sudo -u webber bash -lc "
            export PATH=${NODE_PATH}:\$PATH
            cd /home/webber/Projects/marktim_shop_fe
            git pull origin ${cfg.branch}
          "
          sudo systemctl daemon-reload
          sudo systemctl restart ${cfg.service}
        """
      }
    }

    stage('Smoke tests') {
      steps {
        script {
          try {
            sh "./ci/smoke-test.sh ${cfg.url}"
          } catch (err) {
            sh """
              curl -X POST -H 'Content-type: application/json' \
              --data '{\"text\":\"❌ Smoke test FAILED for branch: ${env.BRANCH_NAME}. Check this: ${env.BUILD_URL}\"}' \
              $SLACK_WEBHOOK
            """
            error "Smoke test failed"
          }
        }
      }
    }
  }

  post {
    success {
      sh """
        curl -X POST -H 'Content-type: application/json' \
        --data '{\"text\":\"✅ Build SUCCESS for branch: ${env.BRANCH_NAME}. Check: ${env.BUILD_URL}\"}' \
        $SLACK_WEBHOOK
      """
    }

    failure {
      sh """
        curl -X POST -H 'Content-type: application/json' \
        --data '{\"text\":\"❌ Build FAILED for branch: ${env.BRANCH_NAME}. Check: ${env.BUILD_URL}\"}' \
        $SLACK_WEBHOOK
      """
    }
  }
}
