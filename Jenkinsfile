pipeline {
  agent any
  environment { IMAGE = "eventflow:${BUILD_NUMBER}" }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install Dependencies') { steps { sh 'npm ci' } }
    stage('Build') { steps { sh 'npx prisma generate && npm run build' } }
    stage('Unit Tests') { steps { sh 'npm test' } }
    stage('Selenium Tests') { steps { sh 'npm run test:selenium' } }
    stage('Security Validation') { steps { sh 'npm audit --audit-level=high' } }
    stage('Docker Build') { steps { sh 'docker build -t $IMAGE .' } }
    stage('Docker Test') { steps { sh 'docker run --rm $IMAGE node -e "console.log(\'container smoke test passed\')"' } }
    stage('Deployment') { steps { sh 'ansible-playbook -i ansible/inventory ansible/playbook.yml' } }
  }
  post { failure { echo 'Pipeline failed. Deployment stage is not reached when earlier stages fail.' } }
}
