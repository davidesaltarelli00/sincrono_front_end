pipeline {
    agent none
    stages {
        stage('Back-end') {
            agent {dockerfile { filename 'Dockerfile.node' }}
            steps {
                sh 'node --version'
                sh 'ng build'
                sh 'pwd && ls dist'
            }
        }

      
        stage('Front-end') {
            agent {dockerfile { filename 'Dockerfile.nginx' }}
            steps {
              sh 'nginx -v'
            }
        }
    }
}


