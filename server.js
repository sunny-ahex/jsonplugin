/**
 * Created by AHEX on 7/2/2015.
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser=require('cookie-parser'),
    morgan = require('morgan'),
    qt   = require('quickthumb'),
    app = express();

app.use(bodyParser());
app.set('views','public/views');
app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(qt.static(__dirname+'/public'));

var transformController = require('./app/controllers/transformController.js');

app.get('/',function(req,res){

    res.render('transform');
});

app.get('/dataLoad',transformController.dataLoad);
app.post('/dataTransform',transformController.dataTransform);
app.post('/saveData',transformController.saveData);

var port=Number(process.env.PORT || 3001);
app.listen(port);
console.log('server on port',port);