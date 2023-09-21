import dotenv from 'dotenv';
import app from './app';

// dotenv config
dotenv.config();

// env variables
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is listinig at port ${PORT}`);
});
