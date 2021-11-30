import {getTasks, noTasks} from './task.js';
import { getProjects, renderProjects, noProject} from './project.js';
import {getUser , renderUser} from './user.js';

const projects = [];
const tasks = [];
let user;

class Project{
    constructor(id,name){
        this.id = id;
        this.name = name;
        this.tasks = [];
    };

    addTask(task){
        this.tasks.push(task);
    }
}

class Task{
    constructor(id,title,description,state,date){
        this.id = id;
        this.title = title;
        this.description = description;
        this.state = state;
        this.date = date;
    }
}


const startWindow = async () => {
    user = await getUser();
    renderUser(user);
    await getProjects(projects);
    if(projects.length != 0){
        renderProjects(projects);
        await getTasks(tasks);
        if(tasks)
            renderTaskByProject(projects,tasks);
        else 
            noTasks();
    } else{
        noProject();
        noTasks();
    }
}

const renderTaskByProject = (projects,tasks) => {
    const ordererProjects = orderByProjects(projects,tasks);
    const main = document.querySelector('main');
    ordererProjects.forEach( project => {
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

//Retorna instancias de la clase Project con sus respectivas Task, en caso de no tener task, se lo elimina de la lista
const orderByProjects = (projects,tasks) => {
    const ordererProjects = projects.map(project => new Project(project._id,project.name));
    ordererProjects.sort((a,b) => (a<b)? -1 : 1);
    tasks.forEach(task => {
        const {_id,title,description,lastChangeDate,state} = task
        const date = new Date(lastChangeDate);
        const newTask = new Task(_id,title,description,state,date);
        const i = ordererProjects.findIndex(project => project.id === task.project);
        ordererProjects[i].addTask(newTask);
    })
    return ordererProjects.filter(project => project.tasks.length !== 0)
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


startWindow();
