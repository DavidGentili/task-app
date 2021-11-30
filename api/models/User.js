const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    creationDate: {type: Date, default: Date.now()}
});

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
};

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

module.exports = mongoose.model('User',UserSchema);