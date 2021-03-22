import * as express from 'express';
import 'dotenv';

import './database/connect';

import { router } from './routes';
import { errorHandleMidleware } from './middlewares/errorHandle';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(router);
// app.use((error, req, res, next) => {
//   console.log('ERROR ===>', error);

//   const code = (error.code && error.code >= 100 && error.code <= 511) ? error.code : 500;
//   const message = error.message || 'Internal server error.';

//   res.status(code).json({
//     ok: false,
//     data: {},
//     message,
//   });
// });
app.use(errorHandleMidleware);

app.listen(port, async () => {
  console.log(`🚀 Running in ${port}`);
});
