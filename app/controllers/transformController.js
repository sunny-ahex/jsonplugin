var AWS = require('aws-sdk');
var json2html=require('node-json2html');
var DOC = require('dynamodb-doc');

var dynamoDBConfig = {
    "accessKeyId": "AKIAJO7SF2DLWVU43J7Q",/*access key created from our account in the aws*/
    "secretAccessKey": "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",/* the secret key */
    "region": "us-east-1"
};

/*access the DB with the config details*/
AWS.config.update(dynamoDBConfig);

/*creating an instance of the db*/
var dynamoDb = new AWS.DynamoDB();
var docClient = new DOC.DynamoDB(dynamoDb);

/*to load the data from DB on the page load time*/
exports.dataLoad = function(req,res){

    /*to retrive the row with Id 3 from the table*/
    var queryParams = {
        TableName:'Data',
        Key:{
            Id:'1'
        }
    };
    docClient.getItem(queryParams,function(error,data){
        if(error){
            console.log(error);
        }
        else{
            /*after loading the Data get the transformation object from the transform table */
            docClient.getItem({TableName:'Transform',Key:{Id:'1'}},function(error,data1){
               // console.log(data,data1);
                var temp=[];
                /*convert the stringified data into the json format*/
                var editorData = JSON.parse(data.Item.data);
                console.log(editorData);
                /*pushing it into a array inorder to pass the array as response object*/
                temp.push(editorData)
                var transform1;
                /*push the transform string into an array and pass it to json2htmltransform plugin*/
                transform1 = data1.Item.transform;
                console.log('dat.i',data1.Item.transform);
                temp.push(transform1);
                console.log('trans1',transform1);
                /*finally get the html data from the plugin after transforming the json data*/
                var html1 = json2html.transform(editorData,transform1);
                /*push it into the array*/
                temp.push(html1);
                console.log('htmla',html1);
                res.send(temp);
            });

        }
    });
};

/*to transform the the json using the transform format*/
exports.dataTransform=function(req,res){
    /*get the json to be transformed*/
    var jsonData = req.body.data;
    /*get the transform structure*/
    var transform = req.body.transform;
    /*pass the json and the transform structure to the json2htmltransform plugin*/
    var html1 = json2html.transform(jsonData,transform);
    console.log(html1);
    res.send(html1);
};

/*save the transform structure to the DB table*/
exports.insertData =function(req,res){
    var tra =[{tag:'li',html:'${Id} - ${name} - ${country}'}];

    docClient.putItem({TableName:'Transform',Item:{Id:'1',transform:tra}},function(error,data){
        if(error){
            console.log(error);
        }
        else{
            console.log('inserted');
            res.send('inserted Data to table');
        }
    });
};

exports.saveData =function(req,res){
    console.log(req.body);
    var data = JSON.stringify(req.body.jsondata);
    var tra = req.body.trans;
    var htmldata = req.body.htmldata;
    docClient.putItem({TableName:'Data',Item:{Id:'1',data: data}},function(error,data){
        if(error){
            console.log(error);
        }
        else{
            console.log('inserted into table');
            docClient.putItem({TableName:'Transform',Item:{Id:'1',transform:tra}},function(error,data){
                if(error){
                    console.log(error);
                }
                else{
                    console.log('inserted into transform table');
                    docClient.putItem({TableName:'HtmlView',Item:{Id:'1',html:htmldata}},function(error,data){
                        if(error){
                            console.log(error);
                        }
                        else{
                            console.log('inserted');
                            res.send('inserted Data to All tables');
                        }
                    });
                }
            });
        }
    });


};

