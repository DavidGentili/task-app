import { removeTaskOfProjectBoard, getTaskOfProjectBoard } from "./project-board.js";
import {cleanMsgPanel, addNewMessage} from './messages.js'
import { getInstance } from "./request.js";
import { generateAButton } from "./button.js";
import { unauthorizedUser } from "./user.js";
const urlTask = 'http://localhost:8080/api/task';


const prepareEventEditTask = (props) => {
    return (e) => {
        const {task} = props;
        openPanelTask();
        const date = new Date(task.date || task.lastChangeDate);
        document.getElementById('titleOfTheTask').value = task.title;
        document.getElementById('descriptionOfTheTask').value = (task.description != undefined) ? task.description : '';
        document.getElementById('DateOfTheTask').textContent = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
        refreshPanelTaskActions(props);  
    }
}

const refreshPanelTaskActions = (props) => {
    const panel = document.getElementById('panel-buttons');
    const children = panel.childNodes;
    while(children.length > 0)
        children[0].remove();
    
    const i = document.createElement('i');
    const p = document.createElement('p');
    const button = generateAButton('Update','','buttonUpdate',prepareEventUpgradeTask(props))

    const titleInput = document.getElementById('titleOfTheTask');
    const descriptionInput = document.getElementById('descriptionOfTheTask');

    i.className = 'fas fa-trash';
    p.textContent = 'remove task';


    titleInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
        descriptionInput.focus();
    });
    descriptionInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
            button.focus();
    })

    panel.appendChild(generateAButton(undefined,undefined,'removeTask',PrepareRemoveTask(props),[i,p]));
    panel.appendChild(button);
} 

const PrepareRemoveTask = (props) => {
    return (e) => {
        closePanelTask();
        getInstance().delete('task',{
            data: {id: props.task.id}
        })
        .then(function(res){
            const {data} = res;
            if(res.status === 200){
                removeTaskOfProjectBoard(props.task,props.projectBoard);
                props.render(props.projectBoard);
                addNewMessage('the task was removed successfully','successful');
            } else{
                cleanMsgPanel();
                addNewMessage(data.message, 'error');
            }
        })
        .catch(function(e){
            if(e.response.status === 403)
                unauthorizedUser();
            else
                addNewMessage('opps, we are having problems with the server, try again later','error');
        })
    }
}

const prepareEventUpgradeTask = (props) => {
    return (e) => {
        const title = document.getElementById('titleOfTheTask').value;
        const description = document.getElementById('descriptionOfTheTask').value;
        closePanelTask();
        if(title.length > 0 && (title != props.task.title || description != props.task.description)){
            getInstance().put('task',{id: props.task.id, title, description})
            .then( (res) => {
                if(res.status === 201){
                    const {task,projectBoard} = props;
                    const currentTask = getTaskOfProjectBoard(task.id,projectBoard);
                    currentTask.date = new Date(res.data.lastChangeDate);
                    currentTask.title = title;
                    currentTask.description = description;
                    props.render(props.projectBoard); 
                    addNewMessage('the task was updated successfully','successful');
                } else
                    addNewMessage(res.data.message,'error');
            })
            .catch( (e) => {
                if(e.response && e.response.status === 403)
                    unauthorizedUser();
                else
                    addNewMessage('opps, we are having problems with the server, try again later','error');
            })
        } else {
            if(title.length > 0){
                closePanelTask()
                addNewMessage('the task has been saved without modifications','successful');
            } else {
                addNewMessage('you must enter a title', 'error');
            }
        }
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