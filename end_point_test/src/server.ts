import * as express from 'express';

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.listen(port, () => {
  console.log(`🚀 Running in ${port}`);
});

app.post('/test', (req: express.Request, res: express.Response) => {
  console.log('->\n\n', req.body, '\n\n<-\n');
  
  res.json({
    ok: true,
    data: {},
  });
});
