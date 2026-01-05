import { ElementHandle } from "puppeteer";

export interface TimeSlot {
  from:             string;
  durationHours:    number;
  element?:         ElementHandle;
}

export interface Room {
  name:         string;
  slots:    TimeSlot[];
}


export interface DailySchedule {
  date:       string;
  rooms:      Room[];
}
