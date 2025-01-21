const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;
const tableData = process.env.tableData;

exports.handler = async event => {
         


    const { connectionId: connectionID } = event.requestContext;



    const body = JSON.parse(event.body);
     
    // Nombre del ESP32 -> espName
    // Configuracion Inicial del ESP32 -> message 

    try {

        // Verifico que el dispositivo este conectado
        const recordConection = await Dynamo.get(connectionID, tableName);            
        const { device, domainName, stage} = recordConection;
        
        let deviceConnect = body.espCLIENT+"#"+body.espCode;

        

        // Verifico si se encuentra connectado
        if ( device === deviceConnect ) {

            // Config JSON data to ESP
            let data = dataClient(body);

            const dataToSave = {
                ID: deviceConnect,
                sortKey: Date.now(),                
                ...data
                };
            
            const dataSave =  await Dynamo.write(dataToSave, tableData);


            // Confirmo Configuracion            
            await WebSocket.send({
                domainName,
                stage,
                connectionID,
                message: JSON.stringify({  
                                            message: deviceConnect,
                                            dataSave: dataSave 
                                        }),
            });

            // console.log('Consult Clientes APP');
            const clients = await Dynamo.getAppClients(tableName);
            // console.log('ESPM1 DATA Clientes APP:' , clients);
                                
            let resp = {  
                            message: deviceConnect,                           
                            dataSend: dataSave,
                        };
                                
            // Envio configuracion a todos los clientes APP
            if ( clients.length > 0 ) {
                clients.forEach( async client => {
                    await WebSocket.send({
                        domainName,
                        stage,
                        connectionID: client.ID,
                        message: JSON.stringify( resp ),
                    });
                                
                });    
            }
        } else {
            // Confirmo Configuracion            
            await WebSocket.send({
                domainName,
                stage,
                connectionID,
                message: JSON.stringify({  
                                            message: deviceConnect,
                                            error: 'DIVECE NOT CONNECT'  
                                        }),
            });
        }

       
        return Responses._200({ message: 'got  a message' });

    } catch (error) {
        return Responses._400({ message: 'message could not be received' });
    }
    

};


function dataClient(body) {
    
    // Guardar Confirguracion
    
    if (body.message === "ESPM4") {
        return {                
                    Presion_Aceite: body.Presion_Aceite,
                    Temp_Aceite: body.Temp_Aceite,
                    Nivel_Aceite: body.Nivel_Aceite,
                    Pos_Compu_Radial: body.Pos_Compu_Radial,
                    Est_Motor: body.Est_Motor,
                    Estado_Compuerta_Radial: body.Estado_Compuerta_Radial,                    
                    Motor: body.Motor,
                    Alarm_Pres_Aceite: body.Alarm_Pres_Aceite,
                    Alarm_Temp_Aceite: body.Alarm_Temp_Aceite,
                    Alarm_Niv_Aceite: body.Alarm_Niv_Aceite
        };
    }    else {
        return {};
    }                  
 
}

