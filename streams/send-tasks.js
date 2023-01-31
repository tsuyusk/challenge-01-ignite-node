import { parse } from 'csv-parse'
import fs from 'node:fs'

const path = new URL('./tasks.csv', import.meta.url)
const readStream = fs.createReadStream(path)

const csvParser = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

const run = async () => {
  const linesParser = readStream.pipe(csvParser)

  for await (const chunk of linesParser) {
    const [title, description] = chunk

    const task = { title, description }

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

run()
