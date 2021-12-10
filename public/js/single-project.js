import { openAsidePanel, closeAsidePanel, renderProjects, noProject } from './aside-panel.js'
import { getProject, prepareEventEditProject } from './project.js';
const idProject = document.URL.split('/').pop();




const starWindow = async () => {
    getProject(idProject).then( (data) => renderSingleProject(data))
    getProject().then(data => {
        console.log(data);
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
    const date = new Date(data.lastChangeDate);
    document.getElementById('firstLetter').textContent = data.name[0].toUpperCase();
    document.getElementById('titleOfTheProject').textContent = data.name;
    document.getElementById('stateOfTheProject').textContent = data.state;
    document.getElementById('dateOfTheProject').textContent = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    document.getElementById('buttonEditProject').addEventListener('click', prepareEventEditProject(data));
    
}


starWindow()
document.getElementById('buttonOpenAsidePanel').addEventListener('click', openAsidePanel);
document.getElementById('buttonCloseAsidePanel').addEventListener('click',closeAsidePanel);