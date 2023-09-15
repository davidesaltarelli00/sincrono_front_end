pipeline {
  agent {
    docker { image 'node:latest' }
  }
  stages {
    stage('Install') {
      steps { 
            sh 'npm install'
            sh 'npm install @angular/cli'
            sh 'ng --version' 
      }
    }
  }
}


