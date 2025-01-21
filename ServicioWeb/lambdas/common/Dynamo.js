const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {

    async get(ID, TableName) {

        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            console.log("Error GET NOT ID");            
            throw Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);
        }

        console.log("Data From (f.get):", TableName ," GET: ", data);

        return data.Item;

    },    

    async write(data, TableName) {

        if (!data.ID) {
            console.log("Error WRITE NOT ID ESP NO CONNECTED OR CONFIGURED");            
            throw Error('no ID on the data');        
        }

       

        const params = {
            TableName,
            Item: data,
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            console.log(`There was an error inserting ID of ${data.ID} in table ${TableName}`);
            throw Error(`There was an error inserting ID of ${data.ID} in table ${TableName}`);
        }


        console.log("OK Write: ", res);

        return data;
    },

    async delete(ID, TableName) {

        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        console.log("OK Delete");

        return documentClient.delete(params).promise();
    },

    // funtions aux

    async isConfig(ID, TableName) {

        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        const data = await documentClient.get(params).promise();

        return !data || !data.Item;

        // if (!data || !data.Item) {
        //     return false;
        // } else {
        //     return true;
        // }      
    },

    // Return all Clients APP
    async getAppClients(TableName) {

        console.log('Get Clients APP of: ', TableName);

        const params = {        
                "TableName": TableName,
                "FilterExpression": "#device = :app",
                "ExpressionAttributeNames": {
                    "#device": "device",
                },
                "ExpressionAttributeValues": {
                     ":app": 'APP',
                }
        };

        try {
            
            // QUERY DynamoDB           
            const data = await documentClient.scan(params).promise(); // scanea toda la tabla
            
            // console.log("getAPPClients - Clientes APP: ", data);
            
            if (!data || !data.Items) {
                console.log("Error GET NOT ID");            
                
                return [];
            } else {
               
                return data.Items;       
            }
        } catch (e) {
            console.error('Reading error', e);
        } 
    },

    
    // Return all Clients APP
    async getESPClient(TableName, espDivice) {

        console.log('Get Clients APP of: ', TableName);

        const params = {        
                "TableName": TableName,
                "FilterExpression": "#device = :esp",
                "ExpressionAttributeNames": {
                    "#device": "device",
                },
                "ExpressionAttributeValues": {
                     ":esp": espDivice,
                }
        };

        try {
            
            // QUERY DynamoDB           
            const data = await documentClient.scan(params).promise(); // scanea toda la tabla
            
            
            
            if (!data || !data.Items) {
                console.log("Error GET NOT ID");            
               
                return [];
            } else {
               
                return data.Items;       
            }
        } catch (e) {
            console.error('Reading error', e);
        } 
    },

    // return: last 20 items on table config by ID ESP => Ej. esp#1001
    
    async getLastDataClients(TableName, esp) {

       
        const params = {        
            "TableName": TableName,
            "KeyConditionExpression": 'ID = :value',
            "ExpressionAttributeValues": { ':value': esp },
            "ScanIndexForward": false,
            "Limit": 20
        };

        try {
            
            // QUERY DynamoDB           
            const data = await documentClient.query(params).promise();
            
            if (!data || !data.Items) {
                   
                throw Error(`There was an error fetching the data for ID of ${esp} from ${TableName}`);
               
            } else {
        
                return data.Items.reverse();       
            }
 
        } catch (e) {
            console.error('Reading error', e);
        } 
    },

    // return: historic items on table config by ID ESP => Ej. esp#1001
    
    async getHistoricDataClients(TableName, esp, fecha, quantity) {

        console.log("getHistoricDataClients : ", TableName, ' - ' , esp, ' - ' ,fecha);

        const params = {
                "TableName": TableName,                
                "KeyConditionExpression": 'ID = :value AND sortKey > :fecha',
                "ExpressionAttributeValues":  { 
                                                ':value': esp,
                                                ':fecha': fecha 
                },
                "Limit": quantity
        };

      

        try {
            
            // QUERY DynamoDB           
            const data = await documentClient.query(params).promise();
            
            if (!data || !data.Items) {
                        
                throw Error(`There was an error fetching the data for ID of ${esp} from ${TableName}`);
                
            } else {
                return data.Items.reverse();       
            }
 
        } catch (e) {
            console.error('Reading error', e);
        } 
    },
};

module.exports = Dynamo;

