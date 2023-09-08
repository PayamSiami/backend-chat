import express, { Express, Request, Response } from 'express'

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' })
})

app.listen(8080, async () => {
  console.log('Server is running at http://localhost:8080')
})
