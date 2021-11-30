import {cleanMsgPanel, addNewMessage, addInternalMessage} from './messages.js'

const showInternalMessages = () => {
    const messages = JSON.parse(localStorage.getItem('pendingMessage'));
    if(messages){
        messages.forEach(element => {
            addNewMessage(element.message,element.type);
        });
    }
    localStorage.setItem('pendingMessage',"[]");
}

// const message = {message: 'its a message', type: 'successful'}
// addInternalMessage(message); 

showInternalMessages();
