import {addNewMessage,cleanMsgPanel } from "./messages.js";
import { activeButton, hiddenButton } from "./loadEffectButton.js";

const getData = () => {
    let email = document.getElementsByName('email')[0].value;
    let password = document.getElementsByName('password')[0].value;
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;

    if(!email || !re.exec(email))
        throw 'the email is wrong';
    if(!password || password == '')
        throw 'the password is wrong';

    email = email.toLowerCase();

    return {email,password}
}

const login = (data) => {
    const url = 'http://localhost:8080/api/users/login';
    fetch(url,{
        method:'POST',
        mode: 'cors',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(async function(res){
        const data = await res.json();
        console.log(data);
        if(res.status === 200){
            localStorage.setItem('userToken',data.token);
            location.href = '/my-board';
        } else {
            addNewMessage(data.message,'error');
            activeButton('buttonLogin','loadElements');
        }
    })
    .catch(function(e){
        addNewMessage('opss, we had an error', 'error');
        activeButton('buttonLogin','loadElements');
    })
}

const eventLogin = () => {
    cleanMsgPanel();
    hiddenButton('buttonLogin','loadElements');
    try{
        const data = getData();
        login(data);
    }catch(e){
        addNewMessage(e,'error');
        activeButton('buttonLogin','loadElements');
    }
}


document.getElementById('buttonLogin').addEventListener('click', eventLogin);
document.getElementsByName('email')[0].focus();
document.getElementsByName('password')[0].addEventListener('keydown', (e) => {
    if(e.key === 'Enter')
        eventLogin();
})