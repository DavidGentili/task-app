const urlProject = 'http://localhost:8080/Api/project';
import { generateAButton } from "./button.js";
import { addInternalMessage, addNewMessage } from "./messages.js";
import { generateModal, removeModal } from "./modal-window.js";
import {generateASelect} from './select.js'

const getProject = async (idProject) => {
    const url = (idProject) ? `${urlProject}?_id=${idProject}` : urlProject;
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
    }

}


const refreshProject = (data, projects) => {
    while(projects.length > 0)
        projects.pop();
    data.forEach(singleProject => projects.push(singleProject));
}

const prepareModalEditProject = (project) => {
    return (e) => {
        generateModal('Update the project');
        const body = document.getElementById('bodyCard');
        body.classList += ' modalEditProject';
        const title = document.createElement('input');
        const div = document.createElement('div');
        div.className = 'panelButtons';
        const props = {
            elements: ['actived', 'archived'],
            name: 'stateOfProject',
            selected: project.state,
        }
        title.value = project.name;
        
        body.appendChild(title);
        body.appendChild(generateASelect(props));
        body.appendChild(div);
        div.appendChild(generateAButton('Remove project','','buttonRemove',prepareEventRemoveProject({project})));
        div.appendChild(generateAButton('Update','','buttonEdit'));
        
    }
}


const prepareEventRemoveProject = (props) => {
    return (e) => {
        console.log(props.project)
        fetch(urlProject,{
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "authentication" : localStorage.getItem('userToken'),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({id: props.project.id})
        })
        .then((res) => {
            if(res.status === 200){
                addInternalMessage('the project was removed successfully','success');
                location.href = '/my-board';
            } else{
                res.json()
                .then(data => {
                    removeModal();
                    addNewMessage(data.message,'error');
                });
            }
        })
        .catch((e) => {
            removeModal();
            addNewMessage(e,'error');
        })
    }
}

export {
    getProject,
    prepareModalEditProject
}