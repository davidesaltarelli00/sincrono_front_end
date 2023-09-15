pipeline {
  agent {
    docker { image 'node:latest' }
  }
  stages {
    stage('Install') {
      steps { 
            sh 'npm install'
            sh 'npm install -g @angular/cli'
            sh 'ng --version' 
      }
    }
  }
}


