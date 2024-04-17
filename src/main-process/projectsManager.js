/*
    PROJECTS MANAGER
    __This provides useful implementations for organising, importing and creating projects within the main process__
*/
const fs = require('fs');
const path = require('path');


class Project {
    constructor(args) {

        /* Constructor if project ~is~ already instantiated */
        if (!!Project.instance) {
            return Project.instance;
        } 
        
        /* Constructor if project ~not~ already instantiated */
        else {
            Project.instance = this;
            return this;
        }  
    }

    
    /* Create New Project - accepts a path and some data, and creates a new project along with it's project file */
    create(folder_path, project_data) {
        
        // create file path from project name and folder_path
        let newProjectFileName = project_data.metadata.name + ".json";
        let file_path = path.join(folder_path, newProjectFileName);


        // load project into "Project" instance
        let newProjectData = {
            "metadata": project_data.metadata,
            "data": project_data.data
        }

        console.log(newProjectData)

        newProjectData["path"] = file_path; // add file path to project data
        this.log_data(newProjectData);


        // check if a project of the same name already exists
        if (fs.existsSync(file_path)) {
            
            this.close();
            console.error('A file with the same name already exists.');

            return this;
        }

        this.save(); // store project data to file at path

        return this; //return the newly created Project object
    }


    /* Open Project Method - instantiates a project with attributes based on data from a given file path */
    open(file_path, callback) {
        
        // validate file_path to ensure it is a MIRA Project file (better implementation of this needed)
        if (!file_path.endsWith('.json')) {
            console.error('File cannot be opened! It is not in JSON format');
            callback(err);
            return;
        }
        
        // read file and parse the JSON to give a JSON object
        fs.readFile(file_path, (err, data) => {

            if (err) { //handle errors reading file
                console.log('Error Reading File!');
                callback(err);
                return;
            }

            this.log_data(JSON.parse(data));
            callback(null, this);
        })
    }


    /* Close Project Method - a closed project is an empty object {} */
    close() {
        for (let property in this) {
            delete this[property];
        }

        return this;
    }


    /* Saves the current project to the file path */
    save() {

        let data_to_write = JSON.stringify(this, null, 4);

        fs.writeFile(this.path, data_to_write, (err) => {
            if (err) {
                console.error('Error writing file!');
                return
            }

            console.log("Project has been saved!");
        })
    }

    
    /* Log Project Data - accepts an object describing a project, and logs this as the data */
    log_data(project_data) {
        
        this.close(); //close project first to give a blank slate

        for (let prop in project_data) {
            if (project_data.hasOwnProperty(prop)) {
                this[prop] = project_data[prop];
            }
        }
    }
}


// let project = new Project();
// console.log(project);

// let project2 = project.create("C:/Users/jacob/AppData/Roaming/MIRA/Files/Projects", {
//     "metadata": {
//         "name": "Project34",
//         "description": "This is a simple test project. I hope it works!",
//         "dateCreated": "7777-03-2024",
//         "dateLastOpened": "27777-03-2024"
//     },
//     "data": {
//         "system": [2],
//         "dataset": [],
//         "views": [],
//         "tests": []
//     }
// })

// console.log(project2);


function retrieve(directory, number) {

    let filesInfo = [];

    const files = fs.readdirSync(directory);

    // Collect Files Data
    files.forEach(file => {
        
        if (file.endsWith('.json')) {
            // File Name
            const fileName = file.replace(".json", "");
            
            // File path
            const filePath = path.join(directory, file);

            // Date Last Modified
            const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const fileDateModified = fileData.metadata.dateLastOpened;

            //Push data to filesInfo
            filesInfo.push([
                fileName,
                filePath,
                fileDateModified
            ])
        } 
    })

    // Sort Array
    filesInfo.sort((a,b) => {
        let dateA = new Date(a[2]);
        let dateB = new Date(b[2]);

        return dateB - dateA;
    })

    // Filter Array so that only the most recent n entries are returned
    filesInfo = filesInfo.slice(0, number);

    return filesInfo;
}

// console.log(retrieve("C:/Users/jacob/AppData/Roaming/MIRA/Files/Projects"));



export { Project, retrieve }; //export necessary modules





// open project function

// create new project function