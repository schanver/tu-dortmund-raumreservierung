import dotenv from 'dotenv';
import chalk from 'chalk';
import { PROJECT_ROOT } from './paths.js';

dotenv.config({ quiet: true, path: `${PROJECT_ROOT}/.env` });

export const config = {
  portalUrl: process.env.PORTAL_URL || '',
  username: process.env.USERNAME || '',
  password: process.env.PASSWORD || ''
};

if (!config.portalUrl || !config.username || !config.password) {
  console.error(chalk.red("Erforderliche Umgebungsvariablen in .env fehlen"));
  process.exit(1);
}
