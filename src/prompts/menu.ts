import { select } from '@inquirer/prompts';
import chalk from 'chalk';

export async function promptMenu() {
  return await select({
    message: "Was möchten sie tun?",
    choices: [
      { name: chalk.yellow("Raum reservieren"), value: "reserve" },
      { name: chalk.red("Reservierung stornieren"), value: "cancel", disabled: "Noch nicht implementiert" },
      { name: chalk.red("Zeige Reservierungen"), value: "show", disabled: "Noch nicht implementiert" },
      { name: chalk.yellow("Programm beenden"), value: "exit" },
    ],
    pageSize: 4
  })
}

