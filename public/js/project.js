const urlProject = 'http://localhost:8080/Api/project';
import { generateAButton } from "./button.js";
import { addInternalMessage, addNewMessage } from "./messages.js";
import { generateModal, removeModal } from "./modal-window.js";
import {generateASelect} from './select.js'

const getProject = async (idProject) => {
    const url = (idProject) ? `${urlProject}?id=${idProject}` : urlProject;
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
        const name = document.createElement('input');
        const div = document.createElement('div');

        body.classList += ' modalEditProject';
        const props = {
            elements: ['active', 'archived'],
            name: 'stateOfProject',
            selected: project.state,
        }
        name.name = 'nameOfProject'
        name.value = project.name;
        div.className = 'panelButtons';

        
        body.appendChild(name);
        body.appendChild(generateASelect(props));
        body.appendChild(div);
        div.appendChild(generateAButton('Remove project','','buttonRemove',prepareEventRemoveProject(project)));
        div.appendChild(generateAButton('Update','','buttonEdit',prepareEventEditProject(project)));
        
    }
}


const prepareEventRemoveProject = (project) => {
    return (e) => {
        fetch(urlProject,{
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "authentication" : localStorage.getItem('userToken'),
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({id: project.id})
        })
        .then((res) => {
            if(res.status === 200){
                addInternalMessage({message: 'the project was removed successfully', type: 'successful'});
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

const prepareEventEditProject = (project) => {
    return (e) => {
        const name = document.getElementsByName('nameOfProject')[0].value;
        const state = document.getElementsByName('stateOfProject')[0].value;
        if(name != project.name || state != project.state){
            const {id} = project;
            const body = {id,name,state};
            fetch(urlProject,{
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'authentication' : localStorage.getItem('userToken'),
                    'Content-Type' : 'application-json'
                },
                body: JSON.stringify(body)
            })
            .then( async res => {
                if(res.status === 201){
                    addInternalMessage({message:'the project was successfully modified', type:'successful'});
                    location.href = document.URL;
                } else{
                    const {message} = await res.json();
                    removeModal();
                    addNewMessage(message,'error');
                }
            })
            .catch( e => {
                console.log(e);
                removeModal();
                addNewMessage('oops we couldn´t modify the project','error');
            })
        } else {
            removeModal()
            addNewMessage('the project has not been modified','successful');
        }
    }
}

export {
    getProject,
    prepareModalEditProject
}