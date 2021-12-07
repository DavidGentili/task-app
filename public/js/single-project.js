import { openAsidePanel, closeAsidePanel, renderProjects, noProject } from './aside-panel.js'
import { getProject } from './project.js';
const idProject = document.URL.split('/').pop();




const starWindow = async () => {
    getProject(idProject).then( (data) => renderSingleProject(data))
    
    getProject().then(data => {
        if(data.length !== 0)
            renderProjects(data);    
        else
            noProject();
    }) 
    .catch((e) => {
        console.log(e);
    })
}

const renderSingleProject = (data) => {
    console.log(data);
}

starWindow()
document.getElementById('buttonOpenAsidePanel').addEventListener('click', openAsidePanel);
document.getElementById('buttonCloseAsidePanel').addEventListener('click',closeAsidePanel);