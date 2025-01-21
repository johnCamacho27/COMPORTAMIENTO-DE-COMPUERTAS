const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.tableName;

exports.handler = async event => {
    
    // console.log('event', event);

    const { connectionId: connectionID, stage, domainName } = event.requestContext;

    // ID (Hash) de conexion de webSocket table WebsocketUsers
    // date (ISO UTF-8) de conexion de webSocket WebsocketUsers
    // device ini = [] -> config = UPDATE (nameESP#codeESP) de conexion de webSocket WebsocketUsers
    // stage (API Stage) de conexion de webSocket WebsocketUsers
    // domainName (API conection) de conexion de webSocket WebsocketUsers

    const data = {
        ID: connectionID,
        date: Date.now(),
        device: [],
        stage,
        domainName,
    };

    await Dynamo.write(data, tableName);
    
    return Responses._200({ message: 'connected!' });

};

// wss://kvlek4n7a5.execute-api.us-east-1.amazonaws.com/dev

