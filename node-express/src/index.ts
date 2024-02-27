
import express from 'express'
import { db } from './db';
import * as schema from '../drizzle/schema';

const app = express()
const port = 3000

app.get('/movies', async (req, res) => {
  const result = await db.select().from(schema.movies);

  res.send(result)
})

type PostMoviesBody = {
  title: string;
  releaseYear: number;
};

app.post('/movies', async (req, res) => {
  const { title, releaseYear } = req.body as PostMoviesBody;
  await db.insert(schema.movies).values([{ title, releaseYear }]);
  res.send(null);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

