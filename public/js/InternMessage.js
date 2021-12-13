import {addNewMessage} from './messages.js'

const showInternalMessages = () => {
    const messages = JSON.parse(localStorage.getItem('pendingMessage'));
    if(messages){
        messages.forEach(element => {
            addNewMessage(element.message,element.type);
        });
    }
    localStorage.setItem('pendingMessage',"[]");
}



showInternalMessages();
