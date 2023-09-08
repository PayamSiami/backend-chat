import dotenv from 'dotenv'
import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import fileupload from 'express-fileupload'
import cors from 'cors'

//create express app
const app: Express = express()

//dotenv config
dotenv.config()

//morgan
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

//helmet
app.use(helmet())

//parse json request url
app.use(express.json())

//parse json request body
app.use(express.urlencoded({ extended: true }))

// mongoSanitize
app.use(mongoSanitize())

//enable cookie parser
app.use(cookieParser())

//gzip compression
app.use(compression())

//file upload
app.use(
  fileupload({
    useTempFiles: true
  })
)

//file upload
app.use(cors({ origin: 'http://localhost:3000' }))

export default app
