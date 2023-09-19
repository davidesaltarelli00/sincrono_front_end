pipeline {
    agent none
    stages {
        stage('Build and Deploy') {
            agent { dockerfile { 
                      filename 'Dockerfile'
                      // args '-u 0 --mount type=bind,source=/home/sviluppo/nginx/server1,target=/home/html'
                               }
                  }
            steps {
                sh 'node --version'
                sh 'ng build'
                // sh 'cp -rvv /var/jenkins_home/workspace/sincronofe_master/dist/sincrono/* /home/html'
                sh 'pwd'
                // sh 'ls /home/html'
            }
        }
    }
}


