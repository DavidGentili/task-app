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

//Renderiza una lista de proyectos en el panel denominado 'menu-board', si hay proyectos añade el boton para agregar proyectos
const renderProjects = (projectBoard) => {
    const aside = document.getElementById('aside-panel');
    const menu = document.getElementById('aside-menu');
    
    let act = menu.nextSibling;
    while(act){
        const ant = act;
        act = act.nextSibling;
        ant.remove();
    }
    if(!document.getElementById('buttonAddNewProject'))
        menu.insertBefore(generateAButton('+ add new project','buttonAddNewProject','',prepareEventInputNewProject(projectBoard)),menu.firstChild);

    projectBoard.forEach(project => {
        const a = document.createElement('a');
        a.href = `/project/${project.id}`;
        a.textContent = project.name;
        aside.appendChild(a);
    })
}

//Renderiza la visualizacion necesaria para cuando no se tiene proyectos
const noProject = (projectBoard) => {
    const aside = document.getElementById('aside-panel');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const button = document.createElement('button');

    img.src = 'img/no-project.png';
    img.alt = 'no projects';
    p.textContent = 'you don´t have projects yet';
    button.textContent = 'Add one';
    button.id = 'buttonAddOneProject';
    button.addEventListener('click',prepareEventInputNewProject(projectBoard));

    aside.appendChild(img);
    aside.appendChild(p);
    aside.appendChild(button);

}

//evento que renderiza una ventana modal y se encarga de asignar los elementos del header
const prepareEventInputNewProject = (projectBoard) => {
    return (e) => {  
        e.preventDefault();
        generateModal('Create a new project');
        const body = document.getElementById('bodyCard');        
        bodyNewProject(body, projectBoard);
    }
}

//Renderiza los elementos de del cuerpo de la ventana modal
const bodyNewProject = (body, projectBoard) => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    input.type = 'text';
    input.name = 'nameProject';
    input.placeholder = 'Project name';
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
            prepareEventNewProject(projectBoard);
    })
    button.textContent = 'Add project'
    button.addEventListener('click',prepareEventNewProject(projectBoard));

    form.appendChild(input);
    form.appendChild(button);
    body.appendChild(form);

    input.focus();

}

//Se encarga de hacer un post del nuevo proyecto, se añade a projectBoard y se renderizan todos los proyectos 
const prepareEventNewProject = (projectBoard) => {
    return (e) => {
         e.preventDefault();
        const url = 'http://localhost:8080/api/project'
        const name = document.getElementsByName('nameProject')[0];
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
                    addProjectToProjectBoard(data,projectBoard);
                    renderProjects(projectBoard);
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


export{
    renderProjects,
    noProject,
    openAsidePanel,
    closeAsidePanel,
}