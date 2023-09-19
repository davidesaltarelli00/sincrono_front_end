pipeline {
    agent none
    stages {
        stage('Build and Deploy') {
            agent { dockerfile { 
                      filename 'Dockerfile'
                      args '-u 0 -v /var/jenkins_home/server1:/var/jenkins_home/server1 -v /var/jenkins_home/server2:/var/jenkins_home/server2'
                               }
                  }
            steps {
                sh 'node --version'
                sh 'ng build'
                sh 'cp -rvv /var/jenkins_home/workspace/sincronofe_master/dist/sincrono/* /var/jenkins_home/server1'
            }
        }
    }
}


