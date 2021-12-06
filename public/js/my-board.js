import { renderProjects, noProject, openAsidePanel, closeAsidePanel} from './aside-panel.js';
import {getUser , renderUser} from './user.js';
import {getProjectBoard, renderProjectBoard} from './board.js';

const projectBoard = [];

const startWindow = async () => {
    const user = await getUser();
    renderUser(user);
    await getProjectBoard(projectBoard);
    if(projectBoard.length > 0){
        renderProjects(projectBoard);
        renderProjectBoard(projectBoard);
    } else {
        noProject(projectBoard);
    }
}


startWindow();
document.getElementById('buttonOpenAsidePanel').addEventListener('click',openAsidePanel);
document.getElementById('buttonCloseAsidePanel').addEventListener('click', closeAsidePanel);
document.getElementById('buttonClosePanelTask').addEventListener('click', (e) => {
    document.getElementById('panel-task').style.transform = '';
});
