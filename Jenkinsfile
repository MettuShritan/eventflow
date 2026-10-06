pipeline {
  agent any

  environment {
    CI = 'true'
    APP_URL = 'http://eventflow-jenkins:3000'
    SELENIUM_URL = 'http://eventflow-selenium:4444'
    DATABASE_URL = 'postgresql://eventflow:eventflow@eventflow-postgres:5432/eventflow?schema=public'
    AUTH_SECRET = credentials('eventflow-auth-secret')
    BOOTSTRAP_ADMIN_EMAIL = credentials('eventflow-admin-email')
    BOOTSTRAP_ADMIN_PASSWORD = credentials('eventflow-admin-password')
    BOOTSTRAP_CONDUCTOR_EMAIL = credentials('eventflow-conductor-email')
    BOOTSTRAP_CONDUCTOR_PASSWORD = credentials('eventflow-conductor-password')
    E2E_ADMIN_EMAIL = credentials('eventflow-admin-email')
    E2E_ADMIN_PASSWORD = credentials('eventflow-admin-password')
    E2E_CONDUCTOR_EMAIL = credentials('eventflow-conductor-email')
    E2E_CONDUCTOR_PASSWORD = credentials('eventflow-conductor-password')
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Install Dependencies') {
      steps { sh 'npm install --no-audit --no-fund' }
    }

    stage('Database') {
      steps {
        sh '''
          docker network create eventflow-ci >/dev/null 2>&1 || true
          docker network connect eventflow-ci eventflow-jenkins >/dev/null 2>&1 || true
          docker rm -f eventflow-postgres >/dev/null 2>&1 || true
          docker run -d --name eventflow-postgres --network eventflow-ci \
            -e POSTGRES_USER=eventflow \
            -e POSTGRES_PASSWORD=eventflow \
            -e POSTGRES_DB=eventflow \
            postgres:16-alpine >/dev/null
          for i in $(seq 1 30); do
            docker exec eventflow-postgres pg_isready -U eventflow -d eventflow >/dev/null 2>&1 && exit 0
            sleep 2
          done
          docker logs eventflow-postgres
          exit 1
        '''
        sh 'npx prisma db push'
        sh 'npm run db:seed'
      }
    }

    stage('Lint & Unit Tests') {
      steps {
        sh 'npm run lint'
        sh 'npm test'
      }
    }

    stage('Build') {
      steps { sh 'npm run build' }
    }

    stage('Start Application') {
      steps {
        sh 'nohup npm start > eventflow-app.log 2>&1 & echo $! > eventflow-app.pid'
        sh 'for i in $(seq 1 30); do curl -fsS http://127.0.0.1:3000 > /dev/null && exit 0; sleep 2; done; cat eventflow-app.log; exit 1'
      }
    }

    stage('Start Selenium') {
      steps {
        sh 'docker rm -f eventflow-selenium >/dev/null 2>&1 || true'
        sh 'docker run -d --name eventflow-selenium --network eventflow-ci --shm-size=2g selenium/standalone-chrome:4.29.0-20250222'
        sh "for i in \$(seq 1 30); do curl -fsS http://eventflow-selenium:4444/status | grep -q '\"ready\":true' && exit 0; sleep 2; done; docker logs eventflow-selenium; exit 1"
      }
    }

    stage('Selenium E2E Tests') {
      steps { sh 'BASE_URL=$APP_URL SELENIUM_URL=$SELENIUM_URL npm run test:e2e' }
    }

    stage('Security Validation') {
      steps { sh 'npm audit --audit-level=high || true' }
    }

    stage('Docker Build') {
      steps { sh 'docker build -t eventflow:${BUILD_NUMBER} .' }
    }

    stage('Deploy') {
      steps { sh 'ansible-playbook -i ansible/inventory.ini ansible/deploy.yml --check' }
    }
  }

  post {
    always {
      sh 'docker rm -f eventflow-selenium >/dev/null 2>&1 || true'
      sh 'docker rm -f eventflow-postgres >/dev/null 2>&1 || true'
      sh 'if [ -f eventflow-app.pid ]; then kill $(cat eventflow-app.pid) || true; fi'
      archiveArtifacts artifacts: 'eventflow-app.log', allowEmptyArchive: true
    }
  }
}
