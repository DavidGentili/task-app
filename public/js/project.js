const urlProject = 'http://localhost:8080/Api/project';
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

const prepareEventEditProject = (project) => {
    return (e) => {
        generateModal('Update the project');
        const body = document.getElementById('bodyCard');
        body.classList += ' modalEditoProject';
        const title = document.createElement('input');
        const props = {
            elements: ['actived', 'archived'],
            name: 'stateOfProject',
            selected: project.state,
        }
        title.value = project.name;

        body.appendChild(title);
        body.appendChild(generateASelect(props));
        
    }
}

export {
    getProject,
    prepareEventEditProject,
}