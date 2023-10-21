import dotenv from 'dotenv';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileupload from 'express-fileupload';
import cors from 'cors';
import routes from './routes';

//create express app
const app: Express = express();

//dotenv config
dotenv.config();

//morgan
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

//helmet
app.use(helmet());

//parse json request url
app.use(express.json());

//parse json request body
app.use(express.urlencoded({ extended: true }));

// mongoSanitize
app.use(mongoSanitize());

//enable cookie parser
app.use(cookieParser());

//gzip compression
app.use(compression());

//file upload
app.use(
  fileupload({
    useTempFiles: true
  })
);

//file upload
app.use(cors({ origin: 'http://localhost:3000' }));

//routes
app.use('/api/v1', routes);

//trim
app.use(
  express.json({
    reviver: (key, value) => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    }
  })
);

//error handling
app.use(
  async (
    err: { status: unknown; message: any },
    req: any,
    res: { status: (arg0: any) => void; send: (arg0: { error: { status: any; message: any } }) => void },
    next: any
  ) => {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message
      }
    });
  }
);
export default app;
