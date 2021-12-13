const addNewMessage = (message,type) => {
    const elementMessage = document.createElement('div');
    const textMessage = document.createElement('p');
    const button = document.createElement('button');

    elementMessage.classList = `msg msg-${type}`;
    textMessage.textContent = message;
    button.textContent = 'X';
    button.addEventListener('click',eventClose);
    document.getElementById('msg-panel').appendChild(elementMessage);

    elementMessage.appendChild(textMessage);
    elementMessage.appendChild(button);
    

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

const eventClose = (e) => {
    let element = e.target;
    while(!element.classList.contains('msg'))
        element = element.parentNode;
    element.style.opacity = '0';
    setTimeout(function(){
        element.remove();
    },1000);
}

export {
    addNewMessage,
    cleanMsgPanel,
    addInternalMessage
}