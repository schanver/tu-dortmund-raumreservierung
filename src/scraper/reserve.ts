import { select, input } from "@inquirer/prompts";
import chalk from "chalk";
import { Page } from "puppeteer"
import { Room, TimeSlot } from "../types";
import { debug, info } from "../logger";

export async function reserveRoom(page: Page, slot : TimeSlot) {
  try {
  if(slot.element){
    info("Clicking on the booking link...");
    await slot.element.click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    debug("Booking page loaded")

      const endTimes = await page.$$eval('select[name="bis"] option', options => 
        options.map(opt => opt.textContent?.trim() || '')
      );

      const reservationTypes = await page.$$eval('select[name="mitlerner"] option', options => 
        options.map(opt => ({
          name: opt.textContent?.trim() || '',
          value: opt.value
        }))
      );

      const title = await input({
        message: 'Enter reservation title (required):',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'Title is required!';
          }
          if (input.length > 32) {
            return 'Title must be 32 characters or less!';
          }
          return true;
        }
      });

        const reservationType = await select(
        {
          message: 'Select reservation type:',
          choices: reservationTypes
        });
      const endTime = await select({
          message: 'Select end time:',
          choices: endTimes.map(time => ({
            name: time,
            value: time
          }))
        }
      );

      info("Filling out the form...");

      await page.type('input[name="comment"]', title);

      await page.select('select[name="mitlerner"]', reservationType);

      await page.select('select[name="bis"]', endTime);

      info(`Form filled with:`);
      info(`  Title: ${title}`);
      info(`  Type: ${reservationType}`);
      info(`  End time: ${endTime}`);



  } else {
      info("Error: No clickable element found for this slot");
  }


  } catch(e) {
    debug`Error occurred: ${e}`;
    console.error(e);
  }
}
