import { debug } from '../logger.js';
import { config } from '../config.js';
import { Page } from 'puppeteer';

export async function login(page: Page) {
  await page.goto(config.portalUrl)
  await page.type('#username', config.username);
  await page.type('#password', config.password);
  await page.click('.btn');
  await page.waitForNetworkIdle();
  debug("Dashboard geladen");
  //await new Promise(resolve => setTimeout(resolve, 2000));
}

