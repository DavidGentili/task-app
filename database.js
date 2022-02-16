const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://davidGentili:wdyMYHHOPYc8faTJ@cluster-task-app.5up0n.mongodb.net/Task-App?retryWrites=true&w=majority')
.then( () => {
    console.log('Database connected'); 
})
.catch( (e) => {
    console.log('error to connect Database');
});
