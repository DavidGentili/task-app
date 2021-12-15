const {isAuthenticated} = require('./auth');

const routes = {
    users: require('./router/users/userHandler'),
    project: require('./router/projects'),
    task: require('./router/task'),
    board: require('./router/board')
}

const getUser = (auth) => {
    if(auth){
        const user = isAuthenticated(auth);
        return (user) ? user : undefined;
    } else
        return undefined;
}

const resolveThrow = (e,res) => {
    const {message, status} = e;
    if(message && status){
        res.statusCode = status;
        res.end(JSON.stringify({message}));
    } else {
        console.log(e)
        res.statusCode = 400;
        res.end(JSON.stringify({message: 'opss we have a problem'}));
    }
}

const authPath = (req,res) => {
    const user = getUser(req.headers.authentication);
    const {method} = req;
    const path = req.path[0];
    if(user){
        req.user = user._id;
        routes[path][method](req,res)
        .catch(function(e){
            resolveThrow(e,res);
        })
    }else{  
        res.statusCode = 403;
        res.end(JSON.stringify({menssage : 'Unauthorized user'}));
    }
}


const routesHandler = (req,res) =>{
    req.path.shift();
    const path = req.path[0];
    const method = req.method;

    res.setHeader('Content-Type','application/json');

    if(path && path === 'users'){
        return routes[path](req,res);
    }else{
        if(routes[path] && routes[path][method]){
            authPath(req,res);
        }else{
            const message = 'wrong route';
            res.statusCode = 404;
            res.end(JSON.stringify({message}));
        }
        
    }
}


module.exports = routesHandler;