import { debug } from '../logger.js';
import { config } from '../config.js';
import { Page } from 'puppeteer';

export async function login(page: Page) {
  await page.setRequestInterception(true);

  page.on("request", (req) => {
    const type = req.resourceType();

    if (type === "image" || type === "stylesheet" || type === "font") {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(config.portalUrl, { waitUntil: "domcontentloaded" });

  await page.type("#username", config.username);
  await page.type("#password", config.password);
  await page.click(".btn");

  await page.waitForNetworkIdle();
  debug("Dashboard geladen");
}

