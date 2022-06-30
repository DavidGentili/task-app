import message from './messages.js'

const { addNewMessage } = message;

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
