const mongoose = require('mongoose');
const { mongodbURL } = require('./config');

console.log(mongodbURL);

mongoose.connect(mongodbURL)
.then( () => {
    console.log('Database connected'); 
})
.catch( (e) => {
    console.error(e);
    console.log('error to connect Database');
});
