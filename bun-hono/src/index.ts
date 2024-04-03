import { Hono } from 'hono'
import { db } from './db';
import * as schema from '../drizzle/schema';
import { logger } from 'hono/logger'

const app = new Hono()
app.use(logger())

app.get('/movies', async (c) => {
  const result = await db.select().from(schema.movies);

  return c.json(result);
});

type PostMoviesBody = {
  title: string;
  releaseYear: number;
};

app.post('/movies', async (c) => {
  const { title, releaseYear } = await c.req.json<PostMoviesBody>()
  await db.insert(schema.movies).values([{ title, releaseYear }]);

  return c.json(null, 201);
});

export default app
