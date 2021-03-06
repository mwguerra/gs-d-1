const express = require('express')
const server = express()
const { cloneDeep } = require('lodash')

server.use(express.json())

const defaultProjects = [{ 
    "id": "01234", 
    "title": "Vacation Time",
    "tasks": [ 
        "Go to the store",
        "Watch movies"
    ]
}]
let requestsCounter = 0
let projects = cloneDeep(defaultProjects)

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
    if (requestsCounter>0) {
        process.stdout.write('.')
    } else {
        process.stdout.write('Requisições: .')
    }
    requestsCounter++
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
// projects
////////////////////////////

server.get('/reset', (req, res) => {
    projects = cloneDeep(defaultProjects)
    return res.json(projects)
})

server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.get('/projects/:id', verifyIfProjectExists, (req, res) => {
    return res.json(req.project)
})

server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body
    const newProject = { id, title, tasks }

    projects.push(newProject)
    
    return res.json(projects)
})

server.put('/projects/:id', verifyIfProjectExists, (req, res) => {
    const { id, title } = req.body

    req.project.title = title
    
    return res.json(req.project)
})

server.delete('/projects/:id', verifyIfProjectExists, (req, res) => {
    projects.splice(req.projectIndex, 1)
    
    return res.json(projects)
})

////////////////////////////
// tasks
////////////////////////////

server.get('/projects/:id/tasks', verifyIfProjectExists, (req, res) => {
    return res.json(req.project.tasks)
})

server.post('/projects/:id/tasks', verifyIfProjectExists, (req, res) => {
    const { task } = req.body

    req.project.tasks.push(task)

    return res.json(req.project)
})

server.delete('/projects/:id/tasks', verifyIfProjectExists, (req, res) => {
    const { task } = req.body
    const { tasks } = req.project
    const taskIndex = tasks.findIndex(t => t == task)

    if (taskIndex>=0) {
        tasks.splice(taskIndex, 1)
    }

    return res.json(req.project.tasks)
})

////////////////////////////
// START SERVER
////////////////////////////

server.listen(3000)
