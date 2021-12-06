import { removeTaskOfProjectBoard } from "./projectBoard.js";
import {cleanMsgPanel, addNewMessage} from './messages.js'
const urlTask = 'http://localhost:8080/api/task';


const prepareEventEditTask = (props) => {
    return (e) => {
        const {task} = props;
        openPanelTask();
        const date = new Date(task.date);
        document.getElementById('titleOfTheTask').value = task.title;
        document.getElementById('descriptionOfTheTask').value = task.description;
        document.getElementById('DateOfTheTask').textContent = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
        refreshPanelTaskActions(props);
        
    }
}

const refreshPanelTaskActions = (props) => {
    const panel = document.getElementById('panel-buttons');
    const children = panel.childNodes;
    while(children.length > 0)
        children[0].remove();
    
    const div = document.createElement('div');
    const i = document.createElement('i');
    const p = document.createElement('p');
    const button = document.createElement('button');

    const titleInput = document.getElementById('titleOfTheTask');
    const descriptionInput = document.getElementById('descriptionOfTheTask');

    div.className = 'removeTask';
    i.className = 'fas fa-trash';
    p.textContent = 'remove task';
    button.textContent = 'Upgrade';

    div.addEventListener('click', PrepareRemoveTask(props));
    button.addEventListener('click', prepareEventUpgradeTask(props));

    titleInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
        descriptionInput.focus();
    });
    descriptionInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
            button.focus();
    })

    div.appendChild(i);
    div.appendChild(p);
    panel.appendChild(div);
    panel.appendChild(button);
} 

const PrepareRemoveTask = (props) => {
    return (e) => {
        closePanelTask();
        fetch(urlTask, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "authentication" : localStorage.getItem('userToken'),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({id: props.task.id})
        })
        .then( async function(res){
            const data = await res.json();
            if(res.status === 200){
                removeTaskOfProjectBoard(props.task,props.projectBoard);
                props.renderProjectBoard(props.projectBoard);
                addNewMessage('the task was removed successfully','successful');
            } else{
                cleanMsgPanel();
                addNewMessage(data.message, 'error');
            }
        })
        .catch(function(e){
            cleanMsgPanel();
            addNewMessage('task could not be deleted', 'error');
        })
    }
}

const prepareEventUpgradeTask = (props) => {
    return (e) => {
        const title = document.getElementById('titleOfTheTask').value;
        const description = document.getElementById('descriptionOfTheTask').value;
        closePanelTask();
        fetch(urlTask, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "authentication" : localStorage.getItem('userToken'),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({id: props.task.id, title, description})
        })
        .then(async function(res){
            if(res.status === 201){
                props.task.title = title;
                props.task.description = description;
                props.renderProjectBoard(props.projectBoard); 
                addNewMessage('the task was updated successfully','successful');
            } else {
                const {message} = await res.json();
                addNewMessage(message,'error');
            }
        })
        .catch(function(error){
            console.log(error);
            addNewMessage('task could not be upgrade', 'error');
        })
    }
}

const openPanelTask = () => {
    document.getElementById('panel-task').style.transform = 'translateX(0)';
}

const closePanelTask = () => {
    document.getElementById('panel-task').style.transform = '';
}

export {
    prepareEventEditTask,
}