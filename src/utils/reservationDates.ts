export function next8Days(): string[] {
  const days: string[] = [];
  const today = new Date();

  for(let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    days.push(`${day}.${month}.${year}`);
  }
  return days;
}
