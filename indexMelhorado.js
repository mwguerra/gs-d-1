const express = require('express')
const server = express()
server.use(express.json())
//gsdfg

let projects = [{ 
    "id": "01234", 
    "title": "Vacation Time",
    "tasks": [ 
        "Go to the store",
        "Watch movies"
    ]
}]

////////////////////////////
// projects
////////////////////////////

server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.get('/projects/:id', (req, res) => {
    return res.json(projects.find(obj => obj.id == req.params.id))
})

server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body
    const newProject = { id, title, tasks }
    projects.push(newProject)
    return res.json(projects)
})

server.put('/projects/:id', (req, res) => {
    const { id, title } = req.body

    projects = projects.map(project => {
        if (project.id == req.params.id) {
            project.id = id
            project.title = title
        }
        return project
    })
    
    return res.json(projects)
})

server.delete('/projects/:id', (req, res) => {
    // https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array
    const filteredProjects = projects.filter(project => project.id != req.params.id)
    projects = [...filteredProjects]
    return res.json(projects)
})

////////////////////////////
// tasks
////////////////////////////

server.get('/projects/:id/tasks', (req, res) => {
    return res.json(projects.find(obj => obj.id == req.params.id).tasks)
})

server.post('/projects/:id/tasks', (req, res) => {
    const { tasks } = req.body
    projects = projects.map(project => {
        if (project.id == req.params.id) {
            project.tasks = tasks
        }
        return project
    })
    return res.json(projects)
})

////////////////////////////
// START SERVER
////////////////////////////

server.listen(3000)
