import { openAsidePanel, closeAsidePanel, renderProjects, noProject } from './aside-panel.js'
import { addNewMessage } from './messages.js';
import { getProject, prepareModalEditProject } from './project.js';
import { generateProjectBoard } from './projectBoard.js';
import { getTask ,createObjectTask } from './task.js';
import { getUser, renderUser } from './user.js'

const idProject = document.URL.split('/').pop();




const starWindow = async () => {
    const user = await getUser();
    if(user){
        renderUser(user);
        const project = await getProject(idProject)
        renderSingleProject(project)
        getProject()
            .then(data => {
                if(data.length !== 0){
                    data.sort((a,b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1);
                    renderProjects(data);    
                } else
                    noProject();
            })
        getTask(idProject)
            .then( data => {
                if(!Array.isArray(data))
                    data = [data];
                renderTaskOfTheProject(generateProjectBoard([project],data));
            })
        .catch((e) => {
            console.log(e);
        })
    }
}

const renderSingleProject = (data) => {
    const date = new Date(data.lastChangeDate);
    document.getElementById('firstLetter').textContent = data.name[0].toUpperCase();
    document.getElementById('titleOfTheProject').textContent = data.name;
    document.getElementById('stateOfTheProject').textContent = data.state;
    document.getElementById('dateOfTheProject').textContent = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    document.getElementById('buttonEditProject').addEventListener('click', prepareModalEditProject(data));
}

const renderTaskOfTheProject = (projectBoard) => {
    const panel = document.getElementById('panel-body');
    cleanPanel(panel);
    projectBoard[0].tasks.forEach(task => {
        const props = {
            task,
            projectBoard,
            render: renderTaskOfTheProject,
            eventEdit: true
        }
        panel.appendChild(createObjectTask(props));
    })
}

const cleanPanel = (panel) => {
    let elem = panel.firstChild;
    while(elem){
        const aux = elem;
        elem = elem.nextSibling;
        aux.remove();
    }
}


starWindow()
document.getElementById('buttonOpenAsidePanel').addEventListener('click', openAsidePanel);
document.getElementById('buttonCloseAsidePanel').addEventListener('click',closeAsidePanel);
document.getElementById('buttonClosePanelTask').addEventListener('click', (e) => {
    document.getElementById('panel-task').style.transform = '';
});