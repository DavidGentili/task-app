const generateAButton = (text, id, className, event, childs) => {
    const button = document.createElement('button');
    button.textContent = (text) ? text : '';
    button.id = (id) ? id : '';
    button.className = (className) ? className : '';
    if(event)
        button.addEventListener('click', event);
    if(childs)
        childs.forEach(child => {button.appendChild(child)});
    return button;
}

export{
    generateAButton
}