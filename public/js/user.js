import { addInternalMessage } from './messages.js'

const url = 'http://localhost:8080/api/users/auth';
const authentication = localStorage.getItem('userToken');

const getUser = async () => {
    if(authentication){
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "authentication" : authentication,
                "Content-Type" : "application/json"
            }
        })
        if(res.status === 200)
            return await res.json();
        else 
            return undefined
    } else
        return undefined
    
}

const renderUser = (user) => {
    const a = document.getElementById('nameOfUser');
    a.textContent = user.name;
}

const unauthorizedUser = () => {
    addInternalMessage({message: 'Your session has expired', type: 'warning'});
    localStorage.removeItem('userToken');
    location.href = '/';
}

export {
    getUser,
    renderUser,
    unauthorizedUser
}