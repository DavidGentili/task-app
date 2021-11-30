const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    state: {type: String, required: true, default: 'pending'},
    project: {type: String, required: true},
    user: {type: String, required: true},
    startDate: {type: Date, default: Date.now()},
    lastChangeDate: {type: Date, default: Date.now()},
    
});

// TaskSchema.pre('findOneAndUpdate', function(){
//     this.lastChangeDate = Date.now();
// })

module.exports = mongoose.model('Task',TaskSchema);