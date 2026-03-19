import 'dotenv/config';
import postgres from 'postgres';

const isSupabase = process.env.DB_HOST?.includes('supabase.co');

const sql = postgres({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max:      10,
  idle_timeout: 20,
  connect_timeout: 30,
  ssl: isSupabase ? { rejectUnauthorized: false } : false,
  types: {},
  connection: {
    application_name: 'otica-showroom',
  },
  ...(isSupabase && { host: process.env.DB_HOST }),
});

export default sql;