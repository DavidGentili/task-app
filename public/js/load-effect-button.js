const hiddenButton = (buttonId,loadId) => {
    const button = document.getElementById(buttonId);
    const load = document.getElementById(loadId);
    button.classList = "hidden";
    load.classList.remove('hidden');
    const child = load.childNodes;
    for(let i = 0 ; i < child.length ; i++){
        if(child[i].className === 'loadItem'){
            child[i].style.animation = 'loadEffect 1s ease-out alternate infinite';
            child[i].style.animationDelay = `${0.3*i}s`;
        }
    }
}

const activeButton = (buttonId,loadId) => {
    const button = document.getElementById(buttonId);
    const load = document.getElementById(loadId);
    load.classList.add('hidden');
    button.classList.remove('hidden');
    const child = load.childNodes;
    for(let i = 0 ; i < child.length ; i++){
        if(child[i].className === 'loadItem'){
            child[i].style.animation = '';
            child[i].style.animationDelay = '';
        }
    }
    
}

export {
    hiddenButton,
    activeButton
}