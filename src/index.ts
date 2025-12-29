import puppeteer from 'puppeteer';
import { login } from './scraper/login.js';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';
import { debug, info } from './logger.js';
import { listRooms } from './scraper/listRooms.js';
import { TimeSlot } from './types.js';
import { reserveRoom } from './scraper/reserve.js';
import { next8Days } from './utils/reservationDates.js';
import { goToDate } from './scraper/dateSelector.js';

const menu = async () => {
  
  debug(`Typescript gestartet`);
  const browser = await puppeteer.launch({ headless:true });
  const page    = await browser.newPage();

  try {
    await login(page);
    info(`Erfolgreich angemeldet...`);

    const timestamp  = await select({
      message: `Wählen Sie den Tag der Reservierung:`,
      choices: next8Days()
    });

    await goToDate(page,timestamp)

    const [hoursLeft, rooms] = await listRooms(page);
    if(rooms.length === 0) {
      info(`Keine Lernräume gefunden.`);
      return;
    }

    const selectedRoom  = await select(
      {
        message: `Noch buchbar: ${hoursLeft.split(" ")[2]} Stunden\nWählen Sie den Lernraum:`,
        choices: rooms.map(r => ({
        name: chalk(r.name),
        value: r
        }))
      }
    );
    
      debug('Ausgewählter Lernraum:', selectedRoom);
    
    if(!selectedRoom.slots || selectedRoom.slots.length === 0) {
      info(chalk.red(`Keine freien Plätze für ${selectedRoom.name}`));
      return;
    }
    
    const availableSlots = selectedRoom.slots.filter((slot : TimeSlot) => !slot.occupied);
    
    if(availableSlots.length === 0) {
      info(`Keine freie Plätze für ${selectedRoom.name}`);
      return;
    }
    
    const selectedSlot = await select({
      message: `Verfügbare Zeitfenster für ${selectedRoom.name}:`,
      choices: availableSlots.map((slot : TimeSlot) => ({
        name: `Von ${slot.from} | Dauer: ${slot.durationHours} St.`,
        value: slot
      })),
    });

    await reserveRoom(page,selectedSlot);

  } catch (e) {
    debug(`Fehler aufgetreten: ${e}`);
    console.error(e);
  }
  finally {
    info(`Vorgang abgeschlossen, Browser wird geschlossen...`);
    await browser.close();
    return;
  }
}

await menu();
