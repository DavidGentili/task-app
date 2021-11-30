import {addNewMessage,cleanMsgPanel, addInternalMessage} from './messages.js';
import { generateSuccessModal } from './modal-window.js';
import { hiddenButton,activeButton } from './loadEffectButton.js';

const getData = () => {
    const name = document.getElementsByName('name')[0].value;
    const email = document.getElementsByName('email')[0].value;
    const password = document.getElementsByName('password')[0].value;
    const confirmPassword = document.getElementsByName('confirmPassword')[0].value;
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    if(!name)
        throw 'the name is wrong';
    if(name.length < 3)
        throw 'the name is to short';
    if(!email || !re.exec(email))
        throw 'the email is wrong';
    if(!password || password.length < 3)
        throw 'the password is wrong'
    if(password !== confirmPassword)
        throw 'the password don´t match';
    return{
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        password
    }
}

const signup = (data) => {
    const url = 'http://localhost:8080/api/users/signup'
    fetch(url,{
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)       
    }).then( async function(res) {
        if(res.status === 200){
            //generateSuccessModal('your user was registered successful','./');
            const message = {message: 'your user was registered successful', type: 'successful'}
            console.log(message);
            addInternalMessage(message);
            console.log('error')
            location.href = '/';
            
        }else{
            const data = await res.json();
            addNewMessage(data.message,'error');
            activeButton('buttonSignup','loadElements');
        }
    })
    .catch(function(e){
        addNewMessage('opss, we had an error', 'error');
        activeButton('buttonSignup','loadElements');
    })
}

const eventSignup = (e) => {
    cleanMsgPanel();
    hiddenButton('buttonSignup','loadElements');
    try{
        const data = getData();
        signup(data);
    } catch(e){
        addNewMessage(e,'error');
        activeButton('buttonSignup','loadElements');        
    }
}
document.getElementById('buttonSignup').addEventListener("click",eventSignup);

