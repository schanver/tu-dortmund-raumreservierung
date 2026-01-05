import puppeteer from 'puppeteer';
import { login } from './scraper/login.js';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';
import { debug, info } from './logger.js';
import { listRooms } from './scraper/listRooms.js';
import { Room, TimeSlot } from './types.js';
import { reserveRoom } from './scraper/reserve.js';
import { next8Days } from './utils/reservationDates.js';
import { goToDate } from './scraper/dateSelector.js';

let selectedSlot: TimeSlot | null = null;
let selectedRoom: Room | null = null;
const menu = async () => {

  debug(`Typescript gestartet`);
  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();

  try {
    await login(page);
    info(`Erfolgreich angemeldet...`);

    dateLoop: while(true) {
      const timestamp  = await select({
        message: `Wählen Sie den Tag der Reservierung:`,
        choices: [...next8Days(),"Beenden"],
        pageSize: 8
      });
      await goToDate(page,timestamp)

      const [hoursLeft, rooms] = await listRooms(page);
      if(rooms.length === 0) {
        info(`Keine Lernräume gefunden.`);
        return;
      }


      roomLoop: while(true) {
        const selectedRoomIndex = await select(
          {
            message: `Noch buchbar: ${hoursLeft.split(" ")[2]} Stunden\nWählen Sie den Lernraum:`,
            choices: [
              ...rooms.map((r,i) => ({
                name: chalk(r.name),
                value: i
              })),
              { name: "Zurück zum Datumauswahl", value: -1 }
            ],
            pageSize:13
          }
        );
        if(selectedRoomIndex === -1) {
          continue dateLoop;
        }
        selectedRoom = rooms[selectedRoomIndex]!



        debug('Ausgewählter Lernraum:', selectedRoom);

        if(!selectedRoom.slots || selectedRoom.slots.length === 0) {
          info(chalk.red(`Keine freien Plätze für ${selectedRoom.name}`));
          return;
        }

        const availableSlots = selectedRoom.slots;
        while(true){
          if(availableSlots.length === 0) {
            info(`Keine freie Plätze für ${selectedRoom.name}`);
            return;
          }

          const selectedSlotIndex = await select({
            message: `Verfügbare Zeitfenster für ${selectedRoom.name}:`,
            choices: [
              ...availableSlots.map((slot : TimeSlot, i) => ({
                name: `Von ${slot.from} | Dauer: ${slot.durationHours} St.`,
                value: i
              })),
              { name: "Zurück zum Raumauswahl", value: -1 },
            ],
            pageSize: 12
          });

          if(selectedSlotIndex === -1) {
            continue roomLoop;
          }
          selectedSlot = availableSlots[selectedSlotIndex]!
          break roomLoop;
        }
      }
      break dateLoop;
    }

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
