module.exports = {
    mongodbURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-app',
    privateKey: process.env.PRIVATE_KEY || 'claveSecreta',
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'http://localhost:9000',
}