const url = 'http://localhost:8080/api/users/auth';
const authentication = localStorage.getItem('userToken');

const getUser = async () => {
    const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "authentication" : authentication,
            "Content-Type" : "application/json"
        }
    })
    return await res.json();
}

const renderUser = (user) => {
    const a = document.getElementById('nameOfUser');
    a.textContent = user.name;
}

export {
    getUser,
    renderUser
}