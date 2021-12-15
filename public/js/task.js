import { addNewMessage, cleanMsgPanel } from "./messages.js";
import { removeTaskOfProjectBoard, addTaskToProjectBoard } from './projectBoard.js';
import { prepareEventEditTask } from "./panel-task.js";
import { getInstance } from "./request.js";
import { unauthorizedUser } from "./user.js";

// props = {task, projectBoard, render, eventEdit, eventCompleted, showState}
const createObjectTask = (props) => {
    const div = document.createElement('div');
    const title = document.createElement('input');
    const action = document.createElement('div');
    const check = (props.eventCompleted) ? document.createElement('i') : undefined ;
    const edit = (props.eventEdit) ? document.createElement('i') : undefined;
    const state = (props.showState) ? document.createElement('h6') : undefined;
    div.className = 'task';
    title.value = (props.task && props.task.title) ? props.task.title : '';
    action.className = 'actionButtons';
    if(state)
        state.textContent = props.task.state;
    if(edit){
        edit.className = 'fas fa-eye';
        action.appendChild(edit);
    }
    if(check){
        check.className = 'fas fa-check';
        action.appendChild(check);
    }
    if(props.task && props.task.title){
        const {task, projectBoard, render} = props;
        if(props.eventCompleted)
            check.addEventListener('click', prepareEventCompleted({task, projectBoard, render}));
        if(props.eventEdit)
            edit.addEventListener('click',prepareEventEditTask({task, projectBoard, render}));
    }

    div.appendChild(title);
    if(state)
        div.appendChild(state);
    div.appendChild(action);
    
    return div;   
}

const generateNewProps = function (props, task){
    this.task = task;
    this.projectBoard = props.projectBoard
    this.render = props.render,
    this.eventEdit = (props.eventEdit) ? props.eventEdit : undefined,
    this.eventCompleted = (props.eventCompleted) ? props.eventCompleted : undefined,
    this.showState = (props.showState) ? props.showState : undefined
}

// props = {task, projectBoard, render, eventEdit, eventCompleted, showState}
const postNewTask = (props) => {
    const {title, project} = props;
    getInstance().post('task', {title, project})
    .then( (res) => {
        if(res.status === 201){
            const {data} = res
            const newTask = addTaskToProjectBoard(data,props.projectBoard);
            const newProps = new generateNewProps(props,newTask);
            props.taskArea.lastChild.remove();
            props.taskArea.appendChild(createObjectTask(newProps));
        } else {
            props.taskArea.lastChild.remove();
            addNewMessage('opps, we are having problems with the server, try again later','error');
        }
    })
    .catch( (e) => {
        props.taskArea.lastChild.remove();
        if(e.response.status === 403)
            unauthorizedUser();
        else
            addNewMessage('opps, we are having problems with the server, try again later','error');
    })
}

// props = {task, projectBoard, render}
const prepareEventCompleted = (props) => {
    return function(e){
        const {task} = props
        const data = {id: task.id, state: 'finished'}
        getInstance().put('task',data)
        .then( (res) => {
            if(res.status === 201){
                const {projectBoard} = props;
                const i = removeTaskOfProjectBoard(task,projectBoard);
                if(i === 0)
                    props.render(projectBoard);
                else
                    e.target.parentNode.parentNode.remove();
            } else
                addNewMessage('opps, we are having problems with the server, try again later','error');
        })
        .catch( (e) => {
            if(e.response.status === 403)
                unauthorizedUser()
            else
            addNewMessage('opps, we are having problems with the server, try again later','error');
        })
    }
}

const getTask = async (project) => {
    try{
        const urlTask = (project) ? `task?project=${project}` : 'task';  
        const res = await getInstance().get(urlTask)
        if(res.status === 200)
            return res.data;
        else{
            const {message} = await res.json();
            addNewMessage(message,'error')
            return [];
        }
    }catch(e){
        if(e.response.status === 403)
            unauthorizedUser();
        else
            addNewMessage('opps, we are having problems with the server, try again later','error');
    }
    
}

export {
    createObjectTask,
    postNewTask,
    getTask
}