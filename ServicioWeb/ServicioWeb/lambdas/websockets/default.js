const Responses = require('../common/API_Responses');

exports.handler = async event => {

    console.log('event', event);

    const { connectionId: connectionID, stage, domainName } = event.requestContext;
 
    const body = JSON.parse(event.body);


    try {

      

       
        await WebSocket.send({
            domainName,
            stage,
            connectionID,
            message: 'This is a reply to your message: '+body.message,
        });

       

        return Responses._200({ message: 'got a message' });

    } catch (error) {
        return Responses._400({ message: 'message could not be received' });
    }


};


