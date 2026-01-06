import puppeteer from 'puppeteer';
import { login } from './scraper/login.js';
import { select } from '@inquirer/prompts';
import { debug, info } from './logger.js';
import { listRooms } from './scraper/listRooms.js';
import { reserveRoom } from './scraper/reserve.js';
import { goToDate } from './scraper/dateSelector.js';
import { selectDate } from './prompts/selectDate.js';
import { selectRoom } from './prompts/selectRoom.js';
import { selectSlot } from './prompts/selectSlot.js';
import { promptMenu } from './prompts/menu.js';
import chalk from 'chalk';
import boxen from 'boxen';

let browser: puppeteer.Browser | null = null;

process.on("SIGINT", async () => {
  console.log("\nBeende Programm …");

  try {
    if (browser) {
      await browser.close();
    }
  } finally {
    process.exit(0);
  }
});

async function menu() {
  console.clear();
  debug("Typescript gestartet");

  browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const banner = `${chalk.bold.greenBright("TU Dortmund Raumreservierung")}
${chalk.bold.gray("@github.com/schanver")}          ${chalk.bold.white("v1.1.0")}`  
    const bannerWithBorder = async () => {
      return boxen(chalk.bold.green(banner), { borderStyle: 'double' , align : 'center' });
    }
    console.log(await bannerWithBorder());

    const choice = await promptMenu();
    switch (choice) {
      case "exit":
        process.exit(0);

      case "reserve":
        break;

      default:
        throw new Error("Unbekannte Auswahl");
    }

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

      let selectingRoom = true;
      while(selectingRoom) {
        const room = await selectRoom(rooms, hoursLeft);
        if (!room) break;

        const slot = await selectSlot(room);
        if (!slot) continue;

        await reserveRoom(page, slot);
        selectingRoom = false;
      }

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
  } catch(e: any) {
    if (e?.name === "ExitPromptError") {
      info("Abbruch durch Benutzer.");
    } else {
      debug(`Fehler aufgetreten: ${e}`);
      console.error(e);
    }
  } finally {
    info("Vorgang abgeschlossen, Browser wird geschlossen...");
    await browser.close();
  }
}

await menu();
