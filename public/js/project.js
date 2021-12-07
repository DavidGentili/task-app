const urlProject = 'http://localhost:8080/Api/project';

const getProject = async (idProject) => {
    const url = (idProject) ? `${urlProject}?_id=${idProject}` : urlProject;
    console.log(url)
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

export {
    getProject
}