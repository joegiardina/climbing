import "core-js/stable";
import "regenerator-runtime/runtime";
import express from 'express';

const app = express();
const port = 3000;

app.use((req, res, next) => {
  const {url, method, headers} = req;
  next();
});

app.get('/', (req, res) => {
  res.send(200);
});

// app.get('/search', (req, res) => {
//   const results = searchByName(req.query.query);
//   console.log('search', results);
//   res.send(results);
// });

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});
