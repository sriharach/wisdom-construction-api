import * as pg from 'pg';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { AuroraDSQLPool } from '@aws/aurora-dsql-node-postgres-connector';
import { awsCredentialsProvider } from '@vercel/oidc-aws-credentials-provider';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const dsqlDriver = {
  ...pg,
  Pool: AuroraDSQLPool,
};

function getCredentialsProvider(): ReturnType<typeof fromNodeProviderChain> {
  if (process.env.VERCEL === '1') {
    return awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN,
      clientConfig: { region: process.env.AWS_REGION },
    });
  }

  return fromNodeProviderChain({
    profile: process.env.AWS_PROFILE,
  });
}

export function createAuroraDsqlOptions(
  env: NodeJS.ProcessEnv = process.env,
): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: env.PGHOST,
    port: Number(env.PGPORT || 5432),
    username: env.PGUSER || 'admin',
    database: env.PGDATABASE || 'postgres',
    ssl: env.PGSSLMODE === 'require' ? true : undefined,
    driver: dsqlDriver,
    extra: {
      customCredentialsProvider: getCredentialsProvider(),
      max: 20,
      idleTimeoutMillis: 30000,
    },
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
    migrationsRun: false,
  };
}