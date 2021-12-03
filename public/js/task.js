import { addNewMessage } from "./messages.js";
const urlTask = 'http://localhost:8080/api/task';

const createObjectTask = (task,projectBoard) => {
    const div = document.createElement('div');
    const title = document.createElement('input');
    const action = document.createElement('div');
    const check = document.createElement('i');
    const edit = document.createElement('i');

    div.className = 'task';
    title.value = task.title;
    action.className = 'actionButtons';
    check.className = 'fas fa-check';
    edit.className = 'fas fa-eye';
    if(task.id){
        check.addEventListener('click', prepareEventCompleted(task.id, projectBoard));
        edit.addEventListener('click',prepareEditTaskEvent(task,projectBoard));
    }


    div.appendChild(title);
    div.appendChild(action);
    action.appendChild(edit);
    action.appendChild(check);
    return div;   
}

const addTaskToProjectBoard = (task,projectBoard) => {
    const i = projectBoard.findIndex(project => project.id === task.project)
    if(i !== -1){
        projectBoard[i].tasks.push(task);
    }
}

const preparePostNewTask = (idProject,projectBoard) => {
    return  function(e){
        e.preventDefault()
        const value = e.target.value.trim();
        if(value.length > 0){
            postNewTask(idProject,value,e.target,projectBoard);
        } else{
            e.target.parentNode.remove();
        }
    }
}

const postNewTask = (project,title,input,projectBoard) => {
    const data = {project, title};
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
                input.nextSibling.childNodes[1].addEventListener('click',prepareEventCompleted(data.id));
                addTaskToProjectBoard(data,projectBoard);
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

const prepareEventCompleted = (idTask) => {
    return function(e){
        const data = {id: idTask, state: 'finished'}
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
                e.target.parentNode.parentNode.remove();
                res.json().then(function(data){
                    addNewMessage('the task was completed successful','successful');
                })
            } else
                addNewMessage('we can´t complete the task','error');
        })
        .catch(function(){
            addNewMessage('we can´t complete the task','error');
        })
    }
}

const prepareEditTaskEvent = (task,projectBoard) => {
    return (e) => {
        document.getElementById('panel-task').style.transform = 'translateX(0)';
        
        document.getElementById('titleOfTheTask').value = task.title;
        document.getElementById('descriptionOfTheTask').value = task.description;
        document.getElementById('DateOfTheTask').textContent = task.date;
    }
}

export {
    createObjectTask,
    preparePostNewTask
}