import { Room, TimeSlot } from '../types.js';
import { info, debug } from '../logger.js';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';

export async function selectSlot(room: Room): Promise<TimeSlot | null> {

  const availableSlots = room.slots ?? [];

  if (availableSlots.length === 0) {
    chalk.red(info(`Keine freien Plätze für ${room.name}`));
    return null;
  }

  const selectedSlotIndex = await select({
    message: `Verfügbare Zeitfenster für ${room.name}:`,
    choices: [
      ...availableSlots.map((slot, i) => ({
        name: `Von ${slot.from} | Dauer: ${slot.durationHours} St.`,
        value: i
      })),
      { name: "Zurück zur Raumauswahl", value: -1 }
    ],
    pageSize: 12
  });

  if (selectedSlotIndex === -1) {
    return null;
  }

  return availableSlots[selectedSlotIndex]!;
}
