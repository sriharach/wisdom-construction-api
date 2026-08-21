import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { createAuroraDsqlOptions } from './aurora-dsql.options';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env.local' });

export const connectionSource = new DataSource(createAuroraDsqlOptions());