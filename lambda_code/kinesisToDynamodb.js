'use strict';

const AWS = require('aws-sdk'),
    docClient = new AWS.DynamoDB.DocumentClient();
    
// const doc = require('dynamodb-doc');
// const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
    console.log(event.Records[0]);
    const buffer = new Buffer(String(event.Records[0].kinesis.data),'base64');
    console.log(buffer.toString('utf8'));

    const eyetrackingData = buffer.toString('utf8').replace(/"/g,'').split(' ');

    const name = eyetrackingData[0];
    const index = eyetrackingData[1];
    const x = eyetrackingData[2];
    const y = eyetrackingData[3];

    const payload = { 
        TableName: 'eyetracking_points', 
        Item:{
            "timeStamp":new Date().getTime(),
            "name":name,
            "index":index,
            "X":x,
            "Y":y
        }       
    } 
    
    docClient.put(payload, callback);
    // dynamo.putItem(payload, callback);
        
};