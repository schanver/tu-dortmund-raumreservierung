import dotenv from 'dotenv';
dotenv.config();

export const config = {
  portalUrl: process.env.PORTAL_URL || '',
  username: process.env.USERNAME || '',
  password: process.env.PASSWORD || ''
};

if (!config.portalUrl || !config.username || !config.password) {
  throw new Error('Missing required environment variables in .env');
}
