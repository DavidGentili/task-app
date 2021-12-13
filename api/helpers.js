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

const formatQuery = (query,user,acceptedArgument) => {
    const keys = Object.keys(query);
    const searchArgument = {user};
    keys.forEach(elem => {
        if(acceptedArgument.includes(elem))
            searchArgument[(elem === 'id') ? '_'+elem : elem] = query[elem];
    })
    return searchArgument;
}

module.exports = {
    formatResponse,
    formatQuery
}