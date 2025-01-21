const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;
const tableConfig = process.env.tableConfig;
const tableData = process.env.tableData;

exports.handler = async event => {
    
    console.log('event config: ', event);

    const { connectionId: connectionID } = event.requestContext;

   

    const body = JSON.parse(event.body);

    
    // Nombre del ESP32 -> espCLIENT
    // Codigo del ESP32 -> codeESP
    // Configuracion Inicial del ESP32 -> message 

    try {
        
        /* 
            Organizar los campos de las tablas para que sean 
            similares en la conexion y en la configuracion  
        */


            let quantity = 0;

            // Verifico que el dispositivo este conectado
            const recordConection = await Dynamo.get(connectionID, tableName);
            
            const { domainName, stage} = recordConection; // Quien se conecto
            
            if (body.message === "HISTORICO") { 

                if(body.esp === "esp4#1004") {
                    quantity = 200;
                }

                

                const clientHistoric = await Dynamo.getHistoricDataClients(tableData, body.esp, body.date, quantity); // los ultimos 20 datos              
                    
    
                const resp = {  
                    message: body.message, 
                    dataHistoric: clientHistoric, // Array last 500 datas
                 
                };

                // Confirmo Configuracion            
                await WebSocket.send({
                    domainName,
                    stage,
                    connectionID,
                    message: JSON.stringify( resp ),
                });

            } 

            // Actualizo la Conexion APP
            if (body.message === "APP") {

                let dataConectionUpdate = {
                                            ...recordConection,
                                            date: Date.now(),
                                            device: body.message
                                          };



                await Dynamo.write(dataConectionUpdate, tableName);

                // CLIENTS CONNECTED
                // CLIENTS CONFIG
                
                const clientConfigs = await Dynamo.getLastDataClients(tableConfig, body.esp); // Las ultimas 20 configuraciones               
                
                const clientConfig = clientConfigs[ clientConfigs.length-1 ];               

                // CLIENTS DATA
                const clientData = await Dynamo.getLastDataClients(tableData, body.esp); // los ultimos 20 datos               
               

                const resp = {  
                                message: body.message, 
                                espConf: clientConfig, // Last config of ESPNAME#
                                dataSave: clientData, // Array last 20 datas
                               
                };
                               
                
                // Confirmo Configuracion            
                await WebSocket.send({
                                        domainName,
                                        stage,
                                        connectionID,
                                        message: JSON.stringify( resp ),
                });




                 
            } 
            
            
            if ( body.message.includes('E', 0) ) {

                    // Actualizo conexion             
                            
                    let dataConectionUpdate = {     
                        ...recordConection,
                        date: Date.now(),
                        device: body.espCLIENT + "#" + body.espCode                    
                        };

                    await Dynamo.write(dataConectionUpdate, tableName);
        
                    // Configuration of any ESP 
                    let config = configClient(body);

                    let dataConfig = {
                        ID: body.espCLIENT + "#" + body.espCode,
                        sortKey: Date.now(),                
                        ...config
                    };
                
                    await Dynamo.write(dataConfig, tableConfig);
                
                    // Confirmo Configuracion            
                    await WebSocket.send({
                                            domainName,
                                            stage,
                                            connectionID,                                        
                                            message: JSON.stringify( { message: body.espCLIENT, config: dataConfig } ),
                    });

               
                    const clients = await Dynamo.getAppClients(tableName);
                                                     
                    let resp = {  
                                    message: config.ID, 
                                    espConf: dataConfig,
                                   
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

            }

            // Actualizo la Conexion ESP: message: MODULO#
       
            return Responses._200({ message: 'config save' });

    } catch (error) {
        return Responses._400({ message: 'message config could not be received' });
    }


};

function configClient(body) {
    
    // Guardar Confirguracion
    
    if (body.message === "ESPM4") {
        return {
                    Acti_Alarm_Fallas: body.Acti_Alarm_Fallas,
                    Acti_Mod_Comp_Radial: body.Acti_Mod_Comp_Radial,
                    Limt_Max_Presion: body.Limt_Max_Presion,
                    Limt_Max_Temperatura: body.Limt_Max_Temperatura,
                    Limt_Baj_Niv_Aceite: body.Limt_Baj_Niv_Aceite,
                    Tiemp_Sost_Max_Presion: body.Tiemp_Sost_Max_Presion,
                    Tiemp_Sost_Max_Temperatura: body.Tiemp_Sost_Max_Temperatura,
                    Tiemp_Sost_Baj_Niv_Aceite: body.Tiemp_Sost_Baj_Niv_Aceite                                   
        };
    }    else {
        return {};
    }                 
 
}



// helper

function dataHistorico (obj1 , obj2) {
    
    console.warn(obj1.localeCompare(obj2));
   
}




