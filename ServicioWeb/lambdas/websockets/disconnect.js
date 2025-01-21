const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const tableUsers = process.env.tableName;

exports.handler = async event => {

    console.log('event', event);

    const { connectionId: connectionID } = event.requestContext;

    await Dynamo.delete(connectionID, tableUsers);

    return Responses._200({ message: 'disconnected' });

};
