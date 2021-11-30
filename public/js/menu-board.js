const openMenuBoard = () => {
    const menu = document.getElementById('menu-board');
    menu.style.transform = 'translateX(0)';
}

const closeMenuBoard = () => {
    const menu = document.getElementById('menu-board');
    menu.style.transform = 'translateX(-100%)';
}

document.getElementById('buttonOpenMenuBoard').addEventListener('click',openMenuBoard);
document.getElementById('buttonCloseMenuBoard').addEventListener('click',closeMenuBoard);
