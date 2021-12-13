import { addNewMessage, cleanMsgPanel } from "./messages.js";
import { removeTaskOfProjectBoard, addTaskToProjectBoard } from './projectBoard.js';
import { prepareEventEditTask } from "./panel-task.js";
const urlTask = 'http://localhost:8080/api/task';

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

const postNewTask = (props) => {
    const data = {project: props.project, title: props.title};
    fetch(urlTask, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "authentication" : localStorage.getItem('userToken'),
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
    }).then(function(res){
        if(res.status === 201){
            res.json().then(function(data){
                const newTask = addTaskToProjectBoard(data,props.projectBoard);
                const newProps = {
                    task: newTask,
                    projectBoard: props.projectBoard,
                    render: props.render,
                    eventEdit: (props.eventEdit) ? props.eventEdit : undefined,
                    eventCompleted: (props.eventCompleted) ? props.eventCompleted : undefined,
                    showState : (props.showState) ? props.showState : undefined
                }
                props.taskArea.lastChild.remove();
                props.taskArea.appendChild(createObjectTask(newProps));
            })
        } else {
            props.target.parentNode.remove();
            addNewMessage('we can´t create the new task', 'error');
        }
    })
    .catch(function(e){
        console.error(e)
        input.parentNode.remove();
        addNewMessage('we can´t create the new task', 'error');
    })
}

const prepareEventCompleted = (props) => {
    return function(e){
        const {task} = props
        const data = {id: task.id, state: 'finished'}
        fetch(urlTask, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "authentication" : localStorage.getItem('userToken'),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(function(res){
            if(res.status === 201){
                const {projectBoard} = props;
                const i = removeTaskOfProjectBoard(task,projectBoard);
                if(i === 0)
                    props.renderProjectBoard();
                else
                    e.target.parentNode.parentNode.remove();
            } else
                addNewMessage('we can´t complete the task','error');
        })
        .catch(function(error){
            console.log(error)
            addNewMessage('we can´t complete the task','error');
        })
    }
}

const getTask = async (project) => {
    const url = urlTask + ((project) ? `?project=${project}` : '');
    const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "authentication" : localStorage.getItem('userToken'),
            "Content-Type" : "application/json"
        }
    })
    if(res.status === 200)
        return await res.json();
    else{
        const {message} = await res.json();
        addNewMessage(message,'error')
        return [];
    }
}

export {
    createObjectTask,
    postNewTask,
    getTask
}