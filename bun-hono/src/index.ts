import { sql } from 'drizzle-orm';
import { Hono } from 'hono'
import { db } from './db';

const app = new Hono()

app.get('/', (c) => {
  const query = sql`select "hello world" as text`;
  const result = db.get<{ text: string }>(query);
  console.log(result);

  return c.json(result);
})

export default app
