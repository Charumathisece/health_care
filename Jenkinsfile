pipeline {
    agent any

    environment {
        IMAGE = "health-backend"
        TAG = "${env.BUILD_ID}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test || true'
                }
            }
        }

        stage('Docker Build') {
            steps {
                dir('backend') {
                    sh "docker build -t ${IMAGE}:${TAG} ."
                }
            }
        }

        stage('Docker Run') {
            steps {
                sh "docker run -d --name ${IMAGE}-container -p 3000:3000 ${IMAGE}:${TAG} || true"
            }
        }
    }

    post {
        always {
            echo "Pipeline Finished"
        }
    }
}
