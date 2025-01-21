const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

//aux funtions for MODULE ESP -> M1, M2, M3, M4, M5, M6, M7 
//const Control = require('../common/control');

const tableName = process.env.tableName;

exports.handler = async event => {

    // console.log('event', event);
    // ID Client Connection 
    const { connectionId: connectionID } = event.requestContext;
    
    const body = JSON.parse(event.body);

    const clientEsp = body.espCLIENT+"#"+body.espCode;

    var messageConfig = {};
    var messageAction = {};
       
    try {

        // Verifica el Cliente APP = Coenctado?.
        const record = await Dynamo.get(connectionID, tableName);
        const { domainName, stage } = record;

        const clients = await Dynamo.getESPClient( tableName, clientEsp );
       
        //console.log("CLIENTES ESP: ", clients);

        // Get Config 
        if (body.control === 'ConfigState') {
            clients.forEach( async client => {
                if (client.device ===  clientEsp) {
                    await WebSocket.send({
                        domainName,
                        stage,
                        connectionID: client.ID,
                        message:  `{
                                    "action":"control",
                                    "message":"${body.message}",
                                    "espCLIENT":"${body.espCLIENT}",
                                    "espCode":"${body.espCode}",
                                    "control":"ConfigState"
                                    }`,                                       
                    });
                }                
            }); 
        }

        // Respuesta de Proceso de Control 
        if (body.control === 'processControl') {
            clients.forEach( async client => {
                if (client.device ===  "APP") {
                    await WebSocket.send({
                        domainName,
                        stage,
                        connectionID: client.ID,
                        message: `{ "action":"control",
                                    "message":"${body.message}",
                                    "espCLIENT":"${body.espCLIENT}",
                                    "espCode":"${body.espCode}",
                                    "control":"${body.control}",
                                    "doing":"${body.doing}"
                                }`,                                       
                    });
                }                
            }); 
        }

        // Re-Configuration of ESP´s
        if (body.control === 'config') {

            clients.forEach( async client => {

                if ( (client.device ===  clientEsp) && (body.message === "ESPM4") ) {
                    messageConfig = `{
                                        "action":"control",
                                        "message":"${body.message}",
                                        "espCLIENT":"${body.espCLIENT}",
                                        "espCode":"${body.espCode}",
                                        "control":"config",                                             
                                        "Acti_Alarm_Fallas":"${body.Acti_Alarms}",
                                        "Acti_Mod_Comp_Radial":"${body.Acti_Mod_Comp_Radial}",
                                        "Limt_Max_Presion":"${body.Limt_Max_Presion}",
                                        "Limt_Max_Temperatura":"${body.Limt_Max_Temperatura}",
                                        "Limt_Baj_Niv_Aceite":"${body.Limt_Baj_Niv_Aceite}",
                                        "Tiemp_Sost_Max_Presion":"${body.Tiemp_Sost_Max_Presion}",
                                        "Tiemp_Sost_Max_Temperatura":"${body.Tiemp_Sost_Max_Temperatura}",
                                        "Tiemp_Sost_Baj_Niv_Aceite":"${body.Tiemp_Sost_Baj_Niv_Aceite}"                                                  
                                    }`;

                    await WebSocket.send({
                        domainName,
                        stage,
                        connectionID: client.ID,
                        message: messageConfig,                                       
                    });
                }              
                             
            }); 
        }

        // Do Action ESP´s
        if (body.control === 'action') {
            clients.forEach( async client => {      
                
                if ( (client.device ===  clientEsp) && (body.message === "ESPM4") ) {
                    messageAction = `
                        {"action":"control",
                         "message":"${body.message}",
                         "espCLIENT":"${body.espCLIENT}",
                         "espCode":"${body.espCode}",
                         "control":"action",
                         "Consig_Apertura":"${body.Consig_Apertura}",
                         "Ejecutar_Consig":"${body.Ejecutar_Consig}",
                         "Parar_Accion":"${body.Parar_Accion}"}
                        `;

                        await WebSocket.send({
                            domainName,
                            stage,
                            connectionID: client.ID,
                            message: messageAction,                                       
                        });
                }

            });              
            
        }

      

        return Responses._200({ message: 'got a message' });

    } catch (error) {
        return Responses._400({ message: 'message could not be received' });
    }

  
};


