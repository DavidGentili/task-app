import { generateAButton } from "./button.js";
import { addInternalMessage, addNewMessage } from "./messages.js";
import { generateModal, removeModal } from "./modal-window.js";
import { getInstance } from "./request.js";
import {generateASelect} from './select.js'
import { unauthorizedUser } from "./user.js";

const getProject = async (idProject) => {
    const urlProject = (idProject) ? `project?id=${idProject}` : 'project';
    try{
        const res = await getInstance().get(urlProject)
        if(res.status === 200)
            return res.data;
        else
            addNewMessage(res.data.message,'error');            
    } catch(e){
        if(e.response.status === 403)
            unauthorizedUser();
        else
            addNewMessage('opps, we are having problems with the server, try again later','error');
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
        getInstance().delete('project', {
            data: {id: project.id}
        })
        .then((res) => {
            if(res.status === 200){
                addInternalMessage({message: 'the project was removed successfully', type: 'successful'});
                location.href = '/my-board';
            } else{
                removeModal();
                addNewMessage(res.data.message,'error');
            }
        })
        .catch((e) => {
            removeModal();
            if(e.response.status === 403)
                unauthorizedUser();
            else
                addNewMessage('opps, we are having problems with the server, try again later','error');
        })
    }
}

const prepareEventEditProject = (project) => {
    return (e) => {
        const name = document.getElementsByName('nameOfProject')[0].value;
        const state = document.getElementsByName('stateOfProject')[0].value;
        if(name.length > 0 && (name != project.name || state != project.state)){
            const {id} = project;
            const body = {id,name,state};
            getInstance().put('project', {id,name,state})
            .then( res => {
                if(res.status === 201){
                    addInternalMessage({message:'the project was successfully modified', type:'successful'});
                    location.href = document.URL;
                } else{
                    removeModal();
                    addNewMessage(res.datamessage,'error');
                }
            })
            .catch( e => {
                if(e.response && e.response.status === 403)
                    unauthorizedUser()
                else{
                    removeModal();
                    addNewMessage('opps, we are having problems with the server, try again later','error');
                }
            })
        } else {
            removeModal()
            if(name.length > 0)
                addNewMessage('the project has not been modified','successful');
            else
                addNewMessage('you must enter a name for the project', 'error');
        }
    }
}

export {
    getProject,
    prepareModalEditProject
}