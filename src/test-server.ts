import { ExpressButBadRequest, ExpressButBadResponse } from './ebb';

const ebb = require('./');

const app = ebb();
const server = require('http').Server(app);
const PORT = process.env.PORT || 1337;


app.use(() => {
  console.log('middleware')
});
app.get('/', (req: ExpressButBadRequest, res: ExpressButBadResponse) => {
  console.log(`Query:  ${JSON.stringify(req.query)}`);
  res.send('Hello world');
});

app.post('/', (req: ExpressButBadRequest, res: ExpressButBadResponse) => {
  console.log(`Body: ${JSON.stringify(req.body)}`);
  res.send('Hello world');
});

server.listen(PORT, () => {
  console.log(`Now listening on ${PORT}`);
});
