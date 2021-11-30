const {isAuthenticated} = require('../../auth');

const auth = {
    GET: (req,res) => {
        const token = req.headers.authentication;
        const user = isAuthenticated(token);
        if(user){
            const data = {name: user.name, email: user.email}
            res.statusCode = 200;
            res.end(JSON.stringify(data)); 
        } else{
            res.statusCode = 400;
            res.end("{}");
        }
    } 
};

module.exports = auth;