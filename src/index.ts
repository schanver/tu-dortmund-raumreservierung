import 'dotenv/config';
import puppeteer from 'puppeteer';
import { login } from './scraper/login';
import chalk from 'chalk';
import { select,search } from '@inquirer/prompts';
import { debug, info } from './logger';
import { listRooms } from './scraper/listRooms';
import { Room, TimeSlot } from './types';
import { reserveRoom } from './scraper/reserve';
import { next8Days } from './utils/reservationDates';
import { goToDate } from './scraper/dateSelector';

const menu = async () => {
  
  debug`Typescript booted`;
  const browser = await puppeteer.launch({ headless: 'shell'});
  const page    = await browser.newPage();

  try {
    await login(page);
    info(`Logged in successfully...`);

    const timestamp  = await select({
      message: 'Choose the day of reservation:',
      choices: next8Days()
    });

    await goToDate(page,timestamp)

    const [hoursLeft, rooms] = await listRooms(page);
    if(rooms.length === 0) {
      info(`No rooms found.`);
      return;
    }

    const selectedRoom  = await select(
      {
        message: `Available hours: ${hoursLeft.split(" ")[2]}\nSelect a room:`,
        choices: rooms.map(r => ({
        name: chalk(r.name),
        value: r
        }))
      }
    );
    
      debug('Selected room:', selectedRoom);
    
    if(!selectedRoom.slots || selectedRoom.slots.length === 0) {
      info(`No slots available for ${selectedRoom.name}`);
      return;
    }
    
    const availableSlots = selectedRoom.slots.filter((slot : TimeSlot) => !slot.occupied);
    
    if(availableSlots.length === 0) {
      info(`No available (unoccupied) slots for ${selectedRoom.name}`);
      return;
    }
    
    const selectedSlot = await select({
      message: `Available slots for ${selectedRoom.name}:`,
      choices: availableSlots.map((slot : TimeSlot) => ({
        name: `From ${slot.from} | Duration: ${slot.durationHours} h`,
        value: slot
      })),
    });

    await reserveRoom(page,selectedSlot);

  } catch (e) {
    debug(`Error occurred: ${e}`);
    console.error(e);
  }
  finally {
    info(`Finished operation, closing the browser...`);
    await page.close();
    await browser.close();
  }
}




menu();
