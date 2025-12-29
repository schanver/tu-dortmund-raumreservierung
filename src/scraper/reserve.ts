import { select, input } from "@inquirer/prompts";
import chalk from "chalk";
import { Page } from "puppeteer"
import { TimeSlot } from "../types.js";
import { debug, info } from "../logger.js";

export async function reserveRoom(page: Page, slot : TimeSlot) {
  try {
  if(slot.element){
    info(`Auf den Buchungslink klicken...`);
    await slot.element.click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    debug(`Buchungsseite ist geladen`)

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
        message: 'Titel (Pflichtfeld):',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'Title ist erforderlich!';
          }
          if (input.length > 32) {
            return chalk.red('Der Titel dar maximal 32 Zeichen lang sein!');
          }
          return true;
        }
      });

        const reservationType = await select(
        {
          message: 'Status:',
          choices: reservationTypes
        });
      const endTime = await select({
          message: 'Bis:',
          choices: endTimes.map(time => ({
            name: time,
            value: time
          }))
        }
      );

    info(`Formular wird ausgefüllt...`);

      await page.type('input[name="comment"]', title);

      await page.select('select[name="mitlerner"]', reservationType);

      await page.select('select[name="bis"]', endTime);

      info(chalk.green(`Formular ausgefüllt mit:`));
      info(`  Titel: ${title}`);
      info(`  Status: ${reservationType}`);
      info(`  Bis: ${endTime}`);

      await page.click('input[value=Reservieren]');
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      await new Promise(resolve => setTimeout(resolve, 2000));
  } else {
      info(`Fehler: Für diesen Slot wurde kein anklickbares Element gefunden.`);
  }
  } catch(e) {
    debug(`Fehler aufgetreten: ${e}`);
    console.error(e);
  }
}
