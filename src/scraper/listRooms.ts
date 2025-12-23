import { Page } from 'puppeteer';
import { Room, TimeSlot } from '../types';
import { debug } from '../logger';

export async function listRooms(page : Page) : Promise<[string,Room[]]> {
  await page.waitForSelector('div.rooms table');
  debug('Room calendar loaded');
  let hoursLeft:string = "";
  let hoursText = await page.waitForSelector(".wrapper > main:nth-child(1) > div:nth-child(3) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > p:nth-child(10)");
  if (hoursText) {
    hoursLeft = await page.evaluate(el => el.textContent, hoursText);
  }
  
  const rows = await page.$$('div.rooms table tr');
  const result: Room[] = [];
  
  for (const row of rows) {
    const roomHeader = await row.$('th a');
    const cells = await row.$$('td');
    if (!roomHeader || cells.length === 0) continue;
    
    const roomName = await page.evaluate(el => el.textContent?.trim() ?? '', roomHeader);
    const slots: TimeSlot[] = [];
    
    for (const td of cells) {
      const colspan = await td.evaluate(el => parseInt(el.getAttribute('colspan') ?? '1', 10));
      const occupied = await td.evaluate(el => el.classList.contains('belegt'));
      const a = await td.$('a');
      if (!a) continue;
      
      const href = await a.evaluate(el => el.getAttribute('href') ?? '');
      const query = href.split('?')[1];
      if (!query) continue;
      
      const params = new URLSearchParams(query);
      const from = params.get('von');
      if (!from) continue;
      
      slots.push({
        from,
        durationHours: colspan,
        occupied,
        element: a
      });
    }
    result.push({ name: roomName, slots });
  }
  
  return [hoursLeft, result];
}


