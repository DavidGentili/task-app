const generateSuccessModal = (message,link) => {
    const classIcon = 'fas fa-check';
    generateModal({
        icon: classIcon,
        link,
        text: message
    })
}

const generateModal = (props) => {
    const modal = document.createElement('section');
    const card = document.createElement('div');
    const icon = document.createElement('i');
    const p = document.createElement('p');
    const a = document.createElement('a');

    modal.className = 'modal-window';
    card.className = 'cardModal';
    icon.className = props.icon;
    p.textContent = props.text;
    a.href = props.link;
    a.textContent = 'Continue';

    const body = document.querySelector('body');
    body.appendChild(modal);
    modal.appendChild(card);
    card.appendChild(icon);
    card.appendChild(p);
    card.appendChild(a);
}

export {
    generateSuccessModal
}