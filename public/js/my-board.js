import { renderProjects, noProject} from './project.js';
import {getUser , renderUser} from './user.js';
import { addNewMessage } from './messages.js';

const projectBoard = [];
let user;


const startWindow = async () => {
    user = await getUser();
    renderUser(user);
    await getProjectBoard();
    console.log(projectBoard);
    if(projectBoard.length > 0){
        renderProjects(projectBoard);
        renderProjectBoard();
    } else {
        noProject();
    }
}

const renderProjectBoard = () => {
    const main = document.querySelector('main');
    projectBoard.forEach( project => {
        if(project.tasks.length > 0)
            main.appendChild(createObjectProject(project));
    })
}

const cleanProjectBoard = () => {
    const projects = document.getElementsByClassName('project');
    while(projects.length)
        projects[0].remove();
}

const createObjectProject = (project) => {
    const elemtProject = document.createElement('div');
    const title = document.createElement('div');
    const i = document.createElement('i');
    const h4 = document.createElement('h4');
    const button = document.createElement('button');
    const taskArea = document.createElement('div');

    elemtProject.className = 'project';
    title.className = 'title';
    i.className = 'fas fa-chevron-down buttonActive';
    i.addEventListener('click',eventHiddenTask);
    h4.textContent = project.name;
    taskArea.className = 'taskArea';
    button.textContent = '+';
    button.addEventListener('click', prepareEventNewTask(project.id));

    project.tasks.forEach(task => {
        taskArea.appendChild(createObjectTask(task))
    })

    elemtProject.appendChild(title);
    title.appendChild(i);
    title.appendChild(h4);
    title.appendChild(button);
    elemtProject.appendChild(taskArea);
    return elemtProject;
}

const createObjectTask = (task) => {
    const div = document.createElement('div');
    const title = document.createElement('input');
    div.className = 'task';
    title.value = task.title;
    div.appendChild(title);
    return div;   
}

const eventShowTask = (e) => {
    e.preventDefault();
    const target = e.target;
    target.removeEventListener('click',eventShowTask);
    target.classList = 'fas fa-chevron-down';
    let task = target;
    if(task.tagName === 'I')
        task = task.parentNode;
    while(task && !(task.classList && task.classList.contains('taskArea')))
        task = task.nextSibling;
    task.classList.remove('d-none');
    target.addEventListener('click',eventHiddenTask);
}

const eventHiddenTask = (e) => {
    e.preventDefault();
    const target = e.target;
    target.removeEventListener('click',eventHiddenTask);
    target.classList = 'fas fa-chevron-right';
    let task = target;
    if(task.tagName === 'I')
        task = task.parentNode;
    while(task && !(task.classList && task.classList.contains('taskArea')))
        task = task.nextSibling;
    task.classList.add('d-none');
    target.addEventListener('click',eventShowTask);
}

const getProjectBoard = async () => {
    const url = 'http://localhost:8080/api/board?taskState=pending&projectState=active';
    const authentication = localStorage.getItem('userToken');
    const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "authentication" : authentication,
            "Content-Type" : "application/json"
        }
    });
    const data = await res.json();
    refreshProjectBoard(data);
}

const refreshProjectBoard = (data) => {
    while(projectBoard.length != 0){
        projectBoard.pop();
    }
    data.forEach(project => {
        projectBoard.push(project);
    })
}

const postNewTask = (project,title,input) => {
    const data = {project, title};
    const url = 'http://localhost:8080/api/task';
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "authentication" : localStorage.getItem('userToken'),
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
    }).then(function(res){
        console.log(res);
        if(res.status === 201){
            //prepareEventNewTask(project)();
        } else {
            input.parentNode.remove();
            addNewMessage('we can´t create the new task', 'error');
        }
    })
    .catch(function(e){
        console.error(e)
        input.parentNode.remove();
        addNewMessage('we can´t create the new task', 'error');
    })
}

const preparePostNewTask = (idProject) => {
    return  function(e){
        e.preventDefault()
        const value = e.target.value.trim();
        if(value.length > 0){
            postNewTask(idProject,value,e.target);
        } else{
            e.target.parentNode.remove();
        }
    }
}



const prepareEventNewTask = (idProject) => {
    return function(e){
        e.preventDefault();
        const task = createObjectTask({title:''});
        const taskArea = e.target.parentNode.nextSibling;
        const input = task.childNodes[0]; 
        taskArea.appendChild(task)
        input.focus();
        input.addEventListener('focusout', preparePostNewTask(idProject));
    }
}

startWindow();
