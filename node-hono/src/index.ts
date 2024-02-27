import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from './db';
import * as schema from '../drizzle/schema';

const app = new Hono()

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

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
