const express = require('express');
const app = express();
const sass = require('node-sass');
const fs = require('fs');
const reload = require('reload');  
const mustache = require("mustache")
const path = require('path') 
const templates = require('./templates.jsx')

app.use('/Content',express.static('Content'));
app.use('/fonts',express.static('fonts'));
app.use('/Scripts',express.static('Scripts'));

sass.render({
  file: "./Content/scss/general.scss",
  sourceMap: true,
  sourceMapEmbed: true
}, function(error, general) { // node-style callback from v3.0.0 onwards
  if(!error){
    // No errors during the compilation, write this result on the disk
    fs.writeFile('./Content/css/theme.css', general.css, function(err){
      if(!err){
        //file written on disk  
      }  
    });
  }
});


// To set functioning of mustachejs view engine
app.engine('html', function (filePath,options,callback) {
    fs.readFile(filePath, function (err, content) {
        if(err)
            return callback(err)        
        var rendered = mustache.render(content.toString(),options,templates.partials());
        return callback(null, rendered)
    });
});


// Setting mustachejs as view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','html');


//rendering example for response
app.get('/',(req,res)=>{    
    res.render('index',templates.data());
}); 



app.listen(3000, () => { 
  console.log('Listening on port 3000...');
});

reload(app); 
