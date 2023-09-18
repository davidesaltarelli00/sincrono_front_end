pipeline {
    agent none
    stages {
        stage('Back-end') {
            agent { dockerfile true }
            steps {
                sh 'node --version'
                sh 'ng build'
                sh 'pwd && ls dist'
            }
        }
        stage('Front-end') {
            agent {
                docker { image 'nginx' }
            }
            steps {
              sh 'nginx -v'
            }
        }
    }
}


