import { createObjectTask, postNewTask } from "./task.js";
import { getInstance } from "./request.js";
import { addNewMessage } from "./messages.js";
import { unauthorizedUser } from "./user.js";

const getProjectBoard = async (projectBoard) => {
    try{
        const {data} = await getInstance().get('board?taskState=pending');
        refreshProjectBoard(data,projectBoard);
    } catch(e){
        if(e.response.status === 403)
            unauthorizedUser();
        else
            addNewMessage('opps, we are having problems with the server try again later','error');
    }
    
}

const refreshProjectBoard = (data,projectBoard) => {
    while(projectBoard.length != 0)
        projectBoard.pop();
    data.forEach(project => {
        projectBoard.push(project);
    })
}

const renderProjectBoard = (projectBoard) => {
    const main = document.querySelector('main');
    cleanWindowProjectBoard();
    projectBoard.forEach( project => {
        if(project.tasks.length > 0)
            main.appendChild(createObjectProject(project,projectBoard));
    })
}

const createObjectProject = (project,projectBoard) => {
    const elemtProject = document.createElement('div');
    const title = document.createElement('div');
    const i = document.createElement('i');
    const h4 = document.createElement('h4');
    const button = document.createElement('button');
    const taskArea = document.createElement('div');

    elemtProject.className = 'project';
    title.className = 'title';
    i.className = 'fas fa-chevron-down buttonActive';
    i.addEventListener('click',toggleProjectTasks);
    h4.textContent = project.name;
    taskArea.className = 'taskArea';
    button.textContent = '+';
    button.addEventListener('click', prepareEventNewTask(project.id,projectBoard));

    project.tasks.forEach(task => {
        taskArea.appendChild(createObjectTask({task, projectBoard, render: renderProjectBoard, eventCompleted: true, eventEdit: true}))
    })

    elemtProject.appendChild(title);
    title.appendChild(i);
    title.appendChild(h4);
    title.appendChild(button);
    elemtProject.appendChild(taskArea);
    return elemtProject;
}

const prepareEventNewTask = (idProject,projectBoard) => {
    return function(e){
        e.preventDefault();
        const taskArea = e.target.parentNode.nextSibling;
        const task = document.createElement('div');
        const input = document.createElement('input'); 
        task.className = 'task';
        task.appendChild(input);
        taskArea.appendChild(task)
        input.focus();
        input.addEventListener('focusout', preparePostNewTask(idProject,projectBoard));
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter'){
                input.blur();
            }
        })
    }
}

const preparePostNewTask = (idProject, projectBoard) => {
    return  function(e){
        e.preventDefault()
        const value = e.target.value.trim();
        if(value.length > 0){
            const props = {
                project: idProject,
                title: value,
                taskArea: e.target.parentNode.parentNode,
                projectBoard,
                render: renderProjectBoard,
                eventCompleted : true,
                eventEdit: true
            }
            postNewTask(props);
        } else{
            e.target.parentNode.remove();
        }
    }
}

const cleanWindowProjectBoard = () => {
    const projects = document.getElementsByClassName('project');
    while(projects.length)
        projects[0].remove();
}

const toggleProjectTasks = (e) => {
    e.preventDefault();
    let task = e.target;
    const hidden = e.target.classList.contains('fa-chevron-right');
    if(task.tagName === 'I')
        task = task.parentNode;
    while(task && !(task.classList && task.classList.contains('taskArea')))
        task = task.nextSibling;
    e.target.classList = (hidden) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'; 
    (hidden) ? task.classList.remove('d-none') : task.classList.add('d-none');
    
}

export {
    renderProjectBoard,
    getProjectBoard
}