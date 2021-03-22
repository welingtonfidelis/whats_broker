import { EventEmitter } from 'events';
import * as express from 'express';
import 'dotenv';

import { databaseConnect } from './database';
import { router } from './routes';
import { errorHandleMidleware } from './middlewares/errorHandle';
import { BotService } from './services';

const emitter = new EventEmitter();
const botService = new BotService();
const app = express();
const port = process.env.PORT || 3001;

databaseConnect(emitter);

app.use(express.json());
app.use(errorHandleMidleware);
app.use(router);

app.listen(port, async () => {
  console.log(`🚀 Running in ${port}`);

  emitter.on('database:connected', () => {
    botService.startAllBots();
  });
});
