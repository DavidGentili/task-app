const http = require('http');
const { port } = require('./config');


const prepareRequest = require('./prepareRequest');
const apiHandler = require('./api/apiHandler');
const publicHandler = require('./public/publicHandler');


const server = http.createServer((req,res) =>{
    let data = '';

    req.on('data', (chunk) =>{
        data += chunk; 
    })

    req.on('end', function(){
        const request = prepareRequest(req,data);    
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        
        if(req.method.toUpperCase() === 'OPTIONS'){            
            res.statusCode = 200;
            res.end('');
        } else{
            if(request.path[0] && request.path[0] === 'api')
                apiHandler(request,res);
            else
                publicHandler(request,res);
        }
        
    })
})

server.listen(port, ()=> {
    console.log(`The server is listening on the port ${port}`);
})