const getInstance = () => {
    return axios.create({
        baseURL: 'https://david-gentili-task-app.herokuapp.com',
        timeout: 1000,
        headers: { 
            'Content-Type' : 'application/json',
            'authentication' : localStorage.getItem('userToken') 
        }
    })
}

export {getInstance}