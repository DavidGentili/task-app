import {getTasks, noTasks} from './task.js';
import {renderProjects, noProject} from './project.js';
import {getUser , renderUser} from './user.js';

const projectBoard = [];
let user;


const startWindow = async () => {
    user = await getUser();
    renderUser(user);
    await getProjectBoard();
    if(projectBoard.length > 0){
        renderProjects(projectBoard);
        renderProjectBoard();
    } else {
        noProject();
        noTasks();
    }
}

const renderProjectBoard = () => {
    const main = document.querySelector('main');
    projectBoard.forEach( project => {
        if(project.tasks.length > 0)
            main.appendChild(createObjectProject(project));
    })
}

const createObjectProject = (project) => {
    const elemtProject = document.createElement('div');
    const title = document.createElement('div');
    const i = document.createElement('i');
    const h4 = document.createElement('h4');
    const taskArea = document.createElement('div');

    elemtProject.className = 'project';
    title.className = 'title';
    i.className = 'fas fa-chevron-down buttonActive';
    i.addEventListener('click',eventHiddenTask);
    h4.textContent = project.name;
    taskArea.className = 'taskArea';

    project.tasks.forEach(task => {
        taskArea.appendChild(createObjectTask(task))
    })

    elemtProject.appendChild(title);
    title.appendChild(i);
    title.appendChild(h4);
    elemtProject.appendChild(taskArea);
    return elemtProject;
}

const createObjectTask = (task) => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    div.className = 'task';
    p.textContent = task.title;
    div.appendChild(p);
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

startWindow();
