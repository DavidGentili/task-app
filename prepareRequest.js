const url = require('url');

const prepareRequest = (req,data) =>{
    const pathName = url.parse(req.url).pathname;
    let path = pathName.split('/');
    path.shift();
    path = path.map(string => string.toLowerCase());
    const query = url.parse(req.url, true).query;
    const method = req.method.toUpperCase();
    const headers = req.headers;
    return {
        data: (data)?JSON.parse(data): {} ,
        path,
        query,
        method,
        headers
    }
}

module.exports = prepareRequest;