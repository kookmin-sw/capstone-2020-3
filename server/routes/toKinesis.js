const AWS= require('aws-sdk');

AWS.config.update({ region: 'us-east-1'});

const kinesis = new AWS.Kinesis();

const data = process.argv[2] + ' ' + process.argv[3] +' '+process.argv[4]+' '+process.argv[5]


const params = {
        Data: new Buffer(JSON.stringify(data)),
        PartitionKey:'1',
        StreamName: 'test'
};

kinesis.putRecord(params, (err, data) => {
        console.log(err, data);
});

