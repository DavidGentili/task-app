const jwt = require('jsonwebtoken');
const privateKey = 'R%hz1mttVzBPybHt'

const authenticateUser = (user) => {
    return jwt.sign({user},privateKey,{
        expiresIn: '6h'
    });
}

const isAuthenticated = (token) => {
    try{
        return jwt.verify(token,privateKey).user;
    }
    catch(e){
        return undefined;
    }

}

module.exports = {
    authenticateUser,
    isAuthenticated
}
