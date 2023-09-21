import logger from './config/logger.config';
import app from './app';

// env variables
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`server is listinig at port ${PORT}`);
});
