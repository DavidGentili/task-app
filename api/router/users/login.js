const User = require('../../models/User');
const {authenticateUser} = require('../../auth');

const checkValues = async (data) =>{
    const {email,password} = data;
    const currentUser = await User.findOne({email});
    if(currentUser){
        const match = await currentUser.matchPassword(password);
        if(match)
            return currentUser;
        else
            throw {message: 'wrong password', status: 400};
    } else
        throw {message: 'this email is not registered', status: 400};;    
}

const login = {
    POST: async (req,res) => {
        const user = await checkValues(req.data); 
        const token = authenticateUser(user)
        res.statusCode = 200;
        res.end(JSON.stringify({token}));
    }
};

module.exports = login;