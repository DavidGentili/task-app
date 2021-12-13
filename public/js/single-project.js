import { openAsidePanel, closeAsidePanel, renderProjects, noProject } from './aside-panel.js'
import { addNewMessage } from './messages.js';
import { getProject, prepareModalEditProject } from './project.js';
import { generateProjectBoard } from './projectBoard.js';
import { getTask, createObjectTask, postNewTask } from './task.js';
import { getUser, renderUser } from './user.js'

const idProject = document.URL.split('/').pop();
const projectBoard = [];



const starWindow = async () => {
    const user = await getUser();
    if(user != {}){
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
                const aux = generateProjectBoard([project],data);
                aux.forEach(project => projectBoard.push(project));
                renderTaskOfTheProject(projectBoard);
            })
        .catch((e) => {
            console.log(e);
        })
    } else{
        localStorage.removeItem('userToken');
        location.href = '/'
    }
}

const renderSingleProject = (data) => {
    const date = new Date(data.lastChangeDate);
    document.getElementById('firstLetter').textContent = data.name[0].toUpperCase();
    document.getElementById('titleOfTheProject').textContent = data.name;
    document.getElementById('stateOfTheProject').textContent = data.state;
    document.getElementById('dateOfTheProject').textContent = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    document.getElementById('buttonEditProject').addEventListener('click', prepareModalEditProject(data));
    document.getElementById('addNewTask').addEventListener('click', prepareToAddNewTask)
}

const renderTaskOfTheProject = (projectBoard) => {
    const panel = document.getElementById('panel-body');
    cleanPanel(panel);
    projectBoard[0].tasks.forEach(task => {
        const props = {
            task,
            projectBoard,
            render: renderTaskOfTheProject,
            eventEdit: true,
            showState: true
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

const prepareToAddNewTask = () => {
    const panel = document.getElementById('panel-body');
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.type = 'text';
    div.className = 'task'
    panel.appendChild(div);
    div.appendChild(input);
    input.addEventListener('focusout', eventNewTask);
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
            input.blur();
    })
    input.focus();
}

const eventNewTask = (e) => {
    e.preventDefault();
    const value = e.target.value.trim();
    if(value.length > 0){
        const props = {
            project: idProject,
            title: value,
            taskArea: document.getElementById('panel-body'),
            projectBoard,
            render: renderTaskOfTheProject,
            showState : true,
            eventEdit: true
        }
        postNewTask(props);
    } else
        document.getElementById('panel-body').lastChild.remove();
}


starWindow()
document.getElementById('buttonOpenAsidePanel').addEventListener('click', openAsidePanel);
document.getElementById('buttonCloseAsidePanel').addEventListener('click',closeAsidePanel);
document.getElementById('buttonClosePanelTask').addEventListener('click', (e) => {
    document.getElementById('panel-task').style.transform = '';
});