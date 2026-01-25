def envConfig = [
    staging: [
        url: "https://staging.marktim.shop/",
        service: "marktim_shop_fe_staging.service",
        branch: "staging",
        name: "STAGING" ],
    main: [
        url: "https://marktim.shop/",
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
    NODE_OPTIONS = "--max-old-space-size=4096"
    SLACK_WEBHOOK = credentials('slack-webhook')
  }

  stages {

    stage('Init') {
      steps {
        script {
            if (!(env.BRANCH_NAME in ['staging', 'main'])) {
              echo "Branch ${env.BRANCH_NAME} is not allowed. Skipping pipeline."
              currentBuild.result = 'NOT_BUILT'
              error('Pipeline stopped: unsupported branch')
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
        script {
          def code = sh(
            script: '''
              set -e
              npm ci
              npm run build
            ''',
            returnStatus: true
          )
          if (code != 0) {
            notifySlack("❌ Build FAILED during Build stage for ${env.BRANCH_NAME}. ${env.BUILD_URL}")
            error "Build failed with exit code ${code}"
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          def code = sh(
            script: """
              echo "Deploying to ${cfg.name}"

              sudo -u webber bash -lc 'export PATH=${NODE_PATH}:\$PATH && \
                cd /home/webber/Projects/marktim_shop_fe && \
                git pull origin ${cfg.branch}'

              sudo systemctl daemon-reload
              sudo systemctl restart ${cfg.service}
            """,
            returnStatus: true
          )

          if (code != 0) {
            notifySlack("❌ Deployment FAILED for ${env.BRANCH_NAME}. ${env.BUILD_URL}")
            error "Deployment failed with exit code ${code}"
          }
        }
      }
    }
    stage('Smoke tests') {
      steps {
        script {
          def status = sh(
            script: "./ci/smoke-test.sh ${cfg.url}",
            returnStatus: true
          )

          if (status != 0) {
            notifySlack("❌ Smoke test FAILED for ${env.BRANCH_NAME}. ${env.BUILD_URL}")
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
    aborted { 
      echo "Pipeline aborted — no Slack notification needed." 
      }
  }
}
