import { generateAButton } from "./button.js";

const addNewMessage = (message,type) => {
    const elementMessage = document.createElement('div');
    const textMessage = document.createElement('p');
    const timeOut = setTimeout(eventClose(elementMessage),10000);

    elementMessage.classList = `msg msg-${type}`;
    textMessage.textContent = message;
    document.getElementById('msg-panel').appendChild(elementMessage);

    elementMessage.appendChild(textMessage);
    elementMessage.appendChild(generateAButton('X','','',eventClose(elementMessage,timeOut)));
}

const addInternalMessage = (message) => {
    const messages = JSON.parse(localStorage.getItem('pendingMessage'));
    messages.push(message);
    localStorage.setItem('pendingMessage',JSON.stringify(messages));
}

const cleanMsgPanel = () => {
    const panel = document.getElementById('msg-panel');
    const childrens = panel.childNodes
    for(let i = 0 ; i < childrens.length ; i++)
        childrens[i].remove();
}

const eventClose = (element, timeOut) => {
    return (e) => {
        if(timeOut)
            clearTimeout(timeOut);
        element.style.opacity = '0';
        setTimeout(function(){
            element.remove();
        },700);
    }
}

export {
    addNewMessage,
    cleanMsgPanel,
    addInternalMessage
}