const mongoose = require('mongoose');
const { mongodbURL } = require('./config');

<<<<<<< HEAD
mongoose.connect(mongodbURL)
=======
mongoose.connect('mongodb://localhost:27017/task-app')
>>>>>>> fff38822fd961658576365c85c588b10953e0ac8
.then( () => {
    console.log('Database connected'); 
})
.catch( (e) => {
    console.error(e);
    console.log('error to connect Database');
});
