const generateModal = () => {
    const modal = document.createElement('section');
    const card = document.createElement('div');
    const headerCard = document.createElement('div');
    const bodyCard = document.createElement('div');
    const button = document.createElement('button');
    
    modal.className = 'modal-window';
    modal.id = 'modal-window'
    card.className = 'cardModal';
    card.id = 'cardModal';
    headerCard.className = 'headerCard';
    bodyCard.className ='bodyCard';
    headerCard.id = 'headerCard';
    bodyCard.id ='bodyCard';
    button.textContent = 'X';
    button.addEventListener('click',removeModal);

    const body = document.querySelector('body');
    body.appendChild(modal);
    modal.appendChild(card);
    card.appendChild(headerCard);
    card.appendChild(bodyCard);
    headerCard.appendChild(button);

}

const removeModal = () => {
    document.getElementById('modal-window').remove();
    document.getElementById('cardModal').remove();
}

export {
    generateModal,
    removeModal
}