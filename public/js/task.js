import { addNewMessage, cleanMsgPanel } from "./messages.js";
import { removeTaskOfProjectBoard, addTaskToProjectBoard } from './projectBoard.js';
import { prepareEventEditTask } from "./panel-task.js";
const urlTask = 'http://localhost:8080/api/task';

const createObjectTask = (props) => {
    const div = document.createElement('div');
    const title = document.createElement('input');
    const action = document.createElement('div');
    const check = document.createElement('i');
    const edit = document.createElement('i');

    div.className = 'task';
    title.value = (props.task && props.task.title) ? props.task.title : '';
    action.className = 'actionButtons';
    check.className = 'fas fa-check';
    edit.className = 'fas fa-eye';
    if(props.task && props.task.title){
        check.addEventListener('click', prepareEventCompleted(props));
        edit.addEventListener('click',prepareEventEditTask(props));
    }


    div.appendChild(title);
    div.appendChild(action);
    action.appendChild(edit);
    action.appendChild(check);
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
                const newProps = {
                    task: data,
                    projectBoard: props.projectBoard,
                    renderProjectBoard: props.renderProjectBoard
                }
                props.target.nextSibling.childNodes[1].addEventListener('click',prepareEventCompleted(newProps));
                props.target.nextSibling.childNodes[0].addEventListener('click',prepareEventEditTask(newProps));
                addTaskToProjectBoard(data,props.projectBoard);
            })
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

export {
    createObjectTask,
    postNewTask
}