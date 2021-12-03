import { renderProjects, noProject} from './project.js';
import {getUser , renderUser} from './user.js';
import { addNewMessage } from './messages.js';
import {getProjectBoard, renderProjectBoard, projectBoard} from './board.js';


const startWindow = async () => {
    const user = await getUser();
    renderUser(user);
    await getProjectBoard(projectBoard);
    if(projectBoard.length > 0){
        renderProjects(projectBoard);
        renderProjectBoard(projectBoard);
    } else {
        noProject();
    }
}

startWindow();
document.getElementById('buttonClosePanelTask').addEventListener('click', (e) => {
    document.getElementById('panel-task').style.transform = '';
});
