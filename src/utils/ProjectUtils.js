
let someProject = {
    path: "",
    metadata: {
        name: "",
        description: "",
        dateCreated: "",
        dateLastOpened: ""
    },
    data: {
        system: [],
        dataset: [],
        views: [],
        tests: []
    }
}

let someData = {
    name: "New Project 2",
    dataset: {},
    description: "This is a new project description!",
}



function updateProject(current_project, new_data) {
    
    for (key in current_project) {
        
        if (typeof current_project[key] === 'object' && !Array.isArray(current_project[key])) {
            updateProject(current_project[key], new_data);

        } else if (new_data.hasOwnProperty(key)){
            current_project[key] = new_data[key];

        } else {
            continue;
        }  
    }
    return current_project;
}


console.log(someProject);
console.log(someData);
let updatedProject = updateProject(someProject, someData);
console.log(updatedProject);