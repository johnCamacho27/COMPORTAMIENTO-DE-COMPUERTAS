const Dynamo = require('../common/Dynamo');

// Configuracion y Reconfiguracion de los Dispositivos 
// 

//    set config modulo1
/**
    const setConfigM1 = ( Tiempo_Sost_Captacion,
                          Tiempo_Sost_Tank,
                          Limite_Conc_Soli_Capta,
                          Limite_Conc_Soli_Tank,
                          Acti_Alarm_Conc_Soli_Capta,
                          Acti_Alarm_Conc_Soli_Tank
                        ) => {

                        var data = { Tiempo_Sost_Captacion,
                                     Tiempo_Sost_Tank,
                                     Limite_Conc_Soli_Capta,
                                     Limite_Conc_Soli_Tank,
                                     Acti_Alarm_Conc_Soli_Capta,
                                     Acti_Alarm_Conc_Soli_Tank }; 


        
        await Dynamo.write(dataConectionUpdate, tableName);
      
        return true;
    };

/*
    set config modulo2
    set config modulo3
    set config modulo4
    set config modulo5
    set config modulo6
    set config modulo7

*/



// Configuracion y Reconfiguracion de los Dispositivos 
// 

/*
    send Action modulo1
    send Action modulo2
    send Action modulo3
    send Action modulo4
    send Action modulo5
    send Action modulo6
    send Action modulo7
*/

const config = ({ domainName, stage, connectionID, message }) => {
    

    console.log( domainName, " - " , stage, " - " , connectionID, " - " , message )

    const ws = create(domainName, stage);

    const postParams = {
        Data: message,
        ConnectionId: connectionID,
    };

    return ws.postToConnection(postParams).promise();
};

const actions = () => {
    return true;
};

module.exports = {
    setConfigM1,
};