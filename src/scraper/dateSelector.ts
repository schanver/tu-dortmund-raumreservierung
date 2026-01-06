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
    const prevLinks = await page.$$('td[align="left"] a');
    
    let linkToClick: ElementHandle | null;
    let foundNext : Boolean = false;
    let nextLink = null;
    for (const link of nextLinks) {
      const text = await page.evaluate(el => el.textContent?.trim(), link);
      if (foundNext && text === '>') {
        nextLink = link;
        break;
      } else if (text === '>') {
        foundNext = true;
      }
    }
    let foundPrev : Boolean = false
    let prevLink = null;
    for (const link of prevLinks) {
      const text = await page.evaluate(el => el.textContent?.trim(), link);
      if (foundPrev && text === '<') {
        prevLink = link;
        break;
      } else if (text === '<') {
        foundPrev = true;
      }
    }

    if(!currentDate) throw Error
    linkToClick = currentDate < selectedDate ? nextLink : prevLink

    if (!nextLink) throw new Error('Kein zweiter Pfeil nach rechts gefunden');
    if(!prevLink) throw new Error('Kein zweiter Pfeil nach links gefunden')
    if(!linkToClick) throw new Error('Kein Link zum Auswahl verfügbar');

    // Click and wait for navigation
    await Promise.all([
      linkToClick.click(),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    ]);
  }
}
