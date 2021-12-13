import { generateModal, removeModal } from "./modal-window.js";
import { addProjectToProjectBoard } from "./projectBoard.js";
import {generateAButton} from './button.js';

// obtiene los proyectos del usuario desde la API. Retorna una lista de proyectos
const getProjects = async () => {
    const url = 'http://localhost:8080/api/project?state=active';
    const authentication = localStorage.getItem('userToken');
    try{
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "authentication" : authentication,
                "Content-Type" : "application/json"  
            }
        })
        const data = await res.json();
        const projects = data.map(project => {
            return {
                id: project._id,
                name: project.name,
                state: project.state
            };
        })
        projects.sort((a,b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1 );
        return projects;
    }catch(e){
        return [];
    }
} 

const projectOfAside = (project) => {
    const a = document.createElement('a');
    a.href = `/project/${project.id}`;
    a.textContent = project.name;
    return a;
}

const cleanAsidePanel = () => {
    let elem = document.getElementById('aside-menu').nextSibling;
    while(elem){
        const aux = elem;
        elem = elem.nextSibling;
        aux.remove();
    }
}

const generateAPanelProject = (name) => {
    const container = document.createElement('div');
    const header = document.createElement('div');
    const panel = document.createElement('div');
    const button = document.createElement('button');
    const i = document.createElement('i');
    const h6 = document.createElement('h6');
    
    container.className = 'panel-project';
    header.className = 'menu-panel-project';
    panel.className = 'panelProject';
    i.className = 'fas fa-chevron-down';
    h6.textContent = name;
    
    container.appendChild(header);
    container.appendChild(panel);
    header.appendChild(button);
    button.appendChild(i);
    header.appendChild(h6);

    button.addEventListener('click',toggleProject(i,panel));

    return container;
}

const renderProjects = (projects) => {
    cleanAsidePanel();
    const menu = document.getElementById('aside-menu');
    const aside = document.getElementById('aside-panel');
    const active = generateAPanelProject('active');
    const archived = generateAPanelProject('archived');
    const activePanel = active.firstChild.nextSibling;
    const archivedPanel = archived.firstChild.nextSibling;

    if(!document.getElementById('buttonAddNewProject'))
        menu.insertBefore(generateAButton('+ add new project','buttonAddNewProject','',prepareEventInputNewProject(projects)),menu.firstChild);

    aside.appendChild(active);
    aside.appendChild(archived);
    

    projects.forEach(project => {
        if(project.state === 'active')
            activePanel.appendChild(projectOfAside(project));
        else
            archivedPanel.appendChild(projectOfAside(project));
    })
}

//Renderiza la visualizacion necesaria para cuando no se tiene proyectos
const noProject = (projects) => {
    const aside = document.getElementById('aside-panel');
    const img = document.createElement('img');
    const p = document.createElement('p');

    img.src = 'img/no-project.png';
    img.alt = 'no projects';
    p.textContent = 'you don´t have projects yet';

    aside.appendChild(img);
    aside.appendChild(p);
    aside.appendChild(generateAButton('Add one', 'buttonAddOneProject',undefined,prepareEventInputNewProject(projects)));

}

//evento que renderiza una ventana modal y se encarga de asignar los elementos del header
const prepareEventInputNewProject = (projects) => {
    return (e) => {  
        e.preventDefault();
        generateModal('Create a new project');
        const body = document.getElementById('bodyCard');        
        bodyNewProject(body, projects);
    }
}

//Renderiza los elementos de del cuerpo de la ventana modal
const bodyNewProject = (body, projects) => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    input.type = 'text';
    input.name = 'nameProject';
    input.placeholder = 'Project name';
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
            prepareEventNewProject(projects);
    })
    button.textContent = 'Add project'
    button.addEventListener('click',prepareEventNewProject(projects));

    form.appendChild(input);
    form.appendChild(generateAButton('Add project',undefined,undefined,prepareEventNewProject(projects)));
    body.appendChild(form);

    input.focus();

}

//Se encarga de hacer un post del nuevo proyecto, se añade a projectBoard y se renderizan todos los proyectos 
const prepareEventNewProject = (projects) => {
    return (e) => {
         e.preventDefault();
        const url = 'http://localhost:8080/api/project'
        const name = document.getElementsByName('nameProject')[0].toUpperCase();
        const value = name.value;
        const data = {name:name.value};
        if(value && value.length > 0){
            fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers:{
                    "authentication" : localStorage.getItem('userToken'),
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(async (res) => {
                if(res.status === 201){
                    removeModal();
                    const data = await res.json();
                    addProjectToProjectBoard(data,projects);
                    renderProjects(projects);
                }
            })
        } else {
            name.placeholder = 'Please insert a name project';
            name.style.borderBottom = '2px solid #DC3545'
        }
    }
}

const openAsidePanel = (e) => {
    document.getElementById('aside-panel').style.transform = 'translateX(0)';
}

const closeAsidePanel = (e) => {
    document.getElementById('aside-panel').style.transform = '';
}

const toggleProject = (icon,panel) => {
    return (e) => {
        if(icon.classList.contains('fa-chevron-down')){
            icon.className = 'fas fa-chevron-right';
            panel.style.display = 'none';
        } else{
            icon.className = 'fas fa-chevron-down';
            panel.style.display = '';
        }
    }
}


export{
    renderProjects,
    noProject,
    openAsidePanel,
    closeAsidePanel,
}