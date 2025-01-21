**API Websocket**

AWS API Websocket En API Gateway, puede crear una API de WebSocket como un frontend con estado para un servicio de AWS (como Lambda o DynamoDB) o para un punto de enlace HTTP. La API de WebSocket invoca al backend en función del contenido de los mensajes que recibe de las aplicaciones cliente.

A diferencia de una API de REST, que recibe las solicitudes y responde a ellas, una API de WebSocket admite la comunicación bidireccional entre las aplicaciones cliente y el backend. El backend puede enviar mensajes de devolución de llamada a los clientes conectados.

En la API de WebSocket, los mensajes JSON entrantes se dirigen a las integraciones de backend en función de las rutas que se hayan configurado. (Los mensajes que no son de JSON se dirigen a la ruta `$default` que se configure).


