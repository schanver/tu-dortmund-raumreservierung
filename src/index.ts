import puppeteer from 'puppeteer';
import { login } from './scraper/login.js';
import { select } from '@inquirer/prompts';
import { debug, info } from './logger.js';
import { listRooms } from './scraper/listRooms.js';
import { reserveRoom } from './scraper/reserve.js';
import { goToDate } from './scraper/dateSelector.js';
import { selectDate } from './prompts/selectDate.js'
import { selectRoom } from './prompts/selectRoom.js'
import { selectSlot } from './prompts/selectSlot.js'

async function menu() {
  debug("Typescript gestartet");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await login(page);
    info("Erfolgreich angemeldet...");

    let running = true;

    while (running) {
      const timestamp = await selectDate();
      if (timestamp === "Beenden") break;

      if(timestamp){ 
      await goToDate(page, timestamp);
      }

      const [hoursLeft, rooms] = await listRooms(page);
      if (rooms.length === 0) {
        info("Keine Lernräume gefunden.");
        continue;
      }

      const room = await selectRoom(rooms, hoursLeft);
      if (!room) continue;

      const slot = await selectSlot(room);
      if (!slot) continue;

      await reserveRoom(page, slot);

      running = (await select({
        message: "Reserviere noch mehr?",
        choices: ["Ja", "Nein"]
      })) === "Ja";

      if(running) {
        await page.waitForSelector('p a');
        const links = await page.$$('p a');
        if(links.length > 1 && links[1]) {
          await links[1].click();
        }
        else {
          throw Error("Keinen Link zurück zum Menu gefunden");
        }
      }
    }
  } catch (e) {
    debug(`Fehler aufgetreten: ${e}`);
    console.error(e);
  } finally {
    info("Vorgang abgeschlossen, Browser wird geschlossen...");
    await browser.close();
  }
}

await menu();
