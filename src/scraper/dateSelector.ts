import { ElementHandle, Page } from 'puppeteer';

export async function goToDate(page: Page, selectedDate: string) {
  while (true) {
    const h2s = await page.$$('div#inhalt h2');
    if (h2s.length === 0) throw new Error('Keine <h2> in div#inhalt gefunden');

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
      console.log('Ausgewähltes Datum erreicht:', currentDate);
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

    if (!nextLink) throw new Error('Kein zweiter Pfeil nach rechts gefunden');

    // Click and wait for navigation
    await Promise.all([
      nextLink.click(),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
  }
}
