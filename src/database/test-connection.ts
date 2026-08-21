import { connectionSource } from './ormconfig.aws';

async function testConnection(): Promise<void> {
  try {
    await connectionSource.initialize();
    await connectionSource.query('SELECT 1');
    console.log('Aurora DSQL connection succeeded.');
  } finally {
    if (connectionSource.isInitialized) {
      await connectionSource.destroy();
    }
  }
}

testConnection().catch((error: unknown) => {
  console.error('Aurora DSQL connection failed.', error);
  process.exitCode = 1;
});