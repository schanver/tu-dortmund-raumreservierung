import { next8Days } from "../utils/reservationDates.js";
import { select } from '@inquirer/prompts';

export async function selectDate(): Promise<string | null> {
  return await select({
    message: "Wählen Sie den Tag der Reservierung:",
    choices: [...next8Days(), "Beenden"],
    pageSize: 9
  })
}
