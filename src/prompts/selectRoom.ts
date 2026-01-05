import { Room } from '../types.js';
import { info, debug } from '../logger.js';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';

export async function selectRoom(
  rooms: Room[],
  hoursLeft: string
): Promise<Room | null> {

  const selectedRoomIndex = await select({
    message: `Noch buchbar: ${hoursLeft.split(" ")[2]} Stunden\nWählen Sie den Lernraum:`,
    choices: [
      ...rooms.map((r, i) => ({
        name: chalk.yellow(r.name),
        value: i
      })),
      { name: "Zurück zur Datumauswahl", value: -1 }
    ],
    pageSize: 13
  });

  if (selectedRoomIndex === -1) {
    return null;
  }

  const room = rooms[selectedRoomIndex]!;

  if (!room.slots || room.slots.length === 0) {
    info(chalk.red(`Keine freien Plätze für ${room.name}`));
    return null;
  }

  debug("Ausgewählter Lernraum:", room);
  return room;
}
