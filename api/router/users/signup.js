const User = require('../../models/User');

const signup = {
    POST: async (req,res) => {
        const {email,password,name,} = req.data;
        const currentUser = await User.findOne({email});
        if(!currentUser){
            const newUser = new User({email,password,name});
            await newUser.save();
            res.statusCode = 200;
            res.end(JSON.stringify(req.data));
        }
        else
            throw {message: 'the email is already registered', status: 400}
    }
};

module.exports = signup;