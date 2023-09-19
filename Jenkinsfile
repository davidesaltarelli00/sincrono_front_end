pipeline {
    agent none
    stages {
        stage('Build') {
            agent {dockerfile { filename 'Dockerfile' }}
            steps {
                sh 'node --version'
                sh 'ng build'
                sh 'pwd && ls dist'
            }
        }
    }
}


