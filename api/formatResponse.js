const formatASingleResponse = (data) => {
    if(data['_id']){
        data['id'] = data['_id'].toString();
        delete data['_id'];
    }
    if(data['__v'])
        delete data['__v'];
}

const formatResponse = (data) => {
    if(Array.isArray(data)){
        data.forEach(singleData => {
            formatASingleResponse(singleData)
        })
    } else
        formatASingleResponse(data);
}

module.exports = {
    formatResponse
}