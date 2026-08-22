import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });
dotenv.config();

const requiredEnvironmentVariables = [
  'POSTGRES_HOST',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name],
);

if (missingEnvironmentVariables.length > 0) {
  console.error(
    `Missing environment variables: ${missingEnvironmentVariables.join(', ')}`,
  );
  process.exitCode = 1;
} else {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: { rejectUnauthorized: false },
  });

  pool
    .query('SELECT NOW() AS connected_at')
    .then(({ rows }) => {
      console.log(`Supabase connection successful: ${rows[0].connected_at}`);
    })
    .catch((error: Error) => {
      console.error(`Supabase connection failed: ${error.message}`);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}