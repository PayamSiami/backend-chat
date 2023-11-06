import logger from './config/logger.config';
import app from './app';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import socketServer from './socket-server';

// env variables
const PORT = process.env.PORT || 8000;
const DATABASE_URL: string = process.env.DATABASE_URL || '';

//exit mongodb
mongoose.connection.on('error', (error) => {
  logger.error('Mongo error', error);
  process.exit(1);
});

//mongo debug
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

//mongodb connection
mongoose.connect(DATABASE_URL).then(() => {
  logger.info('Connected to Mongodb');
});

const server = app.listen(PORT, () => {
  logger.info(`server is listening at port ${PORT}`);
});

app.get('/', (_req, res) => {
  res.send({ uptime: process.uptime() });
});

// socket io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_ENDPOINT
  }
});
io.on('connection', (socket) => {
  logger.info('socket io connected successfully');
  socketServer(socket, io);
});

// handle server error
const exitHandler = () => {
  if (server) {
    logger.info('Server closed.');
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unExceptedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unExceptedErrorHandler);
process.on('unhandledRejection', unExceptedErrorHandler);

//SIGTERM
process.on('SIGTERM', () => {
  if (server) {
    logger.info('Server closed.');
    process.exit(1);
  }
});
