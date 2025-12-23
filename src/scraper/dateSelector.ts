import { ElementHandle, Page } from 'puppeteer';

export async function goToDate(page: Page, selectedDate: string) {
  while (true) {
    const h2s = await page.$$('div#inhalt h2');
    if (h2s.length === 0) throw new Error('No <h2> found in div#inhalt');

    let raumBelegung: ElementHandle<Element> | null = null;
    for (const h2 of h2s) {
      const text = await page.evaluate(el => el.textContent?.trim(), h2);
      if (text?.includes('Raumbelegung am')) {
        raumBelegung = h2;
        break;
      }
    }
    if(!raumBelegung) throw new Error()
    const h2Text = await page.evaluate(el => el.textContent?.trim(), raumBelegung);
    const match = h2Text?.match(/\d{2}\.\d{2}\.\d{4}/);
    const currentDate = match ? match[0] : null;
    if (currentDate === selectedDate) {
      console.log('Reached selected date:', currentDate);
      break;
    }

    // Find the second right arrow each iteration
    await page.waitForSelector('td[align="right"] a');
    const nextLinks = await page.$$('td[align="right"] a');

    let found = false;
    let nextLink = null;
    for (const link of nextLinks) {
      const text = await page.evaluate(el => el.textContent?.trim(), link);
      if (found && text === '>') {
        nextLink = link;
        break;
      } else if (text === '>') {
        found = true;
      }
    }

    if (!nextLink) throw new Error('No second right arrow link found');

    // Click and wait for navigation
    await Promise.all([
      nextLink.click(),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
  }
}
