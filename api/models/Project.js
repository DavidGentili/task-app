const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProjectSchema = new Schema({
    name: {type: String, required: true},
    state: {type: String, required: true, default: 'active'},//active, archived, finished
    user: {type: String, required: true},
    startDate: {type: Date, default: Date.now()},
    lastChangeDate: {type: Date, default: Date.now()},
    
});


module.exports = mongoose.model('Project',ProjectSchema); 