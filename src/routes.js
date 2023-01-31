import { Database } from './database.js'
import { buildRoutePath } from './utils/buildRoutePath.js'
import { requireProperties } from './utils/requireProperties.js'

const db = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.query

      const data = db.select('tasks', {
        ...(title ? { title } : {}),
        ...(description ? { description } : {})
      })

      return res.writeHead(200).end(JSON.stringify(data))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        requireProperties(req.body, ['title', 'description'])
      } catch (error) {
        return res.writeHead(400).end(JSON.stringify({ error: error.message }))
      }

      const { title, description } = req.body

      const task = {
        title,
        description,
        completed_at: null
      }

      db.insert('tasks', task)
      return res.writeHead(201).end(JSON.stringify(task))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        requireProperties(req.body, ['title', 'description'])
        requireProperties(req.params, ['id'])
      } catch (error) {
        return res.writeHead(400).end(JSON.stringify({ error: error.message }))
      }
      const { id } = req.params
      const { title, description } = req.body

      const storagedTask = db.find('tasks', id)
      if (!storagedTask) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: 'Task does not exist.' }))
      }

      const user = db.update('tasks', id, { title, description })

      return res.end(JSON.stringify(user))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      requireProperties(req.params, ['id'])

      const { id } = req.params

      const storagedTask = db.find('tasks', id)
      if (!storagedTask) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: 'Task does not exist.' }))
      }

      db.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      requireProperties(req.params, ['id'])

      const { id } = req.params

      const storagedTask = db.find('tasks', id)
      if (!storagedTask) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: 'Task does not exist.' }))
      }

      const task = db.update('tasks', id, {
        completed_at: storagedTask.completed_at === null ? new Date() : null
      })

      return res.writeHead(200).end(JSON.stringify(task))
    }
  }
]
