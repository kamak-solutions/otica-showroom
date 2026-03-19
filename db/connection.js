import 'dotenv/config';
import postgres from 'postgres';

const ssl = process.env.DB_HOST?.includes('supabase.co')
  ? { rejectUnauthorized: false }
  : false;

const sql = postgres({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max:      10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;