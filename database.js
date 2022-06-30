const mongoose = require('mongoose');
const { mongodbURL } = require('./config');

mongoose.connect(mongodbURL)
.then( () => {
    console.log('Database connected'); 
})
.catch( (e) => {
    console.error(e);
    console.log('error to connect Database');
});
