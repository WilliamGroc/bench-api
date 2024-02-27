// Import the framework and instantiate it
import Fastify from 'fastify';
import { db } from './db';
import * as schema from '../drizzle/schema';

const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/movies', async function handler(request, reply) {
  const result = await db.select().from(schema.movies);
  return result;
})

type PostMoviesBody = {
  title: string;
  releaseYear: number;
};

fastify.post('/movies', async function handler(request, reply) {
  const { title, releaseYear } = request.body as PostMoviesBody;
  await db.insert(schema.movies).values([{ title, releaseYear }]);
  return null;
});

// Run the server!
(async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})()