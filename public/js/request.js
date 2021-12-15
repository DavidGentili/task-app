const getInstance = () => {
    return axios.create({
        baseURL: 'http://localhost:8080/api/',
        timeout: 1000,
        headers: { 
            'Content-Type' : 'application/json',
            'authentication' : localStorage.getItem('userToken') 
        }
    })
}

export {getInstance}