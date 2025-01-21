# URL: https://www.youtube.com/watch?v=DzpGfyB0iKk&ab_channel=CompleteCoding

Comand: sls deploy

# Deploy: 

sls deploy
Serverless: Running "serverless" installed locally (in service node_modules)
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service myserverlessproject2.zip file to S3 (35.02 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...........................
Serverless: Stack update finished...
Service Information
service: myserverlessproject2
stage: dev
region: us-east-1
stack: myserverlessproject2-dev
resources: 31
api keys:
  None
endpoints:
  wss://gbw4cb3h2j.execute-api.us-east-1.amazonaws.com/dev
functions:
  websocket-connect: myserverlessproject2-dev-websocket-connect
  websocket-disconnect: myserverlessproject2-dev-websocket-disconnect
  websocket-default: myserverlessproject2-dev-websocket-default
  websocket-message: myserverlessproject2-dev-websocket-message
layers:
  None

# Test

http://websocket.org/echo.html

Para desconectar Clientes: 
https://docs.aws.amazon.com/es_es/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-connections.html


ERRORES:

- Los Lambda muestran errores de codigo
- DynamoDB establece el PK y SK e identifica tipo de variables
- cuando se compila por primera vez no siempres funciona por lo que hay que compilar de nuevo
