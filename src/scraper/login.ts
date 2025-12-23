import { debug } from '../logger';
import { config } from '../config';
import { Page } from 'puppeteer';

export async function login(page: Page) {
  await page.goto(config.portalUrl)
  await page.type('#username', config.username);
  await page.type('#password', config.password);
  await page.click('.btn');
  await page.waitForNetworkIdle();
  debug("Dashboard loaded");
  await new Promise(resolve => setTimeout(resolve, 2000));
}

