const routes = {
    auth: require('./auth'),
    login: require('./login'),
    signup: require('./signup')
};

const handler = async (req,res) =>{
    req.path.shift();
    const path = req.path[0];
    const method = req.method;

    if(path && routes[path][method]){
        try{
            await routes[path][method](req,res);
        }catch(e){
            console.log(e);
            res.statusCode = e.status;
            const {message} =  e
            res.end(JSON.stringify({message})); 
        }
    } 
    else{
        const message = 'wrong route';
        res.statusCode = 404;
        res.end(JSON.stringify({message}));
    }
}

module.exports = handler;