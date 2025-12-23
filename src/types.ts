export interface TimeSlot {
  hour:         string;
  isFree:       boolean;
  duration?:    number;
  isOLG?:       boolean;
}

export interface Room {
  name:         string;
  id:           string;
  timeSlots:    TimeSlot[];
}


export interface DailySchedule {
  date:       string;
  rooms:      Room[];
}
