pipeline {
    agent any

    environment {
        PROJECT_KEY    = 'student3'
        PROJECT_NAME   = 'student3'
        IMAGE_NAME     = 'student3'
        CONTAINER_NAME = 'student3'
        APP_PORT       = '3005'
        SONAR_HOST_URL = 'http://192.168.119.129:9000'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Checkout') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Snyk Scan') {
            steps {
                sh 'npm audit --audit-level=low || true'
                echo 'Snyk scan stage placeholder'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                            -Dsonar.projectKey=$PROJECT_KEY \
                            -Dsonar.projectName=$PROJECT_NAME \
                            -Dsonar.projectVersion=1.0 \
                            -Dsonar.sources=. \
                            -Dsonar.inclusions=**/*.js \
                            -Dsonar.sourceEncoding=UTF-8 \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Run App') {
            steps {
                sh 'docker rm -f ${CONTAINER_NAME} || true'
                sh 'docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:3000 ${IMAGE_NAME}:latest'
            }
        }

        stage('ZAP Scan') {
            steps {
                echo 'ZAP scan stage'
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                echo 'Kubernetes deploy stage'
            }
        }
    }

    post {
        success {
            echo 'Pipeline finished successfully.'
        }
        failure {
            echo 'Pipeline failed. Review SonarQube and Jenkins logs.'
        }
        always {
            echo 'Pipeline ended.'
        }
    }
}
