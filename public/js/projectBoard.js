const removeTaskOfProjectBoard = (task,projectBoard) => {
    const i = projectBoard.findIndex(project => {
        const tasks = project.tasks;
        return tasks.some(current => current.id === task.id);
    })
    if(i !== -1){
        projectBoard[i].tasks = projectBoard[i].tasks.filter(current => current.id != task.id);
    }
}

const upgradeTaskOfProjectBoard = (task, projectBoard) => {
    const i = projectBoard.findIndex(project => {
        return project.tasks.some(current => current.id === task.id);
    });
    if(i !== -1){
        const j = projectBoard[i].tasks.findIndex(current => current.id === task.id);
        if(j !== -1)
            projectBoard[i].tasks[j] = task;
    }
}

const addTaskToProjectBoard = (task,projectBoard) => {
    const i = projectBoard.findIndex(project => project.id === task.project)
    const {id, title,description,date} = task;
    if(i !== -1){
        projectBoard[i].tasks.push({id, title, description, date});
    }
}

const addProjectToProjectBoard = (project, projectBoard) => {
    projectBoard.push(project);
    sortProjectBoardByName(projectBoard);
}

const sortProjectBoardByName = (projectBoard) => {
    projectBoard.sort((a,b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1);
}

export {
    removeTaskOfProjectBoard,
    addTaskToProjectBoard,
    addProjectToProjectBoard,
    sortProjectBoardByName
}