const express = require('express')
const server = express()
server.use(express.json())

let requestsCounter = 0
const projects = [{ 
    "id": "01234", 
    "title": "Vacation Time",
    "tasks": [ 
        "Go to the store",
        "Watch movies"
    ]
}]

////////////////////////////
// Prototypes
////////////////////////////

Array.prototype.findById = function(id) {
    return this.findIndex(p => p.id == id)
}

Array.prototype.getById = function(id) {
    return this.find(p => p.id == id)
}

////////////////////////////
// Middlewares
////////////////////////////

server.use((req, res, next) => {
    requestsCounter++
    console.log(`Requisições: ${requestsCounter}`)
    return next()
})

function verifyIfProjectExists (req, res, next) {
    const { id } = req.params
    const projectIndex = projects.findById(id)
    
    // Verifica se o projeto existe
    if (projectIndex<0) {
        return res.status(400).json({ "error": "The project doesn't exist." })
    }
    
    // Cria novos elementos no req
    req.projectIndex = projectIndex
    req.project = projects.getById(id)

    return next()
}

////////////////////////////
// Route: projects
////////////////////////////

server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body
    const newProject = { id, title, tasks }

    projects.push(newProject)
    
    return res.json(projects)
})

server.put('/projects/:id', verifyIfProjectExists, (req, res) => {
    const { title } = req.body

    req.project.title = title
    
    return res.json(projects)
})

server.delete('/projects/:id', verifyIfProjectExists, (req, res) => {
    projects.splice(req.projectIndex, 1)
    
    return res.json(projects)
})

////////////////////////////
// Route: tasks
////////////////////////////

server.post('/projects/:id/tasks', verifyIfProjectExists, (req, res) => {
    const { title } = req.body

    req.project.tasks.push(title)

    return res.json(req.project)
})

////////////////////////////
// START SERVER
////////////////////////////

server.listen(3000)
