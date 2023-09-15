pipeline {
  agent {
    docker { image 'node:latest' }
  }
  stages {
    stage('Install') {
      steps { 
            sh 'npm install'
            sh 'npm install -g @angular/cli@1.0.2'
            sh 'ng --version' 
      }
    }
 
    stage('Test') {
      parallel {
        stage('Static code analysis') {
            steps { sh 'npm run-script lint' }
        }
        stage('Unit tests') {
            steps { sh 'npm run-script test' }
        }
      }
    }
 
    stage('Build') {
      steps { sh 'npm run-script build' }
    }
  }
}



pipeline {
  agent {
    docker { image 'node:latest' }
  }
 
  stage('NPM Install') {
        /*withEnv(["NPM_CONFIG_LOGLEVEL=warn"]) {*/
        steps{ 
            sh 'npm install'
            sh 'npm install -g @angular/cli@1.0.2'
            sh 'ng --version'
        }
        /*}*/
    }

    stage('Test') {
      parallel {
        stage('Static code analysis') {
            steps { sh 'npm run-script lint' }
        }
        stage('Unit tests') {
            steps { sh 'npm run-script test' }
        }
      }
    }
 
    stage('Build') {
      steps { sh 'npm run-script build' }
    }
  }


